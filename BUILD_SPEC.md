# On-Cue — Build Spec

Where the build actually stands, what's decided, and what happens next, in order. What the product does and what this release includes lives in `docs/PRD.md`. The rules live in `docs/GOVERNANCE-MODEL.md`.

Last updated: 2026-10-23.

## What On-Cue is

A shoot-day coordination app for episodic television. Each person on set gets a private view: where to be, what's next, and what's holding the next camera roll. It's also the production's record — every decision is logged with the person who made it and the role they made it under. It does not replace the call sheet, the radios, or anyone's judgment. Full description: `docs/PRD.md`.

**Demo production:** Harbor Unit "Undertow" — Season 1, Episode 102, Shoot Day 6, Pier 14. Fictional.

**Visual identity: "Night Call."** The landing page is the one dark, animated title card (a navy and gold 3D constellation). Every working screen is light cool-gray paper (`--paper: #f3f4f5`, changed from warm ivory on 2026-10-22) with navy text, gold for the primary action, and red for holds. Every color, with its hex number, is in `DESIGN.md`.

## Current state

**Front end:** React + TypeScript + Vite. Ten screens: Landing, Onboarding, My Set, AD Command, Live Take, Lighting Console, Wardrobe & Talent, Set & Props Continuity, Take Intelligence, Budget. Centered bottom tab navigation. A role switcher stands in for sign-in.

**Backend:** A Supabase project exists. `0001_initial_schema.sql` is applied to the live database (13 tables, with access rules enforced in the database). `0002_wardrobe_depth.sql` is written but not applied. **The app is not connected to Supabase yet** — everything runs in local memory and resets on reload.

**Works today:**
- **AD Command** — readiness board with blocked departments first; Clear Hold appears only for the 1st AD.
- **Wardrobe & Talent** — a contact sheet per character with real camera capture (photo and note in one action; Front, Back, or any typed label). Harbor Unit costume changes with item colors and fabrics, story reasons, multiples, hazards, fitting status, actor names, and a "used in N scenes across M episodes" count.
- **Lighting Console** — "Lighting Ready" takes a reference photo; the ETA track record shows fixed demo data.
- **Set & Props Continuity** — Props and Art Department log items with photos; only the owning role can add; Props has food and brand-substitution fields.
- **Budget** — dollars by department, visible to the UPM and Producer only.
- **Take Intelligence** — takes, usable takes, turnaround, and time lost by cause (demo data).
- **Onboarding** — a real file picker; the Harbor Unit sample call sheet and schedule are recognized by name; reading the file is simulated by design.

**Placeholders or not built** (per-screen detail in `docs/PRD.md` Section 8): sign-in, the Supabase connection, real-time updates, offline saving, the Record screen, the Live Take note field, the six headshots in Wardrobe, and the My Set and Lighting buttons that don't record anything yet. The app still opens on the old "DSI / Lone Wolf" demo; Undertow appears only on Wardrobe, after uploading a sample file.

## Confirmed decisions (don't re-litigate these)

1. **Backend: Supabase** — Postgres, sign-in, real-time, and file storage.
2. **No public APIs exist for production software** (checked across SyncOnSet, Movie Magic, and others). Verified 2026-10-23: Entertainment Partners (EP) bought SyncOnSet in January 2020 and sells it alongside Movie Magic, so one company owns both. Production data is entered natively in On-Cue or reached through real partnerships.
3. **Vendor search: Google Places API, not scraping.**
4. **Anchor Browser: a future module, not this release.** If built, the agent finds and summarizes vendor leads on sites that allow it; a person approves and buys; nothing gets around website protections (CAPTCHAs, bot blocking, region blocks). See `docs/PRD.md` Section 16.
5. **Data entry has to be zero-effort.** Day-of data piggybacks on what people are already doing; reference data is entered once, by one person, during prep.
6. **PRD:** `docs/PRD.md` v1.0 (2026-10-23) replaces PRD v0.2 (`PRD.pdf`, kept as history).
7. **Governance additions (2026-10-23):** calculations update on their own, decisions never do; the 1st AD can hand off roll authority; safety stop versus concern; privacy redaction is the one exception to append-only; adding a day player takes under a minute; broadcast status, scope detail. Full text in `docs/GOVERNANCE-MODEL.md`.
8. **Demo production:** Harbor Unit "Undertow" on every screen. The DSI / Lone Wolf demo is retired.
9. **The Record** (formerly "Agent Activity") is its own screen.
10. **On-Cue is not an accounting system.** No payroll, receipts, union rule calculation, or tax incentives. The UPM view translates minutes into an estimated dollar impact, and that's all.

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
| Wardrobe depth (story days, costume changes, usage count, colors for Lighting) | Built in the app with demo data; database tables in `0002`, not applied |
| The Record screen | Not built |

