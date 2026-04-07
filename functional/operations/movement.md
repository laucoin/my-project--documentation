---
outline: deep
---

# Movement

A **Movement** is a timestamped record of any entry into or exit from the project site. It is the core operational log
of the application.

## Immutability

A movement **cannot be edited** after it has been recorded. If a correction is needed, the movement must be
soft-deleted and a new movement created in its place. When recreating a movement, a custom `datetime` can be supplied
to reflect the actual time of the event.

::: warning
A movement cannot be created with a datetime **in the future**. All recorded movements must have a datetime less than
or equal to the current time.
:::

---

## Direction

Every movement has a direction:

| Type  | Meaning                          |
|-------|----------------------------------|
| `IN`  | A person enters the project site |
| `OUT` | A person leaves the project site |

## Participants in a movement

A movement can include one or more people. Two kinds of people can be recorded in a movement:

| Kind                       | Description                                                                                        |
|----------------------------|----------------------------------------------------------------------------------------------------|
| **Registered participant** | A participant pre-registered in the project                                                        |
| **Guest**                  | A light, one-off entry with a first name, last name, and birthdate — not registered in the project |

Registered participants can be added individually or collectively via their group.

### Pool

When participants are added to a movement via a group, the group name is captured as a **pool name** — a labelled
grouping within the movement. This snapshot is taken at movement time and is preserved independently of any subsequent
rename or deletion of the group. It serves as a display label to identify which group a set of participants belonged to
when the movement was recorded.

## Reason

A reason is mandatory when the movement direction is considered non-natural for that type of person:

| Direction | Participant type       | Reason required? |
|-----------|------------------------|------------------|
| `OUT`     | Registered participant | **Yes**          |
| `IN`      | Registered participant | No               |
| `IN`      | Guest                  | **Yes**          |
| `OUT`     | Guest                  | No               |

### Reasons for a registered participant going OUT

| Reason                 | Description                                                  |
|------------------------|--------------------------------------------------------------|
| An activity ID         | The participant is leaving to take part in specific activity |
| `SHOPPING`             | The participant is leaving for a shopping errand             |
| `MEDICAL`              | The participant is leaving for a medical appointment         |
| `DEFINITIVE_DEPARTURE` | The participant is leaving the project for good              |
| `OTHER`                | Any other reason                                             |

### Reasons for a guest coming IN

| Reason              | Description                                     |
|---------------------|-------------------------------------------------|
| `EMERGENCY`         | The guest is entering in an emergency situation |
| `LOGISTICS`         | The guest is entering for a logistical purpose  |
| `PARTNER_ANIMATION` | The guest is an external facilitator or partner |
| `VISIT`             | The guest is a visitor                          |

## Optional elements

| Element      | Description                                                                                   |
|--------------|-----------------------------------------------------------------------------------------------|
| **Activity** | Indicates that the movement is related to a specific activity *(requires ACTIVITY option)*    |
| **Vehicle**  | Indicates that a vehicle was used — the driver must be identified *(requires VEHICLE option)* |

## Classic communication

When the **COMMUNICATION** option is enabled, an outgoing movement linked to an activity can have a **communication
thread** attached to it.

When writing a message in this thread, the user selects a sender:

| Sender option                 | Description                                              |
|-------------------------------|----------------------------------------------------------|
| The user themselves (default) | The message is sent on behalf of the logged-in user      |
| The movement's activity       | The message is sent on behalf of the group that went out |

::: info Option dependencies
Classic communication requires both **ACTIVITY** and **COMMUNICATION** to be enabled on the project.
:::

For a more structured form of communication with a dedicated status and topic,
see [Alert](/functional/operations/alert).

## Participant presence status

Each participant's current presence status is derived at runtime from their movement history and their resolved
departure date (see [Attendance fallback](/functional/business-objects/#dates-and-attendance)).

| Status           | Condition                                                                                       |
|------------------|-------------------------------------------------------------------------------------------------|
| `NOT_ARRIVED_YET`| No movement has been recorded for this participant yet                                          |
| `IN`             | The participant's last recorded movement is an `IN`                                             |
| `OUT`            | The participant's last recorded movement is an `OUT`                                            |
| `LEFT`           | The participant's resolved departure date is in the past (regardless of their last movement)    |

`LEFT` takes precedence over `IN` or `OUT`: once the departure date is passed, the participant is considered to have
left the project.

---

## Soft-deleted referenced elements

When an activity or a participant referenced by a movement is later soft-deleted, **the movement record is not
affected** — it continues to display the name of the deleted element. A visual label is shown in the UI to indicate
that the element no longer exists.

Soft-deleted activities and participants **cannot be selected** when creating new movements.

---

## Key attributes

| Attribute     | Description                                                                                  |
|---------------|----------------------------------------------------------------------------------------------|
| `id`          | Primary key — UUID generated by the application                                              |
| `project_id`  | Logical link to `core.projects` — the project this movement belongs to                       |
| `datetime`    | When the movement occurred                                                                   |
| `type`        | `IN` or `OUT`                                                                                |
| `reason`      | Required for non-natural movements *(nullable — see above)*                                  |
| `activity_id` | Logical link to `core.activities` — optional activity linked to this movement *(nullable)*   |
| `created_at`  | Creation timestamp — managed by Spring Auditing                                              |
| `created_by`  | Logical link to `core.users` — user who created the record                                   |
| `updated_at`  | Last modification timestamp — managed by Spring Auditing                                     |
| `updated_by`  | Logical link to `core.users` — user who last modified the record                             |
| `deleted_at`  | Soft-delete timestamp — `NULL` means active                                                  |
