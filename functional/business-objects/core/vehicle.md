---
module: core
scope: project
object_name: vehicle
required_options: VEHICLE
created: 2026-04-12
last_update: 2026-04-12
---

# Vehicle

A **Vehicle** is a means of transport that can be associated with a movement. Its primary purpose is to record which
vehicle was used and who was driving it, so that the driver can be identified in the event of a traffic incident.

```
Organization
└── Project
    └── Vehicle
```

::: info Option required
Vehicles are only available if the **VEHICLE** option is enabled on the project.
:::

## Main attributes

| Attribute          | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| License plate      | The vehicle's registration number                                  |
| Brand              | The vehicle manufacturer                                           |
| Model              | The vehicle model                                                  |
| Availability dates | Date and time range to identify vehicle start and end availability |

### Status

A vehicle does not have an explicit status field. Its state is derived from:

| Situation                                            | Implied state     |
|------------------------------------------------------|-------------------|
| Has been soft deleted                                | Disabled          |
| No dates set OR today is between start and end dates | Active            |
| Start date is in the future                          | Not available yet |
| End date is in the past                              | No more available |

### Availability dates

A vehicle can have its own availability dates (start and end). These are optional. If not set, the vehicle is full-time available.

## Action

### Creation

- Name: Creation
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- License plate is required
	- Brand is required
	- Model is required
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
	- `PROJECT_ADMIN`s still see the vehicle but it should be marked “disabled” (refer to [status](#status)).

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted vehicles

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

| Related object | Relationship                                       |
|----------------|----------------------------------------------------|
| Project        | A vehicle belongs to one project                   |
| Movement       | A vehicle can be attached to one or more movements |
