# On Cue — Build Spec

What this app is, what's actually done, what's decided but not built, what's still open, and what has to happen next — in order. This consolidates everything from PRD v0.2, DATA_INPUT.md, and this project's working decisions into one place.

## What On Cue is

A role-based, next-action coordination app for TV/film production. Each person on set (1st AD, Director, DP, Gaffer, Script Supervisor, Wardrobe, Talent Assistant, Producer) gets a private view answering: where to go, when, what's my next action, what's holding the next camera roll. It does not replace the call sheet, radios, or human judgment — see PRD §3 and §5.

Visual identity: **"Night Call"** — the landing page is a dark navy/gold animated 3D constellation (the one title-card moment); every operational page is light ivory paper with navy ink text and gold/signal-color accents, not dark. Full detail in `DESIGN.md` and the two project memory files (`design_system_night_call.md`, `design_landing_animation_in_chrome.md`).

## Current state (as of this doc)

**Frontend-only prototype.** React + TypeScript + Vite. Zero backend — all state is local React state, resets on reload. No real auth (a fake role-switcher dropdown). No persistence.

**7 pages, all re-themed to Night Call this session:** My Set, AD Command, Live Take, Lighting Console, Wardrobe & Talent, Take Intelligence, Onboarding — plus the nav shell (`Layout.tsx`, book-tab bottom nav, atmospheric-fade header) and the landing page (unchanged, approved as-is).

**Real features built this session (not fictional, actually work):**
- Wardrobe contact sheet — per-character growing photo gallery, real camera capture (`getUserMedia`), optional note captured in the same motion as the photo, timestamped.
- Lighting reference photo + ETA track record — "Lighting Ready" captures a reference photo; a visible on-time/late history (last 5 setups) is the actual trust-building mechanism, not the photo.
- AD Command's department feed sorts blockers-first, not recency-first.

**Still fictional / hardcoded:** everything else — production/scene/setup data, take history, continuity text seeded in `src/data/seed.ts`, the Onboarding call-sheet "import" (a fake progress bar, no real parsing — PRD explicitly puts real ingestion out of scope for this release).

## Confirmed decisions (don't re-litigate these)

1. **Backend: Supabase.** Postgres + built-in auth + realtime + storage. Decided over a custom Rust backend (wrong tool for a product whose requirements are still moving) and over free alternatives like Neon (DB-only, no auth/realtime/storage) or Appwrite (MariaDB, not Postgres).
2. **No public APIs exist for production software.** Confirmed across SyncOnSet, Wardy, DepDep, RacRac, and Entertainment Partners/Movie Magic (the actual industry standard). Any real production data has to be entered natively in On Cue or reached through a real enterprise partnership — not casual integration. Same is true for theater venues (they publish spec-sheet PDFs, not APIs).
3. **Vendor/resource search: Google Places API, not scraping.** "Find a costume shop near wherever the crew is" is a solved, legitimate, licensed problem — Google (and secondarily Yelp Fusion) already index this globally. Scraping and republishing other companies' documents/listings as "our own API" was explicitly considered and rejected — legal risk, not a technical problem.
4. **Anchor Browser: not needed right now.** It's a real tool (cloud browser for AI agents, built for bulk/scheduled scraping at scale), but nothing currently in scope needs it — Google Places covers vendor search, built-in web research covers PRD/design fact-checking. Revisit only if a genuine bulk-scraping need appears that those two can't cover.
5. **Data entry has to be zero-effort or it won't happen.** "People are lazy" was the correct observation, not cynicism. The fix: day-of data (photos, status) piggybacks on something the person is already doing; static reference data (venue specs, vendor lists) gets entered once, by one person, during prep — not re-entered daily by a busy crew.
6. **PRD v0.2 exists, on its own branch, not merged.** `docs/prd-continuity-notes-v0.2`, pushed to origin. Adds §9.6 Continuity Notes (Wardrobe): who writes a note, when, append-only, timestamped. Amends §9.2 to make Script Supervisor's "notes" explicit free text. This is real, reviewable, and ready to merge whenever you decide to.

## Confirmed scope additions (decided — build these)

