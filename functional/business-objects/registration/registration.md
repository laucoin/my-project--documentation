---
type: business-object
modules:
  - registration
scope: project
object_name: registration
required_options: REGISTRATION
tags:
  - registration
  - options
outline: deep
created: 2026-04-17
last_update: 2026-04-17
---

# Registration

::: info Option required
Registrations are only available if the **REGISTRATION** option is enabled on the project.
:::

## Definition

A **Registration** is a submission made by a candidate through a [Form](/functional/business-objects/registration/form).
It holds the candidate's answers and tracks the validation lifecycle.

```
Project
└── Form
	└── Registration
```

## Main attributes

| Attribute | Description                                         |
|-----------|-----------------------------------------------------|
| Answers   | The candidate's responses to the form fields        |
| Status    | Current validation status                           |
| Notes     | Internal notes added by project staff during review |

### Status

| Status      | Description                                      |
|-------------|--------------------------------------------------|
| `PENDING`   | Submitted, awaiting review                       |
| `VALIDATED` | Approved — participants are added to the project |
| `REJECTED`  | Refused — no participant is created              |

### Validation effects

When a registration is **validated**, the following happens automatically depending on the form type:

| Form type    | Effect                                                                               |
|--------------|--------------------------------------------------------------------------------------|
| `INDIVIDUAL` | One participant is created and added to the project                                  |
| `GROUP`      | All participants are created, added to the project, and a dedicated group is created |

::: warning Visibility before validation
Participants and groups resulting from a registration are **not visible** in other modules (movements, alerts,
planning, etc.) until the registration status is `VALIDATED`.
:::

## Relationships

| Related object | Relationship                                               |
|----------------|------------------------------------------------------------|
| Form           | A registration belongs to one form                         |
| Participant    | A validated registration creates one or more participants  |
| Group          | A validated group registration creates one dedicated group |
