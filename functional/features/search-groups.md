---
type: feature
modules:
  - core
objects:
  - group
required_options:
  - GROUP
tags:
  - group
  - search
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Search Groups

::: info Option required
Requires the **GROUP** option to be enabled on the project.
:::

## Objects used

- [Group](/functional/business-objects/core/group)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Descriptions

### Pagination

The results of the search are paginated, refer to the [pagination](/functional/features/pagination) for more details.

### Search & Filters

#### Text search

| Property            | Value      |
|---------------------|------------|
| Type                | text       |
| Strictness          | non-strict |
| Required            | no         |
| Eligible for search | ``name``   |

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
    John DOE ->> BFF: Search groups for project X<br/>(with wanted search & filter)
    BFF ->> Core: Pass request
    Core -->> BFF: Paginated groups
    BFF -->> John DOE: Paginated groups
```

## Autocomplete

Used in the [Create Movement](/functional/features/create-movement) flow to select a group within the project scope. Text search only, no pagination.

### Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

### Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search groups (autocomplete, project scope)
    BFF ->> Core: Pass request
    Core -->> BFF: Matching groups (top results)
    BFF -->> John DOE: Matching groups
```
