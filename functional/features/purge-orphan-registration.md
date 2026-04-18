---
type: feature
modules:
  - registration
objects:
  - form
  - registration
required_options:
  - REGISTRATION
tags:
  - registration
  - purge
  - options
outline: deep
created: 2026-04-18
last_update: 2026-04-18
---

# Purge Orphans — Registration

::: warning Draft
This page is a placeholder. The registration orphan-cleanup job is aligned in principle with
[Purge orphans — Core](/functional/features/purge-orphan-core) and
[Purge orphans — Operations](/functional/features/purge-orphan-operations), but the exact object list and
conditions are still being finalised in coordination with the Registration module.
:::

## Allowed roles

- `SUPER_ADMIN`

## Trigger

- Scheduler triggers purge of orphans for all projects on a regular basis (e.g., daily).
- Manual trigger by a user with the appropriate role through the BFF.

## Objects used

- [Form](/functional/business-objects/registration/)
- [Registration request](/functional/business-objects/registration/)

## Purge condition

All registration-module records whose parent project has been deleted.

## Constraints

- The deletion cannot be rolled back.
- Full detail of the cleaned-up objects and their cascade rules will be specified once the Registration module documentation is complete.
