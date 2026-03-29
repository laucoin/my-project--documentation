---
outline: deep
---

# Roles

The application has two levels of roles: **global roles** that apply to the platform as a whole, and **project roles**
that grant access to a specific project through a profile.

---

## Global roles

Every user has exactly one global role. The default role assigned to every account is `USER`.

| Role          | Description                                                         |
|---------------|---------------------------------------------------------------------|
| `USER`        | Standard user — default role for every account                      |
| `SUPER_ADMIN` | Platform administrator — full visibility across the entire platform |

### USER

A `USER` can:

- Log in and out
- Create a project *(automatically receives a permanent `PROJECT_ADMIN` profile on it)*
- View and manage their own profiles *(accept or reject pending invitations)*
- Access a project using an active profile *(while today falls within the profile's date range)*
- Browse projects open for registration *(those with an active registration period today)*
- Submit registration requests for those projects

### SUPER_ADMIN

A `SUPER_ADMIN` inherits all `USER` permissions, and can additionally:

- View all users, and block, unlock, or delete them
- View all projects, whether or not they are open for registration
- Create a temporary profile on any project *(one hour, automatically approved — no invitation required)*

::: info
A super admin cannot perform actions on a project's data without a profile. Creating a temporary profile is their only
way to interact with a project.
:::

---

## Project roles

A project role is granted through a **profile**, which links a user to a specific project. Three project roles exist:

| Role                  | Description                                                                     |
|-----------------------|---------------------------------------------------------------------------------|
| `PROJECT_ADMIN`       | Full control over the project and its configuration                             |
| `PROJECT_COORDINATOR` | Operational access — manages day-to-day content but not administrative settings |
| `PROJECT_PARTICIPANT` | Restricted operational access — limited to operation entities only              |

### PROJECT_ADMIN

A `PROJECT_ADMIN` can create, read, update, and delete all objects within the project scope:

- The project itself and its settings
- Groups, participants, activities, vehicles
- Movements, alerts, communications
- Registration periods and requests *(if the REGISTRATION option is enabled)*
- Profiles linked to the project *(inviting users, assigning roles, blocking, unblocking, revoking access)*

### PROJECT_COORDINATOR

A `PROJECT_COORDINATOR` has broad operational access but cannot touch administrative settings or profiles:

| Permission                              | PROJECT_COORDINATOR |
|-----------------------------------------|---------------------|
| Create objects                          | ✓                   |
| Read objects                            | ✓                   |
| Update objects                          | ✓                   |
| Disable objects                         | ✓                   |
| Re-enable objects                       | ✗                   |
| Delete objects                          | ✗                   |
| Update the project itself               | ✗                   |
| Invite users to the project             | ✗                   |
| Edit, block, unblock or delete profiles | ✗                   |
| Access registration features            | ✗                   |

::: info
The `PROJECT_COORDINATOR` role is intended for operational staff. A coordinator can record movements and manage alerts,
but has no access to project configuration, user management, or registration.
:::

### PROJECT_PARTICIPANT

A `PROJECT_PARTICIPANT` has the most restricted access — limited to operation entities only:

| Permission                                        | PROJECT_PARTICIPANT |
|---------------------------------------------------|---------------------|
| Record movements                                  | ✓                   |
| Create and view alerts                            | ✓                   |
| Participate in communications                     | ✓                   |
| Access project configuration                      | ✗                   |
| Manage groups, participants, activities, vehicles | ✗                   |
| Access profiles                                   | ✗                   |
| Access registration features                      | ✗                   |

::: info
The `PROJECT_PARTICIPANT` role is intended for youth participants who need to interact with operational features only.
:::

---

## Profiles

A **profile** is the link between a user and a project. It carries the project role, the period during which access is
active, and the invitation status.

### Profile attributes

| Attribute         | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| User              | The user this profile belongs to                                            |
| Project           | The project this profile grants access to                                   |
| Role              | `PROJECT_ADMIN`, `PROJECT_COORDINATOR`, or `PROJECT_PARTICIPANT`            |
| Start date        | From when the profile is active *(optional)*                                |
| End date          | Until when the profile is active *(optional — no end date means permanent)* |
| Invitation status | `INVITED`, `ACCEPTED`, or `REJECTED`                                        |

A user can only use a profile while today falls within its active date range **and** the invitation status is
`ACCEPTED`.

### Creating a profile

| Method            | Initiated by       | Result                                                                                        |
|-------------------|--------------------|-----------------------------------------------------------------------------------------------|
| Project creation  | Any `USER`         | Immediate permanent `PROJECT_ADMIN` profile, status `ACCEPTED`, no invitation required        |
| Invitation        | A `PROJECT_ADMIN`  | Invitation sent to a user within the same organisation *(see lifecycle below)*                |
| Direct assignment | `SUPER_ADMIN` only | Temporary `PROJECT_ADMIN` profile lasting one hour, status `ACCEPTED`, automatically approved |

### Invitation lifecycle

When a `PROJECT_ADMIN` invites a user, the invitation goes through the following lifecycle:

```
INVITED ──► ACCEPTED
        └─► REJECTED
```

The invited user accepts or rejects the invitation from their profile view. Upon acceptance, the profile becomes active.

### Mandatory permanent admin

::: warning
Every project must always have at least one `PROJECT_ADMIN` profile with no end date. A project can never be left
without a permanent administrator.
:::
