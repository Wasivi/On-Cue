-- On Cue — initial schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query -> paste -> Run).
-- Builds every table from BUILD_SPEC.md, with Row Level Security enabled and a first-pass
-- policy set matching the PRD's own privacy rules. Policies can be tightened once real auth
-- is wired up and tested end to end — this is a reviewed starting point, not a final version.

-- ============================================================================
-- Enums
-- ============================================================================

create type app_role as enum (
  '1st AD', 'Director', 'DP', 'Gaffer', 'Script Supervisor', 'Sound Mixer',
  'Wardrobe', 'Talent Assistant', 'Producer', 'UPM', 'Art Department', 'Props'
);

create type department_name as enum (
  'lighting', 'wardrobe', 'sound', 'camera', 'props', 'art', 'locations', 'talent'
);

create type department_status_state as enum ('ready', 'inProgress', 'notReady');

create type take_result as enum ('print', 'hold', 'noGood', 'incomplete');

create type continuity_department as enum ('wardrobe', 'art', 'props');

create type vendor_source as enum ('MANUAL', 'GOOGLE_PLACES');

create type audit_event_type as enum ('ready', 'hold', 'roll', 'take', 'info');

-- ============================================================================
-- Core production hierarchy
-- ============================================================================

create table productions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  season int,
  episode int,
  episode_title text,
  shoot_day int,
  location text,
  created_at timestamptz not null default now()
);

create table scenes (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  scene_number text not null,
  description text
);

create table setups (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes(id) on delete cascade,
  setup_number text not null,
  description text,
  target_roll_time timestamptz,
  location text,
  status text not null default 'hold' -- 'hold' | 'ready' | 'rolling'
);

create table takes (
  id uuid primary key default gen_random_uuid(),
  setup_id uuid not null references setups(id) on delete cascade,
  take_number int not null,
  result take_result,
  notes text, -- free text — PRD §9.2: Script Supervisor's notes field
  reset_causes text[], -- fixed category chips, e.g. {'Lighting adjustment','Actor reset'}
  duration_seconds int,
  recorded_by uuid references auth.users(id),
  recorded_at timestamptz not null default now()
);

-- ============================================================================
-- Department status (the live readiness board)
-- ============================================================================

create table department_statuses (
  id uuid primary key default gen_random_uuid(),
  setup_id uuid not null references setups(id) on delete cascade,
  department department_name not null,
  status department_status_state not null default 'notReady',
  eta text,
  owner text,
  current_task text,
  blocker_count int not null default 0,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Continuity — shared by Wardrobe, Art Department, and Props. All three do
-- the same thing: track an item with a photo, an optional note, and where it
-- came from. character_name is only meaningful for wardrobe.
-- ============================================================================

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text, -- e.g. 'Costume Rental', 'Prop House', 'Furniture Rental'
  city text,
  contact_info text,
  source vendor_source not null default 'MANUAL',
  created_at timestamptz not null default now()
);

create table continuity_items (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  setup_id uuid references setups(id), -- nullable: an item can span multiple setups in a day
  department continuity_department not null,
  character_name text, -- nullable: only wardrobe uses this
  item_name text,
  label text not null, -- 'Front' | 'Back' | free-typed custom label
  note text,
  photo_url text, -- Supabase Storage path
  vendor_id uuid references vendors(id),
  -- Props-only fields, per the decided rule: nullable columns here rather
  -- than a separate prop_items table — the fake-Coke/prop-food case lives
  -- in these two columns, null on every Wardrobe/Art row.
  is_food boolean,
  brand_substitution_note text, -- e.g. "fake brand used — no clearance obtained"
  captured_by uuid references auth.users(id),
  captured_at timestamptz not null default now()
);

-- ============================================================================
-- Trust-building: ETA track record (Lighting Console) and budget (UPM)
-- ============================================================================

create table eta_track_record (
  id uuid primary key default gen_random_uuid(),
  setup_id uuid not null references setups(id) on delete cascade,
  department department_name not null,
  stated_eta timestamptz,
  actual_ready_time timestamptz,
  result text, -- 'onTime' | 'late'
  created_at timestamptz not null default now()
);

