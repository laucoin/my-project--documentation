---
type: feature
modules:
  - core
objects:
  - participant
required_options:
tags:
  - participant
  - gdpr
  - export
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Export Participant Data

## Objects used

- [Participant](/functional/business-objects/core/participant)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- Any user linked to the concerned participant

## Constraints

- Must not include other participants' personal data

Refer to [data policy](/functional/features/data-policy) for the expected format and exported data.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Export participant data for project X
    BFF ->> Core: Request participant data
    Core -->> BFF: Participant data
    BFF ->> Operations: Request participant operations data
    Operations -->> BFF: Operations data
    BFF ->> BFF: Generate export file
    BFF -->> John DOE: Export file
```
