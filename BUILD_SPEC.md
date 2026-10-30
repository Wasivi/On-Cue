# On-Cue — Build Spec

Where the build actually stands, what's decided, and what happens next, in order. What the product does and what this release includes lives in `docs/PRD.md`. The rules live in `docs/GOVERNANCE-MODEL.md`.

Last updated: 2026-10-25.

## What On-Cue is

A shoot-day coordination app for episodic television. Each person on set gets a private view: where to be, what's next, and what's holding the next camera roll. It's also the production's record — every decision is logged with the person who made it and the role they made it under. It does not replace the call sheet, the radios, or anyone's judgment. Full description: `docs/PRD.md`.

**Demo production:** Harbor Unit "Undertow" — Season 1, Episode 102, Shoot Day 6, Pier 14. Fictional.

**Visual identity: "Night Call."** The landing page is the one dark, animated title card (a navy and gold 3D constellation). Every working screen is light cool-gray paper (`--paper: #f3f4f5`, changed from warm ivory on 2026-10-22) with navy text, gold for the primary action, and red for holds. Every color, with its hex number, is in `DESIGN.md`.

## Current state

**Front end:** React + TypeScript + Vite. Ten screens: Landing, Onboarding, My Set, AD Command, Live Take, Lighting Console, Wardrobe & Talent, Set & Props Continuity, Take Intelligence, Budget. Centered bottom tab navigation. A role switcher stands in for sign-in.

**Backend:** A Supabase project exists, and all four setup files (`0001`–`0004`) are applied to the live database: 16 tables and 2 views, with access rules enforced in the database (verified 2026-10-30). **The app is not connected to Supabase yet** — everything runs in local memory and resets on reload.

**Works today:**
- **The call sheet drives every screen** — upload the call sheet and the show's logo and name, calls, meals, sunset, safety brief, location, hospital, scenes in shooting order, cast, crew, each department's notes (each role sees its own), and tomorrow's advance fill in across the app. No show is written into any screen: screens read the call sheet, the day's record, and prep data (`src/data/samples/`). With no call sheet loaded, every screen says so.
- **AD Command** — readiness board with blocked departments first; Clear Hold appears only for the 1st AD.
- **Wardrobe & Talent** — a contact sheet per character with real camera capture (photo and note in one action; Front, Back, or any typed label). Harbor Unit costume changes with item colors and fabrics, story reasons, multiples, hazards, fitting status, actor names, and a "used in N scenes across M episodes" count. Each actor's headshot, cast number, and call times; the call sheet's wardrobe notes on the right character; today's scenes in each look, in shooting order.
- **Lighting Console** — "Lighting Ready" takes a reference photo; the task, ETA track record, equipment, and checklist come from the day's record (demo data).
- **Set & Props Continuity** — Props and Art Department log items with photos; only the owning role can add; Props has food and brand-substitution fields.
- **Budget** — dollars by department, visible to the UPM and Producer only.
- **Take Intelligence** — takes, usable takes, turnaround, and time lost by cause (demo data).
- **Onboarding** — a real file picker. The Harbor Unit call sheet (`sample-data/harbor-unit-ep2-call-sheet.pdf`) loads the show, its logo, and the whole day, listing what it found as it reads. Any other file gets an honest "On-Cue can't read this yet," with the option to load the sample instead.

**Placeholders or not built** (per-screen detail in `docs/PRD.md` Section 8): reading any show's call sheet (only the sample is recognized, by file name), sign-in, the Supabase connection, real-time updates, offline saving, the Record screen, the Live Take note field, and the My Set and Lighting buttons that don't record anything yet.

## Confirmed decisions (don't re-litigate these)

