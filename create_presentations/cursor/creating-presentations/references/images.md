# Pictures and memes

A picture earns a place on the slide, or it stays out. Ask during the interview. Do not add a photo the user did not agree to.

## Where a picture goes

| Slide job | Placement | What belongs there |
|---|---|---|
| `title`, `section` | `bleed` | One photograph on the right edge. The title stays in the left column. |
| `split` | `card` | The proof is a thing you can see: a product, a place, a screen. The card sits low on the right. |
| `quote` | `portrait` | A face, cropped square, next to the attribution. |
| `close` | `card` | Optional. A single object, never a crowd smiling at the camera. |
| `metrics`, `chart`, `table`, `code`, `diagram`, `bullets`, `comparison`, `statement` | none | The number, the flow, or the sentence is the picture. |

`image.placement` is `bleed`, `card`, or `portrait`. Omit it and the renderer uses the row above.

```json
"image": {
  "src": "media/hot-path.jpg",
  "alt": "Server rack in a dim aisle",
  "credit": "Photo: Ada Lovelace / Wikimedia Commons",
  "placement": "bleed"
}
```

`src` is relative to `deck.json`. `alt` is required. `credit` is required when the file came from the web.

## Where to look

1. A file the user already dropped in the project. Copy it to `slides/<slug>/media/`.
2. A search, when they asked you to find a photo. Use WebSearch, then download a file you can name and credit.
3. Sources to prefer, in this order: Wikimedia Commons, a photo the user licensed, Unsplash, Pexels.
4. Skip the file when the license is unclear, the page is a random image CDN, or the picture is a logo you do not have rights to. Say which slide has no picture and why.

Save the bytes under `slides/<slug>/media/`. Point `image.src` at that file. Do not hotlink. The renderer copies the file next to `index.html` and embeds it in the `.pptx`.

Search query shape: the concrete noun on that slide, plus `wikimedia` or `unsplash`. Open the result, confirm it shows the thing the slide is about, then download it.

## Memes

Use a meme only when the user asked for one.

- One meme in the deck. Mode is `fluff` or `marketing`.
- Put it on a `split` or `section` slide. The title says the point. The meme is the card or the bleed, not the argument.
- Credit the original poster or the archive you took it from.
- If you cannot find a file you are allowed to save, do not substitute a different joke. Leave the picture off and say so.

Do not search for a meme "to make it funnier" when they did not ask.
