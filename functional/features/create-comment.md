---
type: feature
modules:
  - operations
objects:
  - comment
  - participant
required_options:
  - COMMENT
tags:
  - comment
  - creation
  - options
outline: deep
created: 2026-04-18
last_update: 2026-04-18
---

# Create Comment

::: info Option required
Requires the **COMMENT** option to be enabled on the project.
:::

## Objects used

- [Comment](/functional/business-objects/operations/comment)
- [Participant](/functional/business-objects/core/participant) — parent

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Constraints

- `message` is required.
- `participant` is required and must belong to the same project.
- Zero or more project-scoped [tags](/functional/business-objects/operations/comment#tags) can be attached.
  - Tags must exist in the project (tag creation happens in [Manage tags](/functional/features/manage-tags)).
- `author` is automatically set to the logged-in user.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create comment for project X<br/>(participant reference, message, optional tags)
    BFF ->> Operations: Pass request
    Operations ->> Core: Validate participant
    Core -->> Operations: Validated
    Operations ->> Operations: Validate tags exist in project
    Operations ->> Operations: Set author to logged-in user
    Operations ->> Operations: Create comment
    Operations -->> BFF: Created comment
    BFF -->> John DOE: Created comment
```
