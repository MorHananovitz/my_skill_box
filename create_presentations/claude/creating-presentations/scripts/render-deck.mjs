import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PptxGenJS from "pptxgenjs";

const W = 13.333;
const H = 7.5;
const M = 0.55;
const GAP = 0.22;
const CW = +(W - M * 2).toFixed(3);

const PALETTES = {
  "plum-gold": {
    background: "1B171C",
    surface: "29242B",
    text: "F4EDF2",
    muted: "A898A2",
    line: "F4EDF2",
    accent: "C08497",
    secondary: "D6B36A",
    chart: ["C08497", "D6B36A", "8E6B86"],
    onAccent: "1B171C",
  },
  "ink-copper": {
    background: "141210",
    surface: "221E1A",
    text: "F6F1E8",
    muted: "B7AA9C",
    line: "F6F1E8",
    accent: "E08A4F",
    secondary: "E7D7C1",
    chart: ["E08A4F", "E7D7C1", "8C5A3C"],
    onAccent: "141210",
  },
  "slate-citron": {
    background: "12161A",
    surface: "1C232A",
    text: "E7EEF2",
    muted: "93A3AD",
    line: "E7EEF2",
    accent: "D6E05C",
    secondary: "8FB8C9",
    chart: ["D6E05C", "8FB8C9", "6E8B3D"],
    onAccent: "12161A",
  },
  "paper-ink": {
    background: "F7F4EE",
    surface: "FFFDF8",
    text: "1C1916",
    muted: "6F675F",
    line: "1C1916",
    accent: "C2412D",
    secondary: "8A8175",
    chart: ["C2412D", "8A8175", "2F5D50"],
    onAccent: "FFFDF8",
  },
  "fog-pine": {
    background: "F3F5F4",
    surface: "FFFFFF",
    text: "14221C",
    muted: "5C6B64",
    line: "14221C",
    accent: "1F6B4A",
    secondary: "C4A46A",
    chart: ["1F6B4A", "C4A46A", "3D6F8A"],
    onAccent: "FFFFFF",
  },
  "chalk-cobalt": {
    background: "F5F7FB",
    surface: "FFFFFF",
    text: "121826",
    muted: "5C6578",
    line: "121826",
    accent: "1E4ED8",
    secondary: "E26D5A",
    chart: ["1E4ED8", "E26D5A", "1F6B4A"],
    onAccent: "FFFFFF",
  },
};

const TYPE = {
  "grotesque-mono": {
    htmlSans: "Outfit",
    htmlMono: "IBM Plex Mono",
    htmlDisplay: "Outfit",
    pptSans: "Avenir Next",
    pptMono: "Menlo",
    pptDisplay: "Avenir Next",
    google: "Outfit:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500",
  },
  "serif-sans": {
    htmlSans: "Source Sans 3",
    htmlMono: "IBM Plex Mono",
    htmlDisplay: "Fraunces",
    pptSans: "Avenir Next",
    pptMono: "Menlo",
    pptDisplay: "Georgia",
    google: "Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500",
  },
  "display-sans": {
    htmlSans: "Manrope",
    htmlMono: "IBM Plex Mono",
    htmlDisplay: "Syne",
    pptSans: "Avenir Next",
    pptMono: "Menlo",
    pptDisplay: "Futura",
    google: "Syne:wght@600;700&family=Manrope:wght@400;600&family=IBM+Plex+Mono:wght@400;500",
  },
};

const ARCHETYPES = new Set([
  "title",
  "section",
  "statement",
  "quote",
  "bullets",
  "split",
  "comparison",
  "metrics",
  "chart",
  "table",
  "diagram",
  "code",
  "close",
]);

function fail(message) {
  console.error(`limit: ${message}`);
  process.exit(1);
}

