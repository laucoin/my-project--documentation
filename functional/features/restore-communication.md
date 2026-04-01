---
type: feature
modules:
  - operations
objects:
  - communication
required_options:
  - COMMUNICATION
tags:
  - communication
  - enable-back
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Restore Communication

::: info Option required
Requires the **COMMUNICATION** option to be enabled on the project.
:::

## Objects used

- [Communication](/functional/business-objects/operations/communication)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- Only applicable to `HIDDEN` communications

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Restore communication for project X
    BFF ->> Operations: Pass request
    Operations ->> Operations: Set communication status = ACTIVE
    Operations -->> BFF: Updated communication
    BFF -->> John DOE: Updated communication
```
