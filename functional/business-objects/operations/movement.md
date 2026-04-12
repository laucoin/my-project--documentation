---
module: operations
scope: project
object_name: movement
created: 2026-04-12
last_update: 2026-04-12
---

# Movement

## Definition

A **Movement** is a timestamped record of any entry into or exit from the project site. It is the core operational log
of the application.

```
Project
└── Movement
```

### Immutability

A movement **cannot be edited** after it has been recorded. If a correction is needed, the movement must be
soft-deleted and a new movement created in its place. When recreating a movement, a custom `datetime` can be supplied
to reflect the actual time of the event.

::: warning
A movement cannot be created with a datetime **in the future**. All recorded movements must have a datetime less than
or equal to the current time.
:::

## Main attributes

| Attribute | Description                                                   |
|-----------|---------------------------------------------------------------|
| Timestamp | The movement moment                                           |
| Contents  | One to many content (Cf. the following table)                 |
| Reason    | The movement reason                                           |
| Activity  | If the movement is linked to an activity (and option active)  |
| Direction | The movement direction with the project location as reference |

| Attribute   | Description                                 |
|-------------|---------------------------------------------|
| Participant | Concerned participant                       |
| Vehicle     | If the participant drive a vehicle          |
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
A same movement cannot contain `REGISTERED` and `GUEST`. Indeed movement reason cannot be the same for that 2 kind of
people (refer the [reason](#reason)).
:::

When a participant is added to a movement, the participant's details are captured. This snapshot is taken at movement time and is preserved independently of any subsequent rename or deletion of the participant.

Eligible participant status (at the movement timestamp):

- `NOT_ARRIVED_YET`
- `IN`
- `OUT`

#### Group

When participants are added to a movement via a group, the group name is captured as a **pool name** — a labelled
grouping within the movement. This snapshot is taken at movement time and is preserved independently of any subsequent
rename or deletion of the group. It serves as a display label to identify which group a set of participants belonged to
when the movement was recorded.

::: info
Adding participants through a group is just a way to save time. When you select a group of participant to add you should be able to remove participant of the group from the movement (but not the group).
:::

#### Vehicle

To drive a vehicle, the participant must be major (at the movement timestamp).

Eligible vehicle status (at the movement timestamp):

- `NOT_USED_YET`
- `IN`
- `OUT`

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
| Have been soft deleted     | Disabled      |
| Have not been soft deleted | Active        |

## Impact other objects status

### Participant presence status

Each participant's current presence status is derived at runtime from their movement history.

| Status         | Condition                                                                                            |
|----------------|------------------------------------------------------------------------------------------------------|
| `NO_MORE_HERE` | The `GUEST` participant's last recorded movement is an `OUT`                                         |
| `NO_MORE_HERE` | The `REGISTERED` participant's last recorded movement is an `OUT` with reason `DEFINITIVE_DEPARTURE` |
| `IN`           | The participant's last recorded movement is an `IN`                                                  |
| `OUT`          | The participant's last recorded movement is an `OUT`                                                 |

### Vehicle presence status

Each vehicle's current presence status is derived at runtime from their movement history and their resolved
departure date (see [Attendance fallback](/functional/business-objects/#dates-and-attendance)).

| Status | Condition                                        |
|--------|--------------------------------------------------|
| `IN`   | The vehicle's last recorded movement is an `IN`  |
| `OUT`  | The vehicle's last recorded movement is an `OUT` |

## Action

### Read & Search

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Search are allowed on following field but not required:
		- Timestamp is included in given range
		- Direction equal at least one given directions
		- Reason equal at least one given reasons
		- Activity equal at least one given activities
		- Status equal at least one given statuses

### Creation

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- Timestamp is required (defaults to current time; can be set to any past datetime)
	- Direction is required (`IN` or `OUT`)
	- At least one participant is required
	- Reason is required depending on direction and participant type (see [Reason](#reason))
	- Activity is optional (if ACTIVITY option is enabled)
	- Vehicle is optional per participant (if VEHICLE option is enabled; driver must be a major)

### Edition

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints (differences with creation):

::: danger Not a real edit
Editing a movement is not a true update — it creates a new movement and soft-deletes the previous one. The form is pre-filled with the original movement's data.
:::

### Soft-delete

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- `PROJECT_USER`
- Constraints:
	- `PROJECT_ADMIN`s and `PROJECT_MANAGER`s still see the movement but it should be marked “disabled”
	  (refer to [status](#status)).

### Enable-back

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
- Constraints:
	- Only applicable to soft-deleted movements

## Relationships

| Related object | Relationship                                 |
|----------------|----------------------------------------------|
| Participant    | A movement contains one or more participants |
| Group          | A movement contains zero or more groups      |
| Vehicle        | A movement contains zero or more vehicles    |
| Activity       | A movement contains zero or one activity     |
