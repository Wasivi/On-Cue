# On-Cue — Data Input & Entry Model

What each screen shows, where that data really comes from on a production, who enters it, and what's real today versus demo data. Requirements and build status for each screen: `docs/PRD.md` Section 8.

Updated 2026-10-23.

## Four kinds of data

1. **Imported** — loaded once from something the production already makes: the call sheet, crew list, schedule, or costume breakdown. Nobody retypes it on the day.
2. **Structured** — a person taps from a fixed set of choices (Ready / Need Time / Issue, cause chips). No typing.
3. **Written** — a person types a short note, always attached to something they're already doing (a photo, a take).
4. **Calculated** — the app works it out from the other three: minutes lost, usage counts, dollar estimates, readiness. Calculations update on their own; decisions never do.

The rule behind all four: **data entry has to be zero-effort, or it won't happen.** Day-of data piggybacks on what people are already doing. Reference data is entered once, by one person, during prep.

## What changed since the last version

Written input is now real in two places: Wardrobe's contact sheet, where each photo can carry a note typed in the same motion, and Set & Props Continuity, where each photo carries an item name and note. Photo labels are open text, with Front and Back as one-tap picks. The Live Take note is still missing.

## Screen by screen

### Sign-in — Imported (not built)
The crew list comes from the production office, off the call sheet. People pick their own name; nobody types a name. Adding a day player has to take under a minute, or people will share logins.

### Onboarding — Imported (simulated)
Upload Call Sheet and Import Production Schedule open a real file picker. Reading the file is out of scope this release; the two Harbor Unit sample files are recognized by name. When this becomes real, it's where the crew list, the scenes, and each character's costume breakdown come from.

### My Set — Structured + Calculated
The next-action card is calculated from the department's status elsewhere. The outcome buttons (Print, Go Again, Approve Escalation, Escalate) are one-tap recorded actions. *Today they don't record anything, and What Changed is fixed text.*

### AD Command — Calculated + Structured
Built entirely from the other departments' statuses, blocked departments first. Clear Hold is a one-tap action for the 1st AD only. *It doesn't write to the Record yet.* Minutes, never dollars.

### Live Take — Structured + Written
Scene, setup, take, outcome, and cause chips are taps. A short free-text note per take is written input: optional, unless the cause is Other. *The note field isn't built yet.*

### Lighting Console — Structured + Calculated
Lighting Ready takes a reference photo and then confirms, so the photo piggybacks on the action. Need 5 Minutes and Equipment Issue are taps (*placeholders today*). The ETA track record and pattern alert are calculated. The colors in frame (*not built*) are calculated from Wardrobe's costume plot: Lighting reads them and never enters them.

### Wardrobe & Talent — Imported + Written + Structured + Calculated
- **Costume plot** (characters, change numbers, story days, items with color and fabric, multiples, hazards, and the story reason for each look) — Imported. It's built during prep from the script breakdown and fittings, not typed on the shoot day. *Demo data today: Harbor Unit "Undertow."*
- **Continuity photos and notes** — Written, in the moment. The costumer photographs the actor and types a note in the same action. Front and Back are one-tap labels; anything else is typed. *Built; photos are lost on reload until storage is connected.*
- **Current multiple, actor ready, fitting issue** — Structured taps.
- **Usage count** ("used in N scenes across M episodes") — Calculated. *Built.*
- **Actor reference photos** — Imported once, during prep. *Six fictional placeholder portraits are in `sample-data/headshots/`, not yet shown in the app.*

### Set & Props Continuity — Written + Structured
Props and Art Department take a photo, name the item, and add a note in one action. Props also taps whether an item is food and adds a brand substitution note when one is needed. Only the owning role can add items. *Built.*

### Take Intelligence — Calculated
Nothing is entered here. Everything is calculated from Live Take records: takes, usable takes, turnaround, time lost by cause, and patterns.

### Budget — Calculated
Nothing is entered here either. Dollar estimates are calculated from minutes lost and the production's budget figures (*demo data today*). UPM and Producer only.

### The Record — Calculated (not built)
Nothing is entered here. It lists every recorded action from every other screen, with the person and the role. Corrections and redactions appear as new entries.

### Find a Vendor — Structured + Imported (not built)
Preset category buttons, with results from Google Places. Vendors the production uses are saved once to the vendors list.

### Sound — Structured + Written (not built)
Sound reports and mic issues per take.

## Decided since the last version

- **Who writes a wardrobe continuity note:** Wardrobe, at the moment of capture. Whether the Script Supervisor may also write one is still open (`docs/PRD.md` Section 17).
- **Live Take note:** optional, and required when the cause is Other.
- **Editing:** notes are never edited or deleted after submission; corrections are new entries. The one exception is privacy redaction (`docs/GOVERNANCE-MODEL.md` Section 3).
- **Photo labels:** open text, with Front and Back as quick picks.
