# 006 – Nuxt Layers

|              |                                        |
|--------------|----------------------------------------|
| **Status**   | Accepted                               |
| **Concerns** | Frontend Architecture, Maintainability |

## Context

The frontend covers three distinct functional domains — project core, operations, and registration — mirroring the
backend module structure. Without a clear boundary strategy, all UI code would live in a single flat Nuxt application,
making it difficult to reason about domain boundaries and to evolve each domain independently.

## Decision

Structure the frontend using **Nuxt Layers**, with one layer per backend module plus a root application layer:

| Layer              | Responsibility                                                            |
|--------------------|---------------------------------------------------------------------------|
| APP Layer          | Entry point — routing, authentication guard, global layout and navigation |
| Project Core Layer | UI for project, group, participant, activity, and vehicle management      |
| Operation Layer    | UI for movement recording, alert creation and management                  |
| Registration Layer | UI for registration period configuration and request management           |

Each domain layer is self-contained: it owns its pages, components, composables, and API calls to the BFF. The APP layer
composes all domain layers and owns cross-cutting concerns.

## Consequences

- Domain boundaries in the frontend mirror the backend module structure, making the codebase easier to navigate.
- Each layer can be developed and tested independently.
- If a backend module is extracted into an independent service, the corresponding frontend layer already has a clear
  boundary and can be moved to a separate application with minimal changes.
- Nuxt Layers add a small amount of configuration overhead compared to a flat Nuxt application.
