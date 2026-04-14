---
type: feature
modules:
  - core
objects:
  - user
required_options:
tags:
  - user
  - search
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Search Users

## Objects used

- [User](/functional/business-objects/core/user)

## Allowed roles

- `SUPER_ADMIN`
- `ORGANIZATION_ADMIN`

## Descriptions

### Pagination

The results of the search are paginated, refer to the [pagination](/functional/features/pagination) for more details.

### Search & Filters

#### Text search

| Property            | Value                                  |
|---------------------|----------------------------------------|
| Type                | text                                   |
| Strictness          | non-strict                             |
| Required            | no                                     |
| Eligible for search | ``firstname``, ``lastname``, ``email`` |

#### Statuses

| Property            | Value           |
|---------------------|-----------------|
| Type                | array (of enum) |
| Strictness          | non-strict      |
| Required            | no              |
| Eligible for search | ``status``      |

## Workflow

::: info
`SUPER_ADMIN` searches across all users. `ORGANIZATION_ADMIN` is restricted to users within their organization scope.
:::

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search users<br/>(with wanted search & filter)
    BFF ->> Core: Pass request
    alt John DOE is SUPER_ADMIN
        Core -->> Core: Enrich with organization info
        Core -->> BFF: Paginated users (all)
    else John DOE is ORGANIZATION_ADMIN
        Core -->> BFF: Paginated users (organization scope)
    end
    BFF -->> John DOE: Paginated users
```

## Autocomplete

Used in the [Invite User to Project](/functional/features/invite-user-to-project) flow to search for a user within the organization scope. Text search only, no pagination.

### Allowed roles

- `PROJECT_ADMIN` — scoped to their organization

### Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search users (autocomplete, organization scope)
    BFF ->> Core: Pass request
    Core -->> BFF: Matching users (top results)
    BFF -->> John DOE: Matching users
```
