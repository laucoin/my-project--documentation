---
type: feature
modules:
  - operations
objects:
  - completion-notice
  - participant
required_options:
  - COMPLETION_NOTICE
tags:
  - completion-notice
  - creation
  - options
outline: deep
created: 2026-04-18
last_update: 2026-04-18
---

# Create Completion Notice

::: info Option required
Requires the **COMPLETION_NOTICE** option to be enabled on the project.
:::

## Objects used

- [Completion Notice](/functional/business-objects/operations/completion-notice)
- [Participant](/functional/business-objects/core/participant) — parent

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`

## Constraints

- `participant` is required and must belong to the project.
- `type` is required: `INTERNAL` or `EXTERNAL`.
- A participant can have at most one notice **per type**. Creating a second notice of the same type for the same participant is rejected.
- The notice is created in `DRAFT` status. Publication happens through [Publish completion notice](/functional/features/publish-completion-notice).

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Create completion notice for project X<br/>(participant reference, type, content)
    BFF ->> Operations: Pass request
    Operations ->> Core: Validate participant
    Core -->> Operations: Validated
    Operations ->> Operations: Check no existing notice for (participant, type)
    Operations ->> Operations: Create notice in DRAFT status
    Operations -->> BFF: Created notice
    BFF -->> John DOE: Created notice
```
