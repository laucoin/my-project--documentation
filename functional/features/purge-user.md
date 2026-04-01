---
type: feature
modules:
  - core
  - operations
objects:
  - user
  - profile
required_options:
tags:
  - user
  - light-user
  - gdpr
  - purge
outline: deep
created: 2026-04-13
last_update: 2026-04-14
---

# Purge User

::: warning Irreversible
Purge is a permanent removal. It cannot be rolled back.
:::

## Objects used

- [User](/functional/business-objects/core/user)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`
- Any user for themselves

## Purge condition

The user must have had no related action in [operations](/functional/business-objects/operations) in the last year.

## Constraints

- The deletion MUST cascade to the [operations](/functional/business-objects/operations) module.
- The deletion cannot be rolled back

::: info Light user purge
For the purge of unlinked light users, see [Purge Light Users](/functional/features/purge-light-users).
:::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Purge user
    BFF ->> Operations: Check purge condition<br/>(no operations in last year)
    Operations -->> BFF: Condition met
    BFF ->> Operations: Delete user operations data
    Operations -->> BFF: Done
    BFF ->> Core: Delete user and related data
    Core -->> BFF: User purged
    BFF -->> John DOE: User purged
```
