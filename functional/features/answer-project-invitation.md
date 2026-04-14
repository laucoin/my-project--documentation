---
type: feature
modules:
  - core
objects:
  - profile
required_options:
tags:
  - profile
  - invitation
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Answer Profile Invitation

## Objects used

- [Profile](/functional/business-objects/core/profile)

## Allowed roles

- The user concerned by the profile

## Constraints

- Can only update status from `INVITED` to `ACCEPTED` or `REJECTED`
- If `ACCEPTED` and today falls within the profile's `access_start`/`access_end` range, the user's session rights and roles must be refreshed

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Answer invitation (ACCEPTED or REJECTED)
    BFF ->> Core: Pass request
    Core ->> Core: Update profile status
    alt REJECTED
        Core -->> BFF: Updated profile
    else ACCEPTED
        Core ->> Core: Check if today is within access date range
        alt Access date range includes today
            Core ->> Core: Refresh session rights/roles
        end
        Core -->> BFF: Updated profile
    end
    BFF -->> John DOE: Updated profile
```
