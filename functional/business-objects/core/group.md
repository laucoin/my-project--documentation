---
module: core
scope: project
object_name: group
required_options: GROUP
created: 2026-04-11
last_update: 2026-04-11
---

# Group

## Definition

A **Group** is a named collection of [participants](/functional/business-objects/core/participant) within a project.
It is used to organise participants into sub-units:

- Simplify operations such as collective check-outs
- Set arrival and departure for a group or participant

```
Organization
└── Project
    └── Group
```

::: info Option required
Groups are only available if the **GROUP** option is enabled on the project.
:::

## Main attributes

| Attribute        | Description                                                                                                               |
|------------------|---------------------------------------------------------------------------------------------------------------------------|
| Name             | The group name                                                                                                            |
| Attendance dates | Date and time range to identify group start and end project participation (if not set: participate for whole the project) |

### Status

A group does not have an explicit status field. Its state is derived from:

| Situation                                            | Implied state   |
|------------------------------------------------------|-----------------|
| Has been soft deleted                                | Disabled        |
| No dates set OR today is between start and end dates | Present         |
| Start date is in the future                          | Not arrived yet |
| End date is in the past                              | Left            |

### Attendance dates

A group can have its own presence dates (start and end). These are optional. If not set, the group is full-time available.

## Action

### Creation

- Name: Creation
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- Name is required
	- Attendance dates are optional

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
	- `PROJECT_ADMIN`s still see the group but it should be marked “disabled” (refer to [status](#status)).

:::warning
When a group is soft-deleted, all group membership are **no longer considered active**. Participants who belonged to the
group lose that membership until the group is soft-deleted.
:::

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted groups
	- The members retrieve there membership

### Delete

::: info Delete ≠ Soft-Delete
Indeed Delete is a real deletion from database which on is definitive.
:::

- Name: Permanent delete
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- The deletion should not impact module [operations](/functional/business-objects/operations).
	- The deletion cannot be rollback

## Relationships

| Related object | Relationship                                      |
|----------------|---------------------------------------------------|
| Project        | A group belongs to one project                    |
| Participant    | A group contains zero or more participants        |
| Movement       | A group can be included in zero or more movements |
