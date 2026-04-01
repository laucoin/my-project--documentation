# Copilot Instructions for SGDF Documentation Project

## Project Overview

This is a **VitePress documentation site** for a group care management system for minors. The documentation is built
using [VitePress](https://vitepress.dev/), [Vue 3](https://vuejs.org/), and [Mermaid](https://mermaid.js.org/) for diagrams.

**Project Purpose**: Document functional and technical aspects of a project management application for Scouts et Guides
de France (SGDF).

**Tech Stack**:

- VitePress 2.0.0-alpha.17
- Vue 3.5.31
- Mermaid 11.13.0
- pnpm 10.33.0
- Node.js 22+

## Documentation Structure

### Directory Layout

```
documentation/
├── functional/
│   ├── index.md
│   ├── data-policy.md
│   ├── roles.md
│   ├── ….md
│   └── business-objects/
│       ├── index.md
│       └── …/
├── technical/
│   └── index.md
├── public/                    (Static assets)
├── .vitepress/                (VitePress configuration)
├── index.md                   (Home page)
├── README.md
└── package.json
```

### Content Sections

1. **Functional Documentation** (`/functional`)
	- **Business Objects**: Each sub folder is an application module
	- **Roles**: User types and permissions
	- **Data Policy**: Data retention and deletion rules

2. **Technical Documentation** (`/technical`)
	- Architecture, APIs, integration options
	- Development guides and customization details
	- Choices and their rationale (ADRs)

## Frontmatter Navigation

Every `.md` file in `functional/` contains a YAML frontmatter block.
**Use these fields to decide which files are relevant to read before answering a question or making a change.**

### Fields

| Field                     | Description                                                                                               |
|---------------------------|-----------------------------------------------------------------------------------------------------------|
| `type`                    | `business-object` for entity files, `reference` for cross-cutting files                                   |
| `module`                  | Which module owns this object (`core`, `operations`)                                                      |
| `scope`                   | Direct parent entity or entities (e.g. `project`, `organization`, `[movement, alert]`)                    |
| `object_name`             | The canonical name of the entity                                                                          |
| `required_options`        | Option that must be enabled on the project for this object to be available. Empty means always available. |
| `tags`                    | Cross-cutting keywords shared across files (see below)                                                    |
| `created` / `last_update` | File history                                                                                              |

### Tag index

Use tags to identify related files across types:

| Tag                     | Files concerned                                                                       |
|-------------------------|---------------------------------------------------------------------------------------|
| `options`               | `options.md`, `group.md`, `activity.md`, `vehicle.md`, `alert.md`, `communication.md` |
| `roles` / `permissions` | `roles.md`, `profile.md`, `user.md`                                                   |
| `data` / `privacy`      | `data-policy.md`, `user.md`, `participant.md`                                         |

### Navigation rules

- **Question about a specific entity** → read the file where `object_name` matches.
- **Question about an optional feature** → also read `options.md` (tag: `options`).
- **Question about access or permissions** → also read `roles.md` (tags: `roles`, `permissions`).
- **Question about data retention or GDPR** → also read `data-policy.md` (tags: `data`, `privacy`).
- **Creating or editing a file** → always add the frontmatter block with all fields, leaving inapplicable ones empty.

### Frontmatter template for a new business object

```yaml
---
type: business-object
module:         # core | operations
scope:          # parent entity, or list if multiple
object_name:
required_options:
tags:
created:
last_update:
---
```

### Frontmatter template for a new reference file

```yaml
---
type: reference
module:
scope:
object_name:
required_options:
tags:
  -
created:
last_update:
---
```

## Writing Guidelines

### Markdown Standards

- Use standard Markdown syntax with YAML frontmatter for metadata
- Keep line length reasonable (80-120 characters recommended)
- Use relative links for internal navigation (e.g., `/functional/business-objects/`)
- Use descriptive anchor links for cross-references

### File Naming Conventions

- Use lowercase with hyphens for file names (e.g., `data-policy.md`)
- Create `index.md` for directories to serve as landing pages
- One main topic per file

### Content Structure

- Start with descriptive headings (H1, H2, H3 hierarchy)
- Include introductory sections explaining the purpose
- Use bullet points for lists and structured information
- Add code examples and diagrams where helpful
- Include links to related documentation sections

### Diagrams with Mermaid

- Use Mermaid for flowcharts, entity relationships, and process diagrams
- Wrap Mermaid code in ` ```mermaid ``` ` blocks
- Example topics for diagrams: workflows, role hierarchies, data relationships

## Development Workflow

### Installation & Setup

```bash
# Install dependencies
pnpm install

# Run dev server with live reload
pnpm dev

# Build documentation
pnpm build

# Preview built version
pnpm preview
```

### VitePress-Specific Features

- **Home Page Layout**: Uses `layout: home` with hero section and feature cards
- **Configuration**: Via `.vitepress/config.mts` (check for sidebar, navbar, theme settings)
- **Markdown Features**: Supports code highlights, tables, custom containers, badges
- **Vue Components**: Can embed Vue components in Markdown files

### Content Development Best Practices

- Keep the main branch production-ready
- Create feature branches for documentation changes
- Use pull requests for review before merging
- Test documentation locally with `pnpm dev` before committing
- Build documentation with `pnpm build` to catch any issues

## Writing Style

- **Audience**: Both functional users and technical developers
- **Tone**: Professional, clear, and instructive
- **Format Preference**:
	- Use active voice
	- Keep sentences concise
	- Explain "what" and "why", not just "how"
	- Include real-world examples when applicable

## Common Tasks

### Adding a New Page

1. Create a new `.md` file in the appropriate directory
2. Add YAML frontmatter if needed
3. Write content following markdown standards
4. Update parent `index.md` with link to new page
5. Test with `pnpm dev`

### Adding Diagrams

1. Use Mermaid syntax for entity relationships, workflows, or processes
2. Keep diagrams simple and readable
3. Include descriptive captions

### Updating Navigation

- Check `.vitepress/config.mts` for sidebar/navbar configuration
- Ensure new pages are linked in related index files
- Maintain logical hierarchy and grouping

## Quality Standards

- ✅ All internal links must be valid (link must be absolute based on the documentation root)
- ✅ No broken references to business objects
- ✅ Markdown must be properly formatted
- ✅ Technical terms should be consistent across documentation
- ✅ Each section should have an introductory overview
- ✅ Include examples where helpful
- ✅ Review for typos and clarity

## Important Notes

- This is documentation for a **group care management system** specifically built for SGDF
- Focus on explaining functionality from both end-user and developer perspectives
- Maintain consistency with existing content style and terminology
- Changes should be made on feature branches, never directly on main
