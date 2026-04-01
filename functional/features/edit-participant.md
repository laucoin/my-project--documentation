---
type: feature
modules:
  - core
objects:
  - participant
required_options:
tags:
  - participant
  - edition
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Participant

## Objects used

- [Participant](/functional/business-objects/core/participant)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- Type cannot be changed

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit participant for project X
    BFF ->> Core: Pass request
    Core -->> BFF: Updated participant
    BFF -->> John DOE: Updated participant
```
