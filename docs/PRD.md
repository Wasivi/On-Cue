# On-Cue — Product Requirements Document

**Version:** 1.0 (draft for review)
**Date:** 2026-10-23
**Status:** Prototype. Replaces PRD v0.2 (`PRD.pdf`, kept as the historical record).
**Audience:** the product owner, designers, engineers, and the AI agents that build On-Cue.

This document says what On-Cue does and what this release includes. The rules it must follow — who decides, who sees what, how actions are recorded — live in `docs/GOVERNANCE-MODEL.md`. Where the two ever disagree, the governance document wins.

> **Fictional prototype notice.** Every production, person, character, location, schedule, and event in this document and in the demo is invented. The demo never uses real productions, real people, or real call sheets.

---

## 1. What On-Cue is

On-Cue is a shoot-day coordination app for episodic television. Each person on set gets a private view that answers three things: where do I need to be, what's my next action, and what's holding the next camera roll.

On-Cue is also the production's **record**. Every decision is logged with the person who made it and the role they made it under, so nobody has to protect themselves with witnesses.

On-Cue supports existing set practice. It does not replace the call sheet, the radios, the Assistant Directors, the department heads, or anyone's judgment.

**The core question:**

> How does each person get exactly what they need to help the current setup reach camera roll — full depth in their own department, and only the slices they need from everyone else?

PRD v0.2 asked for "the minimum accurate information." The spirit is the same. The refinement is *deep at home, narrow abroad*: a department sees its own work in full, and other departments' work only as narrow, purpose-built slices.

---

## 2. The problem

A shoot day runs on call sheets, schedules, radios, texts, and verbal check-ins, across departments that each keep their own tools. When a take stops or a setup is delayed:

- **Nobody owns the next step clearly.** The 1st AD walks the set asking who's ready.
- **Everyone hears everything, and nothing is recorded.** The radio carries every update, but there's no record of why a take failed or who cleared what.
- **Information is trapped in each department's system.** The commercial tools don't share data with each other (Section 15), so the AD can't see wardrobe's readiness and wardrobe can't see what moved in the schedule.
- **People protect themselves with witnesses.** On a set with no record, the only protection is making sure everyone heard you say it out loud.
- **Delay costs show up hours later**, after the money is already spent.

Wardrobe shows the problem clearly. A look repeats across scenes and episodes by **story day**, not by scene. When a director asks mid-shoot, "how many scenes is this costume in?", someone has to recount the whole costume plot by hand.

---

## 3. Principles

A summary. The full rules are in `docs/GOVERNANCE-MODEL.md`.

1. **Agents recommend, humans decide.** Agents may recommend, summarize, classify, and draft. Only a signed-in person approves, clears, rolls, buys, schedules, or signs off. Calculated numbers (minutes lost, budget snapshots) may update on their own; decisions never do.
2. **Only the 1st AD clears a hold and approves roll.** The 1st AD can hand that authority to a named person for a stated window, and the handoff is recorded.
3. **Anyone can stop for safety.** A safety stop puts the setup straight back on HOLD, and only the 1st AD clears it. A concern goes to the owning department without stopping the set.
4. **Every action records the person and the role.** Events are never edited or deleted; corrections are new events. The one exception is privacy redaction of personal content, and the redaction is itself recorded.
5. **Broadcast status, scope detail.** Everyone sees what changed and what's blocked within seconds. Detail stays in its own department. Only changes that affect your own role interrupt you.
6. **Minutes for the AD, dollars for the UPM.** The 1st AD sees minutes lost, never dollars. Dollars are for the UPM and Producer only.
7. **Time lost, not fault.** The record answers what happened, who did it, and what it authorized — never whose fault it was.
8. **The walkie boundary.** Radios stay the live channel and the fallback when the network fails. On-Cue is the record, never the live voice.

---

## 4. Goals and non-goals

### Goals

- Give each role its next action, location, target time, and status.
- Let authorized people record take outcomes and reset causes in seconds.
- Route each cause to only the departments responsible, and tell everyone else only what they need.
- Give the 1st AD a fast readiness summary and the only control that clears a hold.
- Keep a visible record of every decision: who, under which role, and what it authorized.
- Give Wardrobe the full depth of its own work: story days, costume changes, colors, multiples, hazards, continuity photos, and how often each look is used.
- Show that a controlled agent model, where humans keep authority, can work on a real set.

