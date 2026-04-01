# Database

The application uses a single **PostgreSQL** instance with three isolated schemas — one per domain module. No module may
query another module's schema directly.

## Schema ownership

| Schema         | Owner               | Content                                                                                      |
|----------------|---------------------|----------------------------------------------------------------------------------------------|
| `core`         | Core Module         | Organisations, projects, users, project profiles, groups, participants, activities, vehicles |
| `operation`    | Operation Module    | Movements, alerts, communications                                                            |
| `registration` | Registration Module | Registration periods, registration requests                                                  |

## Isolation rules

- A container's repositories access only their own schema.
- Cross-schema queries are forbidden — even via raw SQL.
- Cross-container data needs must go through the owning container's service interface.

## Migrations

Each container manages its own schema migrations independently using **Flyway**. Migration scripts are versioned and
co-located with the container's source code.

| Container    | Migration location                             |
|--------------|------------------------------------------------|
| Core         | `core/src/main/resources/db/migration`         |
| Operation    | `operation/src/main/resources/db/migration`    |
| Registration | `registration/src/main/resources/db/migration` |

Flyway applies pending migrations automatically on startup. Each container targets its own schema, so migration scripts
across containers are versioned independently.

## Access

All runtime database access uses **R2DBC** (reactive, non-blocking driver). Query construction uses **jOOQ** with the
R2DBC dialect. The only exception is **Flyway**, which uses JDBC exclusively for schema migrations at startup.
