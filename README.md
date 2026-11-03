# Skills

Skills for Claude Code and Cursor. Each skill ships as two copies of the same workflow: one for Claude Code, one for Cursor. Install the copy that matches the tool you are using.

```
skills_folder/
└── create_presentation/
    ├── claude/creating-presentations/
    └── cursor/creating-presentations/
```

A new skill gets the same shape: `<skill>/claude/<skill-name>/` and `<skill>/cursor/<skill-name>/`, each with a `SKILL.md`. Copy or symlink the inner skill directory. Leave the `claude/` and `cursor/` folders where they are.

| Copy | Install into | Loads in |
|---|---|---|
| `claude/<skill-name>/` | `~/.claude/skills/<skill-name>/` or `<project>/.claude/skills/<skill-name>/` | Claude Code |
| `cursor/<skill-name>/` | `~/.cursor/skills/<skill-name>/` or `<project>/.cursor/skills/<skill-name>/` | Cursor |

`~/.claude/skills/` and `~/.cursor/skills/` make the skill available in every project. A project path (`.claude/skills/` or `.cursor/skills/` inside that project) limits it to that project and travels with the repo.

## Skills

| Skill | Install |
|---|---|
| [creating-presentations](create_presentation/README.md) | Slide decks as reviewable HTML and editable PowerPoint. Commands for Claude Code and Cursor are in that README. |

## Adding a skill

1. Create `<skill>/claude/<skill-name>/` and `<skill>/cursor/<skill-name>/`.
2. Put a `SKILL.md` in each, with `name` and `description` in the frontmatter. Keep the workflow the same. Put host-specific paths and commands in the Claude copy only.
3. Add a `README.md` in the skill folder with the install commands for both copies, plus any setup that skill needs (packages, CLIs, credentials).
4. Add a row to the table above.
