---
type: business-object
modules:
  - preparation
scope: preparation
object_name: budget
required_options: PREPARATION
tags:
  - budget
  - preparation
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Budget

::: info Option required
The budget is only available if the **PREPARATION** option is enabled on the project.
:::

## Definition

The **Budget** defines the financial frame of the project. It sets the price per participant and organizes expected
expenses into categories.

```
Organization
└── Project
    └── Preparation
        └── Budget
```

::: info One budget per preparation
A preparation contains exactly one budget.
:::

## Main attributes

| Attribute           | Description                                            |
|---------------------|--------------------------------------------------------|
| Price per participant | The cost charged to or allocated per participant     |
| Expense categories  | List of expense categories with their allocated amount |

### Expense categories

An expense category groups related costs under a label.

| Attribute | Description                              |
|-----------|------------------------------------------|
| Label     | Name of the expense category             |
| Amount    | Allocated amount for this category       |

## Relationships

| Related object | Relationship                                                      |
|----------------|-------------------------------------------------------------------|
| Preparation    | A budget belongs to one preparation                               |
| [Comment](/functional/business-objects/preparation/comment) | A budget can receive zero or more comments **(if option enabled)*  |
