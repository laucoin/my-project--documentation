---
outline: deep
---

# Movement

A **Movement** is a timestamped record of any entry into or exit from the project site. It is the core operational log
of the application.

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

## Key attributes

| Attribute             | Description                                      |
|-----------------------|--------------------------------------------------|
| Date & time           | When the movement occurred                       |
| Type                  | `IN` or `OUT`                                    |
| Reason                | Required for non-natural movements *(see above)* |
| Activity              | Optional — the activity linked to this movement  |
| Vehicle               | Optional — the vehicle used                      |
| Participants / Guests | The people included in this movement             |
