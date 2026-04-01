---
type: business-object
modules:
  - core
scope: project
object_name: vehicle
required_options: VEHICLE
tags:
  - vehicle
  - options
outline: deep
created: 2026-04-12
last_update: 2026-04-12
---

# Vehicle

::: info Option required
Vehicles are only available if the **VEHICLE** option is enabled on the project.
:::

## Definition

A **Vehicle** is a means of transport that can be associated with a movement. Its primary purpose is to record which
vehicle was used and who was driving it, so that the driver can be identified in the event of a traffic incident.

```
Organization
└── Project
    └── Vehicle
```

## Main attributes

| Attribute          | Description                                                        |
|--------------------|--------------------------------------------------------------------|
| License plate      | The vehicle’s registration number                                  |
| Brand              | The vehicle manufacturer                                           |
| Model              | The vehicle model                                                  |
| Availability dates | Date and time range to identify vehicle start and end availability |

### Status

A vehicle does not have an explicit status field. Its state is derived from:

| Situation                                                                                     | Implied state  |
|-----------------------------------------------------------------------------------------------|----------------|
| Has been soft deleted                                                                         | `DISABLED`     |
| Arrival date is in the future                                                                 | `NOT_HERE`     |
| End date is in the past                                                                       | `NO_MORE_HERE` |
| Refer to [movement](/functional/business-objects/operations/movement#vehicle-presence-status) |                |
| No dates set OR today is between start and end dates                                          | `NOT_USED_YET` |

### Availability dates

A vehicle can have its own availability dates (start and end). These are optional. If not set, the vehicle is full-time available.

## Relationships

| Related object | Relationship                                       |
|----------------|----------------------------------------------------|
| Project        | A vehicle belongs to one project                   |
| Movement       | A vehicle can be attached to one or more movements |
