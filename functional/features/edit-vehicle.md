---
type: feature
modules:
  - core
objects:
  - vehicle
required_options:
  - VEHICLE
tags:
  - vehicle
  - edition
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Vehicle

::: info Option required
Requires the **VEHICLE** option to be enabled on the project.
:::

## Objects used

- [Vehicle](/functional/business-objects/core/vehicle)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

Same constraints as [Create Vehicle](/functional/features/create-vehicle).

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit vehicle for project X
    BFF ->> Core: Pass request
    Core -->> BFF: Updated vehicle
    BFF -->> John DOE: Updated vehicle
```
