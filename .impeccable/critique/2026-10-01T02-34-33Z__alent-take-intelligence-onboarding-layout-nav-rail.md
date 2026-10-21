---
target: operational pages and nav (My Set, AD Command, Live Take, Lighting Console, Wardrobe & Talent, Take Intelligence, Onboarding, Layout nav rail)
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-10-01T02-34-33Z
slug: alent-take-intelligence-onboarding-layout-nav-rail
---
Method: dual-agent (A: Explore agent ad5722cb6d3fd7649 · B: general-purpose agent ae6b249338a3e4f5e)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Lamps/pills update live, but teal "Ready" beside amber/red reads as a generic 3-color dashboard, not a restrained signal system. |
| 2 | Match System / Real World | 2 | Strong production vocabulary undercut by serif title-card type and a teal/gold palette that reads boutique-agency, not shop-floor signage. |
| 3 | User Control and Freedom | 2 | No confirm/undo on Escalate, No Good, or Continuity Issue; RoleSwitcher has no visible Escape/outside-click close. |
| 4 | Consistency and Standards | 1 | The shell's palette, type, shadows, corners, and nav pattern all contradict the written design system. |
| 5 | Error Prevention | 2 | Live Take gates its generate action on a cause being picked, but irreversible-feeling calls elsewhere fire with zero confirmation. |
| 6 | Recognition Rather Than Recall | 3 | My Set's NOW / YOUR ACTION / WHAT CHANGED / UP NEXT structure is solid recognition-first IA. |
| 7 | Flexibility and Efficiency | 1 | No shortcuts, no fast department-to-department jump for the AD; RoleSwitcher is a tiny buried pill. |
| 8 | Aesthetic and Minimalist Design | 1 | AD Command alone mixes two display faces, five palette colors, a floating shadowed pill, and a second gradient title. |
| 9 | Error Recovery | 2 | No empty/error states anywhere; WardrobeTalent's camera-to-file-input fallback is a genuine bright spot. |
| 10 | Help and Documentation | 1 | No contextual help beyond icon `title=` attributes; nothing explains Hold vs. Ready to a first-timer. |
| **Total** | | **18/40** | **Poor — major UX overhaul warranted** |

## Design Specificity Verdict

**LLM assessment:** The operational shell is not running the Andon Line system DESIGN.md specifies. `src/index.css` is explicitly headed `/* DSI Identity — fictional agency palette */` and defines `--teal:#1a5f7a`, `--gold:#e6b800`, `--violet:#553c9a`, box-shadow tokens, and a global Playfair Display body font — none of which is Zen Kaku Gothic New or the signal-red/shingou-green/brass-amber/plum set. `.card` ships `border-radius:8px` plus `box-shadow` and a hover lift — the exact "soft card on a shadow" pattern DESIGN.md names as the thing this system exists to refuse. `Layout.tsx` is a navy-gradient canvas with an auto-hiding bottom tab bar, not the spec's fixed 240px ink rail with a red left-rule. Onboarding brands the product "DSI PRODUCTION / Lone Wolf S8E9" instead of Harbor Unit/Episode 104. Git history suggests the Andon Line system (commit `139283f`) was built, then the most recent "Rebuild operational app shell" commit (`c1b630b`) reverted the shell to a pre-redesign identity — while individual cards still carry stray code comments referencing a lamp system whose colors no longer exist in the CSS. Net effect: this currently reads as a generic teal/gold ops dashboard with film-production labels on top, internally inconsistent with itself.

**Deterministic scan:** `detect.mjs` ran clean (exit 2, 10 findings, no crash) against all 8 target files. Zero findings in Layout.tsx, MySet.tsx, ADCommand.tsx, and LiveTake.tsx — the detector only catches literal one-off hex values outside DESIGN.md's documented list, so it missed the systemic finding entirely (a *consistently*-used wrong token like `var(--teal)` doesn't look like "undocumented color" to a literal scanner). What it did catch: 8 distinct undocumented hex literals scattered across LightingConsole.tsx (`#fcd34d`, `#92400e`), WardrobeTalent.tsx (`#e5e2dc`), TakeIntelligence.tsx (`#ddd6fe`, `#5b21b6`), and Onboarding.tsx (`#e0f2f7`, `#ede9fe`, `#553c9a`, plus a second `#e5e2dc`) — each sitting beside a CSS-variable sibling, confirming genuine token drift rather than a detector artifact. It also caught one real performance antipattern: Onboarding.tsx:111 animates `width` directly (layout thrash) instead of `transform`/`grid-template-columns`. No false positives identified; all flagged values were independently confirmed absent from DESIGN.md.

**Visual overlays:** Not available this run — no browser automation tool was exposed in this session, so the live-page overlay step was skipped. This is a fallback signal, not a finding.

## Overall Impression

My Set's role-specific content is genuinely well-researched production detail, and a few interaction patterns (progressive disclosure on AD Command's chips, WardrobeTalent's camera fallback) are real craft. But the shell wrapping all of it currently contradicts the project's own written design system on nearly every axis — palette, type, shadows, corners, nav shape — which is the single biggest problem here, ahead of any individual page's UX.

