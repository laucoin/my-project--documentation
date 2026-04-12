---
module: core
scope: project
object_name: activity
required_options: ACTIVITY
created: 2026-04-11
last_update: 2026-04-11
---

# Activity

## Definition

An **Activity** is a recurring event organized within a project. Its is used to enrich movements by
providing context for why participants are entering or leaving the project site.

```
Organization
└── Project
    └── Activity
```

::: info Option required
Activities are only available if the **ACTIVITY** option is enabled on the project.
:::

## Main attributes

| Attribute          | Description                                                         |
|--------------------|---------------------------------------------------------------------|
| Name               | The activity name                                                   |
| Description        | The activity description                                            |
| Capacity           | Range from the minimum required to the maximum participant          |
| Duration           | Estimated activity duration                                         |
| Availability dates | Date and time range to identify activity start and end availability |

### Status

An activity does not have an explicit status field. Its state is derived from:

| Situation                                            | Implied state     |
|------------------------------------------------------|-------------------|
| Has been soft deleted                                | Disabled          |
| No dates set OR today is between start and end dates | Active            |
| Start date is in the future                          | Not available yet |
| End date is in the past                              | No more available |

### Availability dates

An activity can have its own availability dates (start and end). These are optional. If not set, the activity is full-time available.

## Action

### Creation

- Name: Creation
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- Name is required
	- Description is optional
	- Capacity is required and must be upper than 0
	- Duration is required and must be upper than 0
	- Availability dates are optional

### Edition

- Name: Edition
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints (differences with creation):

### Soft-delete

- Name: Delete
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- The soft-deletion should not impact module [operations](/functional/business-objects/operations).
	- `PROJECT_ADMIN`s still see the activity but it should be marked “disabled” (refer to [status](#status)).

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted activities

### Delete

::: info Delete ≠ Soft-Delete
Delete is a real deletion from database which on is definitive.
:::

- Name: Permanent delete
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- The deletion should not impact module [operations](/functional/business-objects/operations).
	- The deletion cannot be rollback

## Relationships

| Related object | Relationship                                         |
|----------------|------------------------------------------------------|
| Project        | An activity belongs to one project                   |
| Movement       | An activity can be attached to one or more movements |