### Non-goals

- Replacing the call sheet, the shooting schedule, or the AD's workflow.
- Scheduling or budgeting software. Movie Magic and others already do this.
- Payroll, timecards, union rule calculation, receipts, tax incentives, or accounting of any kind. The UPM view turns minutes into an estimated dollar impact, and that is all.
- Any autonomous decision: scheduling, safety, staffing, purchasing, or camera roll.
- Live voice or calling. Radios own live talk.
- Collecting data from websites by getting around their protections (CAPTCHAs, bot blocking, region blocks).
- Assigning fault or scoring individual performance.
- Real production data in the prototype.

---

## 5. Users and roles

### Roles with their own screen

| Role | Owns decisions on | Sees | Main screen |
|---|---|---|---|
| 1st AD | Clearing holds, READY, roll, handing off roll authority | Every department's status, blockers, minutes lost (never dollars) | AD Command |
| Director | Print and retake calls, creative approvals | Take results, performance notes, department status, full wardrobe depth for the scene | My Set, Live Take |
| DP | Camera and the visual plan | Camera and lighting readiness, visual issues, costume colors in frame | Lighting Console |
| Gaffer | Lighting fixes and readiness | Lighting tasks, power, blockers, costume colors in frame | Lighting Console |
| Script Supervisor | The take log and its notes | Every take, continuity from wardrobe, art, and props, full wardrobe depth | Live Take |
| Sound Mixer | Sound reports, mic issues | The take log, their own reports, blockers | Sound (not built) |
| Wardrobe | Costume continuity; wardrobe's actor-ready | Full wardrobe depth: costume plot, story days, multiples, hazards, photos, usage | Wardrobe & Talent |
| Talent Assistant | Performer holding and readiness | Call times, actor status, private notes | Wardrobe & Talent |
| Producer | Schedule-risk decisions | Department status, minutes lost, cost impact | Budget, Take Intelligence |
| UPM | The budget view (translation only) | Cost impact in dollars, minutes lost | Budget |

### Status-only departments (no screen of their own this release)

- **Art Department** — logs continuity items (photo, name, note) on the Set & Props Continuity screen and shows as a status line on AD Command. It can become a full role later; the database already supports it.
- **Props** — its own role, separate from Art, same pattern. Props-only fields: whether an item is food, and a brand substitution note (for example, a fake label used for clearance).
- **Location** — a one-line status, such as "permit active, location locked."

Every person signs in as themselves. Many people can hold the same role, and one person can hold several roles and switch during the day. Every action records the role it was taken under.

---

## 6. The demo production

All demo content uses one fictional production, **Harbor Unit "Undertow."**

| | |
|---|---|
| Show | Harbor Unit (a fictional police procedural) |
| Season / Episode | Season 1, Episode 102, "Undertow" |
| Shoot day | Day 6 |
| Location | Pier 14, NYC Harbor District (fictional) |
| Current setup | 14A — Scene 14, EXT. Pier 14 Dock, NIGHT. Vale and Reyes confront the tip; Kade stands backup |
| Time / target roll | 8:10 PM / 8:30 PM |
| Starting status | HOLD |
| Take event | Take 3 stops at 0:41. Causes: Continuity (Reyes's blood level doesn't match the last printed take) and Lighting adjustment (glare off the wet dock) |
| ETAs | Wardrobe 3 minutes, Lighting 4 minutes |

**Cast (six principals):** Det. Mara Vale (T. Marchetti), Ana Reyes (K. Oduya), Sgt. Theo Kade (D. Brennan), Warden Silva (R. Bianchi), Capt. Elena Dray (M. Alvarez), Oswin Price (J. Halvorsen).

**The wardrobe story the demo tells:**
- Vale's Change 4 (olive trench) carries Story Night 4's damage from Episode 1 (Scenes 38–42) into Episode 2 (Scenes 11–15), the carry-over example in `docs/WARDROBE-SOP.md`. It's used in 10 scenes across 2 episodes.
- Reyes's blood level escalates across the dock scenes.
- Price's fitting is still pending, and that has to reach the 1st AD before Scene 19 is scheduled.

