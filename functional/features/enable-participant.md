---
type: feature
modules:
  - core
objects:
  - participant
required_options:
tags:
  - participant
  - enable-back
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Enable Participant

## Objects used

- [Participant](/functional/business-objects/core/participant)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- Only applicable to `DISABLED` participants

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Enable participant for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set participant availability = AVAILABLE
    Core -->> BFF: Updated participant
    BFF -->> John DOE: Updated participant
```
