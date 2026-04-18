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
  - edition
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Group

::: info Option required
Requires the **GROUP** option to be enabled on the project.
:::

## Objects used

- [Group](/functional/business-objects/core/group)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

Same constraints as [Create Group](/functional/features/create-group), except:

- `project` is immutable — a group cannot be moved from one project to another.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit group for project X
    BFF ->> Core: Pass request
    Core -->> BFF: Updated group
    BFF -->> John DOE: Updated group
```
