---
type: feature
modules:
  - core
  - operations
objects:
  - participant
required_options:
tags:
  - participant
  - soft-delete
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Disable Participant

## Objects used

- [Participant](/functional/business-objects/core/participant)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- The soft-deletion must not impact the [operations](/functional/business-objects/operations/) module.
- `PROJECT_ADMIN`s still see the participant, but it is marked `DISABLED`.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Disable participant for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set participant status = DISABLED
    Core -->> BFF: Updated participant
    BFF -->> John DOE: Updated participant
```
