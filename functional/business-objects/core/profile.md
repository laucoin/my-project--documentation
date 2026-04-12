---
module: core
scope: project
object_name: profile
created: 2026-04-11
last_update: 2026-04-12
---

# Profile

## Definition

A **profile** is the link between a user and a project. In other words, a profile allow user to interact with a project
depending is profile role.

```
Organization
└── Project
    └── Profile
```

## Main attributes

| Attribute    | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| User         | Concerned user                                                              |
| Project      | Concerned project                                                           |
| Type         | Profile type                                                                |
| Role         | Project scope role (check full role list [here](/functional/roles#project)) |
| Status       | Invitation status                                                           |
| Access dates | Date and time range to identify profile access start and end                |

### Type

Possible values:

- `DEFAULT`
- `SUPPORT`

## Status

A profile as 2 statuses. To be used a profile must has:

- `ACCEPTED` invitation status
- Permanent or in progress usage status

### Invitation status

Possible values:

- `INVITED`
- `ACCEPTED`
- `REJECTED`

### Usage status

Its state is derived from its dates.

| Situation                            | Implied state |
|--------------------------------------|---------------|
| Profile has been soft deleted        | Blocked       |
| No dates set                         | Permanent     |
| Start date is in the future          | Upcoming      |
| Today is between start and end dates | In progress   |
| End date is in the past              | Ended         |

### Access dates

A profile can have its own access dates (start and end). These are optional. If not set, the profile is full-time available.

## Action

### Creation

- Name: Creation
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- User is required (user search in organization scope)
	- Project is required
	- Type is automatically set to `DEFAULT`
	- Role is required (You can only assign your role or lower)
	- Invitation status is automatically set to `INVITED`
	- Access dates are optional

::: info
If a user is not found in the organization, that mean, he never login to the application. If not created, it create [light user](/functional/business-objects/core/user#light-user-creation) a link it to your invitation.
:::

### Support profile

::: info
The support profile can only be created via the project himself
:::

- Name: Support profile
- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- User is automatically set to the creator
	- Project is automatically set to the selected project
	- Type is automatically set to `SUPPORT`
	- Role is automatically defined as `PROJECT_ADMIN`
	- Invitation status is automatically set to `ACCEPTED`
	- Access end date is automatically set to 1 hours after the creation

### On project creation

::: info
This profile can only be created automatically on the project creation for the creator.
:::

- Name: Support profile
- Allowed roles: **The project creator**
- Constraints:
	- User is automatically set to the creator
	- Project is automatically set to the created project
	- Type is automatically set to `DEFAULT`
	- Role is automatically defined as `PROJECT_ADMIN`
	- Invitation status is automatically set to `ACCEPTED`
	- Access dates is not defined

### Edition

- Name: Edition
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints (differences with creation):
	- Type cannot be changed
	- Invitation status cannot be changed

### Answer invitation

- Name: Answer invitation
- Allowed roles: **Must be the user concerned by the profile**
- Constraints (differences with creation):
	- Can only update status from `INVITED` to `ACCEPTED` or `REJECTED`

### Soft-delete

- Name: Delete
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- The user concerned by the profile cannot access project anymore.
	- `SUPPORT` profile cannot be soft-delete.
	- `PROJECT_ADMIN`s still see the profile but it should be marked “disabled” (refer to [status](#status)).
	- It must have at least one permanent profile with role `PROJECT_ADMIN` and type `DEFAULT` in the project.

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted profiles

## Relationships

| Related object | Relationship                          |
|----------------|---------------------------------------|
| Project        | A profile belongs to one organization |
| User           | A profile concerns one user           |
