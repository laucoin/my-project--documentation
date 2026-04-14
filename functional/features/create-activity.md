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
  - creation
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Create Activity

::: info Option required
Requires the **ACTIVITY** option to be enabled on the project.
:::

## Objects used

- [Activity](/functional/business-objects/core/activity)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- Name is required
- Description is optional
- Capacity is required and must be greater than 0
- Duration is required and must be greater than 0
- Availability dates are optional

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create activity for project X
    BFF ->> Core: Pass request
    Core -->> BFF: Created activity
    BFF -->> John DOE: Created activity
```
