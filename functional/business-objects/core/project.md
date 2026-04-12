---
module: core
scope: organization
object_name: project
created: 2026-04-11
last_update: 2026-04-11
---

# Project

## Definition

The **Project** is the central object of the application. In the legal sense, it represents a group care facility for
minors: a structured context defined by a period.

```
Organization
└── Project
```

## Main attributes

| Attribute      | Description                                           |
|----------------|-------------------------------------------------------|
| Name           | The project name                                      |
| Options        | List of enable options                                |
| Schedule range | Date and time range to identify project start and end |

### Options

The organization has some available [options](/functional/options). A project's options are limited to those enabled by its organization.

### Status

A project does not have an explicit status field. Its state is derived from:

| Situation                            | Implied state |
|--------------------------------------|---------------|
| Project has been soft deleted        | `BLOCKED`     |
| No dates set                         | `PERMANENT`   |
| Start date is in the future          | `UPCOMING`    |
| Today is between start and end dates | `IN_PROGRESS` |
| End date is in the past              | `ARCHIVED`    |

## Action

### Read & Search

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- Search are allowed on following field but not required:
		- Text search on name
		- Options includes options (one or multiples)
		- Scheduled dates includes a date
		- Status equal at least one given statuses

### Creation

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
	- `ORGANIZATION_USER`
- Constraints:
	- Name is required
	- Options are optional (no option given mean no option active)
	- Attendance dates are optional

::: warning Automatic profile creation
When a user create a project, a [profile](/functional/business-objects/core/profile) is automatically generated.
For more details, check the [profile adapted section](/functional/business-objects/core/profile#on-project-creation)
:::

### Edition

- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints (differences with creation):
	- There is no profile creation on project edition.

### Soft-delete

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
	- `PROJECT_ADMIN`
- Constraints:
	- All users belonging to that project (with a profile) are prevented from using it.
	- Existing data (participants, movements, etc.) is preserved.

### Enable-back

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- Only applicable to soft-deleted projects

### Delete

::: info Delete ≠ Soft-Delete
Delete is a real deletion from database which on is definitive.
:::

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- Should delete all operation content (participants, movements, etc.)
	- The deletion cannot be rolled back

## Relationships

| Related object | Relationship                                                              |
|----------------|---------------------------------------------------------------------------|
| Organization   | A project belongs to one organization                                     |
| Profile        | A project contains one or more profiles                                   |
| Group          | A project contains zero or more groups                                    |
| Participant    | A project contains zero or more participants                              |
| Movement       | A project contains zero or more movements                                 |
| Activity       | A project contains zero or more activities *(if option enabled)*          |
| Vehicle        | A project contains zero or more vehicles *(if option enabled)*            |
| Communication  | A project contains zero or more communications *(if option enabled)*      |
| Alert          | A project contains zero or more alerts *(if option enabled)*              |
| Period         | A project contains zero or more registration period *(if option enabled)* |
