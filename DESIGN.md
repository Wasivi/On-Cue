---
name: On Cue
description: A film-set command console built on Japanese operations-floor signage — andon boards and rail departure displays — not a SaaS ops dashboard.
colors:
  ink: "#17181a"
  ink-secondary: "#55565a"
  ink-muted: "#6b6c70"
  paper: "#f4f1ea"
  surface: "#ffffff"
  rail: "#121214"
  rail-border: "#232326"
  rail-muted: "#9a9b9e"
  signal-red: "#c81e2c"
  signal-red-light: "#fbe7e8"
  shingou-green: "#146356"
  shingou-green-light: "#e2eeec"
  brass-amber: "#b4690e"
  brass-amber-light: "#f7e8d3"
  plum: "#5b3a6e"
  plum-light: "#efe4ee"
  line: "#ded8c8"
  line-strong: "#c3bca8"
  signal-red-text: "#8c1520"
  signal-red-hover: "#a5111e"
  signal-red-confirm-text: "#f0a3a8"
  shingou-green-text: "#0f4f45"
  brass-amber-text: "#7a4a0a"
  brass-amber-hover: "#8f5309"
  plum-text: "#4a2f5a"
  ink-hover: "#000000"
  line-strong-hover: "#a8a08c"
typography:
  display:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.08em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "18px"
    fontWeight: 700
rounded:
  none: "2px"
  sm: "3px"
  full: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "#000000"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  button-danger:
    backgroundColor: "{colors.signal-red}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "24px"
---

# Design System: On Cue

## Overview

**Creative North Star: "Andon Line"**

On Cue is a film-set readiness board, not an ops dashboard with a film theme painted on. Its visual world comes from the two Japanese operations-floor systems built for exactly its problem — status legible at a glance, under bad light, by someone with no time to read: the **andon board** (the manufacturing-floor lamp system where a colored light communicates line status before any word does) and **JR rail departure signage** (dense, disciplined, high-legibility information design that has never needed a drop shadow to feel authoritative). Both are minimalist by function, not by decoration — restraint because urgency has no room for ornament, not restraint as a mood.

The system deliberately refuses the default AI-generated ops-dashboard look it replaced: soft rounded cards floating on drop shadows, a teal-accent SaaS palette, pill badges, a generic dark sidebar. Line and space carry hierarchy here. Color is a signal, spent narrowly and precisely, never a decoration spread across a surface. Status renders as a small solid lamp — the andon light — never a rounded chip.

