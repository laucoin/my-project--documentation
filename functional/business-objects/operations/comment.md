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

::: info Editability
A Comment can be edited in place (message and tags) via [Edit comment](/functional/features/edit-comment), and removed via [Delete comment](/functional/features/delete-comment). See the [Editability policy](/functional/business-objects/operations/#editability-of-operations-entities).
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

A comment can carry zero or more [Tags](/functional/business-objects/operations/tag). Tags are project-scoped labels created once per project and reused across every participant's comments. The full definition (attributes, count semantics, lifecycle) is documented on the [Tag](/functional/business-objects/operations/tag) business object page.

::: info Tag moderation
Tag management (create, rename, delete) is restricted to `PROJECT_ADMIN` and
`PROJECT_MANAGER`. Other roles can attach existing tags to their comments but cannot modify the project tag catalog. See [Manage tags](/functional/features/manage-tags).
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
