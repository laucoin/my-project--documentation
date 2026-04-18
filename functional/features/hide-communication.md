---
type: feature
modules:
  - operations
objects:
  - communication
required_options:
tags:
  - communication
  - soft-delete
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Hide Communication

## Objects used

- [Communication](/functional/business-objects/operations/communication)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Constraints

- `PROJECT_ADMIN`s and `PROJECT_MANAGER`s still see the communication, but it is marked `HIDDEN`.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Hide communication for project X
    BFF ->> Operations: Pass request
    Operations ->> Operations: Set communication status = HIDDEN
    Operations -->> BFF: Updated communication
    BFF -->> John DOE: Updated communication
```