**Source files:** `src/data/seedHarborUnit.ts`, `sample-data/harbor-unit-ep2-call-sheet.csv`, `sample-data/harbor-unit-production-schedule.csv`, `sample-data/headshots/`.

**Requirement:** Undertow is the default demo on every screen, and the earlier "DSI / Lone Wolf" demo data is retired. *Not built: today only the Wardrobe screen shows Undertow, and only after a sample file is uploaded on Onboarding.*

---

## 7. The core loop

1. The production office loads the day: call sheet and crew list. (Simulated this release.)
2. Each person signs in as themselves and lands on My Set with their role's next action.
3. A take stops. The Script Supervisor (or 1st AD) records the outcome and the causes.
4. The harness sends a task card to each responsible department and a short status to everyone else.
5. Departments respond: Ready, Need Time, or Report Issue.
6. AD Command shows overall readiness. When every required department is ready, the setup reads **Ready for AD Approval**.
7. The 1st AD — or the person they handed off to — clears the hold and approves roll. Nothing rolls automatically.
8. Every step is written to the Record with the person and the role.

At any point, anyone can call a safety stop (out loud on the radio first), and the setup goes straight back on HOLD.

---

## 8. Requirements by screen

**Status key:** **Built** — works today. **Partly built.** **Not built.**
"Works today" means in the app's local memory. Nothing is saved to the server until Section 11 is built, so everything resets when the page reloads.

### 8.1 Sign-in — Not built

- Sign in by picking your name from the production's crew list. No self-serve sign-up, no typed-in names.
- One person can hold several roles and switch during the day. Every action records the role in use.
- Google or Apple sign-in, if offered, only signs in an existing crew-list account. It never creates one.
- The production office can add a day player, give them a role, and set an end date in under a minute. Their access ends on that date or at wrap.
- Prototype: no passwords. Today a role switcher stands in for sign-in.

### 8.2 My Set — Partly built

- A home screen for each role: current setup, location, target time, status, next action, and what changed.
- It never shows the whole production plan by default.
- Its action buttons (Print, Go Again, Approve Escalation, Escalate) record events. *Today they're placeholders that record nothing, and the What Changed section is fixed text.*

### 8.3 Live Take — Partly built

- The Script Supervisor or 1st AD records scene, setup, take, outcome (print, hold, no good, incomplete), and reset causes.
- Causes: Actor performance / line, Lighting adjustment, Camera / focus, Sound, Continuity, Props / set reset, Director wants another option, Technical issue, Time / interruption, Other.
- A short free-text note per take, separate from the cause chips. It's optional unless the cause is Other. *Not built.*
- Choosing a cause creates only the task cards the routing table allows (Section 9).

### 8.4 Readiness and the READY gate — Partly built

- Each department marks Ready, Need Time, or Report Issue.
- The setup's state is calculated from the departments it needs. When all are ready, it reads Ready for AD Approval. *Built for lighting and talent.*
- Only the 1st AD can move the setup to READY and approve roll, enforced both on screen and in the database. *Built.*
- Roll-authority handoff: to a named person, for a stated window, recorded. It ends at that time or when the 1st AD takes it back. *Not built.*
- Two kinds of flag, safety stop and concern, as defined in governance Section 2. *Not built.*
- Nothing ever rolls automatically.

### 8.5 AD Command — Built

- An overall readiness board, sorted with blockers first.
- Minutes lost, never dollars.
- The Clear Hold control appears only for the 1st AD (and later, for whoever holds a recorded handoff).

### 8.6 Lighting Console — Partly built

- The Gaffer's task card for the current cause.
- "Lighting Ready" takes a reference photo of the lit set, then confirms ready. *Built.*
- "Need 5 Minutes" and "Equipment Issue" report back to the board. *Placeholders today.*
- An ETA track record: whether the department's last five stated ETAs held. That history is what earns the AD's trust, not the photo. *Shown today with fixed demo data.*
- The costume colors in frame for the scene — a narrow slice from the `scene_color_palette` view, with no other wardrobe detail. *Not built.*

### 8.7 Wardrobe & Talent — Partly built

Full depth for Wardrobe, following `docs/WARDROBE-SOP.md`:

