---
type: feature
modules:
  - core
objects:
  - activity
required_options:
  - ACTIVITY
tags:
  - activity
  - edition
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Activity

::: info Option required
Requires the **ACTIVITY** option to be enabled on the project.
:::

## Objects used

- [Activity](/functional/business-objects/core/activity)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

Same constraints as [Create Activity](/functional/features/create-activity).

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit activity for project X
    BFF ->> Core: Pass request
    Core -->> BFF: Updated activity
    BFF -->> John DOE: Updated activity
```