1. **Backend: Supabase** — Postgres, sign-in, real-time, and file storage.
2. **No public APIs exist for production software** (checked across SyncOnSet, Movie Magic, and others). Verified 2026-10-23: Entertainment Partners (EP) bought SyncOnSet in January 2020 and sells it alongside Movie Magic, so one company owns both. Production data is entered natively in On-Cue or reached through real partnerships.
3. **Vendor search: Google Places API, not scraping.**
4. **Anchor Browser: a future module, not this release.** If built, the agent finds and summarizes vendor leads on sites that allow it; a person approves and buys; nothing gets around website protections (CAPTCHAs, bot blocking, region blocks). See `docs/PRD.md` Section 16.
5. **Data entry has to be zero-effort.** Day-of data piggybacks on what people are already doing; reference data is entered once, by one person, during prep.
6. **PRD:** `docs/PRD.md` v1.0 (2026-10-23) replaces PRD v0.2 (`PRD.pdf`, kept as history).
7. **Governance additions (2026-10-23):** calculations update on their own, decisions never do; the 1st AD can hand off roll authority; safety stop versus concern; privacy redaction is the one exception to append-only; adding a day player takes under a minute; broadcast status, scope detail. Full text in `docs/GOVERNANCE-MODEL.md`.
8. **Demo production:** Harbor Unit "Undertow", loaded from its call sheet (`sample-data/harbor-unit-ep2-call-sheet.pdf`). The DSI / Lone Wolf demo is retired and its data deleted (2026-10-25).
9. **The Record** (formerly "Agent Activity") is its own screen.
10. **On-Cue is not an accounting system.** No payroll, receipts, union rule calculation, or tax incentives. The UPM view translates minutes into an estimated dollar impact, and that's all.
11. **Nothing about a show is written into the screens (2026-10-25).** Any show's call sheet must be able to drive the app, its logo included. Screens read three things only: the call sheet (what the upload reads), the day's record (what On-Cue captures during the day), and prep data (costume plot, headshots, budget). Adding a show means adding data, never editing a screen.

## Confirmed scope for this release

| Item | Status |
|---|---|
| UPM role — Budget screen | Built (demo data) |
| Art Department — status-only, logs on Set & Props Continuity | Built |
| Props — its own role, status-only, logs on Set & Props Continuity | Built |
| Sound Mixer — full role with its own screen | Not built |
| Vendor tracking (`vendors` table) | Table exists |
| Find a Vendor (Google Places) | Not built |
| Crew-list sign-in | Not built |
| Offline Phase 1 (save on device first, sync later) | Not built |
| Wardrobe depth (story days, costume changes, usage count, colors for Lighting) | Built in the app with demo data; database tables live (`0002`), app not connected to them yet |
| The Record screen | Not built |
| Call sheet drives every screen (show, logo, times, scenes, cast, crew, notes) | Built for the Harbor Unit sample; reading other shows' call sheets not built |

## Schema status

