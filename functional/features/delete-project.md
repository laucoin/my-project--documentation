---
type: feature
modules:
  - core
  - operations
  - registration
  - preparation
objects:
  - project
required_options:
tags:
  - project
  - deletion
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Delete Project

::: info Delete ≠ Block
Delete is a permanent removal from the database.
:::

## Objects used

- [Project](/functional/business-objects/core/project)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`

## Constraints

- Must delete all dependent content (participants, movements, etc.)
- The deletion cannot be rolled back

::: info Asynchronous cleanup
Deleting a project only removes the project record itself. All foreign keys in dependent records are set to null. This choice prevents overloading database I/O and gives a quick response to the user, without waiting for the full deletion or launching an async job without a success status.

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
    John DOE ->> BFF: Delete project X
    BFF ->> Core: Delete project record
    Core ->> Core: Set project_id = null on all dependent records
    Core -->> BFF: Project deleted
    BFF -->> John DOE: Project deleted
    Note over BFF, Core: Orphaned records cleaned up asynchronously<br/>by Core, Operations and Registration purge jobs
```
