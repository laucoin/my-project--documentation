---
type: feature
modules:
  - core
objects:
  - project
required_options:
tags:
  - project
  - edition
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Project

## Objects used

- [Project](/functional/business-objects/core/project)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- No automatic profile creation on project edition

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit project X
    BFF ->> Core: Pass request
    Core -->> BFF: Updated project
    BFF -->> John DOE: Updated project
```
