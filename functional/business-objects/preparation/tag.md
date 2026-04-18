---
type: business-object
modules:
  - preparation
scope: project
object_name: preparation_tag
required_options: COMMENT
tags:
  - tag
  - comment
  - preparation
  - options
outline: deep
created: 2026-04-18
last_update: 2026-04-18
---

# Tag (Preparation)

::: info Option required
Tags are only available if the **COMMENT** option is enabled on the project.
:::

## Definition

A **Tag** is a project-scoped label used to categorize [Comments](/functional/business-objects/preparation/comment) posted on preparation sub-elements (typical day, planning, pedagogy, menu, budget). Tags are defined once per project and reused across every preparation comment.

::: info Distinct entity
Tag on Preparation Comments (this entity, Preparation module) and Tag on participant Comments
([Operations module](/functional/business-objects/operations/tag)) share the same concept and name but are distinct
technical entities with their own parent reference, catalog, and lifecycle.
:::

```
Project
├── Tag (Preparation)
└── Preparation
    └── <sub-element>
        └── Comment
            └── Tag (association, 0..N)
```

## Main attributes

| Attribute | Description                                                                             |
|-----------|-----------------------------------------------------------------------------------------|
| Label     | Human-readable name of the tag. Unique within the project (case-insensitive).           |
| Count     | Derived number of non-hidden preparation comments currently carrying this tag.          |

### Count

The count is not stored as a write-through field from comments — it supports a **quick-count increment**: a user can bump the count without writing a full comment, which is useful for rapid follow-up on a preparation discussion. The count is still consistent with the number of comments that carry the tag (deleting a comment decrements the count).

## Lifecycle

Tags are managed through [Manage tags](/functional/features/manage-tags):

- **Create** — create a new tag (initial count `0`).
- **Rename** — change the label. The tag identity is preserved, so every preparation comment that carried it keeps the association.
- **Delete** — remove the tag from the project catalog and detach it from every comment that carried it. Irreversible.

## Relationships

| Related object      | Relationship                                           |
|---------------------|--------------------------------------------------------|
| Project             | A tag belongs to one project                           |
| Preparation comment | A tag can be attached to zero or more comments         |
