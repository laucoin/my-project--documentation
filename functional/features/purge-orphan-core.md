---
type: feature
modules:
  - core
objects:
  - activity
  - group
  - participant
  - profile
  - project
  - vehicle
required_options:
tags:
  - activity
  - group
  - participant
  - profile
  - project
  - vehicle
  - purge
outline: deep
created: 2026-04-14
last_update: 2026-04-14
---

# Purge Orphans

## Allowed roles

- `SUPER_ADMIN`

## Trigger

- Scheduler triggers purge of orphans for all projects on a regular basis (e.g., daily).
- Manual trigger by a user with the appropriate role through the BFF.

## Organization’s orphans

### Objects used

- [Project](/functional/business-objects/core/project)

### Purge condition

All project without a defined organization (previously deleted).

### Constraints

- The deletion cannot be rolled back

### Workflow

```mermaid
sequenceDiagram
    autonumber
    Core ->> Core: Scheduler triggers purge of orphan projects
    Core ->> Core: Find projects without organization
    Core ->> Core: Delete orphan projects
```

## Project’s orphans

### Objects used

- [Activity](/functional/business-objects/core/activity)
- [Group](/functional/business-objects/core/group)
- [Participant](/functional/business-objects/core/participant)
- [Profile](/functional/business-objects/core/profile)
- [Vehicle](/functional/business-objects/core/vehicle)

### Purge condition

All object without a defined project (previously deleted).

### Constraints

- The deletion cannot be rolled back

### Workflow

```mermaid
sequenceDiagram
    autonumber
    par [Activity]
        Core ->> Core: Scheduler triggers purge of orphan projects’s activities
        Core ->> Core: Find activities without project
        Core ->> Core: Delete orphan activities
    and [Group & Participant]
        Core ->> Core: Scheduler triggers purge of orphan projects’s groups and participants
        Core ->> Core: Find groups and participants without project
        Core ->> Core: Delete orphan groups and participants
        Core ->> Core: Find memberships without group or participant
        Core ->> Core: Delete orphan memberships
    and [Profile]
        Core ->> Core: Scheduler triggers purge of orphan projects’s profiles
        Core ->> Core: Find profiles without project
        Core ->> Core: Delete orphan profiles
    and [Vehicle]
        Core ->> Core: Scheduler triggers purge of orphan projects’s vehicles
        Core ->> Core: Find vehicles without project
        Core ->> Core: Delete orphan vehicles
    end
```