function words(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function cssHex(value) {
  return `#${value}`;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const outFlag = args.indexOf("--out");
  if (args.length < 1 || outFlag === -1 || !args[outFlag + 1]) {
    fail("usage: node scripts/render-deck.mjs path/to/deck.json --out path/to/output-dir");
  }
  return { specPath: path.resolve(args[0]), outDir: path.resolve(args[outFlag + 1]) };
}

function validate(deck) {
  if (!deck || typeof deck !== "object") fail("deck.json must be an object");
  if (!deck.title) fail("title is required");
  if (!["technical", "fluff", "marketing"].includes(deck.mode)) fail("mode must be technical, fluff, or marketing");
  const ticket = deck.ticket || {};
  if (!PALETTES[ticket.palette]) fail(`unknown palette ${ticket.palette}`);
  if (!TYPE[ticket.typePair]) fail(`unknown typePair ${ticket.typePair}`);
  if (!["editorial", "manifesto", "stage", "dashboard", "poster", "rail"].includes(ticket.family)) {
    fail(`unknown family ${ticket.family}`);
  }
  if (!["hairline", "accent-bar", "corner-index", "numbered-rail"].includes(ticket.motif)) {
    fail(`unknown motif ${ticket.motif}`);
  }
  if (ticket.family === "rail" && ticket.motif !== "numbered-rail") {
    fail("family rail requires motif numbered-rail");
  }
  if (deck.mode === "technical" && ticket.palette === "chalk-cobalt") {
    fail("a technical deck does not use chalk-cobalt");
  }
  if (!Array.isArray(deck.slides) || deck.slides.length === 0) fail("slides must be a non-empty array");

  let previous = null;
  deck.slides.forEach((slide, index) => {
    const n = index + 1;
    if (!ARCHETYPES.has(slide.archetype)) fail(`slide ${n}: unknown archetype ${slide.archetype}`);
    if (deck.slides.length >= 6 && slide.archetype === previous && slide.archetype !== "section") {
      fail(`slide ${n}: ${slide.archetype} follows the same archetype`);
    }
    previous = slide.archetype;
    if (!slide.title) fail(`slide ${n}: title is required`);
    const titleMax = slide.archetype === "statement" || slide.archetype === "quote" ? 140 : 90;
    if (slide.title.length > titleMax) fail(`slide ${n}: title is ${slide.title.length} characters (max ${titleMax})`);
    if (Array.isArray(slide.items)) checkItems(slide.items, n, "items");
    if (Array.isArray(slide.aside)) checkItems(slide.aside, n, "aside");
    if (Array.isArray(slide.left)) checkItems(slide.left, n, "left");
    if (Array.isArray(slide.right)) checkItems(slide.right, n, "right");
    if (slide.archetype === "bullets") {
      if (!slide.items || slide.items.length < 3 || slide.items.length > 6) fail(`slide ${n}: bullets need 3 to 6 items`);
    }
    if (slide.archetype === "split") {
      if (!slide.body || !slide.asideTitle || !slide.aside) fail(`slide ${n}: split needs body, asideTitle, and aside`);
      if (words(slide.body) > 40) fail(`slide ${n}: split body is longer than 40 words`);
      if (slide.aside.length < 3 || slide.aside.length > 5) fail(`slide ${n}: aside needs 3 to 5 items`);
    }
    if (slide.archetype === "comparison") {
      for (const key of ["leftTitle", "left", "rightTitle", "right"]) {
        if (!slide[key]) fail(`slide ${n}: comparison needs ${key}`);
      }
      if (slide.left.length < 3 || slide.right.length < 3) fail(`slide ${n}: comparison needs at least 3 points a side`);
    }
    if (slide.archetype === "metrics") {
      if (!slide.metrics || slide.metrics.length < 2 || slide.metrics.length > 4) fail(`slide ${n}: metrics need 2 to 4 numbers`);
    }
    if (slide.archetype === "table") {
      if (!slide.columns || !slide.rows) fail(`slide ${n}: table needs columns and rows`);
      if (slide.columns.length > 5) fail(`slide ${n}: table has more than 5 columns`);
      if (slide.rows.length < 3 || slide.rows.length > 7) fail(`slide ${n}: table needs 3 to 7 body rows`);
    }
    if (slide.archetype === "diagram") {
      if (!slide.nodes || slide.nodes.length < 3 || slide.nodes.length > 6) fail(`slide ${n}: diagram needs 3 to 6 nodes`);
      for (const node of slide.nodes) {
        if (words(node.label) > 3) fail(`slide ${n}: diagram label "${node.label}" is longer than 3 words`);
      }
    }
    if (slide.archetype === "code") {
      const lines = String(slide.code || "").split("\n");
      if (!slide.code) fail(`slide ${n}: code is required`);
      if (lines.length > 12) fail(`slide ${n}: code is ${lines.length} lines (max 12)`);
    }
    if (slide.archetype === "chart") {
      const chart = slide.chart;
      if (!chart || !["bar", "line", "donut"].includes(chart.type)) fail(`slide ${n}: chart.type must be bar, line, or donut`);
      if (!chart.series || chart.series.length < 1 || chart.series.length > 3) fail(`slide ${n}: chart needs 1 to 3 series`);
      const count = chart.series[0].labels.length;
      if (count < 3 || count > 8) fail(`slide ${n}: chart needs 3 to 8 categories`);
    }
    if (slide.image) {
      const photoOk = new Set(["title", "section", "quote", "split", "close"]);
      if (!photoOk.has(slide.archetype)) {
        fail(`slide ${n}: a photo belongs on title, section, quote, split, or close`);
      }
      if (!slide.image.src || !slide.image.alt) fail(`slide ${n}: image needs src and alt`);
      const placement = slide.image.placement;
      if (placement && !["bleed", "card", "portrait"].includes(placement)) {
        fail(`slide ${n}: image.placement must be bleed, card, or portrait`);
      }
    }
    if (slide.actions) {
      if (!["title", "close"].includes(slide.archetype)) fail(`slide ${n}: buttons belong on title or close`);
      if (!Array.isArray(slide.actions) || slide.actions.length < 1 || slide.actions.length > 2) {
        fail(`slide ${n}: use 1 or 2 actions`);
      }
      for (const action of slide.actions) {
        if (!action.label || !action.href) fail(`slide ${n}: each action needs label and href`);
        if (words(action.label) > 4) fail(`slide ${n}: button label is longer than 4 words`);
      }
    }
  });

  const used = new Set(deck.slides.map((slide) => slide.archetype));
  if (deck.slides.length >= 6 && used.size < 3) fail("a deck of 6 or more slides needs at least 3 archetypes");
}

function checkItems(items, n, label) {
  items.forEach((item, i) => {
    if (words(item) > 14) fail(`slide ${n}: ${label} ${i + 1} is ${words(item)} words (max 14)`);
  });
}

function contentLeft(ticket) {
  return ticket.motif === "numbered-rail" || ticket.family === "rail" ? 1.7 : M;
}

function contentWidth(ticket) {
  return +(W - contentLeft(ticket) - M).toFixed(3);
}

function titleSize(mode) {
  if (mode === "fluff") return 48;
  if (mode === "marketing") return 40;
  return 36;
}

function diagramRows(nodes) {
  if (nodes.length <= 4) return [nodes];
  const mid = Math.ceil(nodes.length / 2);
  return [nodes.slice(0, mid), nodes.slice(mid)];
}

function defaultPlacement(archetype) {
  if (archetype === "quote") return "portrait";
  if (archetype === "split" || archetype === "close") return "card";
  return "bleed";
}

function stageImages(deck, specDir, outDir) {
  const mediaDir = path.join(outDir, "media");
  for (const slide of deck.slides) {
    if (!slide.image?.src) continue;
    const abs = path.resolve(specDir, slide.image.src);
    if (!fs.existsSync(abs)) fail(`missing image ${slide.image.src}`);
    fs.mkdirSync(mediaDir, { recursive: true });
    const name = path.basename(abs);
    const dest = path.join(mediaDir, name);
    if (path.resolve(abs) !== path.resolve(dest)) fs.copyFileSync(abs, dest);
    slide.image.href = `media/${name}`;
    slide.image.abs = dest;
    if (!slide.image.placement) slide.image.placement = defaultPlacement(slide.archetype);
  }
}

function figure(slide) {
  if (!slide.image?.href) return "";
  const credit = slide.image.credit ? `<figcaption>${esc(slide.image.credit)}</figcaption>` : "";
  return `<figure class="photo photo-${esc(slide.image.placement)}"><img src="${esc(slide.image.href)}" alt="${esc(slide.image.alt)}" />${credit}</figure>`;
}

function actionRow(slide) {
  if (!slide.actions?.length) return "";
  const links = slide.actions
    .map((action) => `<a class="action" href="${esc(action.href)}">${esc(action.label)}</a>`)
    .join("");
  return `<div class="actions">${links}</div>`;
}

function highlight(code) {
  const keywords = new Set(["type", "function", "return", "try", "catch", "const", "let"]);
  const types = new Set(["Record", "Request", "Step", "Row", "string", "number"]);
  return esc(code).replace(/\b[A-Za-z]+\b/g, (word) => {
    if (keywords.has(word)) return `<span class="kw">${word}</span>`;
    if (types.has(word)) return `<span class="ty">${word}</span>`;
    return word;
  });
}

function renderHtml(deck, outFile) {
  const palette = PALETTES[deck.ticket.palette];
  const type = TYPE[deck.ticket.typePair];
  const size = titleSize(deck.mode);
  const centered = deck.ticket.family === "manifesto" ? "manifesto" : "";
  const fontHref = `https://fonts.googleapis.com/css2?family=${type.google}&display=swap`;
  const sections = deck.slides.map((slide, index) => {
    const body = renderSlideBody(slide, index, deck);
    const bleed = slide.image?.placement === "bleed" ? "has-bleed" : "";
    return `<section id="slide-${index + 1}" class="slide ${esc(slide.archetype)} ${centered} ${bleed} motif-${esc(deck.ticket.motif)}" data-n="${index + 1}">
        ${deck.ticket.motif === "accent-bar" ? `<span class="accent-bar"></span>` : ""}
        ${deck.ticket.motif === "numbered-rail" ? `<span class="rail">${String(index + 1).padStart(2, "0")}</span>` : ""}
        ${deck.ticket.motif === "corner-index" ? `<span class="corner">${String(index + 1).padStart(2, "0")}</span>` : ""}
        ${figure(slide)}
        <div class="frame">${body}</div>
      </section>`;
  });

  const css = `
    :root {
      --bg: ${cssHex(palette.background)};
      --surface: ${cssHex(palette.surface)};
      --text: ${cssHex(palette.text)};
      --muted: ${cssHex(palette.muted)};
      --line: ${cssHex(palette.line)}24;
      --accent: ${cssHex(palette.accent)};
      --secondary: ${cssHex(palette.secondary)};
      --sans: "${type.htmlSans}", "Avenir Next", sans-serif;
      --display: "${type.htmlDisplay}", "${type.htmlSans}", sans-serif;
      --mono: "${type.htmlMono}", Menlo, monospace;
      --title: ${size}pt;
      --on-accent: ${cssHex(palette.onAccent)};
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; overflow: hidden; }
    body {
      margin: 0; min-height: 100vh; color: var(--text); font-family: var(--sans);
      display: grid; place-items: center;
      background:
        radial-gradient(900px 420px at 8% -10%, color-mix(in srgb, var(--accent) 32%, transparent), transparent 70%),
        #0c0a0d;
    }
    .slide {
      display: none;
      width: 13.333in; height: 7.5in; margin: 0; position: relative;
      transform-origin: center center;
      cursor: pointer;
      background:
        radial-gradient(520px 280px at 100% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%),
        var(--bg);
      overflow: hidden; color: var(--text);
      box-shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
    }
    .slide.active { display: block; transform: scale(var(--fit, 1)); }
    .frame {
      height: 100%;
      padding: 0.55in;
      display: flex; flex-direction: column; gap: 0.22in;
    }
    .motif-numbered-rail .frame, .motif-accent-bar .frame { padding-left: 1.7in; }
    .kicker {
      margin: 0; font-family: var(--mono); font-size: 12pt; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--accent);
    }
    h2 {
      margin: 0; font-family: var(--display); font-size: var(--title); font-weight: 500;
      letter-spacing: -0.03em; line-height: 1.22;
    }
    .hairline { height: 1px; background: var(--accent); opacity: 0.85; }
    .subtitle { margin: 0; font-size: 20pt; line-height: 1.35; color: var(--muted); max-width: 10.5in; }
    .grow { flex: 1; display: flex; flex-direction: column; min-height: 0; }
    .center-copy { justify-content: center; gap: 0.16in; }
    .section h2, .statement h2, .quote h2 { font-size: 36pt; max-width: 11in; }
    .title .subtitle, .close .subtitle { margin-top: 0.08in; }
    .split-grid, .compare-grid { flex: 1; display: grid; gap: 0.22in; min-height: 0; }
    .split-grid { grid-template-columns: 1.3fr 0.9fr; }
    .compare-grid { grid-template-columns: 1fr 1fr; }
    .prose {
      margin: 0; font-size: 26pt; line-height: 1.3; display: flex; align-items: center;
    }
    .card, .node, .metric, pre, .plain li {
      background: var(--surface); border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .card:hover, .node:hover, .metric:hover, .plain li:hover {
      transform: translateY(-3px);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
    }
    .card { padding: 0.36in 0.38in; display: flex; flex-direction: column; gap: 0.2in; }
    .card h3 { margin: 0; font-size: 16pt; font-weight: 600; color: var(--secondary); }
    .card ul, .plain { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; flex: 1; }
    .card li, .plain li { font-size: 20pt; line-height: 1.3; }
    .card ul { justify-content: space-evenly; }
    .plain { flex: 1; justify-content: space-between; }
    .plain li {
      padding: 0.22in 0.28in;
      display: flex; align-items: center; gap: 0.18in;
    }
    .mark { color: var(--accent); font-family: var(--mono); font-size: 14pt; }
    .rows { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.28in; }
    .row { display: flex; align-items: center; justify-content: center; gap: 0.16in; }
    .node {
      flex: 1; min-height: 2.15in; display: flex; align-items: center; justify-content: center;
      text-align: center; padding: 0.18in; font-size: 20pt; font-weight: 500;
    }
    .node.sink { color: var(--secondary); }
    .arrow { width: 0.28in; height: 2px; background: var(--accent); position: relative; flex: 0 0 auto; }
    .arrow:after {
      content: ""; position: absolute; right: -1px; top: -4px;
      border-left: 7px solid var(--accent); border-top: 5px solid transparent; border-bottom: 5px solid transparent;
    }
    .down { align-self: center; width: 2px; height: 0.28in; background: var(--accent); position: relative; }
    pre {
      flex: 1; margin: 0; padding: 0.42in 0.48in; display: flex; align-items: center;
      font-family: var(--mono); font-size: 20pt; line-height: 1.55;
    }
    pre code { font: inherit; white-space: pre; }
    .kw { color: var(--secondary); }
    .ty { color: var(--accent); }
    table { width: 100%; height: 100%; border-collapse: collapse; flex: 1; }
    th, td { text-align: left; padding: 0.18in 0.24in; font-size: 18pt; border-bottom: 1px solid var(--line); vertical-align: middle; }
    th { font-size: 14pt; color: var(--muted); font-weight: 600; background: var(--surface); }
    tr.hot td { color: var(--secondary); }
    .metrics { flex: 1; display: grid; gap: 0.22in; }
    .metric {
      padding: 0.32in 0.32in 0.32in 0.42in; display: flex; flex-direction: column; justify-content: center;
      position: relative; overflow: hidden;
    }
    .metric:before {
      content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--accent);
    }
    .metric b { font-size: 42pt; font-weight: 500; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
    .metric span { color: var(--muted); font-size: 16pt; }
    .note { margin: 0; color: var(--muted); font-size: 14pt; }
    .accent-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 0.08in; background: var(--accent); }
    .rail, .corner { position: absolute; font-family: var(--mono); color: var(--accent); }
    .rail { left: 0.4in; top: 0.48in; font-size: 28pt; }
    .corner { right: 0.55in; top: 0.42in; font-size: 14pt; }
    .attribution { margin: 0; color: var(--muted); font-family: var(--mono); font-size: 14pt; }
    .chart { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.14in; }
    .bar-row { display: grid; grid-template-columns: 1.8in 1fr auto; gap: 0.16in; align-items: center; font-size: 14pt; }
    .track { height: 0.18in; background: var(--surface); border-radius: 99px; overflow: hidden; }
    .fill {
      height: 100%; background: linear-gradient(90deg, var(--accent), var(--secondary));
      box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
    }
    .photo { margin: 0; position: absolute; }
    .photo-bleed, .photo-card { overflow: hidden; }
    .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .photo-bleed { right: 0; top: 0; bottom: 0; width: 3.6in; box-shadow: -28px 0 48px rgba(0, 0, 0, 0.28); }
    .photo-card {
      right: 0.55in; bottom: 0.55in; width: 3.1in; height: 2.15in; border-radius: 16px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
      border: 1px solid color-mix(in srgb, var(--text) 18%, transparent);
    }
    .photo-portrait {
      width: 1.8in; height: auto; left: 0.55in; bottom: 0.4in;
      border-radius: 0; border: 0; box-shadow: none; text-align: center;
    }
    .photo-portrait img {
      width: 1.35in; height: 1.35in; margin: 0 auto; border-radius: 50%;
      border: 3px solid var(--accent);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
    }
    .motif-numbered-rail .photo-portrait, .motif-accent-bar .photo-portrait { left: 1.7in; }
    .has-bleed .frame { padding-right: 3.9in; }
    .photo figcaption {
      position: absolute; left: 0; right: 0; bottom: 0; margin: 0;
      padding: 18px 10px 8px; font-family: var(--mono); font-size: 10pt; color: #fff;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.62));
    }
    .photo-portrait figcaption {
      position: static; display: block; margin-top: 0.08in; padding: 0;
      background: none; color: var(--muted); text-align: center; width: 1.8in;
    }
    .actions { display: flex; gap: 0.16in; margin-top: 0.08in; }
    .action, .deck-nav button {
      appearance: none; border: 0; cursor: pointer; text-decoration: none;
      font-family: var(--mono); font-size: 12pt; letter-spacing: 0.04em;
      background: var(--accent); color: var(--on-accent);
      padding: 0.12in 0.22in; border-radius: 999px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    }
    .action:hover, .deck-nav button:hover { transform: translateY(-2px); }
    .deck-nav {
      position: fixed; z-index: 4; left: 50%; bottom: 18px; transform: translateX(-50%);
      display: flex; gap: 8px; padding: 8px; border-radius: 999px;
      background: color-mix(in srgb, #0c0a0d 72%, transparent);
      backdrop-filter: blur(10px);
    }
    .deck-nav span {
      align-self: center; padding: 0 0.12in; color: #f4edf2;
      font-family: var(--mono); font-size: 12pt;
    }
    .manifesto.title h2, .manifesto.statement h2, .manifesto.quote h2, .manifesto.close h2,
    .manifesto.section h2 { text-align: center; margin-left: auto; margin-right: auto; }
    .manifesto .subtitle, .manifesto .kicker, .manifesto .attribution { text-align: center; }
`;
  const nav = `<nav class="deck-nav" aria-label="Slides">
  <button type="button" id="prev">Previous</button>
  <span id="count"></span>
  <button type="button" id="next">Next</button>
</nav>
<script>
  const slides = [...document.querySelectorAll(".slide")];
  const SLIDE_W = 13.333 * 96;
  const SLIDE_H = 7.5 * 96;
  let index = 0;
  function fit() {
    const scale = Math.min((window.innerWidth - 32) / SLIDE_W, (window.innerHeight - 84) / SLIDE_H);
    document.documentElement.style.setProperty("--fit", String(Math.max(scale, 0.2)));
  }
  function show(next) {
    index = Math.max(0, Math.min(slides.length - 1, next));
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    document.getElementById("count").textContent = (index + 1) + " / " + slides.length;
  }
  document.getElementById("prev").addEventListener("click", () => show(index - 1));
  document.getElementById("next").addEventListener("click", () => show(index + 1));
  slides.forEach((slide) => {
    slide.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      show(index + 1);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); show(index + 1); }
    if (event.key === "ArrowLeft") show(index - 1);
  });
  window.addEventListener("wheel", (event) => event.preventDefault(), { passive: false });
  window.addEventListener("resize", fit);
  fit();
  show(0);
</script>`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(deck.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${fontHref}" rel="stylesheet" />
  <style>
${css}
  </style>
</head>
<body>
${sections.join("\n")}
${nav}
</body>
</html>`;
  fs.writeFileSync(outFile, html);
  return { css, sections, fontHref };
}

function renderSlideBody(slide, index, deck) {
  const kicker = slide.kicker ? `<p class="kicker">${esc(slide.kicker)}</p>` : "";
  const title = `<h2>${esc(slide.title)}</h2>`;
  const rule = deck.ticket.motif === "hairline" ? `<div class="hairline"></div>` : "";
  const head = `${kicker}${title}${rule}`;
  if (slide.archetype === "title" || slide.archetype === "close" || slide.archetype === "section" || slide.archetype === "statement" || slide.archetype === "quote") {
    const extra = slide.subtitle
      ? `<p class="subtitle">${esc(slide.subtitle)}</p>`
      : slide.attribution
        ? `<p class="attribution">${esc(slide.attribution)}</p>`
        : "";
    return `<div class="grow center-copy">${head}${extra}${actionRow(slide)}</div>`;
  }
  if (slide.archetype === "bullets") {
    const items = slide.items
      .map((item, i) => `<li><span class="mark">${String(i + 1).padStart(2, "0")}</span>${esc(item)}</li>`)
      .join("");
    return `${head}<ul class="plain">${items}</ul>`;
  }
  if (slide.archetype === "split") {
    return `${head}<div class="split-grid"><p class="prose">${esc(slide.body)}</p><aside class="card"><h3>${esc(slide.asideTitle)}</h3><ul>${slide.aside.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></aside></div>`;
  }
  if (slide.archetype === "comparison") {
    const col = (heading, items) =>
      `<article class="card"><h3>${esc(heading)}</h3><ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>`;
    return `${head}<div class="compare-grid">${col(slide.leftTitle, slide.left)}${col(slide.rightTitle, slide.right)}</div>`;
  }
  if (slide.archetype === "metrics") {
    const cols = slide.metrics.length;
    const cards = slide.metrics
      .map((metric) => `<article class="metric"><b>${esc(metric.value)}</b><span>${esc(metric.label)}</span></article>`)
      .join("");
    return `${head}<div class="metrics" style="grid-template-columns: repeat(${cols}, 1fr)">${cards}</div>`;
  }
  if (slide.archetype === "table") {
    const headCells = slide.columns.map((column) => `<th>${esc(column)}</th>`).join("");
    const body = slide.rows
      .map((row, i) => `<tr class="${slide.emphasis === i ? "hot" : ""}">${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
      .join("");
    return `${head}<table><thead><tr>${headCells}</tr></thead><tbody>${body}</tbody></table>`;
  }
  if (slide.archetype === "code") {
    return `${head}<pre><code>${highlight(slide.code)}</code></pre>`;
  }
  if (slide.archetype === "diagram") {
    const rows = diagramRows(slide.nodes);
    const last = slide.nodes[slide.nodes.length - 1].id;
    const htmlRows = rows
      .map((row, rowIndex) => {
        const cells = row
          .map((node, i) => {
            const arrow = i < row.length - 1 ? `<span class="arrow"></span>` : "";
            return `<div class="node ${node.id === last ? "sink" : ""}">${esc(node.label)}</div>${arrow}`;
          })
          .join("");
        const down = rowIndex < rows.length - 1 ? `<span class="down"></span>` : "";
        return `<div class="row">${cells}</div>${down}`;
      })
      .join("");
    return `${head}<div class="rows">${htmlRows}</div>`;
  }
  if (slide.archetype === "chart") {
    const series = slide.chart.series[0];
    const max = Math.max(...slide.chart.series.flatMap((item) => item.values));
    const rows = series.labels
      .map((label, i) => {
        const value = series.values[i];
        return `<div class="bar-row"><span>${esc(label)}</span><div class="track"><div class="fill" style="width:${(value / max) * 100}%"></div></div><span>${esc(value)}${slide.chart.unit ? ` ${esc(slide.chart.unit)}` : ""}</span></div>`;
      })
      .join("");
    const note = slide.note ? `<p class="note">${esc(slide.note)}</p>` : "";
    return `${head}<div class="chart">${rows}</div>${note}`;
  }
  return head;
}

function addHairline(slide, pptx, palette, x, y, w) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.01,
    fill: { color: palette.accent },
    line: { color: palette.accent, pt: 0 },
  });
}

