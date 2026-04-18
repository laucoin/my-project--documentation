---
type: feature
modules:
  - operations
objects:
  - comment
required_options:
  - COMMENT
tags:
  - comment
  - deletion
  - options
outline: deep
created: 2026-04-18
last_update: 2026-04-18
---

# Delete Comment

::: info Option required
Requires the **COMMENT** option to be enabled on the project.
:::

::: info Soft-delete
"Delete" here means soft-delete: the comment transitions to the `HIDDEN` state and is excluded from listings, but the record is preserved. See [Soft-delete](/glossary#soft-delete).
:::

## Objects used

- [Comment](/functional/business-objects/operations/comment)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER` — only on comments they authored themselves

## Constraints

- Target comment must exist and must not already be `HIDDEN`.
- Tag counts linked to the comment are decremented.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Delete comment for project X<br/>(comment reference)
    BFF ->> Operations: Pass request
    Operations ->> Operations: Check author / role
    Operations ->> Operations: Soft-delete comment (status = HIDDEN)
    Operations ->> Operations: Decrement tag counts
    Operations -->> BFF: Confirmation
    BFF -->> John DOE: Confirmation
```