-- Backs Take Intelligence's "time lost by cause" view — minutes only, no
-- dollars. Broadly readable by every crew role, 1st AD included: minutes are
-- the 1st AD's native language (the day is a clock), and this is the exact
-- data that already exists on that screen, just not yet backed by a real
-- table. Never put a dollar figure in this table — that's budget_snapshots,
-- a different table with a deliberately different, narrower audience.
create table time_loss_records (
  id uuid primary key default gen_random_uuid(),
  setup_id uuid not null references setups(id) on delete cascade,
  department department_name not null,
  cause text not null, -- the fixed PRD cause categories, e.g. 'Lighting adjustment'
  minutes_lost int not null default 0,
  recorded_at timestamptz not null default now()
);

-- UPM view: dollars, never shown to the 1st AD. Deliberately a SEPARATE
-- table from time_loss_records above, not a shared one with a column-level
-- permission trick — the point isn't just restricting a column, it's that
-- minutes and dollars are two different audiences by design (the 1st AD
-- tracks schedule, the UPM tracks money; collapsing that boundary turns
-- every hold into a money argument). time_lost_minutes here is an internal
-- input to the cost math, for the UPM's own context — not the thing a
-- 1st AD is meant to read; that's time_loss_records, above.
-- One CURRENT snapshot per (setup, department) — the unique constraint makes
-- this an upsert target: recomputed automatically whenever time_loss_records
-- changes, never a growing history table. The UPM always sees the latest
-- number for a setup, not a log of every recompute.
create table budget_snapshots (
  id uuid primary key default gen_random_uuid(),
  setup_id uuid not null references setups(id) on delete cascade,
  department department_name not null,
  time_lost_minutes int not null default 0,
  estimated_cost_impact numeric(10, 2),
  computed_at timestamptz not null default now(),
  unique (setup_id, department)
);

create table production_budget (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  department department_name not null,
  allocated_budget numeric(12, 2),
  spent_to_date numeric(12, 2) not null default 0
);

-- ============================================================================
-- Audit log — append-only, matches PRD §4 "preserve an auditable record"
-- ============================================================================

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type audit_event_type not null,
  actor_role app_role,
  actor_user_id uuid references auth.users(id),
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Profiles — one row per real user, linked to Supabase's built-in auth
-- ============================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null,
  display_name text,
  production_id uuid references productions(id),
  created_at timestamptz not null default now()
);

-- Helper used by several policies below: the calling user's role.
create function auth_role() returns app_role
language sql stable
as $$
  select role from profiles where id = auth.uid()
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table productions enable row level security;
alter table scenes enable row level security;
alter table setups enable row level security;
alter table takes enable row level security;
alter table department_statuses enable row level security;
alter table vendors enable row level security;
alter table continuity_items enable row level security;
alter table eta_track_record enable row level security;
alter table time_loss_records enable row level security;
alter table budget_snapshots enable row level security;
alter table production_budget enable row level security;
alter table audit_log enable row level security;
alter table profiles enable row level security;

-- Shared operational data: any signed-in crew member can read it.
create policy "crew can read productions" on productions for select using (auth.role() = 'authenticated');
create policy "crew can read scenes" on scenes for select using (auth.role() = 'authenticated');
create policy "crew can read setups" on setups for select using (auth.role() = 'authenticated');
create policy "crew can read department statuses" on department_statuses for select using (auth.role() = 'authenticated');
create policy "crew can read vendors" on vendors for select using (auth.role() = 'authenticated');
create policy "crew can read eta track record" on eta_track_record for select using (auth.role() = 'authenticated');
create policy "crew can read time loss records" on time_loss_records for select using (auth.role() = 'authenticated');
create policy "crew can read audit log" on audit_log for select using (auth.role() = 'authenticated');
-- Append-only by design, same pattern as continuity_items — any signed-in
-- crew member can write an event (every role performs auditable actions),
-- but actor_user_id must be their own; no update/delete policy exists.
create policy "crew can insert own audit events" on audit_log for insert
  with check (actor_user_id = auth.uid());