async function renderPptx(deck, outFile) {
  const palette = PALETTES[deck.ticket.palette];
  const type = TYPE[deck.ticket.typePair];
  const size = titleSize(deck.mode);
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: W, height: H });
  pptx.layout = "WIDE";
  pptx.author = "Hayadata";
  pptx.title = deck.title;
  const x = contentLeft(deck.ticket);

  deck.slides.forEach((spec, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: palette.background };
    let width = contentWidth(deck.ticket);
    if (spec.image?.abs) {
      const placement = spec.image.placement;
      if (placement === "bleed") {
        slide.addImage({ path: spec.image.abs, x: W - 3.6, y: 0, w: 3.6, h: H });
        width = Math.min(width, +(W - 3.6 - x - 0.15).toFixed(3));
      } else if (placement === "portrait") {
        slide.addImage({ path: spec.image.abs, x, y: H - M - 1.35, w: 1.35, h: 1.35 });
      } else {
        slide.addImage({ path: spec.image.abs, x: W - M - 3.1, y: H - M - 2.15, w: 3.1, h: 2.15 });
      }
      if (spec.image.credit && placement !== "portrait") {
        const cap = placement === "bleed"
          ? { x: W - 3.45, y: H - 0.38, w: 3.3, h: 0.28 }
          : { x: W - M - 3.0, y: H - M - 0.36, w: 2.9, h: 0.26 };
        slide.addText(spec.image.credit, {
          ...cap,
          fontFace: type.pptMono, fontSize: 10, color: "FFFFFF", margin: 0,
        });
      }
    }
    if (spec.notes) slide.addNotes(spec.notes);
    if (deck.ticket.motif === "accent-bar") {
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.08, h: H,
        fill: { color: palette.accent },
        line: { color: palette.accent, pt: 0 },
      });
    }
    if (deck.ticket.motif === "numbered-rail") {
      slide.addText(String(index + 1).padStart(2, "0"), {
        x: 0.35, y: 0.48, w: 1.1, h: 0.5,
        fontFace: type.pptMono, fontSize: 28, color: palette.accent, margin: 0,
      });
    }
    if (deck.ticket.motif === "corner-index") {
      slide.addText(String(index + 1).padStart(2, "0"), {
        x: W - 1.3, y: 0.38, w: 0.7, h: 0.32,
        fontFace: type.pptMono, fontSize: 14, color: palette.accent, align: "right", margin: 0,
      });
    }
    const titleH = spec.title.length > 58 ? 1.15 : 0.72;
    const centered = ["title", "statement", "quote", "close", "section"].includes(spec.archetype);
    const cluster = (spec.kicker ? 0.34 : 0) + titleH + 0.2 + (spec.subtitle || spec.attribution ? 0.95 : 0);
    let cursor = centered ? Math.max(M, (H - cluster) / 2) : M;
    const align = deck.ticket.family === "manifesto" && centered ? "center" : "left";
    if (spec.kicker) {
      slide.addText(spec.kicker.toUpperCase(), {
        x, y: cursor, w: width, h: 0.3,
        fontFace: type.pptMono, fontSize: 12, color: palette.accent, margin: 0, align,
      });
      cursor += 0.34;
    }
    slide.addText(spec.title, {
      x, y: cursor, w: width, h: titleH,
      fontFace: type.pptDisplay, fontSize: size, color: palette.text, margin: 0,
      bold: false, align,
    });
    cursor += titleH + 0.08;
    if (deck.ticket.motif === "hairline") addHairline(slide, pptx, palette, x, cursor, width);
    cursor += 0.16;

    const bottom = H - M;
    const blockH = bottom - cursor;

    if ((spec.archetype === "title" || spec.archetype === "close") && spec.subtitle) {
      slide.addText(spec.subtitle, {
        x, y: cursor, w: width, h: 0.9,
        fontFace: type.pptSans, fontSize: 20, color: palette.muted, margin: 0, align,
      });
    }
    if (spec.archetype === "bullets") drawBullets(slide, spec, type, palette, x, cursor, width, blockH);
    if (spec.archetype === "split") drawSplit(slide, spec, type, palette, x, cursor, width, blockH);
    if (spec.archetype === "comparison") drawComparison(slide, spec, type, palette, x, cursor, width, blockH);
    if (spec.archetype === "code") {
      slide.addText(spec.code, {
        x, y: cursor, w: width, h: blockH,
        fontFace: type.pptMono, fontSize: 20, color: palette.text, margin: 18,
        fill: { color: palette.surface }, valign: "middle",
      });
    }
    if (spec.archetype === "table") drawTable(slide, spec, type, palette, x, cursor, width, blockH);
    if (spec.archetype === "diagram") drawDiagram(slide, pptx, spec, type, palette, x, cursor, width, blockH);
    if (spec.archetype === "metrics") drawMetrics(slide, spec, type, palette, x, cursor, width, blockH);
    if (spec.archetype === "chart") drawChart(slide, pptx, spec, palette, x, cursor, width, blockH);
    if (spec.archetype === "quote" && spec.attribution) {
      slide.addText(spec.attribution, {
        x, y: cursor, w: width, h: 0.4,
        fontFace: type.pptMono, fontSize: 14, color: palette.muted, margin: 0,
      });
    }
    if (spec.actions?.length) {
      spec.actions.forEach((action, i) => {
        slide.addText(action.label, {
          x: x + i * 2.5, y: H - 0.95, w: 2.3, h: 0.42,
          shape: "roundRect",
          fill: { color: palette.accent },
          color: palette.onAccent,
          fontFace: type.pptSans,
          fontSize: 14,
          align: "center",
          valign: "middle",
          hyperlink: { url: action.href },
        });
      });
    }
  });

  await pptx.writeFile({ fileName: outFile });
}

