# On Cue — Data Input & Entry Model

What's shown on each screen, where it actually comes from in a real production, and what's currently fictional vs. a real gap to design.

Three kinds of data move through this app:

1. **Imported** — loaded once per shoot day from an external source (call sheet, schedule), not typed by anyone in the app.
2. **Structured** — a person picks from a fixed set of buttons/categories. No free text. Already how most of this prototype works.
3. **Written** — a person types a sentence. Right now this exists **nowhere** in the app (see README check below) except as hardcoded fictional text.

## The headline finding

There is currently **zero real text-input anywhere in the app.** Every "note" you read (continuity notes, take notes, the activity feed) is hardcoded fictional copy in `src/data/seed.ts`, not something any role can actually type. The only `<input>` elements that exist are the landing page's fake sign-in form, a lighting checklist checkbox, and the hidden camera file-picker on Wardrobe & Talent.

## Screen by screen

### Onboarding — Imported
"Upload Call Sheet," "Import Production Schedule," "Start With a Template" are where production/scene/setup/character/look names would really come from — parsed out of a real call sheet or schedule export. **The PRD explicitly puts real call-sheet ingestion out of scope for this release**, so the current fake progress-bar animation is intentional, not a gap. When it's built for real, this is also where each character's base wardrobe item list would load from (the costume breakdown is prepared during prep, before the shoot day — it's not typed live on set).

### My Set — Structured, read-only summary
Each role's "next action" card is derived from that department's own status elsewhere (see below) — nothing is typed here directly. The outcome buttons (Print/Hold/No Good, Go Again/Move On, Approve Escalation) are one-tap logged actions, not text.

### AD Command — Computed + structured
Entirely aggregated from other departments' statuses. "Send 5-Min Check-in" / "Reorder Next Setup" / "Escalate Blocker" are logged actions (the `AckButton` pattern), no text entry.

### Live Take — Structured, **with one real gap**
Scene/setup/slate/take/outcome and reset causes are chip-based category selection — already built, matches the PRD exactly ("categorized reset causes"). **But the PRD's own wording for this role is "slate, take, outcome, categorized reset causes, _and notes_"** — free-text notes are explicitly spec'd here and don't exist in the UI yet. This is the cleanest, most clearly-justified place to add a real textarea: Script Supervisor records category chips *plus* a short free-text note per take.

### Lighting Console — Structured
Gaffer's task card is derived from whichever cause was selected on Live Take. Status buttons (Ready / Need Time / Equipment Issue) are logged actions. The "Pattern Alert" recovery suggestion is system-computed (same engine as Take Intelligence), not written by a person.

### Wardrobe & Talent — **this is the one that needs a real decision**
Breaking down exactly what you asked about:
- **Character / look / item list**: Imported, same as above — this is the costume breakdown from prep, not typed on the shoot day.
- **Continuity photos**: Already real and working — tapping a photo slot opens the actual device camera.
- **Continuity notes** ("vest has dust smudge on right shoulder"): this is the gap. In a real production, this is the Set Costumer's job — they maintain a continuity log, usually a photo plus a short note, right after a look is confirmed or after any take that might affect it. The PRD calls this role's data "character, look, **approved continuity notes**, reset task" — "approved" likely means "the official continuity record," not "someone else writes it and Wardrobe just reads it," but that's genuinely ambiguous in the PRD and worth you confirming. My recommendation: Wardrobe types the note themselves, attached to the photo they just took, timestamped automatically — mirroring how the camera capture already works.
- **Fixed photo slots (Front/Back/Detail: Cuff)**: hardcoded today. Real version needs to be a small, flexible list — Front + Back always, plus an open "+ Add detail shot" for anything specific to that look.
- **Reset required flag**: structured toggle, same pattern as other departments' issue buttons — no text needed.

### Take Intelligence — Fully computed, no input at all
Everything here (time lost by cause, usable-take counts, the recovery suggestion) is an aggregate derived from Live Take records over time. Nobody writes anything on this screen, ever — it's pure analytics. Worth knowing this one is categorically different from the others.

## Open questions (yours to decide, not mine to assume)

1. Who exactly is authorized to write a Wardrobe continuity note — Wardrobe only, or also Script Supervisor (continuity is technically their department in a lot of real productions)? The PRD's "approved continuity notes" phrasing doesn't settle this.
2. Should Live Take's new notes field be required, optional, or only shown for certain reset causes (e.g., required when "Other" is selected)?
3. Is a free-text note ever editable/deletable after submission, or is it an append-only log (matches "preserve an auditable record" in the PRD's product goals)?
4. Do detail photo slots get named by the person taking them (truly open-ended) or chosen from a short preset list (Cuff, Collar, Prop, Stain, Patch) to keep the continuity log consistent across different Wardrobe staff?
