---
type: business-object
modules:
  - operations
scope: project
object_name: alert
required_options: ALERT
tags:
  - alert
  - options
outline: deep
created: 2026-04-12
last_update: 2026-04-12
---

# Alert

::: info Option required
Alerts are only available if the **ALERT** option is enabled on the project, which itself requires **COMMUNICATION** to
be enabled.
:::

## Definition

An **Alert** is a structured container that groups a status, a topic, and a communication thread. It is used to track
and discuss any situation that requires formal follow-up.

```
Project
└── Alert
```

## Main attributes

| Attribute      | Description            |
|----------------|------------------------|
| Title          | Summary of the purpose |
| Description    | Alert description      |
| Status         | Alert status           |
| Communications | Communication thread   |

### Status

| Status        | Description                                    |
|---------------|------------------------------------------------|
| `IN_PROGRESS` | The alert is open and being actively monitored |
| `RESOLVED`    | The situation has been resolved                |
| `CANCELED`    | The alert has been closed without resolution   |

### Communications

Refer [communication](/functional/business-objects/operations/communication)

## Relationships

| Related object | Relationship                                 |
|----------------|----------------------------------------------|
| Communication  | An alert contains one or more communications |
