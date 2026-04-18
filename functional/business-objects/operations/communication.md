---
type: business-object
modules:
  - operations
scope:
  - movement
  - alert
object_name: communication
required_options:
tags:
  - communication
  - operations
  - options
outline: deep
created: 2026-04-12
last_update: 2026-04-18
---

# Communication

## Definition

A **Communication** is a timestamped message attached to either an **Alert** or a **Movement that includes an
Activity**. It is not a general-purpose messaging tool — it is strictly scoped to these two operational contexts.

A communication attached to a movement is only allowed when the movement is an `OUT` movement of `REGISTERED` participants that also includes an activity.

| Sender           | Description                                              |
|------------------|----------------------------------------------------------|
| User (default)   | The message is sent on behalf of the logged-in user      |
| Movement         | The message is sent on behalf of the group that went out |

```
Project
├── Movement (with Activity) ──┐
│                               ├── Communication
└── Alert ──────────────────────┘
```

::: warning Movement scope
A Communication can only be linked to an **in-progress `OUT` Movement of `REGISTERED` participants that includes an Activity**. Movements without an Activity, `IN` movements, `GUEST` movements, and closed movements cannot have Communications attached.
:::

::: info Editability
A Communication supports in-place editing of its `message` via [Edit communication](/functional/features/edit-communication). See the [Editability policy](/functional/business-objects/operations/#editability-of-operations-entities).
:::

## Main attributes

| Attribute | Description                                                          |
|-----------|----------------------------------------------------------------------|
| Message   | The communication message                                            |
| Alert     | If the communication is linked to an alert *(option ALERT required)* |
| Movement  | If the communication is linked to a movement with activity           |
| Creator   | The logged-in user, if not written by a movement                     |

::: info Movement or creator
As mentioned in the [definition](#definition), a sender is required (either the movement or the logged-in user).
:::

### Status

A communication does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | `HIDDEN`      |
| Have not been soft deleted | `VISIBLE`     |

## Relationships

| Related object | Relationship                                                                       |
|----------------|------------------------------------------------------------------------------------|
| Movement       | A communication is related to zero or one movement (with activity)                 |
| Alert          | A communication is related to zero or one alert                                    |
| User           | A communication is related to zero or one user (zero in the case of a purged user) |

## UI/UX requirements

- The creation of a communication should be facilitated for movements with an activity
- A counter showing the number of communications linked to the activity should be displayed
