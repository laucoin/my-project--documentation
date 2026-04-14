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
  - creation
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Create Group

::: info Option required
Requires the **GROUP** option to be enabled on the project.
:::

## Objects used

- [Group](/functional/business-objects/core/group)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- Name is required
- Attendance dates are optional

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create group for project X
    BFF ->> Core: Pass request
    Core -->> BFF: Created group
    BFF -->> John DOE: Created group
```
