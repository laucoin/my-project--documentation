---
type: feature
modules:
  - core
  - operations
objects:
  - vehicle
required_options:
  - VEHICLE
tags:
  - vehicle
  - deletion
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Delete Vehicle

::: info Delete ≠ Disable
Delete is a permanent removal from the database.
:::

::: info Option required
Requires the **VEHICLE** option to be enabled on the project.
:::

## Objects used

- [Vehicle](/functional/business-objects/core/vehicle)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- The deletion must not affect the [operations](/functional/business-objects/operations/) module.
- The deletion cannot be rolled back

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Delete vehicle for project X
    BFF ->> Operations: Check for linked operations
    Operations -->> BFF: No linked operations
    BFF ->> Core: Delete vehicle
    Core -->> BFF: Vehicle deleted
    BFF -->> John DOE: Vehicle deleted
```
