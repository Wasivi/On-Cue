# On Cue

## Product Identity

**Name:** On Cue  
**Tagline:** Your next action on set.  
**Category:** Live production coordination / next-take operating system  
**Platform:** Web app (desktop-first, tablet-ready)  
**Audience:** Location Managers, 1st ADs, DPs, Gaffers, Wardrobe, Script Supervisors, Talent teams, Producers on episodic television and feature film sets.

---

## Problem

Television crews lose 15–40 minutes per hour to friction between takes. The causes are predictable — lighting adjustments, actor resets, continuity issues, sound problems — but the recovery is chaotic. Everyone hears everything on walkie-talkies. Department heads waste mental bandwidth on information that does not concern them. The 1st AD has no real-time visibility into who is actually ready. Retakes pile up without anyone tracking *why*, so the same problems repeat across setups.

Current tools are either:
- **Call sheets and PDFs** — static, outdated the moment something changes.
- **Generic project management** — Asana, Monday, Notion — built for office workers, not for people standing in the rain at 5:30 AM holding a light meter.
- **Giant shared dashboards** — everyone sees everything, which means no one sees what matters to them right now.

---

## Solution

On Cue is a **role-aware, next-take coordination system**. It does not replace the call sheet or the shooting schedule. It sits on top of them and answers one question for every person on set:

> *"What do I need to do right now so we can roll camera again?"*

### Core principles

1. **Progressive disclosure.** The Gaffer sees lighting tasks, power status, and target-ready times. They do not see the actor's pickup schedule, producer budget, or parking map unless it directly blocks their next action.
2. **Live state, not static documents.** When a take fails, the Script Supervisor or AD tags the cause in 3 seconds. On Cue instantly creates private action cards for the responsible departments and updates the AD's readiness board.
3. **Recovery intelligence, not surveillance.** Track take patterns, time loss by cause, and setup-to-setup performance. Frame it as planning data — "Lighting caused delays in 3 of the last 5 setups, pre-light Scene 43 now" — never as blame.
4. **One main page per person.** No navigation maze. Land on "My Set" and see your current scene, your task, your target time, and what changed since the last take.

---

## Differentiation

| Product | What it does | Why it is not enough |
|--------|--------------|----------------------|
| Movie Magic Scheduling / StudioBinder | Schedule, stripboard, call sheets | Static. Does not know what happened 10 minutes ago. |
| SetHero / Wrapbook | Crew lists, timecards, payroll | HR and accounting. Not operational during a take. |
| Generic PM (Asana, Monday) | Tasks, boards, timelines | Built for software teams. No production vocabulary. No live state. |
| Walkie-talkies + group chat | Real-time voice and text | Everyone hears everything. No structured handoff. No record of why takes failed. |
| **On Cue** | **Role-aware next-take recovery** | **Only the right person sees the right action at the right moment. Structured take logging turns failure into coordinated recovery.** |

---

## User roles and what they see

| Role | First screen | What they update |
|------|-------------|------------------|
| 1st AD | Full readiness board, timing, blockers, next setup | Hold/clear, re-prioritize, escalate |
| Director | Current setup, take count, creative/actor status | "Go again," "Move on," direction notes |
| DP | Shot/setup, camera readiness, lighting state | Camera ready, visual issue flag |
| Gaffer | Lighting tasks, power alerts, equipment needs | Lighting ready, time request, equipment issue |
| Script Supervisor | Slate, take number, continuity, take quality | Print / hold / no good, cause chips, notes |
| Wardrobe | Actors needed next, look, continuity, reset notes | Actor ready, continuity risk, change required |
| Talent Assistant | Call, scene, hair/makeup/wardrobe readiness | Arrived, ready, need support |
| Producer | Schedule risk, delay cause, cost/time impact | Read-only by default; approve escalation |

---

## Key workflows

### 1. From "Cut" to "Action"
- Take ends. Script Supervisor taps the outcome (print / hold / no good) and picks cause chips (actor reset, lighting, sound, etc.).
- On Cue creates private action cards for affected departments.
- Each department lead sees only their card on "My Set."
- As departments mark ready, the AD Command board updates in real time.
- When all departments are ready, the hold clears and the AD sees "Ready to Roll."

### 2. Take Intelligence
- Automatically track: takes per setup, usable takes, average turnaround, time lost by cause, repeated patterns.
- Surface recovery suggestions: "Lighting caused delays in 3 of the past 5 setups. Pre-light Scene 43 while talent resets."
- Positioned as planning intelligence, never employee surveillance.

### 3. Call sheet import
- Upload PDF, Excel, or CSV call sheet.
- AI extraction recognizes crew, cast, locations, scenes, parking, contacts.
- Each user lands on "My Set" with their role-specific view already populated.

---

## Data model (simplified)

```
Production
  → Shoot Day
    → Location
    → Scene
      → Setup
        → Take
        → Department Task
        → Person Assignment
        → Live Status Update
```

Visibility rules:
- If user.role = "Gaffer" → show lighting tasks, power status, current setup, lighting blockers, required contacts. Hide cast compensation, producer budget, wardrobe details, other department task lists.
- If user.role = "Wardrobe" → show actor needed next, look continuity, reset notes. Hide lighting diagrams, truck parking, full shooting schedule.

---

## What we are NOT building (yet)

- Permit submission or government integrations
- Real-time GPS or live street maps
- Full budgeting or accounting
- Payroll or timecards
- AI video analysis of takes
- Chat or social features

The prototype focuses on: **decision layer** — what is needed, who owns it, what is approved, and what might stop the shoot.

---

## Visual direction

**Not generic SaaS.** Not another white-background task manager with purple buttons.

This is an **on-set command console**. It should feel like the tools that already exist in production: dense, legible under fluorescent lights or sun glare, color-coded by status, respectful of the user's time and attention.

- **Dark charcoal navigation** — reduces eye strain during 14-hour days, matches existing production monitors and switchers.
- **Warm off-white workspace** — paper-like, not sterile gray. Feels like a call sheet, not a spreadsheet.
- **Teal = ready / go.** Amber = waiting / at risk. Red = blocker / hold. Muted violet = secondary emphasis.
- **High information density** — production people are used to dense call sheets and stripboards. Do not waste space.
- **Clear timestamps, status pills, progress rings** — every state change must be scannable in under 2 seconds.
- **Production vocabulary** — call sheet, basecamp, load-in, hold, wrap, picture vehicle, G&E, COI, scout, lockup, honeywagon, continuity, slate, camera roll. No generic "task" or "project."

---

## Success metrics (future)

- Time between takes reduced by 20%+
- Number of "why are we waiting?" radio calls reduced
- AD can identify blockers before walking to the department
- Script Supervisor's take notes feed directly into editorial dailies
- Producers can see delay causes and schedule risk without interrupting set

---

## Current status

Frontend prototype built in React + TypeScript + Vite.  
Seeded fictional data: Harbor Unit, Episode 104, Shoot Day 12, Brooklyn Loft.  
Six views: My Set, AD Command, Live Take, Lighting Console, Wardrobe & Talent, Take Intelligence.  
Local state only — no backend, auth, or integrations yet.
