---
type: feature
modules:
  - core
objects:
  - organization
required_options:
tags:
  - organization
  - search
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Search Organizations

## Objects used

- [Organization](/functional/business-objects/core/organization)

## Allowed roles

- `SUPER_ADMIN`

## Descriptions

### Pagination

The results of the search are paginated, refer to the [pagination](/functional/features/pagination) for more details.

### Search & Filters

#### Text search

| Property            | Value              |
|---------------------|--------------------|
| Type                | text               |
| Strictness          | non-strict         |
| Required            | no                 |
| Eligible for search | ``name``, ``slug`` |

#### Is auth strict

| Property            | Value              |
|---------------------|--------------------|
| Type                | boolean            |
| Strictness          | N/A                |
| Required            | no                 |
| Eligible for search | ``is_strict_auth`` |

#### Is main

| Property            | Value       |
|---------------------|-------------|
| Type                | boolean     |
| Strictness          | N/A         |
| Required            | no          |
| Eligible for search | ``is_main`` |

#### Options

| Property            | Value           |
|---------------------|-----------------|
| Type                | array (of enum) |
| Strictness          | non-strict      |
| Required            | no              |
| Eligible for search | ``options``     |

#### Statuses

| Property            | Value           |
|---------------------|-----------------|
| Type                | array (of enum) |
| Strictness          | non-strict      |
| Required            | no              |
| Eligible for search | ``status``      |

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search organizations<br/>(with wanted search & filter)
    BFF ->> Core: Pass request
    Core -->> BFF: Paginated organizations
    BFF -->> John DOE: Paginated organizations
```
