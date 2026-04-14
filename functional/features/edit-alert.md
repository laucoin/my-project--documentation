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
  - edition
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Alert

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

- Title, description and status are editable
- Status can be updated to `RESOLVED` or `CANCELED`

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit alert for project X
    BFF ->> Operations: Pass request
    Operations -->> BFF: Updated alert
    BFF -->> John DOE: Updated alert
```
