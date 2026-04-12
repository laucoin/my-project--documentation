# Architecture

The application is a **Spring Boot modular monolith** backed by a **Nuxt frontend**. It is deployed as a single unit but
designed so that each module can be extracted into an independent microservice without architectural rework.

## Principles

- **One deployment, clear boundaries** — all modules run in the same process but communicate through explicit API
  contracts, not shared state or direct database cross-access.
- **Schema isolation** — each backend module owns exactly one PostgreSQL schema. No module queries another module's
  schema directly.
- **Frontend mirrors backend** — the Nuxt application is structured in layers that map directly to the backend modules,
  keeping domain responsibilities consistent across the stack.
- **Single entry point** — the frontend communicates exclusively with the BFF, which is responsible for aggregation,
  authentication enforcement, and routing to the appropriate module.

## Module map

| Module       | Layer (frontend)   | Schema (database) | Responsibility                                                             |
|--------------|--------------------|-------------------|----------------------------------------------------------------------------|
| BFF          | APP                | —                 | API gateway, auth enforcement, aggregation                                 |
| Core         | Project core layer | `core`            | Organizations, projects, users, participants, groups, activities, vehicles |
| Operation    | Operation layer    | `operation`       | Movements, alerts, communications                                          |
| Registration | Registration layer | `registration`    | Registration periods and requests                                          |

## C4 Model

The architecture is documented using the C4 model:

- [Level 1 – System Context](/technical/architecture/c4/context)
- [Level 2 – Containers](/technical/architecture/c4/containers)
- [Level 3 – Components](/technical/architecture/c4/components/)
