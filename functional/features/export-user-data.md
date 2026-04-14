---
type: feature
modules:
  - core
objects:
  - user
required_options:
tags:
  - user
  - gdpr
  - export
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Export User Data

## Objects used

- [User](/functional/business-objects/core/user)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- Any user for themselves

## Constraints

- Must not include other participants' personal data
- Must not include other users' personal data

Refer to [data policy](/functional/features/data-policy) for the expected format and exported data.

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Export user data
    BFF ->> Core: Request user data
    Core -->> BFF: User data (profiles, participants link)
    BFF ->> Operations: Request user operations data
    Operations -->> BFF: Operations data
    BFF ->> BFF: Generate export file
    BFF -->> John DOE: Export file
```