## Schema status

- **`supabase/migrations/0001_initial_schema.sql`** — applied. 13 tables: `productions`, `scenes`, `setups`, `takes`, `department_statuses`, `vendors`, `continuity_items`, `eta_track_record`, `time_loss_records`, `budget_snapshots`, `production_budget`, `audit_log`, `profiles`. Access rules are enforced in the database, including the 1st AD READY gate and dollars for the UPM and Producer only.
- **`supabase/migrations/0002_wardrobe_depth.sql`** — written, not applied. Adds `story_days`, `costume_changes` (with `actor_name`), `costume_change_scenes`, a `costume_change_id` link on `continuity_items`, and two views: `costume_change_usage` and `scene_color_palette` (neither readable by signed-out users).
- **`supabase/migrations/0003_lock_profile_roles.sql`** — written, not applied. Closes a hole in `0001`: a signed-in person could give themselves any role, such as 1st AD or UPM. After it, only the production office assigns roles, and a person can change only their own display name.
- **Later:** new event kinds for handoffs, safety stops, and redactions (governance Section 7).

## Still open

- The PRD's open questions (`docs/PRD.md` Section 17) — best answered by talking to working crew.
- Constellation labels: decided "no background box, stronger outline" (2026-10-22); not built yet.
- The Prezi-style camera zoom on each constellation node as it's revealed (decided 2026-10-22); not built yet.
- `docs/PRODUCTION-WORKFLOW.md` is referenced by `CLAUDE.md` and `AGENTS.md` but doesn't exist yet. The workflow sections of the October 2026 research could become it.
- Theater and the other future modules (`docs/PRD.md` Section 16).
- **Role switching:** `profiles` holds one role per person. Letting someone hold several assigned roles and switch between them (governance Section 4) needs an assigned-roles table; until then, the production office sets each person's role.
- **Access by production:** the database's access rules don't yet separate one production's data from another's. That's fine with one demo production, but it's needed before a second real one.
- **Old demo data:** the DSI / Lone Wolf data in `src/data/seed.ts` uses real venue names and addresses, which breaks the fictional-data rule. It goes away when DSI is retired (next step 2).

## What has to happen next, in order

1. **You:** in the Supabase SQL Editor, run `0002_wardrobe_depth.sql`, then `0003_lock_profile_roles.sql` — a new tab for each, paste, Run. Then, in Supabase's Authentication settings, turn off public sign-ups ("Allow new users to sign up"), because crew accounts come only from the production office.
2. Make Undertow the default demo on every screen, retire DSI / Lone Wolf, and show the six headshots in Wardrobe.
3. Connect the app to Supabase: crew-list sign-in, a real-time What Changed feed, photos saved to storage, and the Phase 1 offline queue.
4. Make every action button record an event (My Set, Lighting, the Live Take note), and build the Record screen.
5. The 1st AD handoff, the safety stop, and the concern flag.
6. Find a Vendor (Google Places — needs your API key and billing setup).
7. The Sound screen.

**In parallel (not code):** talk to 10–15 working crew — ADs, costume supervisors, UPMs. Their answers settle the PRD's open questions and give you real quotes.