function drawBullets(slide, spec, type, palette, x, y, w, h) {
  const gap = 0.12;
  const rowH = (h - gap * (spec.items.length - 1)) / spec.items.length;
  spec.items.forEach((item, i) => {
    const top = y + i * (rowH + gap);
    slide.addShape("roundRect", {
      x, y: top, w, h: rowH,
      fill: { color: palette.surface },
      line: { color: palette.surface, pt: 0 },
      rectRadius: 0.08,
    });
    slide.addText(
      [
        { text: `${String(i + 1).padStart(2, "0")}   `, options: { fontFace: type.pptMono, color: palette.accent, fontSize: 14 } },
        { text: item, options: { fontFace: type.pptSans, color: palette.text, fontSize: 20 } },
      ],
      { x: x + 0.28, y: top, w: w - 0.5, h: rowH, margin: 0, valign: "middle" },
    );
  });
}

function drawSplit(slide, spec, type, palette, x, y, w, h) {
  const asideW = w * 0.4;
  const bodyW = w - asideW - GAP;
  slide.addText(spec.body, {
    x, y, w: bodyW, h,
    fontFace: type.pptSans, fontSize: 26, color: palette.text, margin: 0, valign: "middle",
  });
  slide.addShape("roundRect", {
    x: x + bodyW + GAP, y, w: asideW, h,
    fill: { color: palette.surface },
    line: { color: palette.surface, pt: 0 },
    rectRadius: 0.08,
  });
  slide.addText(
    [
      { text: spec.asideTitle, options: { breakLine: true, bold: true, color: palette.secondary, fontSize: 16 } },
      ...spec.aside.map((item) => ({ text: item, options: { breakLine: true, color: palette.text, fontSize: 16 } })),
    ],
    {
      x: x + bodyW + GAP + 0.28,
      y: y + 0.28,
      w: asideW - 0.5,
      h: h - 0.5,
      fontFace: type.pptSans,
      margin: 0,
      valign: "top",
      paraSpaceAfter: 12,
    },
  );
}