- **Contact sheet** — *Built.* A photo log per character. Taking the photo and writing its note are one action. Front and Back are quick labels, and any other label can be typed. Each entry is timestamped. *Photos are lost on reload until storage is connected.*
- **Costume changes** — *Built, with demo data.* Character and actor, change number, story day, items with color and fabric, multiples and their current state, hazards, continuity notes, fitting status, and the story reason for the look.
- **Usage count** — *Built, calculated in the app.* "Used in N scenes across M episodes" for each change. Moves to the database view `costume_change_usage` when connected.
- **Actor reference photos** — *Not built.* The six portraits in `sample-data/headshots/` replace the initials circle. They are fictional placeholders; real continuity photos still come only from the camera on set.
- **Carry-over** — a change links to the earlier change whose damage it carries, and is prepped from that change's final-state photos. *In the data model only.*
- **Actor Ready** — sets Wardrobe's readiness. It never clears a hold. *Built.*
- **Fitting issues** — a change with an "issue" fitting reaches the 1st AD's board before its scene is scheduled. *Not built.*

### 8.8 Set & Props Continuity — Built

- Props and Art Department log continuity items: photo, name, note. Only the owning role can add items; everyone else with access views them.
- Props-only fields: food item, brand substitution note.
- Who can read continuity: the owning department, 1st AD, Director, and Script Supervisor. The Gaffer does not see continuity notes.

### 8.9 Take Intelligence — Built, with demo data

- Total takes, usable takes, average turnaround, time lost, time lost by cause, and a pattern table.
- Suggestions are framed as planning, never blame. Example: "Lighting caused delays in 3 of the last 5 setups — pre-light the next setup while talent resets."
- Minutes only.

### 8.10 Budget — Built, with demo data

- UPM and Producer only, enforced on screen and in the database. Anyone else is pointed to minutes on Take Intelligence.
- Estimated cost impact by department per setup, calculated from minutes lost. No line items, no payroll, no receipts.

### 8.11 The Record — Not built

- Its own screen: a time-ordered, read-only list of every recorded action, showing the time, person, role, what happened, what it authorized, and where it was routed.
- Corrections appear as new entries that point to the entry they correct. Redactions appear as entries too.
- It follows the same visibility rules as everything else. For example, the 1st AD never sees a dollar entry.
- It shows that the harness — not an agent — checked and routed each action.
- Backed by the `audit_log` table, which already exists in the database.

### 8.12 Onboarding — Partly built

- "Upload Call Sheet" and "Import Production Schedule" open a real file picker. "Start With a Template" loads the demo. *Built.*
- Reading the file's contents is out of scope this release, so the import is simulated. The Harbor Unit sample files are recognized by name so the demo matches what was uploaded. *Built.*
- When this becomes real, it's where the crew list (8.1) and each character's costume breakdown come from.

### 8.13 Find a Vendor — Not built

- Wardrobe first, then Art and Props. Preset category buttons (costume rental, fabric store, and so on) for vendors near the current shoot location.
- Results come from Google Places, a licensed listing service, not from scraping.
- Vendors the production uses are saved to the `vendors` table.

### 8.14 Sound — Not built

- The Sound Mixer's screen: sound reports and mic issues per take.
- Not live audio monitoring. Com-Tek already covers that.

### 8.15 Reset Demo — Built

- Restores the demo's starting HOLD state and clears changes made during a demo.

---

## 9. Routing

When a take stops, each cause sends tasks to the departments responsible and a short status to everyone else.

| Cause | Task goes to | Who else is told | Restricted |
|---|---|---|---|
| Actor reset | Talent Assistant, Wardrobe | 1st AD, Director, Camera | The Gaffer does not see continuity notes |
| Lighting adjustment | Gaffer | 1st AD, DP, Director, Camera | Wardrobe does not see equipment or power details |
| Sound | Sound Mixer | 1st AD, Director, Camera | Others see only that the setup is on hold |
| Continuity | Wardrobe, Script Supervisor | 1st AD, Director | The Producer sees only overall status |
| Camera / focus | Camera / DP | 1st AD, Director | Others see only that the setup is on hold |
| Props / set reset | Props (or Art Department) | 1st AD, Director | Others see only that the setup is on hold |
| Safety stop | The owning department | Everyone: the setup is on HOLD | — |

