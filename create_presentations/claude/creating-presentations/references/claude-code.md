# Claude Code

Follow this file only in Claude Code. You are in Claude Code when `${CLAUDE_SKILL_DIR}` has been replaced with a real directory, or when this skill was loaded from `.claude/skills` or `~/.claude/skills`. In Cursor, ignore this file and follow `SKILL.md`.

The interview, the outline, the design ticket, the archetypes, and the spec do not change. Ask each of those in chat and stop. Do not render in the same turn. There is no form tool.

## Skill directory

`${CLAUDE_SKILL_DIR}` is the folder that contains `SKILL.md`, `package.json`, and `scripts/render-deck.mjs`. If that token is still literal, use the directory of the loaded `SKILL.md`.

The deck is written in the user's project, not inside the skill directory.

From the skill directory:

```bash
cd "${CLAUDE_SKILL_DIR}"
npm install
node scripts/render-deck.mjs "<project>/slides/<slug>/presentation slides/deck.json" --out "<project>/slides/<slug>"
```

That command replaces the render block in `SKILL.md`. The files it must leave are the same list: numbered `01.json` and `01.html`, `deck.json`, `generate.mjs`, `index.html`, and `deck.pptx`.

To change a slide, edit its numbered `.json`, then run:

```bash
node "<project>/slides/<slug>/presentation slides/generate.mjs"
```

## Tools

- Run commands with Bash.
- Read and write the numbered slide files with the file tools.
- Photos: WebSearch, then download the file with Bash into `slides/<slug>/media/`. Credit and placement stay as in [images.md](images.md). Do not hotlink.

## Review

Open the deck so a person can click it. macOS:

```bash
open "<project>/slides/<slug>/index.html"
```

Linux: `xdg-open`. Windows: `start`.

Check every slide against [html-stage.md](html-stage.md). When a browser or computer-use tool is available, click through: one slide on screen, a click advances, Previous and Next move one slide, and an action link does not advance. When you only read the HTML, say that you reviewed the source and opened the file, and which click checks you did not run.

Do not hand-edit `index.html`.
