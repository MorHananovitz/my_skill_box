# Slide archetypes

Choose the archetype from the content. The deck uses several archetypes. In a deck of 6 or more slides, the same archetype does not occupy two slides in a row. A `section` slide may recur when a new chapter starts.

| Archetype | Use when the slide's job is | Avoid when |
|---|---|---|
| `title` | Open the deck: kicker, title, one-line promise | You are mid-argument |
| `section` | Name the next chapter | The "chapter" is really one bullet |
| `statement` | One sentence the room should remember | You have three peer points |
| `quote` | The words belong to a person | You are paraphrasing yourself |
| `bullets` | 3–5 peer points, each under 14 words | You have a sequence, a number, or a comparison |
| `split` | A claim on the left and support on the right | Both sides are the same kind of list |
| `comparison` | Two named alternatives | You have more than two columns |
| `metrics` | 2–4 numbers that are the point | The numbers need axes or a trend |
| `chart` | A trend, a composition, or ranked values | You have one isolated number (`metrics`) |
| `table` | Peer rows that must be compared cell by cell | You have fewer than 3 rows |
| `diagram` | A flow or a pipeline with named nodes | The picture is decorative |
| `code` | Exact code, a formula, or a config snippet | The snippet is longer than 12 lines |
| `close` | The last slide: one ask, one line | You still have evidence to show |

## Mode bias

Technical decks earn diagrams, tables, code, and charts. Titles stay at 36pt so labels fit. A technical slide may hold a chart plus a one-line reading (`note`).

Fluff decks earn `statement`, `quote`, `section`, and `title`. One idea occupies the slide. A chart appears only when a single comparison is the idea. Titles sit at 48pt.

Marketing decks earn `metrics`, `comparison`, `split`, and `close`. The claim is larger than the proof, and the proof is a number or a named result. Titles sit at 40pt. The close states the ask in one line.

## Density

The renderer rejects a slide that breaks these limits. Split the slide. Do not ask the renderer to shrink type.

- Margins 0.55in. Gap between blocks 0.22in.
- The content band stays inside the margins. Do not pin text to the edges, and do not leave a slide that is only a title floating in an empty field unless the archetype is `statement`, `quote`, `section`, or `poster`-family `title`.
- Bullets: 3–6 items. Each item: 14 words or fewer.
- Metrics: 2–4.
- Chart series: 1–3. Categories: 3–8.
- Table: at most 5 columns and 7 body rows.
- Diagram: 3–6 nodes.
- Code: at most 12 lines.
- Title: at most 90 characters. Statement and quote: at most 140 characters.

## Charts

`chart.type` is `bar`, `line`, or `donut`.

- One chart per slide.
- Single series omits the legend. Multi-series uses direct names in the legend, in the sans face.
- Bar charts are horizontal when labels are words, vertical when labels are time.
- Values sit at the end of bars or on line points. Donuts put the total or the lead share in the center.
- Axes use the muted color. Gridlines use `line`. The plot sits on the slide background.
- No 3D, no dual axis, no gradient fills, no icons inside the plot.
- The slide `title` says what the chart argues. The optional `note` states the reading in one line ("Latency drops after the cache ships").
- Colors come from the palette series, in order.

## Diagrams

Nodes are short labels (1–3 words). Edges are ordered pairs. The renderer lays out a single row up to 4 nodes and two rows after that, with arrow connectors. Do not add a node that is only decoration.

## Tables

Header row uses the surface color and the sans face at 14–16pt. Body text is at least 14pt. Highlight a cell by setting `emphasis` to a row index only when that row is the result. Leave `emphasis` unset when every row matters equally.