---

## 10. Data and privacy

- Who can see and change what is enforced in the database itself (Supabase row-level security), not only on screen.
- **Schema:**
  - `supabase/migrations/0001_initial_schema.sql` — applied to the live database: 13 tables and their access rules.
  - `supabase/migrations/0002_wardrobe_depth.sql` — written, not yet applied: story days, costume changes, the scenes each change appears in, actor names, the `costume_change_usage` view, and the `scene_color_palette` view.
  - `supabase/migrations/0003_lock_profile_roles.sql` — written, not yet applied: only the production office can assign a person's role; a person can change only their own display name.
- Every event stores the person and the role. Continuity photos store who captured them.
- Privacy redaction (governance Section 3) removes personal content from an event and records the removal. Retention rules are to be confirmed with an entertainment lawyer.
- The demo contains no real people or productions. The headshots are AI-generated portraits of fictional people, used only inside the app as placeholders.
- No wording in the app assigns blame.

---

## 11. Connection, sync, and offline

- **Backend:** Supabase — database, sign-in, real-time updates, and file storage. *The app is not connected yet; everything runs in local memory.*
- **Real-time:** a status change on one device shows on every other device within seconds. *Not built.*
- **Offline, Phase 1 (this release):** every action is saved on the device first and shown immediately. If the connection is down, actions wait in a queue and send on reconnect, and nothing is lost. Because events are never edited, there's nothing to merge, only entries to put in time order. *Not built.*
- **Offline, Phase 2 (later):** reading the full board offline for long stretches, reconciling several devices that were offline at once, and deciding what authority screens show when they can't confirm the latest state.
- If the network fails, the set runs on radios and paper. The critical path never ran through the app.

---

## 12. The agent harness

- This release uses fixed routing rules, not live AI model calls.
- The harness owns authorization, visibility, logging, routing, and state changes. For each event it: checks the event, confirms the person and role are allowed, routes it, creates tasks, recalculates the setup's status, writes it to the Record, and drafts role-specific messages.
- Agents (in later releases) can only summarize, classify, recommend, and draft inside those limits.

---

## 13. Design

- **"Night Call":** the landing page is the one dark, animated title card. Every working screen is light cool-gray paper (`#f3f4f5`) with navy text, gold for the primary action, and red for holds and blockers.
- A bottom tab bar, centered and reachable with a thumb. Designed for phones and tablets on set, and usable on desktop.
- Production vocabulary throughout — call, setup, slate, hold, wrap — never generic "task" or "project."
- Every color, with its hex number, is in `DESIGN.md`.

---

## 14. Success criteria

**For prototype validation:**

- A user finds their next action, location, and target time in under 10 seconds.
- A department lead reports Ready, Need Time, or Issue in two taps or fewer.
- The 1st AD identifies the department causing a hold in under 10 seconds.
- A director's "how many scenes is this costume in?" is answered on screen in under 10 seconds.
- A take reset creates only the right tasks and notifications.
- Every recorded action shows a named person and their role.
- The 1st AD never sees a dollar figure anywhere in the app.
- Users report getting less irrelevant information than a full call sheet gives them, and see the app as support, not monitoring or blame.

**What a pilot should measure** (hypotheses to test, not claims):

- Time between "cut" and the next roll.
- How many "why are we waiting?" radio calls happen.
- How often the AD finds the blocker without walking to the department.

---

## 15. Competitive context

Checked 2026-10-23.

- **Entertainment Partners (EP) bought SyncOnSet in January 2020** and sells it as one platform with Movie Magic Budgeting and Scheduling and its accounting tools. The wardrobe-continuity tool and the budgeting and scheduling standard belong to the same company.
- **Other production tools** include StudioBinder, Setkeeper, Yamdu, SetHero, and Studiovity. Crew and payroll tools include Wrapbook. Generic project tools (Asana, Monday, Notion) lack production vocabulary and live set state.
- **An earlier project check found no public APIs** for production software (SyncOnSet, Movie Magic, and others). On-Cue's data is entered natively or reached through real partnerships.
- **On-Cue's position:** the live decision layer and the record of authorization during the shoot day. It works alongside scheduling, budgeting, and payroll tools rather than replacing them.
- **The question investors will ask:** why won't EP connect its own products? This needs an answer before any pitch.

