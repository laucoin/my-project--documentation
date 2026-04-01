---
type: feature
modules:
  - core
objects:
  - profile
required_options:
tags:
  - profile
  - support
  - creation
outline: deep
created: 2026-04-14
last_update: 2026-04-14
---

# Create Support Profile

## Objects used

- [Profile](/functional/business-objects/core/profile)

## Allowed roles

- `SUPER_ADMIN` — all projects
- `ORGANIZATION_ADMIN` — limited to projects within their organization scope

## Constraints

- Project is required
- Type is automatically set to `SUPPORT`
- Role is automatically set to `PROJECT_ADMIN`
- Invitation status is automatically set to `ACCEPTED`
- Access start is automatically set to the current datetime
- Access end is automatically set to access start + 1 hour

::: warning Server-side enforcement
The frontend does **not** send role, invitation status, or access dates. These values are set exclusively by Core to prevent tampering.
:::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create support profile for project X
    BFF ->> Core: Pass request (project only)
    Core ->> Core: Set type = SUPPORT
    Core ->> Core: Set role = PROJECT_ADMIN
    Core ->> Core: Set invitation_status = ACCEPTED
    Core ->> Core: Set access_start = now
    Core ->> Core: Set access_end = now + 1h
    Core -->> BFF: Created profile
    BFF -->> John DOE: Created profile
```
