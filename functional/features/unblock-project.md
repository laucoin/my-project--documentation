---
type: feature
modules:
  - core
objects:
  - project
required_options:
tags:
  - project
  - enable-back
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Unblock Project

## Objects used

- [Project](/functional/business-objects/core/project)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`

## Constraints

- Only applicable to `BLOCKED` projects

::: warning Session impact
Access restoration is stateless and takes effect at each affected user's **next token refresh**, not immediately.
:::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Unblock project X
    BFF ->> Core: Pass request
    Core ->> Core: Set project status = ACTIVE
    Core -->> BFF: Updated project
    BFF -->> John DOE: Updated project
```
