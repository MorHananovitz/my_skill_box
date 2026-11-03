# creating-presentations

Designs an original slide deck and writes two files from one spec: a click-through HTML deck for review, and an editable PowerPoint (`.pptx`) with real text, shapes, tables, pictures, and native charts.

The agent interviews first, drafts an outline when you have not supplied one, then offers palettes, type pairs, and templates and waits for a choice. Ask for a presentation, slide deck, keynote, pitch, conference talk, or to turn an outline into slides.

```
create_presentation/
├── claude/creating-presentations/
└── cursor/creating-presentations/
```

The Claude copy adds `references/claude-code.md`. Claude Code follows that file for the skill path, the render command, and how `index.html` is opened. The interview, outline, design ticket, and spec are the same in both copies.

Install the inner `creating-presentations/` directory. Leave `claude/` and `cursor/` where they are. Run the commands from this folder. `$(pwd)` is this folder.

A symlink keeps this repo as the source of truth. A copy is a snapshot: later edits here do not show up until you copy again. Start a new Claude Code session and a new Cursor agent chat after installing.

## Claude Code

Every project:

```bash
mkdir -p ~/.claude/skills
ln -sfn "$(pwd)/claude/creating-presentations" ~/.claude/skills/creating-presentations
```

One project only. Run this from that project:

```bash
mkdir -p .claude/skills
ln -sfn "/path/to/create_presentation/claude/creating-presentations" .claude/skills/creating-presentations
```

Copy instead of linking:

```bash
mkdir -p ~/.claude/skills
cp -R claude/creating-presentations ~/.claude/skills/creating-presentations
```

## Cursor

Every project:

```bash
mkdir -p ~/.cursor/skills
ln -sfn "$(pwd)/cursor/creating-presentations" ~/.cursor/skills/creating-presentations
```

One project only. Run this from that project:

```bash
mkdir -p .cursor/skills
ln -sfn "/path/to/create_presentation/cursor/creating-presentations" .cursor/skills/creating-presentations
```

Copy instead of linking:

```bash
mkdir -p ~/.cursor/skills
cp -R cursor/creating-presentations ~/.cursor/skills/creating-presentations
```

Cursor's built-in skills live in `~/.cursor/skills-cursor/`. Install this skill under `~/.cursor/skills/` or `<project>/.cursor/skills/`.

## After install

The skill depends on Node.js and `pptxgenjs`. `node_modules/` is gitignored, so install it once inside the skill directory you just linked or copied:

```bash
cd ~/.claude/skills/creating-presentations   # or ~/.cursor/skills/creating-presentations
npm install
```

A symlink and a copy share this step. With a symlink, `npm install` writes `node_modules/` into this folder's skill copy.
