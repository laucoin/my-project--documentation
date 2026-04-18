---
type: business-object
modules:
  - preparation
scope: preparation
object_name: location
required_options: PREPARATION
tags:
  - location
  - preparation
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Location

::: info Option required
Locations are only available if the **PREPARATION** option is enabled on the project.
:::

## Definition

A **Location** is a physical place where the project takes place. A preparation can reference multiple locations,
but only one location can be active at a given time.

```
Organization
└── Project
    └── Preparation
        └── Location
```

## Main attributes

| Attribute       | Description                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------|
| Name            | The location name                                                                             |
| Address         | The physical address of the location                                                          |
| Description     | Additional details about the location                                                         |
| Active period   | Derived date range during which the location is assigned to the project. Computed from [planning](/functional/business-objects/preparation/planning) assignments (see the warning below). |

::: warning One active location at a time
A preparation can hold several locations (e.g. one per phase of the project), but the project can only be held at one location at a time. The location's **active period** is not stored on the location itself: the [planning](/functional/business-objects/preparation/planning) assigns each day of the project to exactly one location, and the active period is the set of days assigned. Overlapping active periods are therefore impossible by construction.
:::

## Relationships

| Related object | Relationship                                 |
|----------------|----------------------------------------------|
| Preparation    | A location belongs to one preparation        |
