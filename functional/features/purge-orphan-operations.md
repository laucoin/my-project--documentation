---
type: feature
modules:
  - core
  - operations
objects:
  - alert
  - communication
  - movement
required_options:
tags:
  - alert
  - communication
  - movement
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

## Objects used

- [Alert](/functional/business-objects/operations/alert)
- [Communication](/functional/business-objects/operations/communication)
- [Movement](/functional/business-objects/operations/movement)

## Purge condition

All object without a defined project (previously deleted).

## Constraints

- The deletion cannot be rolled back

## Workflow

```mermaid
sequenceDiagram
    autonumber
    par [Alert]
        Operations ->> Operations: Scheduler triggers purge of orphan projects’s alerts
        Operations ->> Operations: Find alerts without project
        Operations ->> Operations: Delete orphan alerts
    and [Movement]
        Operations ->> Operations: Scheduler triggers purge of orphan projects’s movements
        Operations ->> Operations: Find movements without project
        Operations ->> Operations: Delete orphan movements
    end
    Operations ->> Operations: Scheduler triggers purge of orphan communications
    Operations ->> Operations: Find communications without movement and/or alert
    Operations ->> Operations: Delete orphan communications
```