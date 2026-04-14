---
type: business-object
modules:
  - operations
scope:
  - movement
  - alert
object_name: communication
required_options: COMMUNICATION
tags:
  - communication
  - options
outline: deep
created: 2026-04-12
last_update: 2026-04-12
---

# Communication

::: info Option required
Communications are only available if the **COMMUNICATION** option is enabled on the project.
:::

## Definition

A **Communication** is a timestamped message created by one of the following entities:

| Sender option            | Description                                              |
|--------------------------|----------------------------------------------------------|
| A user himself (default) | The message is sent on behalf of the logged-in user      |
| A movement               | The message is sent on behalf of the group that went out |

```
Project
├── Movement ──┐
│              ├── Communication
└── Alert ─────┘
```

## Main attributes

| Attribute | Description                                                    |
|-----------|----------------------------------------------------------------|
| Message   | The communication message                                      |
| Alert     | If the communication is linked to an alert (and option active) |
| Movement  | If the communication is linked to a movement                   |
| Creator   | The logged in user, if not written by a movement               |

::: info Movement or creator
As it’s mentioned in the [definition](#definition) a sender is required (movement or logged user).
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
| Movement       | A communication is related from zero to one movement                               |
| Alert          | A communication is related from zero to one alert                                  |
| User           | A communication is related from zero to one user (zero is the case of purged user) |

## UI/UX requirements

- The creation of communication should be facilitated for movement with activity
- A counter with the last communication with the activity should be displayed
