---
module: core
scope: project
object_name: vehicle
required_options: VEHICLE
created: 2026-04-12
last_update: 2026-04-12
---

# Vehicle

::: info Option required
Vehicles are only available if the **VEHICLE** option is enabled on the project.
:::

## Definition

A **Vehicle** is a means of transport that can be associated with a movement. Its primary purpose is to record which
vehicle was used and who was driving it, so that the driver can be identified in the event of a traffic incident.

```
Organization
└── Project
    └── Vehicle
```

## Main attributes

| Attribute          | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| License plate      | The vehicle's registration number                                  |
| Brand              | The vehicle manufacturer                                           |
| Model              | The vehicle model                                                  |
| Availability dates | Date and time range to identify vehicle start and end availability |

### Status

A vehicle does not have an explicit status field. Its state is derived from:

| Situation                                                                                     | Implied state  |
|-----------------------------------------------------------------------------------------------|----------------|
| Has been soft deleted                                                                         | `DISABLED`     |
| Arrival date is in the future                                                                 | `NOT_HERE`     |
| End date is in the past                                                                       | `NO_MORE_HERE` |
| Refer to [movement](/functional/business-objects/operations/movement#vehicle-presence-status) |                |
| No dates set OR today is between start and end dates                                          | `NOT_USED_YET` |

### Availability dates

A vehicle can have its own availability dates (start and end). These are optional. If not set, the vehicle is full-time available.

## Action

### Read & Search

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Search are allowed on following field but not required:
		- Text search on license plate, brand, model
		- Available dates includes a date
		- Status equal at least one given statuses

### Creation

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- License plate is required
	- Brand is required
	- Model is required
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
	- `PROJECT_ADMIN`s still see the vehicle but it should be marked “disabled” (refer to [status](#status)).

### Enable-back

- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted vehicles

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

| Related object | Relationship                                       |
|----------------|----------------------------------------------------|
| Project        | A vehicle belongs to one project                   |
| Movement       | A vehicle can be attached to one or more movements |
