# Deck spec

Write one JSON file. The renderer turns it into `index.html` and `deck.pptx`. Both outputs come from this file, so edit the spec and re-render. Do not hand-edit one output and leave the other behind.

```json
{
  "title": "Deck title",
  "mode": "technical",
  "ticket": {
    "palette": "<palette the user picked>",
    "family": "editorial",
    "typePair": "grotesque-mono",
    "motif": "hairline"
  },
  "slides": []
}
```

`mode` is `technical`, `fluff`, or `marketing`.

## Slide fields

Common optional fields: `kicker` (short mono label), `notes` (speaker notes; not drawn on the slide).

`image` is allowed on `title`, `section`, `quote`, `split`, and `close`. See [images.md](images.md). `actions` is one or two `{ "label", "href" }` buttons on `title` or `close`. Label is four words or fewer. The HTML stage draws the effects and the click-through controls (one slide, Previous, Next). Do not put those in the spec.

| Archetype | Required | Optional |
|---|---|---|
| `title` | `title` | `kicker`, `subtitle` |
| `section` | `title` | `kicker` |
| `statement` | `title` | `kicker` |
| `quote` | `title` | `attribution` |
| `bullets` | `title`, `items` (string array) | `kicker` |
| `split` | `title`, `body`, `asideTitle`, `aside` (string array) | `kicker` |
| `comparison` | `title`, `leftTitle`, `left`, `rightTitle`, `right` (string arrays) | `kicker` |
| `metrics` | `title`, `metrics` (`value`, `label`, optional `hint`) | `kicker` |
| `chart` | `title`, `chart` | `kicker`, `note` |
| `table` | `title`, `columns` (strings), `rows` (arrays of strings) | `kicker`, `emphasis` (row index) |
| `diagram` | `title`, `nodes` (`id`, `label`), `edges` (`from`, `to`) | `kicker` |
| `code` | `title`, `code` | `kicker`, `language` |
| `close` | `title` | `kicker`, `subtitle` |

### Chart object

```json
"chart": {
  "type": "bar",
  "orientation": "horizontal",
  "unit": "ms",
  "series": [
    { "name": "Before", "labels": ["Read", "Write"], "values": [42, 18] }
  ]
}
```

`orientation` is `horizontal` or `vertical` for `bar`. Ignore it for `line` and `donut`. Every series in a chart uses the same `labels` array.

## Render

From the skill directory (the folder that contains `package.json`):

```bash
npm install
node scripts/render-deck.mjs path/to/deck.json --out path/to/output-dir
```

The command writes `presentation slides/` first. Each slide is `01.json` plus `01.html`, then `02`, counting from 1. `deck.json` in that folder holds the title, mode, and ticket. `generate.mjs` in that folder reads the numbered JSON files in order and rewrites `index.html` and `deck.pptx` in the parent folder, plus each single-slide HTML file.

Edit a slide in its numbered `.json`. Then run `node "presentation slides/generate.mjs"` from the output folder's parent, or pass that script's path. Open `01.html` to see that slide alone. Open `index.html` to click through the deck. The PowerPoint file keeps text as text, tables as tables, charts as native charts, photos as pictures, and action labels as hyperlinks.

When the script prints a limit error, change the spec (split a slide, cut a bullet, move a number into `metrics`). Re-render. Do not bypass the limit by editing the script.

A complete technical example lives at [assets/example-deck.json](../assets/example-deck.json). Use it as a shape reference. Build a new ticket for each talk.
