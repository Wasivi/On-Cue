---
name: On-Cue
description: Night Call — a navy and gold title card on the landing page; light cool-gray paper with navy ink, gold for the one primary action, and red for holds on every working screen.
colors:
  # Working screens (light paper)
  paper: "#f3f4f5"
  paper-deep: "#e7e9eb"
  surface: "#ffffff"
  surface-elevated: "#fafbfc"
  border: "#dde0e3"
  border-strong: "#c4c9ce"
  ink: "#14222b"
  ink-warm: "#0d2836"
  muted: "#4f7184"
  muted-dim: "#7c94a0"
  # Accent and signal
  gold: "#e6b800"
  gold-bright: "#cc9f00"
  gold-glow: "rgba(230, 184, 0, 0.22)"
  on-gold: "#0a0e17"
  bronze: "#c9a227"
  bronze-text: "#8a6d1a"
  bronze-glow: "rgba(201, 162, 39, 0.18)"
  teal: "#8ab4c7"
  teal-text: "#2d6478"
  slate: "#6b9ab0"
  slate-deep: "#5a8a9e"
  slate-deeper: "#4a7a8e"
  stop-red: "#e2493c"
  stop-red-text: "#a8392e"
  stop-red-hover: "#c93c30"
  stop-red-dim: "#8c2a22"
  stop-red-glow: "rgba(226, 73, 60, 0.18)"
  # Landing page and header strip (the dark title card)
  navy-mid: "#0d3a4d"
  navy: "#0a2a3a"
  navy-deep: "#071820"
  navy-deepest: "#051015"
  navy-input: "#0f1f2e"
  ivory: "#e8f0f5"
  ivory-warm: "#e1ded2"
  landing-subtitle: "#9a958c"
typography:
  display:
    fontFamily: "'Big Caslon', 'Big Caslon Medium', Didot, Georgia, serif"
    fontSize: "72px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "22px"
    fontWeight: 700
    fontStyle: "italic"
    lineHeight: 1.2
  body:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.08em"
  caption:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "12px"
    fontWeight: 600
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 700
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    hoverBackgroundColor: "{colors.gold-bright}"
    textColor: "{colors.on-gold}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "1px solid {colors.border-strong}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-danger:
    backgroundColor: "{colors.stop-red}"
    hoverBackgroundColor: "{colors.stop-red-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border}"
    shadow: "0 1px 2px rgba(20, 34, 43, 0.06)"
    padding: "24px"
  nav-tab:
    backgroundColor: "{colors.paper}"
    activeBackgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    activeTextColor: "{colors.bronze-text}"
    border: "1px solid {colors.border-strong}"
    rounded: "12px 12px 0 0"
---

# Design System: On-Cue

## Overview

**Creative North Star: "Night Call"**

"Night Call" is the production term for an overnight shoot. The system has two readings of one palette:

- **The landing page is the title card.** Dark navy, gold, an animated 3D constellation of the crew. It's seen once, and it's the moment people love. It stays dark.
- **Every working screen is light paper.** Near-white with a cool gray tint (`#f3f4f5`), navy ink (`#14222b`), gold (`#e6b800`) for the one primary action, and red (`#e2493c`) for holds. People stare at these screens for a 14-hour day, so they're light, calm, and readable in sun glare or stage light.

**History, so it isn't repeated:**
- An all-dark version (navy on every screen) was built and **rejected**: dark-on-dark text was unreadable and it felt oppressive for an all-day working surface.
- Warm ivory paper (`#f4efe3`) was used until 2026-10-22 and **rejected**: on a real screen it read as "brown." The paper is now cool gray (`#f3f4f5`).
- An earlier "Andon Line" system (ink and paper, flat signage) was drafted and never shipped.

**Key characteristics:**
- Light cool-gray paper with white cards on every working screen. Never a dark page outside the landing page.
- Gold means "primary, active, yours," spent narrowly. Red means "stop."
- A small solid lamp dot leads every status word.
- The landing page's animation lives on in the header strip of every page.
- Playfair Display carries almost all text; Big Caslon is the one display moment per screen; JetBrains Mono is for numbers people act on.

