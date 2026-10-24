-- On Cue — wardrobe depth
-- Run this once in the Supabase SQL Editor, after 0001_initial_schema.sql.
--
-- 0001 modeled wardrobe continuity as flat rows in continuity_items — fine
-- for Art/Props (status-only, item + photo), too thin for Wardrobe. A 28-year
-- costume-production veteran reviewed the actual Wardrobe SOP against this
-- schema and flagged it as "bare bones": color wasn't structured anywhere
-- (Lighting needs it), there was no field for *why* a look exists (the
-- script dictates character, which dictates costume — that reasoning has to
-- live somewhere), and there was no fast answer to the question a director
-- actually asks mid-shoot: "how many scenes/episodes are we using this
-- costume change in?" Before this migration, answering that meant a human
-- combing the whole plot by hand.
--
-- This migration adds the two tables the real-world costume plot needs
-- (docs/WARDROBE-SOP.md §2) — story_days and costume_changes — plus a join
-- table for "which scenes" and two views that implement the governing
-- visibility principle from the Wardrobe SOP: *deep at home, narrow abroad*.
-- That's a sharper restatement of GOVERNANCE-MODEL.md §2 ("Authority Stays
-- Scoped. Awareness Does Not.") for read depth specifically: the Wardrobe
-- Supervisor gets full depth on wardrobe (every field, every note); a role
-- in a different department gets a narrow, purpose-built slice, not the
-- whole table. scene_color_palette is that slice for Lighting/DP — color
-- only, nothing else. costume_change_usage is the usage-rollup fix.

-- ============================================================================
-- Enums
-- ============================================================================

create type fitting_status as enum ('fitted', 'pending', 'issue');

-- ============================================================================
-- Story days — the unit Wardrobe actually thinks in (SOP §1). Not an
-- episode, not a shoot day: a day inside the story. Same story day means
-- same clothes, damage and all, even when it spans episodes.
-- ============================================================================

