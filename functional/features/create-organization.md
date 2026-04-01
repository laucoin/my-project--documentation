---
type: feature
modules:
  - core
objects:
  - organization
required_options:
tags:
  - organization
  - creation
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Create Organization

## Objects used

- [Organization](/functional/business-objects/core/organization)

## Allowed roles

- `SUPER_ADMIN`

## Constraints

- Name is required
- Slug is required
- Options are optional (no option given means no option active)
- `is_strict_auth` is required
- `is_main` is required

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create organization
    BFF ->> Core: Pass request
    opt OIDC provider validation
        Core ->> OIDC provider: Validate organization slug
        OIDC provider -->> Core: Validation result
    end
    Core -->> BFF: Created organization
    BFF -->> John DOE: Created organization
```
