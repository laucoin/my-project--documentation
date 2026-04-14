---
type: feature
modules:
  - core
  - operations
objects:
  - activity
required_options:
  - ACTIVITY
tags:
  - activity
  - soft-delete
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Disable Activity

::: info Option required
Requires the **ACTIVITY** option to be enabled on the project.
:::

## Objects used

- [Activity](/functional/business-objects/core/activity)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- The soft-deletion must not impact the [operations](/functional/business-objects/operations/) module.
- `PROJECT_ADMIN`s still see the activity, but it is marked `DISABLED`.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Disable activity for project X
    BFF ->> Core: Pass request
    Core ->> Core: Set activity status = DISABLED
    Core -->> BFF: Updated activity
    BFF -->> John DOE: Updated activity
```
