---
type: business-object
modules:
  - registration
scope: project
object_name: form
required_options: REGISTRATION
tags:
  - form
  - registration
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Form

::: info Option required
Forms are only available if the **REGISTRATION** option is enabled on the project.
:::

## Definition

A **Form** is a registration form that allows external candidates to submit a registration request for a project.
A project can have multiple forms (e.g. one per registration period or target audience).

```
Project
└── Form
```

## Main attributes

| Attribute      | Description                                              |
|----------------|----------------------------------------------------------|
| Title          | The form title                                           |
| Type           | Individual or group registration                         |
| Opening period | Date range during which the form accepts submissions     |
| Project scope  | Optional restriction to a specific period of the project |
| Fields         | List of questions/fields presented to the candidate      |

### Type

| Type         | Description                                       |
|--------------|---------------------------------------------------|
| `INDIVIDUAL` | Each submission registers one participant         |
| `GROUP`      | Each submission registers a group of participants |

### Opening period

A form is only open for submissions during its defined date range. Outside this range, the form does not accept new
registrations. The opening period can cover the full project duration or only a partial range.

### Project scope

A form can optionally be restricted to a specific period within the project. This allows targeting candidates
who will only participate during a defined phase (e.g. the first two weeks of a month-long project).

## Relationships

| Related object | Relationship                                  |
|----------------|-----------------------------------------------|
| Project        | A form belongs to one project                 |
| Registration   | A form can receive zero or more registrations |