function drawComparison(slide, spec, type, palette, x, y, w, h) {
  const colW = (w - GAP) / 2;
  [ [spec.leftTitle, spec.left, x], [spec.rightTitle, spec.right, x + colW + GAP] ].forEach(([title, items, left]) => {
    slide.addShape("roundRect", {
      x: left, y, w: colW, h,
      fill: { color: palette.surface },
      line: { color: palette.surface, pt: 0 },
      rectRadius: 0.08,
    });
    slide.addText(title, {
      x: left + 0.28, y: y + 0.26, w: colW - 0.5, h: 0.4,
      fontFace: type.pptSans, fontSize: 16, color: palette.secondary, margin: 0, bold: true,
    });
    slide.addText(items.map((item) => item).join("\n\n"), {
      x: left + 0.28, y: y + 0.85, w: colW - 0.5, h: h - 1.15,
      fontFace: type.pptSans, fontSize: 18, color: palette.text, margin: 0, valign: "top",
    });
  });
}

function drawTable(slide, spec, type, palette, x, y, w, h) {
  const header = spec.columns.map((column) => ({
    text: column,
    options: { fill: { color: palette.surface }, color: palette.muted, fontFace: type.pptSans, fontSize: 14, bold: true, align: "left" },
  }));
  const rows = [
    header,
    ...spec.rows.map((row, rowIndex) => row.map((cell) => ({
      text: cell,
      options: {
        color: spec.emphasis === rowIndex ? palette.secondary : palette.text,
        fontFace: type.pptSans,
        fontSize: 15,
        align: "left",
        fill: { color: palette.background },
      },
    }))),
  ];
  slide.addTable(rows, {
    x, y, w, h,
    colW: spec.columns.map(() => w / spec.columns.length),
    border: [{ pt: 0 }, { pt: 0 }, { pt: 0.5, color: "3A343C" }, { pt: 0 }],
    fontFace: type.pptSans,
    color: palette.text,
    valign: "middle",
    rowH: h / (spec.rows.length + 1),
  });
}