## Colors

### Working screens (light paper)

| Token | Hex | Use |
|---|---|---|
| Paper | `#f3f4f5` | Page background on every working screen |
| Paper Deep | `#e7e9eb` | The bottom navigation bar; recessed areas; checklist hover |
| Surface | `#ffffff` | Cards, inputs, the active nav tab |
| Surface Elevated | `#fafbfc` | Popovers and raised panels |
| Border | `#dde0e3` | Card and divider hairlines |
| Border Strong | `#c4c9ce` | Hover and focus borders, nav tab outlines, the nav bar's top edge |
| Ink | `#14222b` | Main text |
| Ink Warm | `#0d2836` | Page titles |
| Muted | `#4f7184` | Secondary text, section labels, inactive nav tabs |
| Muted Dim | `#7c94a0` | Tertiary text, timestamps, icons at rest |

### Accent and signal

Each signal color comes in two weights: the **bright** version for fills, dots, and backgrounds, and a darker **text** version for words on paper. The bright versions fail contrast as text on a light background — never use them for text.

| Token | Bright (fills, dots) | Text on paper | Meaning |
|---|---|---|---|
| Gold | `#e6b800` (hover `#cc9f00`) | `#8a6d1a` (Bronze Text) | Primary action, active, yours |
| Teal | `#8ab4c7` | `#2d6478` | Ready / go; informational |
| Bronze | `#c9a227` | `#8a6d1a` | At risk, caution, in progress |
| Stop Red | `#e2493c` (hover `#c93c30`, dim `#8c2a22`) | `#a8392e` | Hold, blocker, destructive |
| Slate | `#6b9ab0`, `#5a8a9e`, `#4a7a8e` | `#4f7184` (Muted) | Department category color when more states are needed |

- **Text on a gold button:** `#0a0e17`.
- **Glows:** gold `rgba(230, 184, 0, 0.22)`; red `rgba(226, 73, 60, 0.18)` (also the pulsing ring on a hold).

### Status pills

A pale tint of the signal color, a matching border, and the text-weight color for the label. The lamp dot still leads the label.

| Pill | Background | Text | Border |
|---|---|---|---|
| Ready | `rgba(138, 180, 199, 0.16)` | `#2d6478` | `rgba(138, 180, 199, 0.35)` |
| Hold | `rgba(226, 73, 60, 0.12)` | `#a8392e` | `rgba(226, 73, 60, 0.30)` |
| At risk | `rgba(201, 162, 39, 0.14)` | `#8a6d1a` | `rgba(201, 162, 39, 0.32)` |
| Waiting | `rgba(79, 113, 132, 0.10)` | `#4f7184` | `rgba(79, 113, 132, 0.20)` |
| Gold | `rgba(230, 184, 0, 0.16)` | `#8a6d1a` | `rgba(230, 184, 0, 0.35)` |

### Landing page and header strip (the dark title card)

| Token | Hex | Use |
|---|---|---|
| Navy Mid | `#0d3a4d` | Landing gradient, first stop |
| Navy | `#0a2a3a` | Landing gradient; the header strip on every page |
| Navy Deep | `#071820` | Landing gradient |
| Navy Deepest | `#051015` | Landing gradient, last stop |
| Navy Input | `#0f1f2e` | Sign-in inputs on the landing page |
| Ivory | `#e8f0f5` | Text on navy |
| Ivory Warm | `#e1ded2` | The landing wordmark; constellation labels |
| Landing Subtitle | `#9a958c` | "21 departments · 87 crew · 12 cast · 4 locations" — a visible dark gray, not black |

- **Landing gradient:** `linear-gradient(160deg, #0d3a4d 0%, #0a2a3a 30%, #071820 70%, #051015 100%)`.
- **Header strip wordmark:** `#ffffff`.
- **Header fade:** the bottom 36px of the header fades from transparent through `rgba(7, 24, 32, 0.5)` into Paper `#f3f4f5`, so there's no hard seam.

