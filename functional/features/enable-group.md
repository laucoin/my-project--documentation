---
type: feature
modules:
  - core
objects:
  - group
required_options:
  - GROUP
tags:
  - group
  - enable-back
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Enable Group

::: info Option required
Requires the **GROUP** option to be enabled on the project.
:::

## Objects used

- [Group](/functional/business-objects/core/group)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- Only applicable to `DISABLED` groups
- Members regain their membership upon re-enabling

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Enable group for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set group status = ACTIVE
    Core -->> BFF: Updated group
    BFF -->> John DOE: Updated group
```