function drawDiagram(slide, pptx, spec, type, palette, x, y, w, h) {
  const rows = diagramRows(spec.nodes);
  const rowH = rows.length > 1 ? 1.45 : 2.15;
  const gapY = 0.55;
  const totalH = rows.length * rowH + (rows.length - 1) * gapY;
  let top = y + Math.max(0, (h - totalH) / 2);
  const last = spec.nodes[spec.nodes.length - 1].id;
  rows.forEach((row, rowIndex) => {
    const arrowW = 0.32;
    const nodeW = (w - arrowW * (row.length - 1) - 0.08 * (row.length - 1)) / row.length;
    row.forEach((node, i) => {
      const left = x + i * (nodeW + arrowW);
      slide.addShape(pptx.ShapeType.roundRect, {
        x: left, y: top, w: nodeW - 0.08, h: rowH,
        fill: { color: palette.surface },
        line: { color: palette.surface, pt: 0 },
        rectRadius: 0.08,
      });
      slide.addText(node.label, {
        x: left, y: top, w: nodeW - 0.08, h: rowH,
        fontFace: type.pptSans, fontSize: 16, color: node.id === last ? palette.secondary : palette.text,
        align: "center", valign: "middle", margin: 0,
      });
      if (i < row.length - 1) {
        slide.addShape(pptx.ShapeType.rightArrow, {
          x: left + nodeW - 0.06, y: top + rowH / 2 - 0.08, w: arrowW, h: 0.16,
          fill: { color: palette.accent },
          line: { color: palette.accent, pt: 0 },
        });
      }
    });
    if (rowIndex < rows.length - 1) {
      slide.addShape(pptx.ShapeType.downArrow, {
        x: x + w / 2 - 0.1, y: top + rowH + 0.08, w: 0.2, h: 0.36,
        fill: { color: palette.accent },
        line: { color: palette.accent, pt: 0 },
      });
    }
    top += rowH + gapY;
  });
}

