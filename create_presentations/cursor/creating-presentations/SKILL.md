---
name: creating-presentations
description: >-
  Designs and builds original slide decks as reviewable HTML and editable
  PowerPoint, with charts, diagrams, infographics, photos, and layouts that
  change with the talk. Use when the user asks for a presentation, slide deck,
  keynote, pitch deck, conference talk, sales deck, slides, pptx, an HTML
  deck, infographic slides, or to turn a topic or outline into slides. Also
  use when they want photos, memes, or a designed visual on the slides.
icon: book-open
color: purple
---

# Creating presentations

Build a deck that looks designed for this talk. Two decks in a row do not share a palette, a type pair, and a composition. HTML is the review surface: effects, hover, and clickable controls live there. The `.pptx` is editable text, shapes, tables, pictures, links, and native charts, generated from the same spec. Save both files. Keep both.

**Core principle:** interview first, then the user picks the look. Each slide's job picks its layout. Density stays in a middle band: margins hold the frame, and the content fills the frame.

## Workflow

Copy this checklist and finish it in order:

```
- [ ] 1. Interview — ask what the presentation is, then wait
- [ ] 2. Outline — approve before rendering when the user has no slide list
- [ ] 3. Design ticket — offer the palettes, fonts, and templates, then wait
- [ ] 4. Write one numbered file per slide
- [ ] 5. Render the HTML
- [ ] 6. Convert that deck to pptx and save both in the same folder
- [ ] 7. Review the HTML, fix the spec, re-render both
```

### 1. Interview

If this conversation has not already answered the interview, send one message and wait. Do not offer palettes in that message. Do not render.

Ask only the lines that are still unknown:

1. What is the presentation for, and who is in the room?
2. What should they do or believe when you stop talking?
3. Is this a technical talk, fluff, or marketing?
4. How long is it — minutes, or a slide count?
5. What facts, numbers, names, or finished slides must appear?
6. Pictures: none, files you will supply, or should I look for photos? A meme only if you want one.

| Answer | Design bias |
|---|---|
| Technical | Strict grid, room for code, formulas, diagrams, and charts that state the number. Title 36pt. |
| Fluff | Larger type, one idea on the slide, quotation and section slides. Title 48pt. Still fills the frame. |
| Marketing | Claim, then proof (a metric or a named result), then a one-line ask on the close. Title 40pt. |

Read [references/palettes.md](references/palettes.md) before the design ticket. Read [references/archetypes.md](references/archetypes.md) before assigning layouts. Read [references/images.md](references/images.md) when they want a photo or a meme.

### 2. Outline

If the user already gave a slide-by-slide outline, use it. Preserve their wording when they asked for a restyle or supplied finished copy.

If they only gave a topic, draft the story first and stop:

- One sentence: what the audience should do or believe afterward.
- 8–14 slides, unless they named a count. Order: open, tension, argument, evidence, close.
- For each slide: the job of the slide, the archetype you expect, the words or data on it, and the picture slot if the interview allowed one (`bleed`, `card`, `portrait`, or none).

Wait for approval. Do not render.

### 3. Design ticket

Do not pick a palette, font, or template and continue. The suggestion is three lists. Wait for a palette, a font, and a template.

Read [references/palettes.md](references/palettes.md). Send one message with these headings, in this order:

**Palettes.** Every palette whose `fits` list includes this mode. For each: name, dark or light, background and accent, and one sentence on the kind of talk it suits. When the mode has both, the list contains dark and light palettes.

**Fonts.** All three type pairs, every time. For each: the id, the title font, the body font, and the mono font used for labels and code. Name the fonts a person would see (Outfit, Fraunces, Syne, and the PowerPoint faces), not only the id.

**Templates.** All six design templates, every time: editorial, manifesto, stage, dashboard, poster, and rail. For each: the name and how the slide is arranged. The motif travels with the template.

You may add up to three ready combinations after the lists. Each combination uses a different palette, a different font, and a different template, with at least one dark palette and one light palette when the mode allows both. A technical deck does not use `chalk-cobalt`.

You may say which combination fits this topic. That note is not a selection. Ask which palette, font, and template they want, and say the three lists can be mixed. Wait for the answer. Do not render.

If this conversation already produced a deck, leave that palette, font, and template out of the ready combinations.

### 4. Write the spec

