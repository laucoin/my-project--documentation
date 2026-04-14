---
type: feature
modules:
  - core
objects:
  - user
required_options:
tags:
  - user
  - enable-back
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Unblock User

## Objects used

- [User](/functional/business-objects/core/user)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`

## Constraints

- Only applicable to `BLOCKED` users

::: warning Session impact
Access restoration is stateless and takes effect at the affected user's **next token refresh**, not immediately.
:::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Unblock user
    BFF ->> Core: Pass request
    Core ->> Core: Set user status = ACTIVE
    Core -->> BFF: Updated user
    BFF -->> John DOE: Updated user
```
