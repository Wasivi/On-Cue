# On-Cue Governance Model

This document defines the rules On-Cue must follow: who can decide what, who sees what, how actions are recorded and attributed, and how the app relates to the tools film crews already trust. It is written for Claude Code and VS Code as the source of truth for implementation decisions. The companion document, `docs/PRODUCTION-WORKFLOW.md`, explains the real-world film production pipeline that these rules support.

---

## 1. The Core Rule: Agents Recommend, Humans Decide

On-Cue is a controlled agent harness. Its agents (role assistants) may:

- **Recommend** — suggest a next action to a specific role
- **Summarize** — condense status across departments
- **Classify** — tag a retake cause, sort a blocker by urgency
- **Draft** — write a note, a status line, a report entry

Agents may never:

- Approve or execute a state change on behalf of a human
- Move a setup to READY, clear a hold, or roll camera
- Edit or delete a recorded event
- Act as an identity — every recorded action must belong to a signed-in person

The production's authorized humans decide, approve, and act. Every consequential state change in the app requires an explicit action by a signed-in person acting under their role.

**Calculations are not decisions.** Derived numbers may update on their own — minutes lost, budget snapshots, a setup's computed readiness. Decisions never do: approving, clearing, rolling, buying, scheduling, moving or locking money, signing off. If an automatic step would commit the production to something, it is a decision, and a signed-in person must take it.

**The READY gate (non-negotiable):** only a signed-in person whose role is 1st AD can move a setup from HOLD to READY and approve camera roll. No other role, and no agent, may perform this action. This mirrors real set practice — only the 1st AD calls "Picture's up" — which exists precisely to prevent chaos and wasted takes. It is enforced twice: AD Command's "Clear Hold — Roll When Ready" button only appears for the 1st AD role, and the database itself refuses a READY change from any other role.

**Covering for the 1st AD.** The 1st AD can't be on the floor every minute, and a second unit has its own 1st AD. Only the 1st AD can hand off roll authority, only to a named person, and only for a stated window: "1st AD [name] hands roll authority to [name] until [time]." The handoff is itself a recorded event. It ends at the stated time or when the 1st AD takes it back, whichever comes first, and every action taken under it records both the covering person and the handoff it relied on. A unit's 1st AD holds authority only for that unit.

## 2. Authority Stays Scoped. Awareness Does Not.

