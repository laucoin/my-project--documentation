---
type: feature
modules:
  - core
objects:
  - profile
required_options:
tags:
  - profile
  - enable-back
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Unblock Profile

## Objects used

- [Profile](/functional/business-objects/core/profile)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- Only applicable to `BLOCKED` profiles

::: warning Session impact
Access restoration is stateless and takes effect at the affected user's **next token refresh**, not immediately.
:::

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Unblock profile for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set profile status = ACTIVE
    Core -->> BFF: Updated profile
    BFF -->> John DOE: Updated profile
```
