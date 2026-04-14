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
  - soft-delete
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Disable Vehicle

::: info Option required
Requires the **VEHICLE** option to be enabled on the project.
:::

## Objects used

- [Vehicle](/functional/business-objects/core/vehicle)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- The soft-deletion must not impact the [operations](/functional/business-objects/operations) module.
- `PROJECT_ADMIN`s still see the vehicle, but it is marked `DISABLED`.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Disable vehicle for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set vehicle status = DISABLED
    Core -->> BFF: Updated vehicle
    BFF -->> John DOE: Updated vehicle
```
