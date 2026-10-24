# On-Cue

## Product Identity

**Name:** On-Cue
**Tagline:** Your next action on set.
**Category:** Shoot-day coordination, and the record of decisions on set
**Platform:** Web app for phones and tablets on set; works on desktop
**Audience:** Crews on episodic television sets — 1st ADs, Directors, DPs, Gaffers, Script Supervisors, Sound Mixers, Wardrobe, Talent Assistants, Producers, and UPMs.

This is the short version. The full requirements are in `docs/PRD.md`; the rules are in `docs/GOVERNANCE-MODEL.md`.

---

## Problem

A shoot day runs on call sheets, schedules, radios, texts, and verbal check-ins, and every department keeps its own tools. When a take stops or a setup slips:

- **Nobody clearly owns the next step**, so the 1st AD walks the set asking who's ready.
- **Everyone hears everything on the radio, and nothing is recorded** — not why the take failed, not who cleared what.
- **Each department's information is stuck in its own system.** The commercial tools don't share data with each other.
- **People protect themselves with witnesses**, making sure everyone heard them say it, because there's no record to point to.
- **Delay costs show up after the money is spent.**

Wardrobe shows it clearly. A look repeats by story day, not by scene, so "how many scenes is this costume in?" means recounting the whole costume plot by hand.

---

## Solution

On-Cue answers one question for every person on set:

> *"What do I need to do right now so we can roll camera again?"*

And it keeps the record of who decided what, so nobody needs witnesses.

### Core principles

1. **Deep at home, narrow abroad.** Each department sees its own work in full, and other departments' work only as narrow slices. The Gaffer sees the costume colors in frame, not the costume plot.
2. **Live state, not static documents.** A stopped take is tagged in seconds, the right departments get a task card, and the 1st AD's board updates.
3. **Humans decide.** Agents recommend, summarize, classify, and draft. Only the 1st AD clears a hold and approves roll. Nothing rolls automatically.
4. **The record protects people.** Every action is logged with the person and the role, and never edited. It answers what happened, not whose fault it was.
5. **Planning intelligence, not surveillance.** Patterns like "lighting caused delays in 3 of the last 5 setups" are framed as planning, never blame.
6. **One main page per person.** Land on My Set: your setup, your task, your target time, what changed.

---

## Differentiation

| Product | What it does | Why it isn't enough |
|---|---|---|
| Movie Magic Budgeting and Scheduling (Entertainment Partners) | Budgets, stripboards, schedules | Plans the shoot; doesn't know what happened ten minutes ago on set |
| SyncOnSet (Entertainment Partners since 2020) | Continuity and inventory for wardrobe, props, and set dressing | A continuity tool, not a live readiness and decision layer for the whole set. The same company owns Movie Magic |
| StudioBinder, Setkeeper, Yamdu | Pre-production planning, call sheets, document sharing | Built around documents and prep, not live decisions during a take |
| SetHero, Wrapbook | Crew lists, timecards, payroll | HR and accounting, not operational during a take |
| Asana, Monday, Notion | General task boards | No production vocabulary, no live set state |
| Walkies and group chat | Instant voice and text | Everyone hears everything; no structured handoff; no record |
| **On-Cue** | **Role-aware next-take coordination, plus the record of decisions** | **The right person sees the right action at the right moment, and every decision is logged with who made it** |

---

## User roles and what they see

| Role | First screen | What they update |
|---|---|---|
| 1st AD | AD Command: readiness, blockers, minutes lost | Clear the hold and approve roll; hand off roll authority |
| Director | My Set: setup, takes, creative and wardrobe status | Print, go again, move on; creative notes |
| DP | Lighting Console: camera and lighting readiness, colors in frame | Camera ready, visual issue |
| Gaffer | Lighting Console: lighting task, power, ETA record | Lighting ready (with a photo), need time, equipment issue |
| Script Supervisor | Live Take: slate, takes, continuity | Outcome, cause chips, take note |
| Sound Mixer | Sound (not built): reports, mic issues | Sound reports, mic issues |
| Wardrobe | Wardrobe & Talent: costume plot, contact sheet, usage | Continuity photos and notes, actor ready, fitting issues |
| Talent Assistant | Wardrobe & Talent: who's needed next, readiness | Arrived, ready, need support |
| Producer | Budget and Take Intelligence: schedule risk, cost impact | Approve escalations |
| UPM | Budget: dollars by department | Read-only budget view |

