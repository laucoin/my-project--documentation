# AGENTS.md — AI Instructions for My Project Documentation

This file is the single source of truth for AI agents working on this repository.
It is read by Claude Code, OpenAI Codex, Gemini CLI, and any other agent that honours `AGENTS.md`.
GitHub Copilot is pointed here via `.github/copilot-instructions.md`.

---

## Project Overview

This is a **VitePress documentation site** for a group care management system for minors
(Scouts et Guides de France — SGDF).

**Tech Stack**:

- VitePress
- Vue
- Mermaid
- pnpm
- Node.js

---

## Repository Structure

```
documentation/
├── functional/
│   ├── index.md
│   ├── business-objects/      # One file per domain entity
│   │   └── <module>/<entity>.md
│   └── features/              # One file per feature
│       └── <verb>-<entity>.md
├── technical/
│   └── index.md
├── public/                    # Static assets
├── .vitepress/
│   └── config.mts             # Sidebar, navbar, Mermaid renderer
├── index.md                   # Home page
├── glossary.md                # Defined terms and concepts
└── package.json
```

### Content Sections

- **Functional** (`/functional`) — Business objects and features from an end-user perspective.
- **Technical** (`/technical`) — Architecture, ADRs, APIs, integration details.
- **Glossary** — Canonical term definitions shared across the docs.

---

## Frontmatter

Every `.md` file in `functional/` **must** contain a YAML frontmatter block.
Use these fields to decide which files are relevant before answering a question or making a change.

### Fields

| Field              | Description                                                                                        |
|--------------------|----------------------------------------------------------------------------------------------------|
| `type`             | `business-object` for entity files, `reference` for cross-cutting files                            |
| `modules`          | Modules that own this object (list: `core`, `operations`, `preparation`, `registration`)           |
| `scope`            | Direct parent entity or entities (e.g. `project`, `organization`, `[movement, alert]`)             |
| `object_name`      | Canonical name of the entity                                                                       |
| `required_options` | Option that must be enabled on the project for this object to exist. Empty means always available. |
| `tags`             | Cross-cutting keywords shared across files (see tag index below)                                   |
| `created`          | Creation date (ISO 8601)                                                                           |
| `last_update`      | Last modification date (ISO 8601)                                                                  |

### Tag Index

| Tag                    | Files concerned                                                                       |
|------------------------|---------------------------------------------------------------------------------------|
| `options`              | `options.md`, `group.md`, `activity.md`, `vehicle.md`, `alert.md`, `communication.md` |
| `roles`, `permissions` | `roles.md`, `profile.md`, `user.md`                                                   |
| `data`, `privacy`      | `data-policy.md`, `user.md`, `participant.md`                                         |

### Navigation Rules

- **Question about a specific entity** → read the file where `object_name` matches.
- **Question about an optional feature** → also read `options.md` (tag: `options`).
- **Question about access or permissions** → also read `roles.md` (tags: `roles`, `permissions`).
- **Question about data retention or GDPR** → also read `data-policy.md` (tags: `data`, `privacy`).
- **Creating or editing a file** → always add the frontmatter block with all fields, leaving inapplicable ones empty.

### Frontmatter Template

```yaml
---
type: reference
modules:
scope:
object_name:
required_options:
tags:
  -
created:
last_update:
---
```

---

## Writing Guidelines

### File Naming

- Lowercase, hyphens only (e.g. `data-policy.md`).
- Feature files follow the pattern `<verb>-<entity>.md` (e.g. `create-participant.md`).
- Each directory must have an `index.md` as landing page.
- One main topic per file.

### Markdown Standards

- Standard Markdown + YAML frontmatter.
- Line length: 80–120 characters recommended.
- Internal links must be **absolute from the documentation root** (e.g. `/functional/business-objects/`).
- Use descriptive anchor links for cross-references.

### Content Structure

- H1 → H2 → H3 hierarchy; start every file with a descriptive H1.
- Include an introductory paragraph explaining the purpose.
- Use tables for structured comparisons, bullet points for lists.
- Add diagrams for workflows and entity relationships.

### Diagrams (Mermaid)

Wrap Mermaid in fenced code blocks:

```mermaid
flowchart TD
    A --> B
```

The custom renderer in `.vitepress/theme/MermaidChart.vue` handles rendering.

### Writing Style

- **Audience**: Both end-users and developers.
- **Tone**: Professional, clear, instructive.
- Active voice. Concise sentences. Explain "what" and "why", not just "how".
- Consistent terminology with the Glossary.

---

## Development Workflow

```bash
pnpm install      # Install dependencies
pnpm dev          # Dev server with live reload
pnpm build        # Production build
pnpm preview      # Preview built version
```

### Git Workflow

- `main` branch is always production-ready.
- Create feature branches for documentation changes.
- Open a pull/merge request for review before merging.
- Run `pnpm dev` locally to verify rendering before committing.
- Run `pnpm build` to catch broken links and build errors.

---

## Quality Checklist

Before committing a new or edited file:

- [ ] Frontmatter is complete and accurate.
- [ ] All internal links are absolute and valid (`pnpm run build` to check).
- [ ] No broken references to business objects or features.
- [ ] Markdown is properly formatted.
- [ ] Technical terms match the Glossary.
- [ ] Each section has an introductory overview.
- [ ] Diagrams render correctly (`pnpm dev`).
- [ ] No typos.

---

## Navigation Configuration

The sidebar and navbar are defined in `.vitepress/config.mts`.
When adding a new page, update the relevant `sidebar` array in that file **and** link to it from the parent `index.md`.