create table story_days (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  label text not null, -- e.g. 'Story Night 4' — what the plot and the bible both call it
  -- A story day that opens an episode mid-way through a story day another
  -- episode ended on (SOP §1's carry-over case) points back at that one.
  -- Self-referential, nullable: most story days start clean.
  continues_from_story_day_id uuid references story_days(id),
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Costume changes — one row per character per complete look, numbered
-- across the season (SOP §2's costume plot, one row per change). This is
-- the table continuity_items.character_name/item_name used to gesture at
-- with loose text; this is the real thing those point into.
-- ============================================================================

create table costume_changes (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  character_name text not null,
  actor_name text not null, -- who's actually in front of the camera — the call sheet's CAST table pairs these two
  change_number int not null, -- numbered across the season, not per episode — SOP §2
  story_day_id uuid references story_days(id),
  -- Structured, not a loose string list: color and fabric are their own
  -- fields because Lighting needs color specifically (scene_color_palette
  -- below reads these two keys and nothing else) and "blue coat" was
  -- exactly the label the SOP's rule of thumb forbids. One jsonb array
  -- column, not a child table — matches takes.reset_causes' existing
  -- pattern of a fixed, small embedded list living on the parent row.
  -- Shape: [{ "name": "Olive trench", "color": "Olive", "fabric": "Wool blend", "type": "Outerwear" }, ...]
  items jsonb not null default '[]'::jsonb,
  -- Hazards drive multiples (SOP §2's third pass): every hazard means a
  -- copy exists for it. multiple_states names what state each copy is in
  -- right now — the thing wardrobe checks before every take.
  -- Shape: [{ "label": "dry", "state": "clean" }, { "label": "damp", "state": "in use" }, ...]
  multiples_count int not null default 1,
  multiple_states jsonb not null default '[]'::jsonb,
  current_multiple_in_use text,
  hazards text[],
  -- The "why." The director's actual objection ("I don't like this costume,
  -- how many scenes is it in") starts upstream of the plot, in why the
  -- costume designer chose it for this character in the first place. Free
  -- text, read by the same people who can see the rest of the row —
  -- deliberately not a separate narrower-audience field, since the
  -- reasoning behind a wardrobe decision is itself a wardrobe-depth fact.
  story_reasoning text,
  fitting_status fitting_status not null default 'pending',
  continuity_notes text[],
  -- A change that carries a story day's damage state into the next episode
  -- (SOP §4 — prepped dirty, not clean) points at the change it carries
  -- from. Self-referential, nullable: most changes don't carry over.
  carry_over_from_change_id uuid references costume_changes(id),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Which scenes a change is worn in — a real join against the scenes table
-- that already exists, not a second copy of scene numbers living in jsonb.
-- This join is *the* fix for the director's question: "how many scenes,
-- how many episodes" becomes a count over this table and productions.episode
-- instead of a human re-reading the whole plot. See costume_change_usage.
create table costume_change_scenes (
  id uuid primary key default gen_random_uuid(),
  costume_change_id uuid not null references costume_changes(id) on delete cascade,
  scene_id uuid not null references scenes(id) on delete cascade,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (costume_change_id, scene_id)
);

-- Links a continuity photo back to the specific change it documents — SOP
-- §2/§3's front/back continuity photos per change. Nullable and additive:
-- existing continuity_items rows (Art, Props, and any pre-this-migration
-- Wardrobe rows) keep working with this left null.
alter table continuity_items add column costume_change_id uuid references costume_changes(id);

-- ============================================================================
-- Row Level Security — costume_changes, story_days, costume_change_scenes
-- get the same audience continuity_items already has: the owning department
-- (Wardrobe) in full depth, plus the three roles whose own job already
-- requires wardrobe visibility (1st AD, Director, Script Supervisor). No
-- other department is added here — that is the point of "narrow abroad":
-- a department that needs a slice gets a view, below, not a seat at this
-- table.
-- ============================================================================

alter table story_days enable row level security;
alter table costume_changes enable row level security;
alter table costume_change_scenes enable row level security;

create policy "wardrobe + AD + Director + SS can read story days" on story_days for select
  using (auth_role() in ('1st AD', 'Director', 'Script Supervisor', 'Wardrobe'));
create policy "wardrobe can write story days" on story_days for insert
  with check (created_by = auth.uid() and auth_role() = 'Wardrobe');

create policy "wardrobe + AD + Director + SS can read costume changes" on costume_changes for select
  using (auth_role() in ('1st AD', 'Director', 'Script Supervisor', 'Wardrobe'));
create policy "wardrobe can insert costume changes" on costume_changes for insert
  with check (created_by = auth.uid() and auth_role() = 'Wardrobe');

create policy "wardrobe + AD + Director + SS can read costume change scenes" on costume_change_scenes for select
  using (auth_role() in ('1st AD', 'Director', 'Script Supervisor', 'Wardrobe'));
create policy "wardrobe can insert costume change scenes" on costume_change_scenes for insert
  with check (created_by = auth.uid() and auth_role() = 'Wardrobe');

-- ============================================================================
-- costume_change_usage — the director's question, answered by a query
-- instead of a person. security_invoker: this view inherits the caller's
-- own RLS on costume_changes/scenes/productions, so its audience is exactly
-- the audience of the table it summarizes — no wider, no narrower. That is
-- "deep at home": this is still wardrobe depth, just rolled up.
-- ============================================================================

create view costume_change_usage with (security_invoker = true) as
select
  cc.id as costume_change_id,
  cc.character_name,
  cc.change_number,
  count(distinct ccs.scene_id) as scene_count,
  count(distinct p.episode) as episode_count
from costume_changes cc
left join costume_change_scenes ccs on ccs.costume_change_id = cc.id
left join scenes s on s.id = ccs.scene_id
left join productions p on p.id = s.production_id
group by cc.id, cc.character_name, cc.change_number;

-- ============================================================================
-- scene_color_palette — the "narrow abroad" slice, built for Lighting (and
-- DP): which colors are in frame for a given scene, nothing else. No
-- fabric, no hazards, no continuity notes, no story reasoning — Lighting
-- doesn't need any of that, and the SOP's own principle ("the lighting guy
-- doesn't need to know everything about the wardrobe") says not to hand it
-- over just because it's technically joinable.
--
-- Deliberately NOT security_invoker: a plain view runs as its owner and
-- does not re-check RLS on costume_changes/scenes underneath it, so this
-- view can be granted to every signed-in role (broader than costume_changes'
-- own Wardrobe/AD/Director/SS audience) while still only ever exposing the
-- five columns below (scene id and number, character, item, color) — the
-- view's column list is the actual access control here, not RLS.
--
-- Because it skips RLS, it also has to keep out anyone who isn't signed-in,
-- provisioned crew: the WHERE clause requires a crew-list role
-- (auth_role() is not null), and the grants at the bottom revoke it from
-- anon. Supabase's default privileges grant new views to anon too, which
-- would otherwise expose this to anyone holding the public key.
-- ============================================================================

create view scene_color_palette as
select
  s.id as scene_id,
  s.scene_number,
  cc.character_name,
  item ->> 'name' as item_name,
  item ->> 'color' as color
from scenes s
join costume_change_scenes ccs on ccs.scene_id = s.id
join costume_changes cc on cc.id = ccs.costume_change_id
cross join lateral jsonb_array_elements(cc.items) as item
where item ->> 'color' is not null
  and auth_role() is not null;

-- Neither view is for signed-out users.
revoke all on scene_color_palette from anon;
revoke all on costume_change_usage from anon;
grant select on scene_color_palette to authenticated;
grant select on costume_change_usage to authenticated;
