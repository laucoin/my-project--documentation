---
type: feature
modules:
  - operations
objects:
  - movement
required_options:
tags:
  - movement
  - enable-back
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Restore Movement

## Objects used

- [Movement](/functional/business-objects/operations/movement)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- Only applicable to `HIDDEN` movements

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Restore movement for project X
    BFF ->> Operations: Pass request
    Operations ->> Operations: Set movement status = ACTIVE
    Operations -->> BFF: Updated movement
    BFF -->> John DOE: Updated movement
```
