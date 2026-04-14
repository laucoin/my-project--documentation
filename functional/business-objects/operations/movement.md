---
type: business-object
modules:
  - operations
scope: project
object_name: movement
required_options: MOVEMENT
tags:
  - movement
  - operations
  - options
outline: deep
created: 2026-04-12
last_update: 2026-04-12
---

# Movement

::: info Option required
Movements are only available if the **MOVEMENT** option is enabled on the project.
:::

## Definition

A **Movement** is a timestamped record of any entry into or exit from the project site. It is the core operational log
of the application.

```
Project
└── Movement
```

### Immutability

A movement cannot be modified. If an error occurs, there are two options:

- Reverse the movement for the extra participants.
- Soft-delete the movement and recreate it correctly.

If a movement has been tampered with, it becomes useless because it could have been altered by a malicious individual.

> E.g. Someone who made a hasty movement withdraws from it afterward and can no longer be traced.

::: warning
A movement cannot be created with a datetime **in the future**. All recorded movements must have a datetime less than
or equal to the current time.
:::

## Main attributes

| Attribute | Description                                                   |
|-----------|---------------------------------------------------------------|
| Timestamp | The movement moment                                           |
| Contents  | One or more content entries (see the table below)             |
| Reason    | The movement reason (see the [Reason](#reason) section for allowed values) |
| Activity  | If the movement is linked to an activity (and option active)  |
| Direction | The movement direction with the project location as reference |

| Attribute   | Description                                 |
|-------------|---------------------------------------------|
| Participant | Concerned participant                       |
| Vehicle     | If the participant drives a vehicle         |
| Pool        | If the participant is added through a group |

### Direction

Every movement has a direction:

| Type  | Meaning                          |
|-------|----------------------------------|
| `IN`  | A person enters the project site |
| `OUT` | A person leaves the project site |

### Content

#### Participant

A movement can include one or more people. Two kinds of people can be recorded in a movement:

| Kind         | Description                                                                                        |
|--------------|----------------------------------------------------------------------------------------------------|
| `REGISTERED` | A participant pre-registered in the project                                                        |
| `GUEST`      | A light, one-off entry with a first name, last name, and birthdate — not registered in the project |

::: warning
A single movement cannot contain both `REGISTERED` and `GUEST` participants. The movement reason is not the same for the two kinds of people (see the [reason](#reason) section).
:::

::: warning Guest lifecycle
A `GUEST` participant is limited to exactly two movements: one `IN` movement when they arrive and one `OUT` movement when they leave. No further movement can be recorded for a guest once they have gone out.
:::

When a participant is added to a movement, the participant’s details are captured. This snapshot is taken at movement time and is preserved independently of any subsequent rename or deletion of the participant.

Eligible participant status (at the movement timestamp):

- Availability status: `ACTIVE` or `NOT_AVAILABLE_YET`
- Presence status: `IN`, `OUT`, or not yet present

#### Group

When participants are added to a movement via a group, the group name is captured as a **pool name** — a labelled
grouping within the movement. This snapshot is taken at movement time and is preserved independently of any subsequent
rename or deletion of the group. It serves as a display label to identify which group a set of participants belonged to
when the movement was recorded.

::: info
Adding participants through a group is just a way to save time. When you select a group of participants to add, you can remove individual participants of the group from the movement (but not the group itself).
:::

#### Vehicle

When a vehicle is attached to a movement, the driver is identified as one of the participants of the movement (flagged as the driver). There is no separate driver attribute on the movement — the driver must be part of the movement's participant list.

To drive a vehicle, the participant must be major (at the movement timestamp).

Eligible vehicle status (at the movement timestamp):

- Availability status: `ACTIVE` or `NOT_AVAILABLE_YET`
- Presence status: `IN`, `OUT`, or not yet present

### Reason

A reason is mandatory when the movement direction is considered non-natural for that type of person:

| Direction | Participant type       | Reason required? |
|-----------|------------------------|------------------|
| `OUT`     | Registered participant | **Yes**          |
| `IN`      | Registered participant | No               |
| `IN`      | Guest                  | **Yes**          |
| `OUT`     | Guest                  | No               |

#### Reasons for a `REGISTERED` participant going OUT

| Reason                 | Description                                                  |
|------------------------|--------------------------------------------------------------|
| An activity ID         | The participant is leaving to take part in specific activity |
| `SHOPPING`             | The participant is leaving for a shopping errand             |
| `MEDICAL`              | The participant is leaving for a medical appointment         |
| `DEFINITIVE_DEPARTURE` | The participant is leaving the project for good              |
| `OTHER`                | Any other reason                                             |

#### Reasons for a `GUEST` coming IN

| Reason              | Description                                     |
|---------------------|-------------------------------------------------|
| `EMERGENCY`         | The guest is entering in an emergency situation |
| `LOGISTICS`         | The guest is entering for a logistical purpose  |
| `PARTNER_ANIMATION` | The guest is an external facilitator or partner |
| `VISIT`             | The guest is a visitor                          |

### Status

A movement does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | `HIDDEN`      |
| Have not been soft deleted | `VISIBLE`     |

## Impact other objects status

### Participant presence status

Each participant’s current presence status is derived at runtime from their movement history.

| Status         | Condition                                                                                            |
|----------------|------------------------------------------------------------------------------------------------------|
| `NO_MORE_HERE` | The `GUEST` participant’s last recorded movement is an `OUT`                                         |
| `NO_MORE_HERE` | The `REGISTERED` participant’s last recorded movement is an `OUT` with reason `DEFINITIVE_DEPARTURE` |
| `IN`           | The participant’s last recorded movement is an `IN`                                                  |
| `OUT`          | The participant’s last recorded movement is an `OUT`                                                 |

### Vehicle presence status

Each vehicle’s current presence status is derived at runtime from their movement history and their resolved
departure date (see [Attendance fallback](/functional/business-objects/#dates-and-attendance)).

| Status | Condition                                        |
|--------|--------------------------------------------------|
| `IN`   | The vehicle’s last recorded movement is an `IN`  |
| `OUT`  | The vehicle’s last recorded movement is an `OUT` |

## Relationships

| Related object | Relationship                                                                                                         |
|----------------|----------------------------------------------------------------------------------------------------------------------|
| Participant    | A movement contains one or more participants                                                                         |
| Group          | A movement contains zero or more groups                                                                              |
| Vehicle        | A movement contains zero or more vehicles                                                                            |
| Activity       | A movement contains zero or one activity                                                                             |
| Communication  | A movement can have zero or more communications *(only if the movement includes an activity, and if option enabled)* |