### Constellation (landing page and header strip)

| Group | Hex |
|---|---|
| Hub (1st AD) | `#e6b800` |
| Creative (Director, Producer) | `#c9a227` |
| Technical (DP, Gaffer, Camera, Sound) | `#8ab4c7` |
| Technical, outer (Focus Puller, Steadicam) | `#6f9db3` |
| Support (Wardrobe, On Set, Script Sup, Locations, Craft Services) | `#6b9ab0` |
| Talent (actors, Scene, Lighting) | `#5a8a9e` |
| Outer crew (Transport, Safety, Art, Props, Hair/MU, and others) | `#4a7a8e` |
| Bones and traveling signal | `#e6b800` |
| Cross-links and their joints | `#8ab4c7` lines, `#b2c8d4` joints |

**Constellation labels (decided 2026-10-22):** no solid background box. Contrast comes from a stronger text outline or shadow instead. *Not built yet — labels currently sit on a dark chip, `rgba(7, 24, 32, 0.72)`, which reads as a "black box."*

### Named rules

**The One Signal Rule.** Stop Red (`#e2493c`) is the only color that means "stop." Gold (`#e6b800`) is the only color that means "primary or active." Nothing else competes with either.

**The Two-Weight Rule.** Bright colors are for fills and dots; the darker text versions (`#2d6478`, `#8a6d1a`, `#a8392e`) are for words on paper.

**The Lamp, Not the Chip Rule.** Status renders as a small solid dot leading a label, not a pill standing alone.

**The One Display Rule.** Big Caslon appears once per screen, for the single thing that screen is about — the wordmark on the landing page, the HOLD / READY / ROLLING word on AD Command. Everything else is Playfair Display.

## Typography

**Display:** Big Caslon (Big Caslon Medium, Didot, Georgia fallback) — once per screen.
**Body and UI:** Playfair Display (Georgia fallback) — every headline, label, button, and paragraph.
**Data:** JetBrains Mono with tabular numerals — every number a crew member acts on.

### Hierarchy
- **Display** (500, Big Caslon): 72px for the landing wordmark; an in-app hero word like HOLD / READY runs 48px, down to 36px on narrow screens.
- **Headline** (700, italic, 22px, Playfair, Ink Warm `#0d2836`): page titles.
- **Title** (600, 15–18px, Playfair, Ink `#14222b`): card headings, role and character names.
- **Body** (400, 14px, line-height 1.6, Playfair): descriptions and detail text.
- **Caption** (600, 12px, Playfair): take chips and small pill labels.
- **Label** (600, 11px, 0.08em tracking, uppercase, Playfair, Muted `#4f7184`): section eyebrows like "CONTINUITY STATE."
- **Data** (700, 14–18px, JetBrains Mono, tabular): timestamps, countdowns, take numbers, percentages.

**Known defect:** the `.big-status` class in `src/index.css` wraps its font list in an extra pair of quotes, so the browser ignores it and falls back to its default serif. It needs a one-line fix.

## Layout

- Page content sits in generous padding (`32px 28px`) with a comfortable maximum width per page.
- **Header strip:** 72px tall, Navy `#0a2a3a`, with the landing page's animated orb cluster spanning edge to edge, the "On Cue" wordmark in white, and a fade into the paper below.
- **Bottom navigation:** see Components.
- Cards float on the paper with a hairline border and a soft shadow.

## Elevation and depth

Ordinary soft shadows on a light surface, tinted with the ink color, never black:

| Token | Value | Use |
|---|---|---|
| Shadow Small | `0 1px 2px rgba(20, 34, 43, 0.06)` | Cards at rest |
| Shadow | `0 2px 8px rgba(20, 34, 43, 0.08)` | Raised elements |
| Shadow Medium | `0 6px 18px rgba(20, 34, 43, 0.10)` | Cards on hover |
| Shadow Large | `0 14px 36px rgba(20, 34, 43, 0.14)` | Dropdowns and popovers |

