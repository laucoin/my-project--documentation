# 003 – Schema per Module

| | |
|---|---|
| **Status** | Accepted |
| **Concerns** | Database, Data Isolation, Module Boundaries |

## Context

All three backend modules share a single PostgreSQL instance (one deployment unit). Without a boundary strategy, modules could freely read each other's tables, creating hidden coupling that would make future extraction into independent services very difficult.

## Decision

Each module owns exactly **one dedicated PostgreSQL schema**:

| Module | Schema |
|--------|--------|
| Core | `core` |
| Operation | `operation` |
| Registration | `registration` |

Rules:
- A module's repositories only access their own schema.
- No module may query another module's schema directly, even via raw SQL.
- Cross-module data needs must go through the module's internal API.
- Each module manages its own schema migrations independently via Flyway.

## Consequences

- Schema isolation enforces the same boundary at the data layer as at the API layer.
- If a module is extracted into an independent service, its schema can be migrated to a dedicated database without changes to the data model.
- Join queries across module boundaries are not possible — any aggregation must happen at the application layer.
