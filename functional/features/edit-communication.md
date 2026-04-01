---
type: feature
modules:
  - operations
objects:
  - communication
required_options:
  - COMMUNICATION
tags:
  - communication
  - edition
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Edit Communication

::: warning Not a real edit
Editing a communication soft-deletes the existing one and creates a new one pre-filled with the original data. The form is pre-filled with the original data.
:::

::: info Option required
Requires the **COMMUNICATION** option to be enabled on the project.
:::

## Objects used

- [Communication](/functional/business-objects/operations/communication)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Constraints

- Only the message is editable

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Edit communication for project X<br/>(updated message)
    BFF ->> Operations: Pass request
    Operations ->> Operations: Soft-delete original communication
    Operations ->> Operations: Create new communication
    Operations -->> BFF: New communication
    BFF -->> John DOE: New communication
```
