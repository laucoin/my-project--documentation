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
  - enable-back
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Enable Vehicle

::: info Option required
Requires the **VEHICLE** option to be enabled on the project.
:::

## Objects used

- [Vehicle](/functional/business-objects/core/vehicle)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- Only applicable to `DISABLED` vehicles

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Enable vehicle for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set vehicle availability = AVAILABLE
    Core -->> BFF: Updated vehicle
    BFF -->> John DOE: Updated vehicle
```
