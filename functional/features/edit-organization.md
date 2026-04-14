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

- `ORGANIZATION_ADMIN`s cannot edit slug or `is_main` field

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