function drawMetrics(slide, spec, type, palette, x, y, w, h) {
  const colW = (w - GAP * (spec.metrics.length - 1)) / spec.metrics.length;
  spec.metrics.forEach((metric, i) => {
    const left = x + i * (colW + GAP);
    slide.addShape("roundRect", {
      x: left, y, w: colW, h,
      fill: { color: palette.surface },
      line: { color: palette.surface, pt: 0 },
      rectRadius: 0.08,
    });
    slide.addText(metric.value, {
      x: left + 0.24, y: y + 0.4, w: colW - 0.4, h: 0.9,
      fontFace: type.pptDisplay, fontSize: 40, color: palette.text, margin: 0,
    });
    slide.addText(metric.label, {
      x: left + 0.24, y: y + 1.4, w: colW - 0.4, h: 0.6,
      fontFace: type.pptSans, fontSize: 16, color: palette.muted, margin: 0,
    });
  });
}

function drawChart(slide, pptx, spec, palette, x, y, w, h) {
  const chart = spec.chart;
  const type = chart.type === "line" ? pptx.ChartType.line : chart.type === "donut" ? pptx.ChartType.doughnut : pptx.ChartType.bar;
  slide.addChart(type, chart.series, {
    x, y, w, h: spec.note ? h - 0.4 : h,
    barDir: chart.orientation === "vertical" ? "col" : "bar",
    showValue: true,
    showLegend: chart.series.length > 1,
    legendPos: "b",
    chartColors: palette.chart.slice(0, chart.series.length),
    chartDataBorder: { pt: 0, color: palette.background },
    catAxisLabelColor: palette.muted,
    valAxisLabelColor: palette.muted,
    catAxisLabelFontSize: 12,
    valAxisLabelFontSize: 12,
    chartArea: { fill: { color: palette.background } },
    plotArea: { fill: { color: palette.background } },
    showValue: true,
    dataBorder: { pt: 0, color: palette.background },
  });
  if (spec.note) {
    slide.addText(spec.note, {
      x, y: y + h - 0.34, w, h: 0.3,
      fontSize: 14, color: palette.muted, fontFace: "Avenir Next", margin: 0,
    });
  }
}