## What's Working

1. **My Set's per-role content map** (`getRoleContent` in MySet.tsx) — each of 8 roles gets specific, real production detail ("DSI patch blown out," "Arri SkyPanel S60," "32mm T2.0"), the strongest evidence of domain authorship in the app.
2. **WardrobeTalent's live camera capture with file-input fallback** — a genuinely useful, non-generic interaction built with real device-constraint awareness.
3. **AD Command's collapsed-by-default department chips** — a well-executed progressive-disclosure pattern that avoids a wall of text while keeping recency visible.

## Priority Issues

**[P0] The entire operational shell runs a different design system than the one documented.** `index.css`, `Layout.tsx`, and `ADCommand.tsx` use teal/gold/Playfair/box-shadow/bottom-tab-bar instead of DESIGN.md's Shingou Green/Zen Kaku Gothic/flat/240px-rail system; the detector's 10 scattered hex-drift findings across 4 more files are symptoms of the same root cause. *Why it matters:* the product fails its own "could this be any dashboard with labels swapped" test — right now, yes. *Fix:* revert `index.css` tokens to DESIGN.md's palette/type, replace `.card`'s shadow+radius with a hairline border at 3px, rebuild `Layout.tsx` as the fixed ink rail with the red left-rule active state. *Suggested command:* `/impeccable polish` (or `/impeccable document` first if the intent was actually to replace DESIGN.md, not revert to it).

**[P1] No confirmation on irreversible, high-stakes actions.** Script Supervisor's "No Good," AD's "Escalate," and Director's "Move On" fire instantly. *Why it matters:* a stressed user mis-tapping mid-take has no recovery path, undermining the product's own "recovery intelligence, not surveillance" promise. *Fix:* route these through the `AckButton` confirm pattern DESIGN.md already specifies. *Suggested command:* `/impeccable harden`.

**[P1] RoleSwitcher is the only way to see another department's view, and it's a cramped bottom-right pill.** `maxWidth:120`, ellipsis-truncated, no visible keyboard-close handling. *Why it matters:* the 1st AD demoing to a crew needs fast, confident role-hopping; the current control is easy to miss. *Fix:* promote it to a visible labeled control with Escape/outside-click dismissal. *Suggested command:* `/impeccable clarify`.

**[P2] AD Command's department feed sorts by recency only, not severity.** A blocked department from 10 minutes ago can rank below a "ready" update from 1 minute ago. *Why it matters:* the AD's whole job is spotting the blocker fastest; recency-only sort buries it. *Fix:* sort hold/blocked status first, recency within status. Also folds in the detector's one performance finding: Onboarding.tsx:111 animates `width` directly — switch to `transform: scaleX()` or a `grid-template-columns` transition. *Suggested command:* `/impeccable optimize`.

**[P3] Empty, loading, and error states are entirely absent.** No page shows zero-department-status, a failed import, or no current setup. *Fix:* add one empty-state treatment per page using the existing lamp/label pattern. *Suggested command:* `/impeccable harden`.

## Persona Red Flags

**Riley (stress tester):** During a live take failure, the cause chips and Print/Hold/No Good buttons carry the same visual weight as routine buttons elsewhere — under real time pressure there's no unmissable "this is the failure path" affordance beyond the banner text itself.

**Sam (accessibility-dependent):** No visible `:focus-visible` outline appears anywhere in the reviewed CSS or inline styles, despite DESIGN.md mandating a system-wide 2px signal-red focus ring; RoleSwitcher and the nav bar lean on color-only state cues.

**Casey (mobile):** Layout.tsx's bottom bar auto-hides after 3 seconds, meaning nav and RoleSwitcher vanish mid-task exactly when a user pauses to read a card — a bad fit for a gloved or rain-wet hand on set.

## Minor Observations

- `WardrobeTalent.tsx`'s photo-slot fallback (`#e5e2dc`) and camera overlay (`rgba(6,15,20,0.92)`) are hardcoded, not tokens.
- `TakeIntelligence.tsx`'s delay-breakdown bars are a plain `<div>` progress bar — a borderline case against the system's "every metric reads as a mono number" rule.
- Onboarding's zigzag card layout (`width:'88%'`, `marginLeft:'30%'`) is a fragile, hand-tuned asymmetric stack likely to break at odd viewport widths.

## Questions to Consider

1. Was the Andon Line system deliberately rolled back by the most recent "rebuild" commit, or did an import/merge silently clobber it — does anyone currently believe the app matches DESIGN.md?
2. If Signal Red is supposed to be the only color that means "stop," why does the live product ship four competing saturated colors at equal weight on the AD's most important screen?
3. Is "DSI Production / Lone Wolf S8E9" leftover fictional data from a prior iteration, out of sync with Harbor Unit / Episode 104 elsewhere — should the demo data be unified?
