# HTML stage

`index.html` is the designed deck. Each slide also has its own numbered file in `presentation slides/`. Edit `01.json` (and the next numbers), then run `generate.mjs`. That rewrites the single-slide HTML files, `index.html`, and `deck.pptx`. Do not keep a hand-edited `index.html` that the PowerPoint no longer matches.

## What the stage always draws

These are part of every deck. Do not remove them to simplify a slide.

- One slide on screen. The page does not scroll. Click the slide to advance. **Previous** and **Next** move one slide. Arrow keys and the space bar do the same. The slide scales to the window.
- Soft shadow under each slide, a wash of the accent color in the page background, and a lift on cards when the pointer is over them.
- Metric cards with an accent spine. Diagram nodes and bullet rows read as objects, not as a default list.
- Chart bars keep the palette series. No 3D chart, no second axis.

`actions` are real buttons. They belong on `title` or `close`, one or two:

```json
"actions": [
  { "label": "Read the note", "href": "https://example.com/note" }
]
```

The label is four words or fewer. In the HTML the button is a link, and a click on that link does not advance the deck. In the PowerPoint the same label is a shape with that hyperlink. Shadow and hover exist in the HTML. PowerPoint keeps text, tables, charts, pictures, and links.

## Infographic slides

Treat `metrics`, `diagram`, `comparison`, `chart`, and `split` as infographics. One focal object. A number is large. A flow is a row of nodes with connectors. A comparison is two cards, not two bullet columns pasted into a text box. The title states what the picture argues.

If the script prints a limit, split the slide in `deck.json`. Do not shrink type and do not bypass the limit in the script.
