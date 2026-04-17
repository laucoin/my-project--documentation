---
type: business-object
modules:
  - preparation
scope: preparation
object_name: pedagogy
required_options: PREPARATION
tags:
  - pedagogy
  - preparation
  - objectives
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Pedagogy

::: info Option required
The pedagogy is only available if the **PREPARATION** option is enabled on the project.
:::

## Definition

The **Pedagogy** is the document that describes and justifies the educational approach of the project. It is
structured as a set of priorities, each containing one or more objectives.

```
Organization
└── Project
    └── Preparation
        └── Pedagogy
            ├── Priority 1
            │   ├── Objective 1.1
            │   └── Objective 1.N
            └── Priority N
                └── Objective N.1
```

::: info One pedagogy per preparation
A preparation contains exactly one pedagogy.
:::

## Main attributes

| Attribute   | Description                                                       |
|-------------|-------------------------------------------------------------------|
| Priorities  | Ordered list of pedagogical priorities                            |

### Priority

A priority represents a high-level educational goal for the project.

| Attribute   | Description                          |
|-------------|--------------------------------------|
| Label       | Name of the priority                 |
| Objectives  | One or more objectives under this priority |

### Objective

An objective is a concrete, measurable outcome attached to a priority.

| Attribute   | Description                         |
|-------------|-------------------------------------|
| Label       | Description of the objective        |

Objectives can be linked to [planning](/functional/business-objects/preparation/planning) slots to indicate during
which activity they are addressed.

## Relationships

| Related object | Relationship                                                          |
|----------------|-----------------------------------------------------------------------|
| Preparation    | A pedagogy belongs to one preparation                                 |
| Planning       | Objectives can be linked to zero or more planning slots               |
| [Comment](/functional/business-objects/preparation/comment) | A pedagogy can receive zero or more comments **(if option enabled)*    |