function slideNumber(index, count) {
  return String(index + 1).padStart(Math.max(2, String(count).length), "0");
}

function writePresentationSlides(deck, outDir, parts) {
  const folder = path.join(outDir, "presentation slides");
  fs.mkdirSync(folder, { recursive: true });
  for (const name of fs.readdirSync(folder)) {
    if (/^\d+\.(json|html)$/.test(name)) fs.unlinkSync(path.join(folder, name));
  }
  const head = { title: deck.title, mode: deck.mode, ticket: deck.ticket };
  fs.writeFileSync(path.join(folder, "deck.json"), `${JSON.stringify(head, null, 2)}\n`);
  deck.slides.forEach((slide, index) => {
    const n = slideNumber(index, deck.slides.length);
    const source = structuredClone(slide);
    if (source.image) {
      delete source.image.href;
      if (source.image.abs) {
        source.image.src = path.relative(folder, source.image.abs);
        delete source.image.abs;
      }
    }
    fs.writeFileSync(path.join(folder, `${n}.json`), `${JSON.stringify(source, null, 2)}\n`);
    const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(n)} ${esc(slide.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${parts.fontHref}" rel="stylesheet" />
  <style>
${parts.css}
  </style>
</head>
<body>
<!-- Slide ${n} of ${deck.slides.length}. Edit ${n}.json, then run: node generate.mjs -->
${parts.sections[index]}
<script>
  const SLIDE_W = 13.333 * 96;
  const SLIDE_H = 7.5 * 96;
  function fit() {
    const scale = Math.min((window.innerWidth - 32) / SLIDE_W, (window.innerHeight - 32) / SLIDE_H);
    document.documentElement.style.setProperty("--fit", String(Math.max(scale, 0.2)));
  }
  window.addEventListener("resize", fit);
  fit();
  document.querySelector(".slide").classList.add("active");
</script>
</body>
</html>`;
    fs.writeFileSync(path.join(folder, `${n}.html`), page);
  });
  const skillDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const generate = `import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Rebuild index.html and deck.pptx from the numbered slide files in this folder.
const here = path.dirname(fileURLToPath(import.meta.url));
const skill = ${JSON.stringify(skillDir)};
const head = JSON.parse(fs.readFileSync(path.join(here, "deck.json"), "utf8"));
const slides = fs.readdirSync(here)
  .filter((name) => /^\\d+\\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(here, name), "utf8")));
const spec = path.join(here, ".assembled.json");
fs.writeFileSync(spec, JSON.stringify({ ...head, slides }));
const out = path.resolve(here, "..");
let status = 1;
try {
  const result = spawnSync(process.execPath, [path.join(skill, "scripts/render-deck.mjs"), spec, "--out", out], { stdio: "inherit" });
  status = result.status ?? 1;
} finally {
  fs.rmSync(spec, { force: true });
}
process.exit(status);
`;
  fs.writeFileSync(path.join(folder, "generate.mjs"), generate);
  return folder;
}

const { specPath, outDir } = parseArgs(process.argv);
const deck = JSON.parse(fs.readFileSync(specPath, "utf8"));
validate(deck);
fs.mkdirSync(outDir, { recursive: true });
stageImages(deck, path.dirname(specPath), outDir);
const htmlPath = path.join(outDir, "index.html");
const pptxPath = path.join(outDir, "deck.pptx");
const parts = renderHtml(deck, htmlPath);
const slideFolder = writePresentationSlides(deck, outDir, parts);
await renderPptx(deck, pptxPath);
console.log(`wrote ${htmlPath}`);
console.log(`wrote ${pptxPath}`);
console.log(`wrote ${slideFolder}`);
console.log(`${deck.slides.length} slides`);
