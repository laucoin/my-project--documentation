---
type: business-object
modules:
  - preparation
scope:
  - preparation
object_name: preparation_comment
required_options: COMMENT
tags:
  - comment
  - preparation
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Comment (Preparation)

::: info Option required
Comments are only available if the **COMMENT** option is enabled on the project.
:::

## Definition

A **Comment** on a preparation element is a message posted by a logged-in user on one of the sub-elements of a
[Preparation](/functional/business-objects/preparation/): Typical day, Planning, Pedagogy, Menu, or Budget.

::: info Distinct entity
Comment on a Preparation element (this entity, Preparation module) and Comment on a Participant
([Operations module](/functional/business-objects/operations/comment)) share the same concept and name but are
distinct technical entities with their own parent reference and lifecycle.
:::

```
Project
└── Preparation
    ├── Typical day
    │   └── Comment
    ├── Planning
    │   └── Comment
    ├── Pedagogy
    │   └── Comment
    ├── Menu
    │   └── Comment
    └── Budget
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

### Status

A comment does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | `HIDDEN`      |
| Have not been soft deleted | `VISIBLE`     |

## Relationships

| Related object      | Relationship                                            |
|---------------------|---------------------------------------------------------|
| Preparation element | A comment is attached to one preparation element        |
| User                | A comment is authored by one user (zero if user purged) |
| Tag                 | A comment can carry zero or more tags                   |
