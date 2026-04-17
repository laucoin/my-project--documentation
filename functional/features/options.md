---
type: reference
modules:
scope:
object_name:
required_options:
tags:
  - options
  - features
  - configuration
outline: deep
created: 2026-04-11
last_update: 2026-04-11
---

# Options

Options are a mechanism for enabling or disabling specific features at the project level. They are pre-allowed at the
organization level and selectively activated per project.

## How options work

1. An **Organization** selects which options are available across its projects.
2. Each **Project** can then activate zero or more of those available options.

This allows organizations to tailor the feature set of each project without exposing features that are irrelevant or not
authorised.

## Available options

| Option                                                                          | Feature unlocked                                                                                                                                 | Dependency |
|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| [`ACTIVITY`](/functional/business-objects/core/activity)                        | Activities can be created and attached to movements                                                                                              | None       |
| [`ALERT`](/functional/business-objects/operations/alert)                        | Alerts can be created with a status, a topic, and a communication thread                                                                         | None       |
| [`COMMENT`](/functional/business-objects/operations/comment)                    | Comments can be posted on participants for annotation and follow-up                                                                              | None       |
| [`COMPLETION_NOTICE`](/functional/business-objects/operations/completion-notice) | Internal and external completion notices can be created and attached to participants                                                             | None       |
| [`GROUP`](/functional/business-objects/core/group)                              | Groups can be created and attached to movements                                                                                                  | None       |
| [`MOVEMENT`](/functional/business-objects/operations/movement)                  | Movements can be recorded (IN/OUT entries and exits), including participants, vehicles, and communication threads on movements with an activity  | None       |
| [`PREPARATION`](/functional/business-objects/preparation/)                      | A preparation can be created and attached to a project or group to organise logistics before a project starts                                    | None       |
| [`REGISTRATION`](/functional/business-objects/registration/)                    | A registration period can be created, allowing external users to submit registration requests                                                    | None       |
| [`VEHICLE`](/functional/business-objects/core/vehicle)                          | Vehicles can be created and attached to movements                                                                                                | None       |

> Communications are not gated by a dedicated option. They are implicitly available when their parent container is (a movement requires `MOVEMENT`; an alert requires `ALERT`).

## Option dependencies

Some options can only be activated if their dependency is already enabled:

```
ACTIVITY           (independent)
ALERT              (independent)
COMMENT            (independent)
COMPLETION_NOTICE  (independent)
GROUP              (independent)
MOVEMENT           (independent)
PREPARATION        (independent)
REGISTRATION       (independent)
VEHICLE            (independent)
```

### Effect on existing data when an option is disabled

Disabling an option on a project **does not delete** any data already created under that option. Existing records
(vehicles, activities, movements linked to activities, registration periods, etc.) are **masked** — hidden from the
UI and excluded from all application operations — but are preserved in the database.

If the option is re-enabled later, the previously masked data becomes visible and usable again.

::: info
Masking is driven entirely by whether the option is currently active on the project. No data migration or purge is
triggered by toggling an option.
:::

## Summary of features per option

### ACTIVITY

- A project can define recurring activities with a name, duration, min/max participants, and availability dates.
- An activity can be attached to any movement to provide context.

→ See [Activity](/functional/business-objects/core/activity) for the full activity reference.

### ALERT

- Alerts can be created at any time with a title and a status (`IN_PROGRESS`, `RESOLVED`, `CANCELED`).
- Each alert contains a communication thread where any currently `OUT` movement can be selected as sender.

→ See [Alert](/functional/business-objects/operations/alert) for the full alert reference.

### COMMENT

- Comments can be posted by any logged-in user on a participant.
- A comment carries a message, an author, and zero or more project-scoped tags.
- Tags can be incremented as a quick counter without writing a full comment.

→ See [Comment](/functional/business-objects/operations/comment) for the full comment reference.

### COMPLETION_NOTICE

- A participant can receive up to one Internal notice and one External notice at the end of a project.
- Each notice has a content body and a publication status (`DRAFT`, `PUBLISHED`).

→ See [Completion Notice](/functional/business-objects/operations/completion-notice) for the full reference.

### GROUP

- A project can define a group of participants with a name and attendance dates.
- A group can be fully or partially attached to any movement to facilitate movement creation.
- A group affects the participant attendance dates.

→ See [Group](/functional/business-objects/core/group) and [Participant](/functional/business-objects/core/participant) for the full group reference.

### MOVEMENT

- Movements record entries (`IN`) and exits (`OUT`) of the project site with a timestamp.
- A movement includes one or more participants (registered or guest), optional vehicles, and an optional activity.
- Movements with an activity can have a communication thread (messages sent on behalf of the user or the movement).

→ See [Movement](/functional/business-objects/operations/movement) for the full movement reference.

### PREPARATION

- A preparation can be attached to a project or to a group (not both simultaneously).
- It groups all organisational elements required before a project starts: location, typical day, planning, pedagogy, menu, and budget.
- A preparation follows a validation workflow (`DRAFT` → `IN_REVIEW` → `VALIDATED` / `REJECTED`).

→ See [Preparation](/functional/business-objects/preparation/) for the full preparation reference.

### REGISTRATION

- A project admin can create a registration period (with dates, audience, pricing, and a maximum number of
  registrations).
- External users can browse the project in the list of open projects and submit registration requests (individual or
  group).

→ See TODO: add reference to the registration documentation once available.

::: info
Special note: if the organization does not allow `REGISTRATION`, external users cannot view projects open for
registration.
:::

### VEHICLE

- A project can define vehicles with a license plate, brand, and model.
- A vehicle can be attached to any movement.
- The driver must be identified in the movement.

→ See [Vehicle](/functional/business-objects/core/vehicle) for the full vehicle reference.