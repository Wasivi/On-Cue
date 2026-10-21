---
name: On Cue
description: A procedural-drama title-card world — navy, gold, and ivory — carried from the landing page into the whole app, not a separate operational palette.
colors:
  navy-deepest: "#051015"
  navy-deep: "#071820"
  navy: "#0a2a3a"
  navy-mid: "#0d3a4d"
  surface: "#0f1f2e"
  surface-elevated: "#0a1620"
  border: "#1c4256"
  border-strong: "#2a4a5c"
  ivory: "#e8f0f5"
  ivory-warm: "#e1ded2"
  muted: "#6b9ab0"
  muted-dim: "#4a6b7d"
  gold: "#e6b800"
  gold-bright: "#f0c800"
  bronze: "#c9a227"
  teal: "#8ab4c7"
  slate: "#6b9ab0"
  slate-deep: "#5a8a9e"
  slate-deeper: "#4a7a8e"
  stop-red: "#e2493c"
  stop-red-hover: "#c93c30"
  stop-red-dim: "#8c2a22"
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
    textColor: "#0a0e17"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    border: "1px solid rgba(138,180,199,0.25)"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  button-danger:
    backgroundColor: "{colors.stop-red}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border}"
    padding: "24px"
---

# Design System: On Cue

## Overview

**Creative North Star: "Night Call"**

On Cue's whole app is one world, not two. The landing page's navy/gold/ivory title-card register — the thing people see first and the thing they said they love — is the system now, not a brand-mark exception carved out from a separate operational palette. "Night Call" is the production term for an overnight shoot: it names the register this system lives in — dark, warm-lit, a little cinematic, built for a crew still on set after dark — and it's deliberately the opposite instinct from a daytime SaaS dashboard's white canvas and gray chrome.

This supersedes an earlier "Andon Line" system (ink/paper, flat signage, zero shadow) that was drafted for this app and never actually matched what shipped. It's gone now, not archived as an alternate mode — there is one design system for On Cue, and this is it.

**Key Characteristics:**
- Dark navy surfaces throughout, the same gradient family as the landing page — not a light "paper" workspace behind a dark brand mark.
- Gold is the one accent that means "this is active, this is yours, this is the primary action" — spent narrowly, the way the landing page already spends it on the hub node and the sign-in button.
- A small solid lamp dot still leads every status word — that part of the prior system was good UX independent of palette, so it survives, just recolored.
- Big Caslon is reserved for the one large display moment per screen (the wordmark on the landing page; the HOLD / READY / ROLLING word on AD Command). Playfair Display carries every other line of text, display down to captions — one voice, like the landing page already runs.
- Soft shadows and glow are allowed and expected — a dark surface reads depth through light falloff, not through hairlines. This is the opposite call from a flat light system, and it's correct for this palette.

## Colors