Follow [references/deck-spec.md](references/deck-spec.md). [assets/example-deck.json](assets/example-deck.json) shows a valid shape. Do not reuse its ticket.

The editable deck lives in `slides/<slug>/presentation slides/`. One numbered file per slide. `deck.json` in that folder is only the title, mode, and ticket.

Assign archetypes from the slide's job:

- A number with no trend goes on `metrics`. A trend or ranking goes on `chart`.
- Two alternatives go on `comparison`. A pipeline goes on `diagram`.
- Exact code or a formula goes on `code`.
- Three to five peer points go on `bullets`. A sequence does not.
- A photo or meme goes on `title`, `section`, `split`, `quote`, or `close`, in the slot from [references/images.md](references/images.md). Search and save the file before you render, under `slides/<slug>/media/`.

In a deck of 6 or more slides, do not place the same archetype on two consecutive slides. A `section` slide may return when a new chapter starts.

Use at least three archetypes in any deck of 6 or more slides. Vary the composition inside the ticket. The ticket stays fixed so the deck still feels like one design.

`metrics`, `diagram`, `comparison`, `chart`, and `split` are the infographic slides. One focal object. The title says what that object argues. See [references/html-stage.md](references/html-stage.md).

### 5. Render the HTML

### 6. Convert to PowerPoint and save both

Run this once from the skill directory (the folder that contains this file's `package.json`). The command writes one file per slide, then the click-through HTML, then the PowerPoint:

```bash
npm install
node scripts/render-deck.mjs path/to/deck.json --out path/to/output-dir
```

Default output folder: `slides/<short-slug>/` in the current project. You must finish with:

- `slides/<short-slug>/presentation slides/01.json` and `01.html`, then `02`, and so on
- `slides/<short-slug>/presentation slides/deck.json` (title, mode, ticket)
- `slides/<short-slug>/presentation slides/generate.mjs`
- `slides/<short-slug>/index.html`
- `slides/<short-slug>/deck.pptx`

`01.html` is that slide alone. `01.json` is the copy for that slide. To change a slide, edit its numbered `.json`, then run:

```bash
node "slides/<short-slug>/presentation slides/generate.mjs"
```

That rewrites every numbered HTML file, `index.html`, and `deck.pptx`. Do not hand-edit `index.html`. Do not keep a second copy of the slide list in the output root. Tell the user the folder path, `generate.mjs`, and both final files. Pictures live in `slides/<short-slug>/media/`.

### 7. Review

Open `index.html` and check every slide. Read [references/html-stage.md](references/html-stage.md).

- One focal point. Type sits inside the margin. Nothing collides with the motif or a photograph.
- The slide is neither a wall of text nor a title floating in an empty field. `statement`, `quote`, and `section` are allowed to be spare.
- One slide is on screen. Clicking the slide advances. Previous and Next move one slide. The page does not scroll. Action buttons on the title or close go to the href you wrote.
- Cards, metrics, and diagram nodes read as designed objects: accent, shadow, and hover. Chart text is readable, series colors match the palette, and a single series has no legend.
- A photo has alt text and a credit. It sits in the slot you agreed. It does not cover the title.
- Technical wording, code, and numbers match the approved outline.

When the script reports a limit, split or cut content in the numbered slide file and run `generate.mjs` again.

Then look at the `.pptx`: text is still text, the table is a table, the chart is a native chart, a picture is a picture, and a button label is a hyperlink. Effects that PowerPoint cannot express stay in the HTML.

## Restyles

When the user asks to redesign an existing deck, keep every word, number, formula, label, and picture credit. Suggest palettes, fonts, and templates the same way as a new deck, and wait for a pick before changing the look. Do not add slides they did not ask for.

## Common mistakes

- Rendering before the interview, the outline (when they had none), and the palette, font, and template are confirmed.
- Offering one favorite palette instead of every palette that fits the mode.
- One left-title-plus-bullets layout on every slide.
- A chart that restates a single number, or a bullet list that hides a chart.
- A photo on a metrics, chart, table, or code slide.
- A meme they did not ask for, or a hotlinked image with no credit.
- Saving only the PowerPoint, or hand-editing `index.html` instead of the numbered slide file.
- Editing one giant slide list after `presentation slides/` exists.
- Shrinking type to force a crowded slide through the renderer.
- Rasterizing a slide into the PowerPoint file.
- Treating the first palette, font, or template in the reference as the deck's look.
