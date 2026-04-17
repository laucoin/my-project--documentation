---
type: business-object
modules:
  - preparation
scope: preparation
object_name: typical_day
required_options: PREPARATION
tags:
  - typical-day
  - preparation
  - planning
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Typical day

::: info Option required
The typical day is only available if the **PREPARATION** option is enabled on the project.
:::

## Definition

A **Typical day** is a reusable day template that defines the standard time slots and activities for a project day.
It serves as the base pattern from which the [Planning](/functional/business-objects/preparation/planning) is built.
Individual planning days can override this pattern.

```
Organization
└── Project
    └── Preparation
        └── Typical day
```

::: info One typical day per preparation
A preparation contains exactly one typical day.
:::

## Main attributes

| Attribute | Description                                          |
|-----------|------------------------------------------------------|
| Slots     | Ordered list of time slots composing the day pattern |

### Slots

A slot represents a block of time in the day. Each slot has:

| Attribute  | Description                                        |
|------------|----------------------------------------------------|
| Start time | Slot start time                                    |
| End time   | Slot end time                                      |
| Label      | Descriptive name of the slot (e.g. "Morning hike") |

## Relationships

| Related object | Relationship                                                           |
|----------------|------------------------------------------------------------------------|
| Preparation    | A typical day belongs to one preparation                               |
| Planning       | A typical day is used as the base pattern for the planning             |
| Comment        | A typical day can receive zero or more comments **(if option enabled)* |