- **UPM role** — scoped to *aggregate time-cost translation* (Take Intelligence's existing "time lost by cause" data, turned into dollars), explicitly not line-item receipts or payroll. Matches the real "hot cost report" a Production Accountant produces daily, fed by the same Daily Production Report data the AD already generates.
- **Art Department role** — covers Production Designer/Art Director/Set Decorator as one app role, same pattern as how "Wardrobe" already covers multiple real job titles.
- **Props role** — kept separate from Art Department (real productions treat it as a distinct job). This is where prop food and fake-branded goods ("greeking," e.g. a fake Coke label for clearance) live.
- **Sound Mixer — full interactive role, not status-only.** Added to `app_role`. Needs its own screen eventually (sound reports, mic issues — not live audio monitoring, which Com-Tek already covers). Not yet built; Art Department is the status-only comparison now, not Sound.
- **Vendor tracking** — a real `vendors` table, not just a search feature. Answers "who are their vendors" directly from the data model, not just a live lookup.
- **"Find a Vendor" screen** (Wardrobe first, Art/Props to follow) — preset category buttons, not a blank search box, powered by Google Places, location-aware to the current shoot location.
- **Identity: provisioned crew-list sign-in, not self-serve.** No open registration. The production office imports the crew list (the Onboarding screen's existing call-sheet import does this); each person signs in as themselves, picked from that list, not a free-text name. Social login (Google/Apple), if kept, authenticates a provisioned account only — it never creates one. Every event already stores both the person (`auth.users` id) and their role (via `profiles`) — authority lives at the role level, accountability at the person level. Prototype v1: no passwords, just picking a name from the seed crew list.
- **Offline tolerance — Phase 1, scoped.** Every action writes to local storage first (optimistic UI), queues on-device if the connection is down, and syncs in the background on reconnect — nothing is ever discarded. This is a write-through queue in front of the Supabase realtime sync already planned, not a replacement for it; the append-only event model is exactly what makes it tractable (no edit conflicts, just ordering by timestamp). **Explicitly out of scope for now (Phase 2, v2):** reading the whole board while disconnected, reconciling multiple devices that were offline simultaneously. The walkie radio remains the actual live-voice fallback if connectivity drops entirely — On Cue is the record, never the live channel.

## Schema status

`supabase/migrations/0001_initial_schema.sql` is written — 15 tables, enums, and a first-pass RLS policy set enforcing the PRD's privacy rules in Postgres itself (not just the UI). Not yet run against the live database; that's a manual step in the Supabase SQL Editor, done once you confirm it.

**Both open questions from the last round are now resolved:**

- **Art Department: status-only for v1, full role deferred.** Same test every other full screen already passed: a dedicated screen is for people making a live go/no-go decision during the shoot day (Wardrobe negotiates "does this read right under this light" with the Director; Lighting/Live Take gate the actual roll; Sound Mixer owns sound reports and mic issues, now also a full role). Art Department's day-of work — dressing the set, resetting between setups — is real but routine execution, not a live decision loop. It flows into `continuity_items` with `department = 'art'` and shows on AD Command as a status line. Reversible later if a real art director needs their own view — the schema already supports it.
- **Budget: 1st AD gets minutes, never dollars.** This split is now a real schema decision, not just a UI restriction: `time_loss_records` (new table) is broadly readable by every role including 1st AD — it backs Take Intelligence's existing "time lost by cause" view, which wasn't actually attached to a real table before this pass. `budget_snapshots` (dollars) stays UPM + Producer only, a genuinely separate table, not a column permission trick on the same one. Matches how it actually works on a real set: the AD tracks schedule, the UPM tracks money, and collapsing that boundary turns every hold into a money argument.

## Still open — not yet decided, don't build

- **Broadway / live theater / "enterprise" expansion.** A real, exciting direction, but theater has a genuinely different structure (Stage Manager not 1st AD, no "takes," cue-stack lighting) — not a relabel of the film version. Recommended to live as a separate "Future Vision" section, not a rewrite of the current scope, until the TV version has been used by a real production.

## What has to happen next, in order

1. **You create the Supabase project.** Sign up free at supabase.com, create a project, get the Project URL and anon public key from Project Settings → API. Send those to me (or put them in a `.env` file yourself).
2. **I write the schema** — before any code, as a reviewed plan, not a blind migration: `productions`, `scenes`, `setups`, `takes`, `department_statuses`, `continuity_items` (generalized Wardrobe/Art/Props photo+note+vendor tracking, replacing the earlier wardrobe-only `continuity_photos`), `prop_items`, `vendors`, `eta_track_record`, `budget_snapshots`, `production_budget`, `audit_log`, `profiles` (roles now include UPM, Art Department, Props). You review it before it's applied — schema changes are expensive to walk back once real data exists.
3. **I wire up real auth** (sign in by picking your name from the provisioned crew list, not self-serve) replacing the fake role-switcher, plus real-time subscriptions so a status change on one device shows up on another, plus the Phase 1 offline write-queue (local-first write, sync on reconnect) layered on top of that sync.
4. **Google Places integration** for the Wardrobe "Find a Vendor" screen — needs its own API key and billing setup on your end (separate from Supabase).
5. **Once the scope decision above is made:** one deliberate PRD rewrite covering whatever's actually in scope (UPM at minimum; Art Department/Props/theater only if you decide to go there) — not another piecemeal update.

Anchor Browser does not appear in this list. Add it back only if a real need shows up that steps 1–5 don't cover.
