---
type: feature
modules:
  - core
objects:
  - project
  - profile
required_options:
tags:
  - project
  - creation
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Create Project

## Objects used

- [Project](/functional/business-objects/core/project)
- [Profile](/functional/business-objects/core/profile)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`
- `ORGANIZATION_USER`

## Constraints

- Name is required
- Options are optional (no option given means no option active)
- Schedule dates are optional

::: warning Automatic profile creation
When a user creates a project, a [profile](/functional/business-objects/core/profile) is automatically created for the creator with role `PROJECT_ADMIN` and invitation status `ACCEPTED`.
:::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create project
    BFF ->> Core: Pass request
    Core ->> Core: Create project
    Core ->> Core: Create PROJECT_ADMIN profile for creator
    Core -->> BFF: Created project
    BFF -->> John DOE: Created project
```