**Key Characteristics:**
- Flat surfaces, hairline borders, zero box-shadow — depth comes from line weight and spacing, never blur.
- Sharp, nearly-square corners (2–3px) everywhere except true circles (avatars, lamps, timeline nodes).
- One saturated red carries every stop/blocker signal; every other status color is comparably restrained.
- Status is a small colored dot beside a label, never a colored border strip on a card edge.
- Zen Kaku Gothic New (a Japanese type foundry's gothic sans) for all display and body text; JetBrains Mono for every number that means something — times, counts, IDs.

## Colors

A restrained, committed palette: one signal color (red) does the urgent work; three quieter signal colors cover status states that aren't emergencies; everything else is ink, paper, and line.

### Primary
- **Signal Red** (#c81e2c): The one color that means "stop, look here." Hold/blocker banners, the destructive Reset Demo confirm state, error text. Used narrowly — this is the andon board's red lamp, not a brand color to spread around.

### Secondary
- **Shingou Green** (#146356): The "go" signal — deliberately not SaaS teal. Named for Japan's 青信号 (aoshingou), the traffic "go" light that reads blue-green rather than pure green. Ready states, print/usable takes, confirmed actions.
- **Brass Amber** (#b4690e): Caution / in-progress / at-risk. A warm brass tone rather than a generic warning orange, echoing gaffer-tape and hazard-tag brass rather than a dashboard's amber-500.
- **Plum** (#5b3a6e): Secondary emphasis — recovery suggestions, generated task lists, the "rolling" motion state. Used for insight, never for a primary call to action.

### Neutral
- **Ink** (#17181a): Primary text, primary buttons. Near-black, not pure black — sumi-ink black.
- **Ink Secondary** (#55565a) / **Ink Muted** (#6b6c70): Secondary and tertiary text. Both hit WCAG AA (4.5:1+) against paper and surface — the prior system's muted gray failed this; this one doesn't.
- **Paper** (#f4f1ea): The workspace background. Unbleached, warm, closer to washi paper than to sterile SaaS gray.
- **Surface** (#ffffff): Card backgrounds — pure white, a clean sheet against the warmer paper field.
- **Rail** (#121214) / **Rail Border** (#232326) / **Rail Muted** (#9a9b9e): The navigation rail — near-black ink, not charcoal-gray "dashboard dark mode."
- **Line** (#ded8c8) / **Line Strong** (#c3bca8): Every border in the system. There is no other way cards separate from each other.

### Named Rules
**The One Signal Rule.** Signal Red is the only color allowed to mean "stop." No other red-family value, no orange escalation tier — one red, spent narrowly, keeps it legible as an alarm instead of decoration.

**The Lamp, Not the Chip Rule.** Status never renders as a fully-rounded pill badge alone. A small solid-color circle (the andon lamp) leads every status indicator, whether inside a `.pill` or beside a section label; the lamp is readable half a second before the word next to it is.

**The Two-Weight Signal Rule.** Every signal color ships two weights: a saturated one for lamps, solid fills, and buttons (Signal Red #c81e2c, Shingou Green #146356, Brass Amber #b4690e, Plum #5b3a6e), and a darkened text-safe variant for the same color used as body text on a light background (Signal Red Text #8c1520, Shingou Green Text #0f4f45, Brass Amber Text #7a4a0a, Plum Text #4a2f5a) — the saturated weight rarely clears 4.5:1 as text at 12-13px, so it never carries a sentence. Hover states darken the saturated weight further (Ink Hover #000000, Signal Red Hover #a5111e, Brass Amber Hover #8f5309, Line Strong Hover #a8a08c); Signal Red Confirm Text (#f0a3a8) is the one lightened exception, used only for label text sitting on a translucent red wash (the armed Reset Demo state) where a dark text color would fail contrast against that dark rail background instead.

## Typography

**Display Font:** Zen Kaku Gothic New (with Hiragino Kaku Gothic ProN, system-ui fallback)
**Body Font:** Zen Kaku Gothic New (same family — one voice throughout, no separate serif/sans pairing)
**Label/Mono Font:** JetBrains Mono

**Character:** A Japanese type foundry's gothic sans — geometric, even-toned, built for signage legibility rather than editorial warmth. Paired with JetBrains Mono for anything tabular or time-based, so a glance can tell a label from a reading.

### Hierarchy
- **Display** (800, 42px, 1.1 line-height, -0.03em): The single big status word (HOLD / READY TO ROLL / ROLLING) on AD Command — the one place the system allows real scale, because that word is the whole point of the screen.
- **Headline** (700, 24px, 1.2, -0.02em): Page titles (`h1`).
- **Title** (700, 16–18px): Card headings, the current-task line, role names.
- **Body** (400, 13px, 1.6 line-height): Descriptions, detail text, secondary copy.
- **Label** (700, 11px, 0.08em letter-spacing, uppercase): Every section eyebrow (NOW, YOUR ACTION, Current Task) and stat label. Small, tracked-out, quiet — signage caption, not a heading.
- **Data** (JetBrains Mono, 700, 13–18px, tabular numerals): Every timestamp, countdown, take number, and readiness percentage. If a number means something operationally, it's mono.

### Named Rules
**The Mono-Means-Live Rule.** JetBrains Mono is reserved for numbers a crew member would act on — a target time, an elapsed hold, a take count. Decorative or narrative numbers stay in the body face.

## Layout

Page content sits in a `32px 28px` padding block, `max-width` capped per page (720–960px) so dense data never stretches into unreadable line lengths. Cards stack with `16–24px` vertical rhythm; more space separates distinct sections than sits inside one. Stat rows and department grids use CSS grid with `auto-fill, minmax()` so the board reflows by content, not by breakpoint math — true to an andon board's job of fitting whatever is currently active. The navigation rail is a fixed 240px column, unscrolling; only the workspace scrolls.

## Elevation & Depth

**No shadows.** This is the system's clearest departure from the SaaS-dashboard default it replaced: cards carry a single 1px hairline border (`--border` / `--border-strong` on hover) and nothing else. Depth is conveyed by line weight, color contrast, and spacing alone — the andon board and the departure sign both communicate hierarchy this way, and adding blur back in would be the fastest way to slide back into the generic look this redesign exists to leave.

### Named Rules
**The Flat-By-Default Rule.** No `box-shadow` appears anywhere in the system. A card separates from its neighbor by a hairline border and by the paper showing through the gap, never by a drop shadow.

## Shapes

Corners are sharp: cards and buttons round to 2–3px, close enough to square that the eye reads "drafted," not "soft." The one exception is the true circle — avatars, the andon-lamp status dots, timeline nodes — which stays a full circle rather than a rounded square, because a circle is a real signal-lamp shape and a squircle is a costume of one. No other clipping, no card notches, no organic blob shapes.

## Components

### Buttons
- **Shape:** Sharp corners (2px).
- **Primary:** Ink background, white text, `10px 18px` padding — the darkest, most confident surface in the system, reserved for the one real action on a screen.
- **Secondary:** White surface, ink text, `1px solid` line-strong border.
- **Danger:** Signal red background, white text — reserved for genuinely destructive or escalating actions.
- **Hover / Focus:** Buttons darken on hover (`background` shift, no shadow added); `:focus-visible` gets a 2px signal-red outline system-wide, since the incumbent build shipped with none at all.
- **Acknowledge state (signature):** Buttons wired through the shared `AckButton` component (log-only actions with no dedicated app state) swap their icon for a checkmark and their label for a confirmation string on click, then disable — the system's answer to "did my click register."

### Chips / Pills
- **Style:** Small rectangular tag (`2px` radius, not a pill despite the class name `.pill`), a solid-color andon lamp dot leading the label, uppercase, `11px`, tracked.
- **State:** `pill-ready` (shingou green), `pill-hold` (signal red), `pill-risk` (brass amber), `pill-wait` (neutral gray) — one lamp color per state, no gradients.

### Cards / Containers
- **Corner Style:** 3px.
- **Background:** Surface white on the paper workspace.
- **Shadow Strategy:** None — see Elevation & Depth.
- **Border:** 1px solid `--border`, darkening to `--border-strong` on hover.
- **Internal Padding:** 20–32px depending on card density.

### Navigation
- **Style:** A 240px ink-black rail, not a floating sidebar. Inactive items sit in rail-muted gray; the active item gets a 2px signal-red left rule and white text — the same left-rule language a subway line map uses for "you are here," not a filled rounded pill.
- **Typography:** 13px, 500 weight, no uppercase.
- **States:** Hover lifts to a faint white wash; active adds the red rule. No rounded background chip on either state.

### Status Lamp (signature)
The recurring custom pattern this redesign introduces: a small solid circle (6–8px) in the relevant signal color, placed before a section's uppercase label or inside a `.pill`. It replaces the prior system's colored left-border card accent everywhere — AD Command's big status card, My Set's NOW card, Lighting Console's Current Task card, and Live Take's generated-tasks card all lead with a lamp instead of a stripe.

## Brand Mark (exception)

The `Wordmark` component (`src/components/Wordmark.tsx`) intentionally does **not** use this system's operational palette. It carries its own small brand palette — Navy (#1b3a6b), Gold (#d4a72c), Ivory (#f5f0e1) — a procedural-drama title-card register (badge gravitas, diagonal cue-stripe, gold reserved for the word "Cue") distinct from the flat andon-signal system the rest of the interface runs on. This is a deliberate, user-directed choice: the brand mark is meant to feel like a title card, the operational UI is meant to feel like an instrument panel, and the two are not required to share a palette. Do not extend Navy/Gold/Ivory beyond `Wordmark.tsx` into the operational interface — that would blur exactly the distinction this exception exists to keep.

## Do's and Don'ts

### Do:
- **Do** lead every status communication with a solid-color lamp (dot) before the word.
- **Do** keep corners sharp (2–3px) except true circles.
- **Do** reserve Signal Red for stop/blocker/destructive meaning only.
- **Do** set every time, count, or take number in JetBrains Mono with tabular numerals.
- **Do** separate cards with a hairline border and paper showing through the gap.

### Don't:
- **Don't** add `box-shadow` to any surface — this system is flat by contract, not by omission.
- **Don't** render status as a fully-rounded pill with no lamp; the lamp is the signal, the shape around it is secondary.
- **Don't** use a colored left-border strip as a card's status accent — that's the prior system's pattern, and the exact tell this redesign moved away from.
- **Don't** introduce a second display typeface; Zen Kaku Gothic New carries both display and body weight.
- **Don't** use SaaS teal for "ready" — the system's go-signal is the blue-shifted shingou green, not a generic mint/teal.
- **Don't** add progress rings, sparklines, or gauges. Every metric in this system reads as a mono number (with a `/total` caption where relevant) — a ring was tried during this build and removed for duplicating data already shown as text while adding back the exact decorative-dashboard silhouette the redesign exists to leave.
