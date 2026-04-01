---
outline: deep
---

# Participant

A **Participant** is a person — minor or major — registered in a project. Participants are the primary subjects of the
application: their presence, movements, and registrations are tracked throughout the project's duration.

::: warning Participant ≠ User
A participant is not the same as an application user. A user is a person who logs into the app. A participant is a
person who takes part in a project. The two can optionally be linked, but they remain distinct concepts. Linking a
participant to a user is never mandatory.
:::

## Scope and data isolation

A participant is unique to a project. If the same person participates in multiple projects, they are represented as
separate participant records in each one. This ensures strict data isolation between projects.

## Minor or major

A participant is classified as a minor or major based solely on their **birthdate**. This classification is independent
of the project's dates or any other context.

## Attendance dates

A participant can have their own attendance dates (arrival and departure). These are optional.

When no personal dates are set, the application resolves the attendance period using this fallback chain:

| Priority | Source                                                                                |
|----------|---------------------------------------------------------------------------------------|
| 1        | The participant's own dates *(if set)*                                                |
| 2        | Their group's dates *(if the participant has none and belongs to a group with dates)* |
| 3        | The project's dates *(final fallback)*                                                |

::: info Attendance date constraint
A participant's attendance dates must stay within the **project** dates. They can extend beyond their group's dates —
group dates are a fallback only, not a binding constraint.
:::

## Key attributes

| Attribute             | Description                               |
|-----------------------|-------------------------------------------|
| First name            | Participant's first name                  |
| Last name             | Participant's last name                   |
| Birthdate             | Used to determine minor or major status   |
| Arrival date & time   | When the participant arrives *(optional)* |
| Departure date & time | When the participant departs *(optional)* |
| Origin                | Where the participant comes from          |
| Active                | Whether the participant is active         |

## Relationships

| Related object | Relationship                                                   |
|----------------|----------------------------------------------------------------|
| Project        | A participant belongs to one project                           |
| Group          | A participant can belong to one or more groups                 |
| Movement       | A participant can be included in one or more movements         |
| User           | A participant can optionally be linked to one application user |

## Guest

A **Guest** is a lightweight variant of a participant. Unlike a registered participant, a guest is not pre-registered in
the project — they are created at the time of a movement. Guests have a first name, last name, and birthdate, but are
stored separately from registered participants and carry no project history.

See [Movement](/functional/operations/movement) for details on how guests appear in movements.
