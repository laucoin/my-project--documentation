---
module: operations
scope: project
object_name: alert
required_options: ALERT
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

## Action

### Read & Search

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Search filters are optional:
		- Text search on title or description
		- Status equal at least one given statuses

### Creation

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Title is required
	- Description is optional
	- Status is automatically set to `IN_PROGRESS`

### Edition

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints (differences with creation):
	- Only title and description are editable
	- Status can be updated to `RESOLVED` or `CANCELED`

### Soft-delete

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- `PROJECT_ADMIN`s and `PROJECT_MANAGER`s still see the alert, but it should be marked “disabled”
	  (refer to [status](#status)).

### Enable-back

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- Only applicable to soft-deleted alerts

## Relationships

| Related object | Relationship                                 |
|----------------|----------------------------------------------|
| Communication  | An alert contains one or more communications |
