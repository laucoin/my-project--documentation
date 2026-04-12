---
module: operations
scope:
  - movement
  - alert
object_name: communication
required_options: COMMUNICATION
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
As it's mentioned in the [definition](#definition) a sender is required (movement or logged user).
:::

## Action

### Read

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Only visible in alert or movement

### Creation

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Message is required
	- Alert
		- Can be created through a movement message
		- Is automatically set if you create a communication in an alert
		- Alert must be `IN_PROGRESS` to be associated
	- Movement is optional (if not selected, it's the logged user the author)
		- Selected movement must in progress. It's mean an `OUT` movement of `REGISTERED` participants.
	- Creator is automatically set to the logged user

### Edition

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints (differences with creation):
	- Only the message is editable

::: danger Not a real edit
Editing a communication is not a true update — it creates a new communication and soft-deletes the previous one. The form is pre-filled with the original communication's data.
:::

### Soft-delete

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- `PROJECT_ADMIN`s and `PROJECT_MANAGER`s still see the communication but it should be marked “disabled”
	  (refer to [status](#status)).

### Enable-back

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- Only applicable to soft-deleted communications

## Relationships

| Related object | Relationship                                                                       |
|----------------|------------------------------------------------------------------------------------|
| Movement       | A communication is related from zero to one movement                               |
| Alert          | A communication is related from zero to one alert                                  |
| User           | A communication is related from zero to one user (zero is the case of purged user) |

## UI/UX requirements

- The creation of communication should be facilitated for movement with activity
- A counter with the last communication with the activity should be displayed
