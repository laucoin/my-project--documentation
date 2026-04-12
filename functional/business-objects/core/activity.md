---
module: core
scope: project
object_name: activity
required_options: ACTIVITY
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
| Availability dates | Date and time range to identify activity start and end availability |

### Status

An activity does not have an explicit status field. Its state is derived from:

| Situation                                            | Implied state       |
|------------------------------------------------------|---------------------|
| Has been soft deleted                                | `DISABLED`          |
| No dates set OR today is between start and end dates | `AVAILABLE`         |
| Start date is in the future                          | `NOT_AVAILABLE_YET` |
| End date is in the past                              | `NO_MORE_AVAILABLE` |

### Availability dates

An activity can have its own availability dates (start and end). These are optional. If not set, the activity is full-time available.

## Action

### Read & Search

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Search are allowed on following field but not required:
		- Text search on name or description (with different ponderation name > description)
		- Capacity include a number of participant
		- Duration equal a duration
		- Available dates includes a date
		- Status equal at least one given statuses

### Creation

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- Name is required
	- Description is optional
	- Capacity is required and must be greater than 0
	- Duration is required and must be greater than 0
	- Availability dates are optional

### Edition

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints (differences with creation):

### Soft-delete

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- The soft-deletion should not impact module [operations](/functional/business-objects/operations).
	- `PROJECT_ADMIN`s still see the activity but it should be marked “disabled” (refer to [status](#status)).

### Enable-back

- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted activities

### Delete

::: info Delete ≠ Soft-Delete
Delete is a permanent removal from the database.
:::

- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- The deletion must not affect the [operations](/functional/business-objects/operations) module.
	- The deletion cannot be rolled back

## Relationships

| Related object | Relationship                                         |
|----------------|------------------------------------------------------|
| Project        | An activity belongs to one project                   |
| Movement       | An activity can be attached to one or more movements |
