# CLAUDE.md — On-Cue

On-Cue is a TV/film shoot-day coordination app. React + TypeScript + Vite front-end prototype. Repo: https://github.com/Wasivi/On-Cue (current work is on `main`).

## Read these docs first

- `docs/GOVERNANCE-MODEL.md` — the rules. Who can decide what, who sees what, how events are recorded, the identity model, and the walkie/offline boundary. Consult before changing any state, role, or visibility behavior.
- `docs/PRODUCTION-WORKFLOW.md` — the real-world film production pipeline (scouting → permits → block/light/rehearse/shoot → roll call) and the role/screen mapping. Consult before adding or changing screens.

## Non-negotiable rules

1. **Agents recommend, summarize, classify, and draft. Humans decide, approve, and act.** No agent may execute a state change.
2. **Only the 1st AD can move a setup to READY / approve camera roll.** Any UI that clears a hold must be gated to the 1st AD role. (There is a known priority-1 defect: the "Clear Hold" button on AD Command is not yet gated.)
3. **Every consequential action writes an append-only, timestamped event** storing both the `role` (authority) and the `person` (named individual). No edits, no deletes.
4. **Events are append-only.** Corrections are new events that reference the one they correct.

## Identity model (provisioned crew list)

- No self-serve signup. The production office imports the crew list (from the call sheet); people sign in as themselves by picking their name from that list.
- Each account carries one or more roles; a person can switch roles during the day. Every action records the role it was performed under.
- **Authority lives at the role level; accountability lives at the person level.** Roles are not unique (two wardrobe people, 2nd AD and 2nd 2nd AD) — an event that only names the role is useless for accountability.
- Social login (Google/Apple) may authenticate provisioned accounts only — it must never create accounts.
- Prototype v1: sign-in can be name-picking from the seed crew list, no passwords.

## Visibility constraints

- Budget **dollars**: UPM and Producer only. The 1st AD sees **minutes lost**, never dollars.
- Art Department and Location are status-only departments (feed AD Command and `continuity_items`); Sound Mixer is a full role.
- Every department status change must surface on every role's screen within seconds (live "What Changed" feed).

## Hard constraints

- **Walkie boundary (hard constraint):** radios remain the live channel and the connectivity-failure fallback. On-Cue is the record of state and authorization, not the live voice channel. It never competes with walkies for live talk.
- **Offline tolerance is necessary and phased.** Phase 1 (current release): every action writes to local storage first, then syncs in the background; if offline, actions queue on-device and send on reconnect — no event is ever discarded, and the UI updates immediately (optimistic). This is a write-through queue in front of realtime sync, not a rearchitecture. Phase 2 (v2, out of scope now): full offline mode — offline board reads, multi-device reconciliation while disconnected. The append-only event rule is what makes Phase 1 cheap: no edit conflicts, only timestamped entries to order.

## Project conventions

- **Fictional data only** in all demo content — never use real names, productions, or call sheets.
- Cast/crew-facing documents use plain, non-technical language.
- Repo stays private in general use; **License: None** (no MIT); do not initialize with README/.gitignore/license when creating new repos.
- Product name is **On-Cue** (repo and code may still say "On Cue" internally — cosmetic cleanup only, low priority).
