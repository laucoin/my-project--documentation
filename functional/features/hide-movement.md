---
type: feature
modules:
  - operations
objects:
  - movement
required_options: MOVEMENT
tags:
  - movement
  - soft-delete
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Hide Movement

## Objects used

- [Movement](/functional/business-objects/operations/movement)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Constraints

- `PROJECT_ADMIN`s and `PROJECT_MANAGER`s still see the movement, but it is marked `HIDDEN`.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Hide movement for project X
    BFF ->> Operations: Pass request
    Operations ->> Operations: Set movement status = HIDDEN
    Operations -->> BFF: Updated movement
    BFF -->> John DOE: Updated movement
```
