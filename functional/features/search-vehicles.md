---
type: feature
modules:
  - core
objects:
  - vehicle
required_options:
  - VEHICLE
tags:
  - vehicle
  - search
  - options
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Search Vehicles

::: info Option required
Requires the **VEHICLE** option to be enabled on the project.
:::

## Objects used

- [Vehicle](/functional/business-objects/core/vehicle)

## Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

## Descriptions

### Pagination

The results of the search are paginated, refer to the [pagination](/functional/features/pagination) for more details.

### Search & Filters

#### Text search

| Property            | Value                                   |
|---------------------|-----------------------------------------|
| Type                | text                                    |
| Strictness          | non-strict                              |
| Required            | no                                      |
| Eligible for search | ``license_plate``, ``brand``, ``model`` |

#### Availability dates

| Property            | Value                                        |
|---------------------|----------------------------------------------|
| Type                | date                                         |
| Strictness          | N/A                                          |
| Required            | no                                           |
| Eligible for search | ``availability_start``, ``availability_end`` |

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
    John DOE ->> BFF: Search vehicles for project X<br/>(with wanted search & filter)
    BFF ->> Core: Pass request
    Core -->> BFF: Paginated vehicles
    BFF -->> John DOE: Paginated vehicles
```

## Autocomplete

Used in the [Create Movement](/functional/features/create-movement) flow to select a vehicle within the project scope. Text search only, no pagination.

### Allowed roles

- `PROJECT_ADMIN`
- `PROJECT_MANAGER`
- `PROJECT_USER`

### Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Search vehicles (autocomplete, project scope)
    BFF ->> Core: Pass request
    Core -->> BFF: Matching vehicles (top results)
    BFF -->> John DOE: Matching vehicles
```
