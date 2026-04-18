---
type: feature
modules:
  - operations
objects:
  - completion-notice
required_options:
  - COMPLETION_NOTICE
tags:
  - completion-notice
  - publication
  - options
outline: deep
created: 2026-04-18
last_update: 2026-04-18
---

# Publish Completion Notice

::: info Option required
Requires the **COMPLETION_NOTICE** option to be enabled on the project.
:::

::: warning Irreversible
Publishing a notice transitions it from `DRAFT` to `PUBLISHED`. The transition is **irreversible**: a published notice cannot be reverted to `DRAFT`, and its content is frozen from that point on.
:::

## Objects used

- [Completion Notice](/functional/business-objects/operations/completion-notice)

## Allowed roles

- `PROJECT_ADMIN`

## Constraints

- Target notice must be in `DRAFT` status.
- `content` must be non-empty.
- After publication:
  - The notice is distributed to its recipients (internal stakeholders for `INTERNAL`, external recipients for `EXTERNAL`).
  - The notice becomes immutable.

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Publish completion notice for project X<br/>(notice reference)
    BFF ->> Operations: Pass request
    Operations ->> Operations: Check role is PROJECT_ADMIN
    Operations ->> Operations: Check status is DRAFT
    Operations ->> Operations: Validate content is non-empty
    Operations ->> Operations: Transition status DRAFT -> PUBLISHED
    Operations ->> Operations: Freeze content (immutable)
    Operations -->> BFF: Published notice
    BFF -->> John DOE: Published notice
```
