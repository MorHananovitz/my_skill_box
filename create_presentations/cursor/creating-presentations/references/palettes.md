# Palettes, type, and motifs

Suggest palettes, fonts, and templates. The user chooses each one. After they choose, record one palette, one type pair, one family, and one motif in `ticket`. Stay inside that ticket on every slide.

A technical talk does not use `chalk-cobalt`. A marketing talk may. There is no default palette, font, or template.

## Palettes

Each palette lists background, surface (cards), text, muted, line, accent, secondary, and three chart series. Text on the accent must stay readable; put accent behind short labels, not behind paragraphs.

### Dark

**plum-gold** — evening technical talks, research, ML.
- background `#1B171C` · surface `#29242B` · text `#F4EDF2` · muted `#A898A2` · line `rgba(244,237,242,0.14)`
- accent `#C08497` · secondary `#D6B36A`
- chart `#C08497` `#D6B36A` `#8E6B86`
- fits: technical, fluff

**ink-copper** — warm launches, narrative, product stories.
- background `#141210` · surface `#221E1A` · text `#F6F1E8` · muted `#B7AA9C` · line `rgba(246,241,232,0.14)`
- accent `#E08A4F` · secondary `#E7D7C1`
- chart `#E08A4F` `#E7D7C1` `#8C5A3C`
- fits: fluff, marketing, technical

**slate-citron** — systems, infrastructure, precise product talks.
- background `#12161A` · surface `#1C232A` · text `#E7EEF2` · muted `#93A3AD` · line `rgba(231,238,242,0.14)`
- accent `#D6E05C` · secondary `#8FB8C9`
- chart `#D6E05C` `#8FB8C9` `#6E8B3D`
- fits: technical

### Light

**paper-ink** — essays, keynotes, teaching.
- background `#F7F4EE` · surface `#FFFDF8` · text `#1C1916` · muted `#6F675F` · line `rgba(28,25,22,0.12)`
- accent `#C2412D` · secondary `#8A8175`
- chart `#C2412D` `#8A8175` `#2F5D50`
- fits: fluff, technical

**fog-pine** — daylight technical reviews, research readouts.
- background `#F3F5F4` · surface `#FFFFFF` · text `#14221C` · muted `#5C6B64` · line `rgba(20,34,28,0.12)`
- accent `#1F6B4A` · secondary `#C4A46A`
- chart `#1F6B4A` `#C4A46A` `#3D6F8A`
- fits: technical, fluff

**chalk-cobalt** — marketing, sales, launch.
- background `#F5F7FB` · surface `#FFFFFF` · text `#121826` · muted `#5C6578` · line `rgba(18,24,38,0.10)`
- accent `#1E4ED8` · secondary `#E26D5A`
- chart `#1E4ED8` `#E26D5A` `#1F6B4A`
- fits: marketing

## Fonts

Show all three pairs every time. "Use with" is a note about fit, not a filter. Use the HTML family in the browser file and the PowerPoint face in the `.pptx`. Do not invent a fourth pair for a single deck.

| id | Title | Body | Labels and code | Often fits | PowerPoint title / body / labels |
|---|---|---|---|---|---|
| `grotesque-mono` | Outfit | Outfit | IBM Plex Mono | technical | Avenir Next / Avenir Next / Menlo |
| `serif-sans` | Fraunces | Source Sans 3 | IBM Plex Mono | fluff | Georgia / Avenir Next / Menlo |
| `display-sans` | Syne | Manrope | IBM Plex Mono | marketing | Futura / Avenir Next / Menlo |

## Templates

Show all six every time. A template is the deck's composition. Slide jobs still pick archetypes inside it. The motif is part of the template.

| id | Arrangement | Motif |
|---|---|---|
| `editorial` | Left-aligned magazine page. A small kicker, then a title, then the content. | `hairline` |
| `manifesto` | Centered. Title, statement, quote, and close slides sit in the middle of the frame at a large size. | `corner-index` |
| `stage` | Two regions. A claim on one side and the proof, chart, or list on the other. | `accent-bar` |
| `dashboard` | Numbers and cards. Metrics and comparisons are the layout, with a short title above them. | `hairline` |
| `poster` | One dominant line or number. The rest of the slide stays quiet around it. | `corner-index` |
| `rail` | A large slide number in the left margin. Content starts to the right of it. | `numbered-rail` |

## Motifs

The template chooses the motif. It shows up in the same place and at the same weight on every slide. Mention it in the template line. Change it only if the user asks.

| id | What it is |
|---|---|
| `hairline` | A 1px rule under the title, inset to the content width |
| `accent-bar` | A full-height accent strip, 0.08in, on the left edge |
| `corner-index` | Slide number in mono, top right, accent color |
| `numbered-rail` | A large `01` in the left margin; content starts to the right of it |

`family: rail` forces `numbered-rail`. `family: manifesto` and `family: poster` center title, statement, quote, and close slides.

## What to offer

The suggestion has three lists. Do not shorten a list to a favorite.

| List | What to show |
|---|---|
| Palettes | Every palette that fits the mode |
| Fonts | `grotesque-mono`, `serif-sans`, `display-sans` |
| Templates | `editorial`, `manifesto`, `stage`, `dashboard`, `poster`, `rail` |

| Mode | Palettes |
|---|---|
| technical | `plum-gold`, `slate-citron`, `ink-copper`, `paper-ink`, `fog-pine` |
| fluff | `paper-ink`, `ink-copper`, `plum-gold`, `fog-pine` |
| marketing | `chalk-cobalt`, `ink-copper`, `paper-ink` |

Ready combinations come after those lists. Each one mixes a different palette, font, and template. A workshop or a table-heavy readout can be described next to `fog-pine` and `dashboard`. A launch story can be described next to `ink-copper` or `chalk-cobalt` and `poster`. Those notes are suggestions. The user picks.
