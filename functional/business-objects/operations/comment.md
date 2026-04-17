---
type: business-object
modules:
  - operations
scope:
  - participant
object_name: comment
required_options: COMMENT
tags:
  - comment
  - operations
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Comment

::: info Option required
Comments are only available if the **COMMENT** option is enabled on the project.
:::

## Definition

A **Comment** is a message posted by a logged-in user on a **participant**. It is used for annotation and
follow-up on a participant throughout the project.

::: info Distinct entity
Comment on a Participant (this entity, Operations module) and Comment on a Preparation element
([Preparation module](/functional/business-objects/preparation/comment)) share the same concept and name but are
distinct technical entities with their own parent reference and lifecycle.
:::

```
Project
└── Participant
    └── Comment
```

## Main attributes

| Attribute | Description                                   |
|-----------|-----------------------------------------------|
| Message   | The comment message                           |
| Author    | The logged-in user who created the comment    |
| Tags      | Zero or more tags associated with the comment |

### Tags

Tags are project-scoped labels that can be attached to a comment to categorize it.

- Tags are created and managed at the **project** level.
- A comment can carry zero or more tags.
- The count of comments sharing a given tag is tracked and can be incremented without adding a full comment (quick
  count increment).

::: info Tag moderation
Tag management (creation, definition, moderation) is handled at the project level. Access rules follow the standard
project role model.
:::

### Status

A comment does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | `HIDDEN`      |
| Have not been soft deleted | `VISIBLE`     |

## Relationships

| Related object | Relationship                                            |
|----------------|---------------------------------------------------------|
| Participant    | A comment is attached to one participant                |
| User           | A comment is authored by one user (zero if user purged) |
| Tag            | A comment can carry zero or more tags                   |
