---
type: business-object
modules:
  - core
scope: project
object_name: activity
required_options: ACTIVITY
tags:
  - activity
  - options
outline: deep
created: 2026-04-11
last_update: 2026-04-11
---

# Activity

::: info Option required
Activities are only available if the **ACTIVITY** option is enabled on the project.
:::

## Definition

An **Activity** is a recurring event organized within a project. It is used to enrich movements by
providing context for why participants are entering or leaving the project site.

```
Organization
└── Project
    └── Activity
```

## Main attributes

| Attribute          | Description                                                         |
|--------------------|---------------------------------------------------------------------|
| Name               | The activity name                                                   |
| Description        | The activity description                                            |
| Capacity           | Range from the minimum required to the maximum participant          |
| Duration           | Estimated activity duration                                         |
| Availability dates | Date and time range defining when the activity is available        |

### Status

An activity does not have an explicit status field. Its availability state is derived from:

| Situation                                            | Implied availability state |
|------------------------------------------------------|----------------------------|
| Has been soft deleted                                | `DISABLED`                 |
| No dates set OR today is between start and end dates | `AVAILABLE`                |
| Start date is in the future                          | `NOT_AVAILABLE_YET`        |
| End date is in the past                              | `NO_MORE_AVAILABLE`        |

### Availability dates

An activity can have its own availability dates (start and end). These are optional. If not set, the activity is full-time available.

## Relationships

| Related object | Relationship                                         |
|----------------|------------------------------------------------------|
| Project        | An activity belongs to one project                   |
| Movement       | An activity can be attached to one or more movements |
