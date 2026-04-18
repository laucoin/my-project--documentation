---
type: feature
modules:
  - core
objects:
  - participant
required_options:
tags:
  - participant
  - search
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Search Participants

## Objects used

- [Participant](/functional/business-objects/core/participant)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Descriptions

### Pagination

The results of the search are paginated, refer to the [pagination](/functional/features/pagination) for more details.

### Search & Filters

#### Text search

| Property            | Value                       |
|---------------------|-----------------------------|
| Type                | text                        |
| Strictness          | non-strict                  |
| Required            | no                          |
| Eligible for search | ``firstname``, ``lastname`` |

#### Is minor

| Property            | Value                   |
|---------------------|-------------------------|
| Type                | boolean                 |
| Strictness          | N/A                     |
| Required            | no                      |
| Eligible for search | `birthday` (computed)   |

#### Types

| Property            | Value           |
|---------------------|-----------------|
| Type                | array (of enum) |
| Strictness          | non-strict      |
| Required            | no              |
| Eligible for search | ``type``        |

#### Attendance dates

| Property            | Value                                    |
|---------------------|------------------------------------------|
| Type                | date                                     |
| Strictness          | N/A                                      |
| Required            | no                                       |
| Eligible for search | ``attendance_start``, ``attendance_end`` |

#### Statuses

| Property            | Value           |
|---------------------|-----------------|
| Type                | array (of enum) |
| Strictness          | non-strict      |
| Required            | no              |
| Eligible for search | ``status``      |

## Workflow

::: info
Access to the project scope is automatically gated by the [authentication profile check](/functional/features/authentication#project-scope-access-check).
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search participants for project X<br/>(with wanted search & filter)
    BFF ->> Core: Pass request
    Core -->> BFF: Paginated participants
    BFF -->> John DOE: Paginated participants
```

## Autocomplete

Used in the [Create Movement](/functional/features/create-movement) flow to select `REGISTERED` participants within the project scope. Text search only, no pagination.

### Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

### Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search participants (autocomplete, project scope)
    BFF ->> Core: Pass request (pre-filter: type = REGISTERED)
    Core -->> BFF: Matching participants (top results)
    BFF -->> John DOE: Matching participants
```
