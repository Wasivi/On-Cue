# Wardrobe Department SOP — Episode Workflow & Shoot Day

For: On-Cue (Harbor Unit demo). Plain language — this is written for cast/crew readers, not engineers.

---

## 1. The one idea everything hangs on: the story day

Episodes are broadcast units. Wardrobe does not think in episodes — it thinks in **story days**.

- A story day is a day inside the story the audience is watching, not a day of filming.
- Same story day = same clothes (with whatever happened to them: rain, blood, torn sleeve).
- When Episode 1 ends mid-story-day and Episode 2 picks up that same day, Episode 2's opening scenes reuse Episode 1's final looks, damage and all.
- Story days are agreed between the costume designer, the director, and the script supervisor before anything is built.

**Rule of thumb: label every look "Character – Story Day – Change #." Never "blue coat."**

That rule of thumb is literal, not just a naming convention: color is a structured field on every change (`items[].color` in the data model below), not buried in a free-text description. The script dictates the character; the character dictates the costume; the costume's color and silhouette are part of how the audience reads that character on screen. Lighting needs that color before the scene, not guessed off a monitor — see Section 7.

---

## 2. Before the episode: the costume plot

Per episode, the wardrobe department produces a **costume plot** — one grid per character, one row per change:

| Field | What it holds | Example |
|---|---|---|
| Character | Who wears it | Detective Vale |
| Change # | One complete look; numbered across the season, not per episode | Change 4 |
| Story day | Which story day(s) it covers | Story Night 4 |
| Episodes | Where it first appears + any episodes it carries into | Ep 1; carries into Ep 2 |
| Scenes | Scene numbers it's worn in | Ep 1: 38–42; Ep 2: 12–15 |
| Items | The pieces, each with its own color and fabric | Olive trench (wool blend), cream shirt (cotton), dark denim, brown belt, black boots |
| Multiples | How many identical copies exist, and why | 3 (dry / damp / soaked) |
| Hazards | What happens to it | Rain tower, mud fall |
| Why | The story reason this character is in this look — not just logistics | "Vale's been in the field since Ep1 — the coat has to look like it never came off" |
| Continuity photos | Actor photographed front & back in this change | VALE-CH4-front.jpg / back.jpg |

The **Why** row is not decoration. A director mid-shoot can always say "I don't love this costume — how many scenes are we even using it in? Let's scrap it." Two things have to be instantly available when that happens, not reconstructed by hand:

1. **The reasoning** that got the look approved in the first place — what it's doing for the character, not just what it's made of.
2. **The exact usage count** — how many scenes, how many episodes. In the app this is a lookup (`costume_change_usage`), not a costume designer re-reading the whole plot under time pressure.

How the plot gets built — three passes through the script:

