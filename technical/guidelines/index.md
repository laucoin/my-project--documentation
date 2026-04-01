# Coding Guidelines

These guidelines define the conventions and standards adopted across all modules of this project.
They are **not ADRs** — they document decisions that are simple enough to not require a formal decision record,
but important enough to be written down for consistency and onboarding.

> **ADRs** are reserved for architectural decisions with significant trade-offs and alternatives.
> Guidelines cover conventions that have a clear best practice in our context.

## Sections

### [Database Conventions](/technical/guidelines/database)

Schema ownership, table naming, identifiers, timestamps, jOOQ, Flyway migrations

### [Spring & Kotlin Conventions](/technical/guidelines/spring)

Hexagonal architecture, inbound ports, bean naming, multi-module structure, jOOQ, coroutines vs Reactor

### [Security Conventions](/technical/guidelines/security)

Authorization boundary, JWT handling, role extraction, session cookie, forbidden patterns

### [Frontend Conventions](/technical/guidelines/frontend)

Nuxt layer structure, component naming, composables, API calls, TypeScript, i18n

### [Coding Style](/technical/guidelines/coding-style)

Naming, method size, package structure, error handling, logging, forbidden patterns

## Principles

- **Consistency over preference** — Follow the convention even if you personally prefer another style.
- **App over DB** — Business logic and generation (UUID, timestamps) belong to the application layer, not the database.
- **Module ownership** — Each module owns its schema, its migrations, its database configuration, and its inbound port.
  Each frontend layer owns its pages, components, and API calls.
- **Explicit over implicit** — Prefer explicit configuration over Spring Boot auto-configuration magic when managing
  multiple datasources.
- **No cross-boundary access** — Backend modules communicate only through inbound service ports. Frontend layers do not
  import from each other. No module queries another module's schema.
- **Auth at the boundary** — Authorization is enforced exclusively at the BFF. Modules trust the calls they receive
  through their inbound port.
