---
type: feature
modules:
  - core
objects:
  - organization
required_options:
tags:
  - organization
  - edition
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Organization

## Objects used

- [Organization](/functional/business-objects/core/organization)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`

## Constraints

Same fields as [Create Organization](/functional/features/create-organization), with these differences:

- `slug` is immutable after creation (it is bound to the configured OIDC provider and cannot be rewritten).
- `ORGANIZATION_ADMIN`s cannot edit `is_main`. Only `SUPER_ADMIN`s can toggle it. Flipping `is_main` grants or revokes `SUPER_ADMIN` on every user of the organization.
- `is_strict_auth` can be toggled by both roles.

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit organization
    BFF ->> Core: Pass request
    Core -->> BFF: Updated organization
    BFF -->> John DOE: Updated organization
```
