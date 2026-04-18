---
type: business-object
modules:
  - preparation
scope: preparation
object_name: planning
required_options: PREPARATION
tags:
  - planning
  - preparation
  - calendar
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Planning

::: info Option required
The planning is only available if the **PREPARATION** option is enabled on the project.
:::

## Definition

A **Planning** is the day-by-day schedule of the project, built on top of the
[Typical day](/functional/business-objects/preparation/typical-day). Each day follows the typical day pattern by
default, but individual days can override it with a custom structure.

```
Organization
└── Project
    └── Preparation
        └── Planning
```

::: info One planning per preparation
A preparation contains exactly one planning.
:::

## Main attributes

| Attribute     | Description                                                           |
|---------------|-----------------------------------------------------------------------|
| Days          | One entry per project day, each defaulting to the typical day pattern |
| External sync | Optional synchronization with external calendar providers             |

### Days

Each day in the planning is either:

- **Inherited (default)** — the day follows the typical day pattern exactly, slot for slot.
- **Custom** — the day redefines all its slots from scratch; no inheritance from the typical day applies.

These two modes are mutually exclusive per day: partial overrides (inheriting some slots and overriding others) are not supported.

::: info Override scope
Switching a day to **Custom** overrides that specific day **permanently** (as long as the custom definition is kept). It does not alter the typical day itself, and it does not affect the structure of any other day. Reverting the day to **Inherited** restores the typical day pattern for that day.
:::

### External sync

The planning can be synchronized with external calendar systems:

- Google Calendar
- Outlook Calendar

::: info Sync direction
Synchronization is outbound only: the planning pushes events to the external calendar. Changes made directly in the
external calendar are not pulled back into the planning.
:::

### Pedagogical objectives link

Planning slots can be linked to
[pedagogical objectives](/functional/business-objects/preparation/pedagogy). This allows tracking which objectives
are covered by which activities during the project.

- A planning slot can be linked to zero or more pedagogical objectives (useful to follow pedagogics objectives).

## Relationships

| Related object       | Relationship                                                         |
|----------------------|----------------------------------------------------------------------|
| Preparation          | A planning belongs to one preparation                                |
| Typical day          | A planning is based on one typical day                               |
| Pedagogy (objective) | A planning slot can be linked to zero or more pedagogical objectives |
| Comment              | A planning can receive zero or more comments                         |