- **`supabase/migrations/0001_initial_schema.sql`** — applied. 13 tables: `productions`, `scenes`, `setups`, `takes`, `department_statuses`, `vendors`, `continuity_items`, `eta_track_record`, `time_loss_records`, `budget_snapshots`, `production_budget`, `audit_log`, `profiles`. Access rules are enforced in the database, including the 1st AD READY gate and dollars for the UPM and Producer only.
- **`supabase/migrations/0002_wardrobe_depth.sql`** — applied. Adds `story_days`, `costume_changes` (with `actor_name`), `costume_change_scenes`, a `costume_change_id` link on `continuity_items`, and two views: `costume_change_usage` and `scene_color_palette` (neither readable by signed-out users). `scene_color_palette` deliberately runs with its owner's rights, so Lighting sees colors without getting the full costume record. Supabase's Security Advisor may flag it as a "Security Definer View". That's expected. Don't switch it to `security_invoker`, or Lighting loses its colors.
- **`supabase/migrations/0003_lock_profile_roles.sql`** — applied. Closes a hole in `0001`: a signed-in person could give themselves any role, such as 1st AD or UPM. After it, only the production office assigns roles, and a person can change only their own display name.
- **`supabase/migrations/0004_security_advisor_cleanups.sql`** — applied 2026-10-30. Pins `auth_role()`'s search path and removes outside access to `rls_auto_enable()`. That function isn't from these setup files; it matches Supabase's documented recipe for turning on access rules for every new table, and its `ensure_rls` trigger stays. Tested afterward: a signed-in person still gets the right role, new tables still get protected, signed-out callers are refused. The only Security Advisor item left is the expected `scene_color_palette` one.
- **How `0001`–`0003` were applied (2026-10-24):** an earlier repair had dropped `0001`'s custom types, which took every column that used them, `auth_role()`, and most access rules with it. The tables were empty, so a one-time script removed the partial setup and ran `0001`–`0003` fresh, in order, as one unit in the SQL Editor. Checked afterward from the app's public key: every table and column is present, `auth_role()` exists, and signed-out users are refused both views and can't edit profiles. All 16 tables have access rules switched on.
- **Migration history:** `0001`–`0003` were run by hand, so Supabase's migration history lists only `0004` (as `security_advisor_cleanups`). Before ever using `supabase db push`, mark the files applied with `supabase migration repair --status applied <version>`; otherwise the CLI will try to run them again.
- **Later:** new event kinds for handoffs, safety stops, and redactions (governance Section 7).

## Still open

- The PRD's open questions (`docs/PRD.md` Section 17) — best answered by talking to working crew.
- Constellation labels: decided "no background box, stronger outline" (2026-10-22); not built yet.
- The Prezi-style camera zoom on each constellation node as it's revealed (decided 2026-10-22); not built yet.
- `docs/PRODUCTION-WORKFLOW.md` is referenced by `CLAUDE.md` and `AGENTS.md` but doesn't exist yet. The workflow sections of the October 2026 research could become it.
- Theater and the other future modules (`docs/PRD.md` Section 16).
- **Role switching:** `profiles` holds one role per person. Letting someone hold several assigned roles and switch between them (governance Section 4) needs an assigned-roles table; until then, the production office sets each person's role.
- **Access by production:** the database's access rules don't yet separate one production's data from another's. That's fine with one demo production, but it's needed before a second real one.
- **Database speed cleanup, before real data (Performance Advisor, 2026-10-30):** 17 access rules re-check the signed-in person on every row, and 25 links between tables have no index. Neither matters while the tables are empty. One setup file fixes both, with no visible change.

## What has to happen next, in order

1. ~~Set up the database and turn off public sign-ups~~ — done: `0001`–`0003` applied and verified (2026-10-24); public sign-ups turned off and verified, with email confirmation left on (2026-10-25). Crew accounts now come only from the production office (Authentication → Users → Add user).
2. ~~Make Undertow the default demo on every screen~~ — done 2026-10-25: every screen reads the uploaded call sheet, the DSI demo is deleted, and Wardrobe shows the six headshots.
3. Connect the app to Supabase: crew-list sign-in, a real-time What Changed feed, photos saved to storage, and the Phase 1 offline queue.
4. **Read any show's call sheet.** An agent drafts the call sheet data from the uploaded file (PDF, Excel, or CSV), logo included; the production office checks the draft and confirms it before anyone sees it (agents draft, humans decide). Runs on step 3's server side, so the AI key never ships inside the app. Needs a privacy review first: call sheets carry crew phone numbers and addresses. The Harbor Unit JSON in `src/data/samples/` is the answer key to test it against.
5. Make every action button record an event (My Set, Lighting, the Live Take note), and build the Record screen.
6. The 1st AD handoff, the safety stop, and the concern flag.
7. Find a Vendor (Google Places — needs your API key and billing setup).
8. The Sound screen.

**In parallel (not code):** talk to 10–15 working crew — ADs, costume supervisors, UPMs. Their answers settle the PRD's open questions and give you real quotes.