-- READY gate: only the 1st AD may move a setup out of 'hold'. This is the
-- one rule every governance doc repeats, and the single thing the whole app
-- revolves around — enforced here, not just in the UI.
create policy "only 1st ad can update setup status" on setups for update
  using (auth_role() = '1st AD')
  with check (auth_role() = '1st AD');
create policy "only 1st ad can insert setups" on setups for insert
  with check (auth_role() = '1st AD');

-- Takes: PRD §9.2 — anyone can read the slate, but only an authorized
-- Script Supervisor or 1st AD records one. Policy named for what each half
-- actually does, not identically for both.
create policy "crew can read takes" on takes for select using (auth.role() = 'authenticated');
create policy "SS or AD can insert takes" on takes for insert
  with check (
    recorded_by = auth.uid()
    and auth_role() in ('Script Supervisor', '1st AD')
  );

-- Department status writes: only that department's own role, or the 1st AD.
-- Every department_name value needs a mapping here or that department can
-- never update its own status at all.
create policy "owning department or AD can update status" on department_statuses for update
  using (
    auth_role() = '1st AD'
    or (department = 'lighting' and auth_role() = 'Gaffer')
    or (department = 'wardrobe' and auth_role() = 'Wardrobe')
    or (department = 'talent' and auth_role() = 'Talent Assistant')
    or (department = 'camera' and auth_role() = 'DP')
    or (department = 'sound' and auth_role() = 'Sound Mixer')
    or (department in ('props') and auth_role() = 'Props')
    or (department in ('art', 'locations') and auth_role() = 'Art Department')
  );
create policy "owning department can insert status" on department_statuses for insert
  with check (
    auth_role() = '1st AD'
    or (department = 'lighting' and auth_role() = 'Gaffer')
    or (department = 'wardrobe' and auth_role() = 'Wardrobe')
    or (department = 'talent' and auth_role() = 'Talent Assistant')
    or (department = 'camera' and auth_role() = 'DP')
    or (department = 'sound' and auth_role() = 'Sound Mixer')
    or (department in ('props') and auth_role() = 'Props')
    or (department in ('art', 'locations') and auth_role() = 'Art Department')
  );

-- Continuity items: the actual privacy rule — Gaffer explicitly does not see
-- continuity notes (PRD §10 routing table). Visible to the owning department,
-- 1st AD, Director, and Script Supervisor (continuity is their department on
-- a real set too); writable only by the owning department. Append-only by
-- design — no update/delete policy exists, so neither is possible.
create policy "owning dept + AD + Director + SS can read continuity" on continuity_items for select
  using (
    auth_role() in ('1st AD', 'Director', 'Script Supervisor')
    or (department = 'wardrobe' and auth_role() = 'Wardrobe')
    or (department = 'art' and auth_role() = 'Art Department')
    or (department = 'props' and auth_role() = 'Props')
  );
create policy "owning dept can insert continuity" on continuity_items for insert
  with check (
    captured_by = auth.uid()
    and (
      (department = 'wardrobe' and auth_role() = 'Wardrobe')
      or (department = 'art' and auth_role() = 'Art Department')
      or (department = 'props' and auth_role() = 'Props')
    )
  );

-- Budget: UPM and Producer only — matches the researched reality that AD and
-- Director don't see raw dollars, only time-risk (which stays in setups/
-- department_statuses, visible to everyone above).
create policy "UPM and Producer can read budget snapshots" on budget_snapshots for select
  using (auth_role() in ('UPM', 'Producer'));
create policy "UPM can insert budget snapshots" on budget_snapshots for insert
  with check (auth_role() = 'UPM');
create policy "UPM and Producer can read production budget" on production_budget for select
  using (auth_role() in ('UPM', 'Producer'));
create policy "UPM can manage production budget" on production_budget for all
  using (auth_role() = 'UPM') with check (auth_role() = 'UPM');

-- Profiles: everyone can see who's in what role (needed for the UI); a user
-- can only edit their own row.
create policy "crew can read profiles" on profiles for select using (auth.role() = 'authenticated');
create policy "users can update own profile" on profiles for update using (id = auth.uid());
create policy "users can insert own profile" on profiles for insert with check (id = auth.uid());