### Primary
- **Gold** (#e6b800): The one color that means "primary, active, yours." Primary buttons, the active nav item, Ready/Go status, the hub of attention on any screen. This is already the landing page's sign-in button and hub-node color — extend it, don't invent a second accent beside it.

### Signal (status)
- **Stop Red** (#e2493c, hover #c93c30): Hold, blocker, destructive confirm. The only color that means "stop, look here" — new to this system because the landing page never needed a stop signal, but it has to exist somewhere for a production-readiness tool. Spent as narrowly as gold. The hover shade follows the same two-weight pattern as Gold → Gold Bright.
- **Bronze** (#c9a227): Caution / at-risk / in-progress. Pulled directly from the constellation's own "creative" category color, not a new hue.
- **Teal / Slate** (#8ab4c7, #6b9ab0, #5a8a9e, #4a7a8e): Secondary and tertiary status, informational tags, department-category color when more than the three signal states above are needed — the constellation's own technical/support/talent colors, reused rather than duplicated.

### Neutral
- **Navy Deepest → Mid** (#051015, #071820, #0a2a3a, #0d3a4d): The background gradient family, exactly as used on the landing page. A page's base canvas picks from this range; it doesn't need the full four-stop gradient every time, but it never drops to a light background.
- **Surface** (#0f1f2e): Card and input backgrounds — the landing page's own input-field color. Elevated surfaces (popovers, dropdowns) step up to #0a1620.
- **Ivory** (#e8f0f5): Primary text on navy. **Ivory Warm** (#e1ded2): the wordmark's cooler, warmer-toward-gray ivory, for the one big display line on a screen.
- **Muted** (#6b9ab0) / **Muted Dim** (#4a6b7d): Secondary and tertiary text — the landing page's own subtitle and footnote colors.
- **Border** (#1c4256) / **Border Strong** (#2a4a5c): Hairline borders and dividers, stepping up on hover/focus.

### Named Rules
**The One Signal Rule.** Stop Red is the only color that means "stop." Gold is the only color that means "primary/active." Nothing else competes with either — this is the rule the prior system got right; it just had the wrong palette under it.

**The Lamp, Not the Chip Rule.** Status still renders as a small solid dot leading a label, not a pill badge standing alone. Carried over unchanged from the prior system — it's a palette-agnostic legibility win, recolored: gold/stop-red/bronze/teal in place of shingou-green/signal-red/brass-amber/plum.

**The One Display Rule.** Big Caslon appears once per screen, for the single thing that screen is actually about — the wordmark on the landing page, the HOLD/READY/ROLLING word on AD Command, a hero number on Take Intelligence. Everywhere else is Playfair Display. Two display faces on one screen is a tell that nothing was actually decided as "the point."

## Typography

**Display Font:** Big Caslon (Big Caslon Medium, Didot, Georgia fallback) — reserved per the One Display Rule above.
**Body/UI Font:** Playfair Display (Georgia fallback) — every headline, label, button, and paragraph that isn't the one display moment.
**Data Font:** JetBrains Mono — every number a crew member would act on.

### Hierarchy
- **Display** (500, Big Caslon): 72px on the landing page's wordmark; an in-app hero word like HOLD/READY/ROLLING runs 48px on desktop down to a 36px floor on narrow viewports. One range, one typeface, used once per screen.
- **Headline** (700, italic, 22px, Playfair): page/section titles.
- **Title** (600, 15–17px, Playfair): card headings, role names, the current-task line. A large call-to-action button's label steps up to 15px within this same weight — emphasis through size, not a second typeface.
- **Body** (400, 14px, 1.6 line-height, Playfair): descriptions, detail text, default button and nav-link text.
- **Caption** (600, 12px, Playfair): take chips, compact pill labels, and other small UI chrome that's smaller than body but not tracked-out like Label.
- **Label** (600, 11px, 0.08em tracking, Playfair, often italic): section eyebrows and stat labels — quiet, tracked-out, never shouting.
- **Data** (JetBrains Mono, 700, 14–18px, tabular numerals): every timestamp, countdown, take number, readiness percentage.

### Named Rules
**The Mono-Means-Live Rule.** Unchanged from the prior system: JetBrains Mono is reserved for numbers a crew member would act on. Decorative or narrative numbers stay in Playfair.

## Layout

Page content sits in generous padding (`32px 28px`+), capped at a comfortable reading width per page so dense data doesn't stretch thin on a wide monitor. The navigation rail runs the same navy-gradient family as the landing page (this is already half-true in `index.css`'s `--nav-bg`; make it fully true) rather than a flat near-black or a light sidebar. Cards float on the navy canvas with real but soft separation — border plus a gentle shadow, not a hairline alone.

## Elevation & Depth

**Soft shadows and glow are the system's depth language**, the reverse of a flat/hairline-only system. The landing page's own popover (`0 12px 32px rgba(0,0,0,0.5)`) and the wordmark's gold text-shadow glow (`0 0 80px rgba(230,184,0,0.12)`) are the reference: diffuse, dark-tinted shadows for elevation; a soft colored glow for emphasis on the one gold/active element in view. Hard-edged, light-colored "SaaS card" shadows are still wrong here — the shadow should read as light falling away into the navy, not plastic lifted off a white page.

## Shapes

Corners round gently — 4px for inputs and cards, a touch more for larger surfaces — matching the landing page's own input and button radius. True circles stay circles: the sign-in button, status lamps, avatar marks. This is rounder than the old flat-signage system on purpose; it's a title-card world, not a factory floor.

## Components

### Buttons
- **Primary:** Gold fill, near-black text (`#0a0e17`) — exactly the landing page's sign-in submit button. Reserved for the one real action on a screen.
- **Secondary:** Transparent, ivory text, hairline border at `rgba(138,180,199,0.25)` — exactly the landing page's "Continue with Google/Apple" buttons.
- **Danger:** Stop Red fill, white text — destructive or escalating actions only.
- **Hover / Focus:** Buttons warm slightly on hover (a touch more fill/border opacity, optionally a faint gold glow on primary); `:focus-visible` gets a 2px gold outline system-wide.
- **Acknowledge state:** Log-only actions (no dedicated app state) swap their icon for a checkmark and label for a confirmation string on click, then disable — carried over from the prior system, palette-agnostic.

### Chips / Pills
- **Style:** Small rounded tag (4px radius), a solid lamp dot leading the label, uppercase or small-caps, tracked.
- **State:** ready/go → gold, hold/blocker → stop red, at-risk/caution → bronze, informational → teal or slate. One lamp color per state, no gradients.

### Cards / Containers
- **Background:** Surface navy (#0f1f2e) on the deeper navy canvas.
- **Border:** 1px solid `--border` (#1c4256), stepping to `--border-strong` on hover.
- **Shadow:** A soft, dark diffuse shadow for lift — see Elevation & Depth.
- **Corner radius:** 8px.
- **Internal padding:** 20–32px depending on density.

### Navigation
- **Style:** A fixed rail in the landing page's own navy gradient, not flat near-black or a light sidebar. The active item gets a gold accent (left rule or soft glow) and ivory text; inactive items sit in muted blue-gray.
- **Typography:** Playfair Display, 13–14px, no uppercase.
- **States:** Hover lifts to a faint gold-tinted wash; active adds the gold accent. No rounded filled-pill background.

### Status Lamp
A small solid circle (6–8px) in the relevant signal color, placed before a label or inside a chip. Gold/stop-red/bronze/teal in place of the prior shingou-green/signal-red/brass-amber/plum — same pattern, recolored into this system.

## Do's and Don'ts

### Do:
- **Do** lead every status communication with a solid-color lamp dot before the word.
- **Do** keep the whole app on the navy/surface background family — no light "workspace gray" canvas anywhere.
- **Do** reserve Gold for the single primary/active meaning, and Stop Red for stop/blocker/destructive only.
- **Do** set every time, count, or take number in JetBrains Mono with tabular numerals.
- **Do** let one Big Caslon moment anchor each screen; everything else is Playfair Display.
- **Do** use soft, dark-tinted shadows and gold glow for elevation and emphasis.

### Don't:
- **Don't** reintroduce a light background, white cards, or gray "SaaS workspace" surface anywhere in the app.
- **Don't** let teal/cyan/violet drift in as ad-hoc one-off hex values outside this palette — if a new status color is genuinely needed, it comes from the constellation's own category colors, not a fresh invention.
- **Don't** add a second display typeface; Big Caslon is for the one moment per screen, Playfair Display for everything else.
- **Don't** render status as a filled pill with no lamp; the lamp is the signal.
- **Don't** add progress rings, sparklines, or gauges where a mono number already says the same thing.
