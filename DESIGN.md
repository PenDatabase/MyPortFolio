# David Eneasato: design contract (v5, "Sheet & index")

User: v4 looked too much like the single reference. v5 blends three sources so none dominates, held
together by the user's palette. Style library: Swiss design (3) as the primary, Editorial (8) as the
accent, with one kinetic moment (17).

| Source | What we take | Where |
|---|---|---|
| rauno.me (Swiss interaction design) | A white sheet on a quiet canvas; staggered-indent grotesk statement; one bold geometric shape cutting through the type; a ruler of ticks as navigation; work as slides | Hero, top ruler, work strip |
| paco.me (quiet index) | Three text columns (Building / Projects / Writing) that make the whole site scannable in one look; a short "Now" note | Index section |
| abrahamadelodun.com (editorial warmth) | Grid-paper canvas, a serif italic voice for the one word that changes, "Say hello." close | Canvas, cycling word, contact |

## What is only David's
- The disc is Freezing Blue and follows the pointer slowly; text under it turns white (two clipped
  copies of the headline, no blend modes).
- The first slide is the live system model: break a service, watch the Telegram alert and recovery.
- ⌘K palette (glass) and the ruler both navigate; the ruler shows where you are as you scroll.

## Colour
Ghost White `#FCFBFD` sheet; canvas `#EFF1F3` with a 32px grid at 5%; ink `#26282C`; Cool Gray
`#3E4044`; muted `#6B6E73`; Freezing Blue `#074864`; abyss `#03283A`; ice `#9FC7D6`.

## Type
Switzer 400/500 for the statement and UI (grotesk, Swiss). Gambetta italic only for the cycling word
and the "Now" voice. Statement clamp(40px, 6vw, 88px) / 1.04, -0.035em, staggered indents of 1.1em.

## Shape and motion
Sheet radius 4px, slides 12px, pills 999px. Disc: spring follow (lerp 0.08), parked under reduced
motion. Ruler ticks fill as you scroll. Slides use native scroll-snap; buttons and arrow keys move
one slide. Easing out `cubic-bezier(0.23,1,0.32,1)`.

## v6 additions (clear navigation, sweet colour)
- Nav: labelled links (Overview, Projects, Experience, Numbers, Notes, Contact) with a Freezing Blue pill on
  the section you're reading, and a blue-to-peach progress line along the bar's bottom edge.
- Every section opens with SectionHead: a coloured dot, the same name as its nav link, and one line on what
  the section is for and how to use it.
- Sweet accents: Peach `#F4AE96` (small hero disc, Numbers figures, dots), Peach soft `#FDE9E1` (Now note,
  Contact panel), Sky `#E2EEF3` (Experience panel). Numbers is the one Freezing Blue band.
  Text colours on tints: `#9C4F37` on peach soft, `#33697E` on paper (both pass 4.5:1).

## v7 palette (user's second swatch set replaces peach and sky)
- Cyan Navy `#0C2743`: Numbers band, active nav pill, buttons, focus ring, link hover text.
- Neon Pear `#D4F604`: fills only (hero disc, Numbers figures on navy, dots, the key on the Ctrl K button,
  link hover highlight, copied flash). Never text on a light ground (1.3:1 on white).
- Pear soft `#F5FBD2` (Now note, Contact panel), Navy soft `#E8ECF3` (Experience panel).