1. **Characters & changes** — list every character with a body in frame, count each one's distinct changes.
2. **Story days** — map which scenes happen on the same story day (that's what makes a change span scenes, and episodes).
3. **Actions & hazards** — flag everything that wets, bloodies, tears, or stunt-wears a garment. Every hazard means multiples.

---

## 3. Fittings (before shooting)

- Each change is fitted on the actor, adjusted, and photographed (front and back) once approved.
- Fitting status per change: fitted / pending / issue. An "issue" must reach the 1st AD's board before the scene is scheduled.

---

## 4. The night before: the costume bible

- The shooting schedule (from the AD department) says which scenes shoot tomorrow.
- Wardrobe pulls every change those scenes need and checks it against the plot — this is the costume bible: what is needed on which shooting day, and whether it must be on the costume truck.
- For carry-over looks (a story day continuing from a previous episode), the previous episode's final-state photos are pulled: the look is prepped in its damaged state, not its clean state.

---

## 5. Shoot day (wardrobe's timeline)

| Time | What wardrobe is doing |
|---|---|
| Crew call | Set the costume truck; stage today's changes; steam, prep, check multiples |
| Actor dress | Dress each actor in the change for the first scene (with the right multiple — damp level, blood level) |
| First shot | Wardrobe standby near set with a reset kit for the current change |
| Between takes | Reset the look to its scene-start state: swap in a clean multiple, re-position the jacket, re-roll the cuff exactly as photographed |
| After "print" | Shoot or confirm continuity photos for the printed take (front/back, plus damage state) |
| Scene wraps | Confirm the next scene's change; pre-stage the next multiple |
| Wrap | End-of-day photos of every look in its final state; log what state each multiple is in; notes for tomorrow and for the next episode's carry-over |

Wardrobe's go/no-go contribution to the set: an actor is not "ready" if they are in the wrong change, the wrong multiple, or a look that doesn't match its continuity photos.

---

## 6. The chart: how it all connects

```
SCRIPT (Ep 2)
   │
   ▼
COSTUME BREAKDOWN ──(3 passes: changes / story days / hazards)──▶ COSTUME PLOT (+ why, + usage)
   │                                                                │
   │                                       story day continues from Ep 1?
   │                                                  ┌───────────────┴───────────────┐
   │                                                 YES: carry over look        NO: new change
   │                                                  (keep damage state)          (fitting, photos)
   │                                                  └───────────────┬───────────────┘
   ▼                                                                  ▼
FITTINGS ──▶ continuity photos (front/back per change) ──▶ SHOOTING SCHEDULE (AD dept)
                                                                     │
                                                                     ▼
                                              COSTUME BIBLE (what's needed each shooting day)
                                                                     │
                                                                     ▼
SHOOT DAY: dress ──▶ standby ──▶ reset between takes ──▶ print photos ──▶ end-state photos
                                                                     │
                                                                     ▼
                                              final-state photos feed the NEXT episode's carry-over
```

---

## 7. Deep at home, narrow abroad — who sees what, and why

GOVERNANCE-MODEL.md §2 ("Authority Stays Scoped. Awareness Does Not.") already sets the rule for *decisions*: each department owns its own state changes, but every status change broadcasts to everyone. Wardrobe depth is the same rule applied to *how much detail* a read gets, stated the way it came up in practice:

> It's true the lighting guy doesn't need to know everything about the wardrobe. But when you're in the wardrobe, the wardrobe person has to know everything about the wardrobe. And when you're in the truck with the lighting man, the lighting guy has to know everything about the lighting.

Concretely:

- **Inside Wardrobe, depth is total.** The Wardrobe Supervisor sees every field on every costume change: all items with color and fabric, multiples and their states, hazards, continuity notes, fitting status, and the story reasoning behind the look. The 1st AD, Director, and Script Supervisor also see this full depth — continuity is already their business on a real set (GOVERNANCE-MODEL.md §5).
- **Outside Wardrobe, visibility is a narrow, purpose-built slice — not the whole record.** Lighting does not get a seat at the costume plot. Lighting gets color: which colors are in frame for a given scene, and nothing else — no fabric, no hazards, no continuity notes, no story reasoning. That slice is `scene_color_palette`, a database view that shows only the scene, the character, the item, and its color.
- **This generalizes past Wardrobe.** Any department can need a narrow slice of another's depth without earning full access to it — e.g. Camera doesn't need Sound's mic notes, but might need "where's the boom" as its own narrow view. Build one of these only when a real need shows up, the same discipline BUILD_SPEC.md already applies to Anchor Browser.

### What this means for On-Cue (the app mapping)

- **A costume change keys on character + change number + story day**, not scene. Scene is where a look is *worn*; story day is why it *repeats*.
- Every change carries: structured items (name, color, fabric, type), multiples count and state, hazards, current multiple in use, continuity photos (front/back + damage state), and the story reasoning behind the look.
- A carry-over flag links a change to the earlier episode it continues from, with the final-state photos attached.
- Usage — "how many scenes, how many episodes" — is a lookup (`costume_change_usage`), answerable the moment a director asks, not a manual recount.
- Wardrobe's day view is the timeline in Section 5 — dress, standby, reset, photo, wrap tasks with times and actors.
- Wardrobe's "ready" status on AD Command means: right change, right multiple, matches photos.
- Color reaches Lighting/DP through `scene_color_palette` only — never the full costume-change record.

## Sources

- [Lowerated — Costume Breakdown: Script to Fittings](https://www.lowerated.com/post/costume-breakdown)
- [filmmakergenius — Costume Breakdown: Building a Costume Plot](https://filmmakergenius.com/academy/costume-design-for-film/costume-breakdown)
- [Blauw Films — Inside the Costume and Wardrobe Department](https://www.blauwfilms.com/research/navigating-the-costume-department-dynamics)
- [Filmustage — Props, Costumes & Locations in Script Breakdown](https://filmustage.com/blog/how-to-identify-props-costumes-and-locations-in-a-script-breakdown/)
- [Frank Beddor — continuity photos on "Wicked"](https://frankbeddor.com/whos-in-charge-of-the-chaos-of-wicked-the-movie/)
- [Storiara — Continuity in film production](https://storiara.com/glossary/continuity)
- [Screen Ireland — Costume Department booklet](https://www.screenireland.ie/images/uploads/general/Booklet_5_-_Costume_Department_2024.pdf)
