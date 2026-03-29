# GitHub Copilot Instructions – My Project - Documentation

## Project overview

This repository contains the documentation for a personal project made available free of charge to an
organization (Scouts et Guides de France). It covers the management of group care for minors.

The documentation is built with [VitePress](https://vitepress.dev/) and [pnpm](https://pnpm.io/).

---

## Documentation structure

```
documentation/
├── functional/                        # Functional documentation
│   ├── business-objects/              # Domain entities
│   │   └── ….md
│   ├── operations/                    # Operational features
│   │   └── ….md
│   ├── registration/                  # Registration workflow
│   │   └── ….md
│   ├── roles.md
│   ├── statistics.md
│   ├── data-policy.md
│   └── ….md
└── technical/                         # Technical documentation
    ├── architecture/
    │   └── c4/                        # C4 model diagrams
    │       ├── context.md             # Level 1 – System Context
    │       ├── containers.md          # Level 2 – Containers
    │       └── components/            # Level 3 – Components
    │           └── ….md
    ├── adr/                           # Architecture Decision Records
    │   └── XXX-….md
    ├── security.md
    ├── database.md
    └── ….md
```

---

## Writing guidelines

### Language

- Write all documentation pages in **English**.

### Markdown

- Use standard [VitePress Markdown](https://vitepress.dev/guide/markdown) syntax.
- Use `#` for page title, `##` for sections, `###` for subsections.
- Prefer tables for structured data comparisons.
- Use [VitePress containers](https://vitepress.dev/guide/markdown#custom-containers) for callouts:
  ```md
  ::: info
  :::
  ::: tip
  :::
  ::: warning
  :::
  ::: danger
  :::
  ```

### Diagrams

- Use **Mermaid** for all diagrams (the VitePress config renders `mermaid` fenced code blocks).
- Prefer the following diagram types depending on context:
    - `flowchart` for processes and workflows
    - `sequenceDiagram` for interactions between components
    - `classDiagram` for domain model relationships
    - `erDiagram` for database schemas
    - `C4Context` / `C4Container` / `C4Component` for architecture diagrams

  Example:
  ````md
  ```mermaid
  flowchart LR
      A[Start] --> B{Decision}
      B -- Yes --> C[Action]
      B -- No --> D[End]
  ```
  ````

### ADR (Architecture Decision Records)

- Follow the existing naming convention: `NNN-kebab-case-title.md` (e.g. `007-new-decision.md`).
- Each ADR must include the following sections:
    - `## Context` – why the decision was needed
    - `## Decision` – what was decided
    - `## Consequences` – what changes as a result
    - Optionally `## Alternatives considered`

### Functional pages

- Each business object page should describe: purpose, attributes, relationships with other objects.
- Each operation/feature page should describe: goal, actors involved, step-by-step flow.

### Technical pages

- C4 model pages should contain at minimum: a Mermaid diagram and a short description of each element.

---

## VitePress config

- The site title is **My Project**.
- Navigation has two top-level sections: **Functional** and **Technical**.
- When adding a new page, also register it in `.vitepress/config.mts` under the appropriate sidebar entry.
- New pages must be placed in the correct directory matching the sidebar structure above.

---

## Technology stack

| Tool       | Role                            |
|------------|---------------------------------|
| VitePress  | Static site generator           |
| Vue 3      | Component framework (for theme) |
| Mermaid    | Diagram rendering               |
| pnpm       | Package manager                 |
| TypeScript | VitePress config (`config.mts`) |
