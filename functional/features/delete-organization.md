---
type: feature
modules:
  - core
  - operations
objects:
  - organization
required_options:
tags:
  - organization
  - deletion
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Delete Organization

::: info Delete ≠ Block
Delete is a permanent removal from the database.
:::

## Objects used

- [Organization](/functional/business-objects/core/organization)

## Allowed roles

- `SUPER_ADMIN`

## Constraints

- Must delete all dependent content (projects, etc.)
- The deletion cannot be rolled back

::: info Asynchronous cleanup
Deleting an organization only removes the organization record itself. All foreign keys in dependent records are set to null. This choice prevent overloading database I/O, and give a quick response to the user, without wait for deletion or launching async job without success status.

Three dedicated purge jobs then clean up orphaned data in each module independently:

- [Purge Orphan Core Data](/functional/features/purge-orphan-core)
- [Purge Orphan Operations Data](/functional/features/purge-orphan-operations)
- [Purge Orphan Registration Data](/functional/features/purge-orphan-registration)
  :::

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Delete organization
    BFF ->> Core: Delete organization record
    Core ->> Core: Set organization_id = null on all dependent records
    Core -->> BFF: Organization deleted
    BFF -->> John DOE: Organization deleted
    Note over BFF, Core: Orphaned records cleaned up asynchronously<br/>by Core, Operations and Registration purge jobs
```