---

## 16. Future modules (not this release)

Drawn from the October 2026 workflow research. Each must follow the governance rules when it's built.

- **Look templates and a multi-season closet** — a master look reused across episodes with a scene modifier ("wet," "distressed") instead of a copy; costumes found by box and shelf seasons later.
- **Hair and makeup continuity** — the same contact-sheet pattern, plus product and allergen notes.
- **Camera and media-card log** — lens, stop, and card per take; a "card sealed" handoff to post-production.
- **Script revisions** — colored revision pages, and which departments a change affects.
- **Stunts and special effects** — safety sign-offs required before an effect can be armed. A person, never the app, triggers it.
- **Locations, base camp, transport, and picture cars** — status and continuity for vehicles and sites.
- **Vendor sourcing agent** — searches vendor sites that allow it and summarizes leads. A human buyer approves and buys, and the purchase is recorded as that person's action. No getting around website protections.
- **Theater mode** — Stage Manager instead of 1st AD, cues instead of takes, quick-change tracking. A different structure, not a relabel of the film version.

**Not ours to build:** payroll, union rule calculation, tax incentives, or customs paperwork as accounting. Partner with the companies that do this.

---

## 17. Open questions

- Which roles will actually use a dedicated screen during a live shoot? (Answer this by talking to working crew.)
- Which status words match what crews really say on set?
- How should On-Cue tell a creative retake from an operational reset?
- Who may enter or amend take outcomes in different kinds of productions?
- Can the Script Supervisor write or amend wardrobe continuity notes, or only read them?
- How long are continuity photos kept after wrap, and who may redact them? (Legal review.)
- How does authority work when a second unit shoots at the same time?

---

## 18. Changes from v0.2

- The demo production is now Harbor Unit "Undertow" (Episode 102, Day 6, Pier 14), replacing Episode 104 / Brooklyn Loft. The app's "DSI / Lone Wolf" demo is retired.
- Roles added: UPM and Sound Mixer, plus Art Department, Props, and Location as status-only departments.
- Moved into this release: sign-in from the crew list, real-time updates, offline Phase 1, and the Supabase backend.
- Events now record the person as well as the role. v0.2 recorded only the role.
- Added the governance principles (Section 3), including the 1st AD handoff, safety stop versus concern, privacy redaction, and "calculations are not decisions."
- Added wardrobe depth: story days, costume changes, colors, multiples, hazards, story reasons, usage count, carry-over, and actor names.
- Screens added: Set & Props Continuity, Budget, Onboarding, Find a Vendor, and Sound. Agent Activity is renamed **The Record** and stays its own screen.
- The non-goals now explicitly exclude accounting, payroll, autonomous purchasing, live voice, and getting around website protections.
- Closed: detail photo labels are open text, with Front and Back as quick picks.
- Added competitive context and future modules.

---

## Related documents

- `docs/GOVERNANCE-MODEL.md` — the rules. This PRD follows them.
- `docs/WARDROBE-SOP.md` — how the wardrobe department works and how On-Cue maps to it.
- `BUILD_SPEC.md` — build status and next steps.
- `DESIGN.md` — the Night Call design system, with every color's hex number.
- `supabase/migrations/` — the database schema.
- `sample-data/` — the demo call sheet, schedule, and headshots.
- `PRD.pdf` — PRD v0.2, kept as history.

## Sources

- [Entertainment Partners — EP acquires SyncOnSet Technologies](https://ep.com/news/entertainment-partners-acquires-synconset-technologies)
- [Motion Picture Association — Entertainment Partners profile](https://www.motionpictures.org/?p=81208)
- [LA Business Journal — Hollywood software firms merge](https://labusinessjournal.com/technology/hollywood-software-firms-merge/)
- [AlternativeTo — StudioBinder alternatives](https://alternativeto.net/software/studiobinder)
- [AlternativeTo — Yamdu alternatives](https://alternativeto.net/software/yamdu)
- [AlternativeTo — SetKeeper alternatives](https://alternativeto.net/software/setkeeper)
