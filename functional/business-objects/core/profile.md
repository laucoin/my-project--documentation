---
type: business-object
modules:
  - core
scope:
  - project
  - user
object_name: profile
required_options:
tags:
  - profile
  - roles
  - permissions
outline: deep
created: 2026-04-11
last_update: 2026-04-12
---

# Profile

## Definition

A **profile** is the link between a user and a project. It carries the project role, the period during which access is
active, and the invitation status.

```
Organization
├── Project ──┐
│             ├── Profile
└── User ─────┘
```

## Usage

A user concerned by the profile can only use it while today falls within its active date range **and** the invitation
status is `ACCEPTED`.

## Main attributes

| Attribute    | Description                                                                          |
|--------------|--------------------------------------------------------------------------------------|
| User         | Concerned user                                                                       |
| Project      | Concerned project                                                                    |
| Type         | Profile type                                                                         |
| Role         | Project scope role (check full role list [here](/functional/features/roles#project)) |
| Status       | Invitation status                                                                    |
| Access dates | Date and time range to identify profile access start and end                         |

### Type

Possible values:

- `DEFAULT`
- `SUPPORT`

## Status

A profile has 2 statuses. To be active, a profile must have:

- `ACCEPTED` invitation status
- Permanent or in progress usage status

### Invitation status

Possible values:

- `INVITED`
- `ACCEPTED`
- `REJECTED`

::: info
There is currently no email notification for invitations. The invited user discovers the invitation on their first
login or during a subsequent visit to the application.
:::

#### Invitation lifecycle

When a `PROJECT_ADMIN` invites a user, the invitation goes through the following lifecycle:

```
INVITED ──► ACCEPTED
        └─► REJECTED
```

The invited user accepts or rejects the invitation from their profile view. Upon acceptance, the profile becomes active.

### Usage status

Its state is derived from its dates.

| Situation                            | Implied state |
|--------------------------------------|---------------|
| Profile has been soft deleted        | `BLOCKED`     |
| No dates set                         | `PERMANENT`   |
| Start date is in the future          | `UPCOMING`    |
| Today is between start and end dates | `IN_PROGRESS` |
| End date is in the past              | `EXPIRED`     |

### Access dates

A profile can have its own access dates (start and end). These are optional. If not set, the profile is full-time available.

## Relationships

| Related object | Relationship                     |
|----------------|----------------------------------|
| Project        | A profile belongs to one project |
| User           | A profile concerns one user      |
