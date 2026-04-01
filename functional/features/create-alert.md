---
type: feature
modules:
  - operations
objects:
  - alert
required_options:
  - ALERT
tags:
  - alert
  - creation
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Create Alert

::: info Option required
Requires the **ALERT** option (and **COMMUNICATION**) to be enabled on the project.
:::

## Objects used

- [Alert](/functional/business-objects/operations/alert)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Constraints

- Title is required
- Description is optional
- Status is automatically set to `IN_PROGRESS`

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create alert for project X
    BFF ->> Operations: Pass request
    Operations ->> Operations: Set status = IN_PROGRESS
    Operations -->> BFF: Created alert
    BFF -->> John DOE: Created alert
```
