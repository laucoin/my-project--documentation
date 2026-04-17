---
type: business-object
modules:
  - preparation
scope: preparation
object_name: menu
required_options: PREPARATION
tags:
  - menu
  - preparation
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Menu

::: info Option required
The menu is only available if the **PREPARATION** option is enabled on the project.
:::

## Definition

The **Menu** defines the meals for every day of the project. It covers all standard meal types across the full
project period.

```
Organization
└── Project
    └── Preparation
        └── Menu
```

::: info One menu per preparation
A preparation contains exactly one menu.
:::

## Main attributes

| Attribute | Description                                              |
|-----------|----------------------------------------------------------|
| Days      | One meal entry per project day                           |

### Meal types

Each day contains entries for the following meal types:

| Meal type   | Description              |
|-------------|--------------------------|
| `BREAKFAST` | Morning meal             |
| `LUNCH`     | Midday meal              |
| `SNACK`     | Afternoon snack          |
| `DINNER`    | Evening meal             |

Each meal entry contains the description of what is served.

## Relationships

| Related object | Relationship                                                      |
|----------------|-------------------------------------------------------------------|
| Preparation    | A menu belongs to one preparation                                 |
| [Comment](/functional/business-objects/preparation/comment) | A menu can receive zero or more comments **(if option enabled)*    |