This is the Crew Resource Management (CRM) principle, adapted from aviation ([Wikipedia — Crew Resource Management](https://en.wikipedia.org/wiki/Crew_resource_management); [SKYbrary — CRM](https://skybrary.aero/articles/crew-resource-management-crm)):

- **Decisions stay scoped.** Each state change belongs to the role that owns it. The gaffer owns the lighting fix; the script supervisor owns the take log; the 1st AD owns the roll call. No role can perform another role's action.
- **Awareness does not stay scoped.** Every status change from any department must surface on every role's own screen within seconds — a live "What Changed" feed, not a page someone has to remember to open. A junior crew member flagging a problem must be heard the same way a CRM-trained first officer's input is heard.
- **Anyone can raise a flag, and there are two kinds.** This is deliberate: it is how real high-reliability teams avoid the silo failures (one department not knowing what another is doing) that plague organizations where information stays trapped in one person's head.
  - **Safety stop.** Any signed-in person, at any level, can call one. It puts the setup straight back on HOLD with no approval needed. Only the 1st AD can clear it, after the owning department confirms the problem is resolved. Easy to stop, deliberate to restart — the factory-line rule where any worker can stop the line. A safety stop is still called out loud on the radio first (Section 6); the app records it.
  - **Concern.** Any signed-in person can flag "this doesn't look right" on any department. It goes to the owning role and appears in the What Changed feed, but it does not stop the set. Only the owning role can resolve it.
- **Broadcast status, scope detail.** Awareness means *status* — what changed, what's blocked, who's waiting — and that reaches everyone. Detail does not: each department sees its own records in full depth and other departments' records only as narrow, purpose-built slices ("deep at home, narrow abroad" — see `docs/WARDROBE-SOP.md` §7). Everything shows in the feed; only changes that affect a person's own role interrupt them with an alert.

## 3. The State Machine Is the Accountability System

Every consequential action writes one immutable, timestamped event that records **three things: who did it (the person), under what authority (the role), and what it authorized** (the existing `AgentEvent` model — kind: ready / hold / roll / take / info — surfaced on the Agent Activity page).

- **Append-only.** No edits, no deletes. Corrections are new events that reference the event they correct.
- **Privacy redaction is the one exception.** Continuity photos are pictures of real performers, and contracts or privacy law can require removing them, or other personal details, after a show wraps. An authorized person (the production office, or whoever it designates) may remove the personal content inside an event — the photo, a name in a note. The event itself stays, still showing what happened, when, and under whose authority, and a new redaction event records who removed what and why. Redaction never changes what was decided or by whom. Confirm the exact retention and removal rules with an entertainment lawyer before a real production uses On-Cue.
- **Person-level attribution is mandatory.** Roles are not unique on a set — two people can be wardrobe, a 2nd AD and 2nd 2nd AD both exist, a PA fills in for anyone. An event that only says "Wardrobe marked this ready" has lost the one thing a state machine exists for: who specifically did it. Every event stores both `role` (the authority) and `person` (the individual). Authority lives at the role level; accountability lives at the person level.
- **The record replaces blame-broadcast.** On a set with no system of record, people protect themselves by making sure everyone heard them say it out loud — looping in the whole production for every decision. That is expensive and dysfunctional. On-Cue's answer is not "tell everyone everything"; it is "the record itself is the protection." Nobody needs witnesses if the state machine logged the action with their name on it.
- **Time lost, not fault.** Events record causes and minutes, not blame. The system's job is to answer "what happened, who did it, and what it authorized," never "whose fault is it."

## 4. Identity and Sign-In: Provisioned Crew List, Not Self-Serve Accounts

On-Cue does not have open registration, and it does not build a full user-account system with self-serve profiles. It uses the model the landing page already describes: **"No account? Ask your production office to add you."** This mirrors how sets actually work — the production office keeps the crew list, and access is provisioned, not self-served.

The identity model:

1. **The production office imports the crew list** (it is already on the call sheet — the Onboarding screen is designed to ingest this).
2. **Each person signs in as themselves** — a name picked from the provisioned crew list, never a free-text field.
3. **Each account carries one or more roles.** One person can be wardrobe *and* standing in as a PA; the role is chosen at sign-in or switched during the day, and every action records the role it was performed under.
4. **Authority lives at the role level** — only an account whose active role is 1st AD can clear a hold. **Accountability lives at the person level** — every event and every continuity item records who did it.
5. **No self-serve signup, and no social login as identity.** Google/Apple sign-in buttons, if kept, authenticate against provisioned accounts only — they never create new ones. Otherwise anyone with an email address could join a private set's record system.
6. **Prototype scope:** sign-in can be as simple as picking your name from the crew list in the seed data — no passwords for v1, since it is a demo. The real product adds production-office provisioning (invite, role assignment, deactivation when someone wraps) on top of this same structure.
7. **Adding a person must take under a minute.** Crews change daily — day players, a PA covering, a last-minute replacement. If adding someone is slow, people share logins, and person-level accountability (Section 3) quietly stops working. The production office must be able to add a day player from the call sheet, give them a role, and set an end date in under a minute; their access ends on that date or when they wrap.

## 5. Visibility Rules: Who Sees What

### Interactive roles (full screens)

| Role | Owns decisions on | Sees |
|---|---|---|
| 1st AD | Clearing holds, READY approval, roll call | All department statuses, blockers, minutes lost (never dollars) |
| Director | Print/retake calls, creative approvals | Current take results, performance notes, department status |
| DP | Camera and visual plan | Camera/lighting readiness, visual issues |
| Gaffer | Lighting fixes and readiness | Lighting tasks, power status, blockers |
| Script Supervisor | Take log and continuity notes | All takes, continuity flags from wardrobe/art/props |
| Sound Mixer | Sound reports and mic issues | Take log, own reports, blockers |
| Wardrobe Supervisor | Costume continuity | Continuity items (department = wardrobe), actor readiness |
| Talent Assistant | Actor holding and readiness | Call times, actor status, private notes |
| Producer | Schedule risk decisions | Department status, minutes lost, cost impact |
| UPM | Budget view | Cost impact rollups (dollars), minutes lost |

Multiple people may hold the same role; each still signs in as themselves and is recorded individually (Section 4).

### Status-only departments (no interactive screen — feed data into AD Command and continuity_items)

- **Art Department** — v1 decision: status-only. Items flow into `continuity_items` with `department = 'art'`. Upgrade to a full role only if real art-department users ask for one. The schema already supports it, so this is reversible.
- **Location** — one-line status ("permit active, location locked"), like the existing seed data.
- **Set/Props** — data lives in `continuity_items` / prop fields; day-of props work is routine execution, not a go/no-go loop.

### Budget visibility (decided)

- **Dollars: UPM and Producer only.** The 1st AD must never see estimated cost impact. Dollars in front of the 1st AD turn every hold into a money argument and rebuild the blame-everyone dynamic this app exists to remove. It also mirrors real sets: the AD tracks schedule, the UPM tracks money.
- **Minutes: everyone who runs the day** — the 1st AD especially. Time lost is the 1st AD's native language and is already in Take Intelligence.

## 6. The Walkie Boundary: On-Cue Complements, Never Replaces

On-set live communication is two-channel simplex radio (commonly Motorola CP200-class handsets), which works with no internet, no cell service, and no app server ([FilmLocal — On-Set Communication Systems](https://filmlocal.com/filmmaking/on-set-communication-systems-for-film/); [Reddit — How do you communicate on set](https://www.reddit.com/r/FilmIndustryLA/comments/os3x9q/how_do_you_communicate_on_set/)). Crew trust it because it cannot go down with the wifi. On-Cue must not compete with it.

**What On-Cue is for:** the durable, structured record of state and authorization — the thing walkies are bad at, currently reconstructed from memory.

**Hard constraint — the walkie boundary:** radios remain the live communication channel and the fallback when connectivity fails. On-Cue never competes with them for live talk. If wifi drops, the set falls back to radios and paper — the day does not stop, because the critical path (voice) never ran through the app.

**Necessary — offline tolerance, phased (Phase 1 in the current release):** On-Cue's record must not develop holes during connectivity loss, because outages correlate with exactly the chaotic moments the record exists for. The append-only event rule (Section 3) is what makes this tractable: there are no edit conflicts to merge, only dated entries to order.

- **Phase 1 (current release):** every action is written to local storage first, then synced in the background. If the connection is down, actions queue on the device and send on reconnect — nothing is discarded. The UI updates immediately from the local write (optimistic UI), so nobody waits on the network to keep working. This is a write-through queue in front of the realtime sync, not a rearchitecture.
- **Phase 2 (v2):** full offline mode — reading the whole board while disconnected for extended periods, reconciling multiple devices that were offline simultaneously, and deciding what authority screens show when they cannot verify state. Out of scope for the current release.

## 7. Data Governance Rules

### Identity and events

- People come from the provisioned crew list (Section 4). No self-serve account creation. No free-text names.
- **events (AgentEvent)** — append-only, immutable (the only exception is privacy redaction, Section 3). Kind enum: `ready | hold | roll | take | info`; handoffs, safety stops, and redactions (Sections 1–3) add kinds when they're built. Every event stores both `role` (authority) and `person` (the named individual from the crew list).
- **continuity_items.captured_by** — the signed-in person, with the role they were acting under at capture time.

### continuity_items (shared table: wardrobe / art / props)

- Single table, not three. `department` is an enum: `wardrobe | art | props`. No free text.
- `character_name` is nullable — only wardrobe populates it.
- `setup_id` (nullable FK) links an item to the setup it was captured during. This is a real column, not a note — "what continuity photos exist for Scene 23B?" must be answerable.
- **Prop-specific fields** (`is_food`, `brand_substitution_note` — e.g., "used a fake Coke label for clearance") live as nullable columns on `continuity_items`, populated only when `department = 'props'`. Do not create a separate `prop_items` table.
- **Append-only.** Corrections are new entries.

### vendors

- Append-only reference data: name, category (costume rental / fabric store / prop house / furniture rental / etc.), city, contact info, source.
- `source` is an enum: `MANUAL | GOOGLE_PLACES | OUTREACH | INHERITED`. No free text.

### budget_snapshots

- Aggregate only: setup_id, department, time_lost_minutes, estimated_cost_impact, computed_at. **No line items, no payroll, no receipts.** On-Cue is not an accounting system and must not pretend to be one.
- One snapshot per setup per department. Recomputed automatically whenever Take Intelligence's time-lost data changes. The UPM sees the current snapshot per setup, not history.
- Visibility enforced at the view layer per Section 5.

## 8. Decision Log

| Decision | Status |
|---|---|
| Product name is **On-Cue** | Decided |
| Only 1st AD approves READY / camera roll | Decided — enforced in AD Command and in the database |
| Identity: provisioned crew-list sign-in, person-level attribution on every event | Decided |
| No self-serve signup; social login never creates accounts | Decided |
| Budget dollars: UPM + Producer only; 1st AD sees minutes | Decided |
| Art Department: status-only in v1 | Decided — reversible |
| Sound Mixer: full interactive role (sound reports, not live monitoring — Com-Tek already covers live) | Decided — user delegated to recommendation |
| Walkie boundary: radios stay the live channel; On-Cue is the record | Decided — hard constraint |
| Offline tolerance: necessary, phased — Phase 1 (local-first event queue, no lost events) in current release; Phase 2 (full offline mode) in v2 | Decided |
| Prop fields on continuity_items, no separate prop_items table | Decided |
| Calculations update on their own; decisions never do | Decided 2026-10-23 |
| 1st AD can hand off roll authority — named person, stated window, recorded | Decided 2026-10-23 — not built yet |
| Two kinds of flag: safety stop (anyone, immediate HOLD, only 1st AD clears) and concern (anyone, no stop) | Decided 2026-10-23 — not built yet |
| Broadcast status, scope detail; only role-relevant changes interrupt | Decided 2026-10-23 |
| Privacy redaction is the one exception to append-only | Decided 2026-10-23 — confirm with entertainment counsel; not built yet |
| Adding a day player takes under a minute | Decided 2026-10-23 — applies when real provisioning is built |
| Vendor photos/logos needed? | Open — default: not in v1 |
| Internal code/branch names follow "On Cue" (repo: On-Cue) — cosmetic cleanup only | Open — low priority |

## Sources

- [Wikipedia — Crew Resource Management](https://en.wikipedia.org/wiki/Crew_resource_management)
- [SKYbrary — Crew Resource Management (CRM)](https://skybrary.aero/articles/crew-resource-management-crm)
- [FilmLocal — Best On-Set Communication Systems for Film](https://filmlocal.com/filmmaking/on-set-communication-systems-for-film/)
- [Reddit r/FilmIndustryLA — How do you communicate on set?](https://www.reddit.com/r/FilmIndustryLA/comments/os3x9q/how_do_you_communicate_on_set/)
- [HowToFilmSchool — Com-Tek](https://howtofilmschool.com/dictionary/com-tek-film/)
- [GVM — DMX Lighting Control for Video Production](https://gvmled.com/dmx-lighting-control-for-video-production-guide/)
- [SetHero — "Picture's Up" film set terminology](https://sethero.com/blog/article/pictures-up-film-set-terminology/)
