---
module: core
scope: project
object_name: participant
created: 2026-04-11
last_update: 2026-04-11
---

# Participant

## Definition

A **Participant** is a person registered in a project. Participants are the primary subjects of the
application: their presence, movements, and registrations are tracked.

```
Organization
└── Project
    ├── Group
    │   └── Participant
    └── Participant
```

::: info Participant relation to group
A participant take part of a project and can (if GROUP option is enabled) be added in group. But groups are only a package not a parent.
:::

::: warning Participant ≠ User
A participant is not the same as an application user. A user is a person who logs into the app. A participant is a
person who takes part in a project. The two can optionally be linked, but they remain distinct concepts. Linking a
participant to a user is never mandatory.
:::

## Main attributes

| Attribute        | Description                                                                                                                                  |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Lastname         | The participant lastname                                                                                                                     |
| Firstname        | The participant firstname                                                                                                                    |
| Birthday         | The participant date of birth                                                                                                                |
| Type             | Registered OR Guest (scheduled or created in a movement)                                                                                     |
| Attendance dates | Date and time range to identify participant start and end project participation (if not set: participate for whole project or groups period) |
| User             | Optional link a user                                                                                                                         |

### Minor VS Major

A participant is classified as a minor or major based solely on their **birthdate**, compared against **today's date**.
This classification is re-evaluated dynamically — a participant can become a major during the course of a project.

### Type

There is 2 types:

- REGISTERED
- GUEST

A **Guest** (`type = GUEST`) is a lightweight variant of a participant. Unlike a registered participant
(`type = REGISTERED`), a guest is not pre-registered in the project — they are created at the time of a movement.
Guests share the same table as registered participants but are distinguished by their type and carry no project history
outside of the movement they were created for.

#### Guest lifecycle

A guest's lifecycle is strictly limited to **two movements**:

1. An `IN` movement — the guest enters the site.
2. An `OUT` movement — the guest leaves the site.

No further movements can be recorded for a guest after they have gone out.

### Status

A participant does not have an explicit status field. Its state is derived from:

| Type         | Situation                                                                         | Implied state   |
|--------------|-----------------------------------------------------------------------------------|-----------------|
| `REGISTERED` | Has been soft deleted                                                             | Disabled        |
| `REGISTERED` | No dates set (nor participant, nor group) OR today is between start and end dates | Present         |
| `REGISTERED` | Start date is in the future                                                       | Not arrived yet |
| `REGISTERED` | End date is in the past                                                           | Left            |
| `GUEST`      | Has been soft deleted                                                             | Disabled        |
| `GUEST`      | No dates set (nor participant, nor group) OR today is between start and end dates | Present         |
| `GUEST`      | End date is in the past                                                           | Left            |

### Attendance dates

A participant can have their own attendance dates (arrival and departure). These are optional.

How to read participant presence:

```mermaid
flowchart TD
    P[John DOE] --> PHD{Does John DOE have specified attendance dates?}
    PHD -->|Yes| PD[That's are his attendance dates]
    PHD -->|No| PHG{Does John DOE have group membership?}
    PHG -->|Yes| GHD{Does John DOE have at least 1 group without specified attendance dates?}
    GHD -->|Yes| PAT[John DOE is a permanent participant]
    PHG -->|No| PAT
    GHD -->|Yes just 1| PD
    GHD -->|Yes more than 1| PHM1G([Sum all his group range])
    PHM1G --> PD
```

::: warning Particular group logic
A participant without attendance dates nor group is considered as permanent.
VS
A participant without attendance dates but with a group depend or the group date.
:::

## Action

### Creation

- Name: Creation
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER` -> Only for `GUEST` participant
- Constraints:
	- Lastname is required
	- Firstname is required
	- Birthday is required
	- Type is automatically set depending the context (except creating in movement participant are `REGISTERED`)
	- Attendance dates are optional
	- User is optional

### Edition

- Name: Edition
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints (differences with creation):
	- Type cannot be changed

### Soft-delete

- Name: Delete
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- The soft-deletion should not impact module [operations](/functional/business-objects/operations).
	- `PROJECT_ADMIN`s still see the participant but it should be marked “disabled” (refer to [status](#status)).

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `PROJECT_ADMIN`
- Constraints:
	- Only applicable to soft-deleted participants

### Purge (GDPR)

Condition to purge: Participant has no related action in [operations](/functional/business-objects/operations) since 1 year.

- Name: Purge
- Allowed roles:
	- `PROJECT_ADMIN`
	- Any user linked to the concerned participant
- Constraints:
	- The deletion MUST impact module [operations](/functional/business-objects/operations).
	- The deletion cannot be rollback

::: danger Impact on data
The participant is remove from all data including module [operations](/functional/business-objects/operations). That mean data became inconsistant,
and affected data like movement, communication, etc. should be marked as inconsistent.

Data must be masked as inconsistent to notify the user, the data you see is partially valid.
:::

### Data extraction (GDPR)

- Name: Data extraction
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- Any user linked to the concerned participant
- Constraints:
	- Should not include other participant personal data

#### Extraction content

- Participant [information](#main-attributes)
- Movements

## Relationships

| Related object | Relationship                                                |
|----------------|-------------------------------------------------------------|
| Project        | A participant belongs to one project                        |
| Group          | A participant can belong to zero or more groups             |
| Movement       | A participant can be included in zero or more movements     |
| User           | A participant can be linked to zero or one application user |