The landing page is different: there, depth comes from glow and light falloff on navy (the wordmark's `0 0 80px rgba(230, 184, 0, 0.12)`).

## Shapes

- 4px corners for buttons, inputs, pills, and chips.
- 8px corners for cards.
- 12px top corners for the navigation tabs.
- True circles for status lamps, avatars, and the camera shutter button.

## Components

### Buttons
- **Primary:** Gold `#e6b800` fill, text `#0a0e17`, weight 700. Hover: `#cc9f00` with a gold glow. One real action per screen.
- **Secondary:** transparent, Ink `#14222b` text, 1px Border Strong `#c4c9ce`. Hover: a faint `rgba(20, 34, 43, 0.04)` wash and a Muted `#4f7184` border.
- **Danger:** Stop Red `#e2493c` fill, white text. Hover: `#c93c30` with a red glow. Destructive or escalating actions only.
- **Ghost:** transparent, Muted `#4f7184` text. Hover: `rgba(79, 113, 132, 0.08)` and Ink text.
- **Focus:** a visible 2px gold `#e6b800` outline on keyboard focus. *Not built yet — `src/index.css` has no focus styles, so keyboard users can't see where they are.*

### Cards
- White `#ffffff`, 1px Border `#dde0e3`, 8px corners, Shadow Small.
- Hover: Shadow Medium, Border Strong `#c4c9ce`, and a 1px lift.

### Bottom navigation
- A bar of book-style tabs rising off a visible spine, **centered**, reachable with a thumb.
- **Bar:** Paper Deep `#e7e9eb`, with a 1px Border Strong `#c4c9ce` top edge.
- **Inactive tab:** Paper `#f3f4f5` fill, Muted `#4f7184` label, 1px Border Strong outline.
- **Active tab:** White `#ffffff` fill, Bronze Text `#8a6d1a` label, slightly taller, shadow `0 -2px 8px rgba(20, 34, 43, 0.1)`.
- **Hold indicator:** a pulsing Stop Red `#e2493c` dot on the My Set tab while the setup is on hold.
- The bar hides itself after 3 seconds without a touch and comes back on touch. The role switcher and Reset Demo sit at its right end.

### Chips and pills
- 4px corners, a lamp dot leading the label, uppercase, tracked.
- Colors from the Status pills table above.
- **Active take chip:** Teal Text `#2d6478` border and label on a `rgba(138, 180, 199, 0.16)` tint.

### Status lamp
A small solid circle (6–8px): Teal `#8ab4c7` for ready, Stop Red `#e2493c` for hold, Bronze `#c9a227` for at risk, Gold `#e6b800` for primary or active.

## Do's and Don'ts

### Do
- **Do** keep every working screen on Paper `#f3f4f5` with White `#ffffff` cards.
- **Do** use the text-weight colors for words on paper: `#2d6478`, `#8a6d1a`, `#a8392e`.
- **Do** reserve Gold `#e6b800` for the single primary or active element and Stop Red `#e2493c` for holds, blockers, and destructive actions.
- **Do** lead every status with a lamp dot.
- **Do** set every time, count, and take number in JetBrains Mono with tabular numerals.
- **Do** keep the landing page dark navy and carry its animation into the header strip.

### Don't
- **Don't** make a working screen dark. It was tried and rejected.
- **Don't** go back to warm ivory or tan paper (`#f4efe3` read as brown). It was rejected on 2026-10-22.
- **Don't** put light text on a light background. Constellation labels once went white-on-white.
- **Don't** put constellation labels in solid dark boxes.
- **Don't** left-align the bottom tabs. They're centered.
- **Don't** add one-off hex colors outside this palette. A new status color comes from the constellation's own colors.
- **Don't** add a second display typeface.
- **Don't** render status as a pill with no lamp.
