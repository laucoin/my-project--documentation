---
type: business-object
modules:
  - core
scope: project
object_name: group
required_options: GROUP
tags:
  - group
  - options
outline: deep
created: 2026-04-11
last_update: 2026-04-11
---

# Group

::: info Option required
Groups are only available if the **GROUP** option is enabled on the project.
:::

## Definition

A **Group** is a named collection of [participants](/functional/business-objects/core/participant) within a project.
It is used to organize participants into subunits:

- Simplify operations such as collective check-outs
- Set arrival and departure for a group or participant

```
Organization
└── Project
    └── Group
```

### Eligible participants

Only `REGISTERED` participants can be part of a group.

## Main attributes

| Attribute        | Description                                                                                                               |
|------------------|---------------------------------------------------------------------------------------------------------------------------|
| Name             | The group name                                                                                                            |
| Attendance dates | Date and time range to identify group start and end project participation (if not set: participate for whole the project) |

### Status

A group does not have an explicit status field. Its state is derived from:

| Situation                                            | Implied state     |
|------------------------------------------------------|-------------------|
| Has been soft deleted                                | `DISABLED`        |
| No dates set OR today is between start and end dates | `SHOULD_BE_HERE`  |
| Start date is in the future                          | `NOT_ARRIVED_YET` |
| End date is in the past                              | `NO_MORE_HERE`    |

### Attendance dates

A group can have its own presence dates (start and end). These are optional. If not set, the group is full-time available.

## Relationships

| Related object | Relationship                                      |
|----------------|---------------------------------------------------|
| Project        | A group belongs to one project                    |
| Participant    | A group contains zero or more participants        |
| Movement       | A group can be included in zero or more movements |