Art Department, Props, and Location are status-only this release: they log continuity items or a status line, without a screen of their own.

Anyone can call a safety stop; only the 1st AD clears it.

---

## Key workflows

### 1. From "Cut" to "Action"
- A take stops. The Script Supervisor taps the outcome and the cause chips, and can add a short note.
- On-Cue sends a task card to each responsible department. Everyone else sees only that the setup is on hold, and why, in a sentence.
- Departments mark Ready, Need Time, or Report Issue, and AD Command updates.
- When every required department is ready, the setup reads **Ready for AD Approval**, and the 1st AD clears the hold. Nothing clears or rolls on its own.
- Every step is written to the Record.

### 2. The costume plot, live
- Wardrobe's costume plot is organized by character, change number, and story day — not by scene.
- Each change carries its items (with color and fabric), multiples, hazards, story reason, and continuity photos.
- "How many scenes is this costume in?" is a lookup: used in N scenes across M episodes.
- Lighting and Camera see only the colors in frame.

### 3. Take Intelligence
- Takes, usable takes, turnaround, time lost by cause, and repeated patterns, all in minutes.
- Suggestions are framed as planning, never blame.

### 4. Call sheet import
- Upload a call sheet or schedule. This release simulates the reading. In the real product, it's where the crew list and the costume breakdown come from.

### 5. The Record
- A read-only history of every action: the time, the person, the role, and what it authorized. Corrections are new entries.

---

## Data model (simplified)

```
Production
  → Story Day
  → Shoot Day
    → Scene
      → Setup
        → Take
        → Department Status
  → Costume Change (appears in many scenes)
      → Items (color, fabric)
      → Continuity photos and notes
  → Continuity Items (Art, Props)
  → Events — the Record (person + role + what it authorized)
  → Budget Snapshots (UPM and Producer only)
```

Visibility, briefly:
- **Gaffer:** lighting tasks, power, blockers, colors in frame. Not continuity notes, cast details, or dollars.
- **Wardrobe:** full wardrobe depth and the actors needed next. Not lighting equipment, dollars, or the full shooting schedule.
- **1st AD:** every department's status and the minutes lost. Never dollars.

---

## What we are not building

- Scheduling or budgeting software
- Payroll, timecards, union rule calculation, receipts, tax incentives, or accounting
- Autonomous decisions of any kind, including purchasing
- Live voice or calling — radios own live talk
- Data collection that gets around website protections
- Permit submission, real-time GPS, or live maps
- AI video analysis of takes
- Chat or social features

The focus is the **decision layer** — what's needed, who owns it, what's approved, and what might stop the shoot — and the record of it.

---

## Visual direction

**"Night Call."** The landing page is the one dark, animated title card: a navy and gold 3D constellation. Every working screen is the other reading of that palette:

- **Light cool-gray paper** (`#f3f4f5`) — near-white with a gray tint. Not warm ivory, and never a dark page.
- **Navy ink** for text, **gold** for the one primary or active element, **red** for holds and blockers, teal and slate for secondary status.
- **A bottom tab bar** of book-style tabs, centered and reachable with a thumb. It hides after a few seconds and comes back on touch.
- **The landing animation lives on** in the header strip of every page.
- **Readable at a glance** under sun glare or stage light: clear timestamps, status dots, and every state scannable in about two seconds.
- **Production vocabulary:** call sheet, setup, slate, hold, wrap, basecamp, honeywagon, continuity, camera roll. Never generic "task" or "project."

Every color, with its hex number, is in `DESIGN.md`.

---

## Success metrics

**For the prototype:** the next action found in under 10 seconds; readiness reported in two taps; the 1st AD finds the cause of a hold in under 10 seconds; "how many scenes is this costume in?" answered in under 10 seconds; every action shows a person and a role; the 1st AD never sees a dollar.

**For a pilot** (hypotheses to test, not claims): time from "cut" to the next roll; how many "why are we waiting?" radio calls happen; how often the AD finds the blocker without walking over.

---

## Current status

Front-end prototype (React + TypeScript + Vite). Demo production: Harbor Unit "Undertow" (Episode 102, Shoot Day 6, Pier 14), fictional. Ten screens. The Supabase database is set up with its access rules; the app isn't connected to it yet, so data stays in local memory. Build status and next steps: `BUILD_SPEC.md`.
