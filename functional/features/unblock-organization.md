---
type: feature
modules:
  - core
objects:
  - organization
required_options:
tags:
  - organization
  - enable-back
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Unblock Organization

## Objects used

- [Organization](/functional/business-objects/core/organization)

## Allowed roles

- `SUPER_ADMIN`

## Constraints

- Only applicable to `BLOCKED` organizations

::: warning Session impact
Access restoration is stateless and takes effect at each affected user's **next token refresh**, not immediately.
:::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Unblock organization
    BFF ->> Core: Pass request
    Core ->> Core: Set organization status = ACTIVE
    Core -->> BFF: Updated organization
    BFF -->> John DOE: Updated organization
```
