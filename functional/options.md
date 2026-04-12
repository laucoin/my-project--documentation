# Options

Options are a mechanism for enabling or disabling specific features at the project level. They are pre-allowed at the
organization level and selectively activated per project.

## How options work

1. An **Organization** selects which options are available across its projects.
2. Each **Project** can then activate zero or more of those available options.

This allows organizations to tailor the feature set of each project without exposing features that are irrelevant or not
authorised.

## Available options

| Option                                                                    | Feature unlocked                                                                                      | Dependency               |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------|
| [`VEHICLE`](/functional/business-objects/core/vehicle)                    | Vehicles can be created and attached to movements                                                     | None                     |
| [`ACTIVITY`](/functional/business-objects/core/activity)                  | Activities can be created and attached to movements                                                   | None                     |
| [`GROUP`](/functional/business-objects/core/group)                        | Group can be created and attached to movements                                                        | None                     |
| [`COMMUNICATION`](/functional/business-objects/operations/communication)  | Outgoing movements linked to an activity can have a communication thread                              | None                     |
| [`ALERT`](/functional/business-objects/operations/alert)        | Alerts can be created with a status, topic, and communication thread referencing any outside activity | Requires `COMMUNICATION` |
| [`REGISTRATION`](/functional/business-objects/registration/)   | A registration period can be created, allowing external users to submit registration requests         | None                     |

## Option dependencies

Some options can only be activated if their dependency is already enabled:

```
VEHICLE        (independent)
ACTIVITY       (independent)
COMMUNICATION  (independent)
  └── ALERT
REGISTRATION   (independent)
```

::: warning
Disabling an option that another option depends on is not permitted while the dependent option is still active. For
example, `COMMUNICATION` cannot be disabled while `ALERT` is enabled.
:::

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

### VEHICLE

- A project can define vehicles with a license plate, brand, and model.
- A vehicle can be attached to any movement.
- The driver must be identified in the movement.

→ See [Vehicle](/functional/business-objects/core/vehicle) for the full vehicle reference.

### ACTIVITY

- A project can define recurring activities with a name, duration, min/max participants, and availability dates.
- An activity can be attached to any movement to provide context.

→ See [Activity](/functional/business-objects/core/activity) for the full activity reference.

### GROUP

- A project can define a group of participants with a name, attendance dates.
- A group can be fully or partially attached to any movement to facilitate movement creation.
- A group affects the participant attendance dates

→ See [Group](/functional/business-objects/core/group) and [Participant](/functional/business-objects/core/participant) for the full group reference.

### COMMUNICATION

- An outgoing movement optionally gains a **communication thread**.
- In this thread, messages can be sent on behalf of the user or the movement.
- Moreover (if `ALERT` is enabled) an Alert can be linked to a communication to provide some context.

→ See [Movement](/functional/business-objects/operations/movement) for details on communication threads in movements.

### ALERT

- Alerts can be created at any time with a title and a status (`IN_PROGRESS`, `RESOLVED`, `CANCELED`).
- Each alert contains a communication thread where any currently outside activity can be selected as sender.

→ See [Alert](/functional/business-objects/operations/alert) for the full alert reference.

### REGISTRATION

- A project admin can create a registration period (with dates, audience, pricing, and a maximum number of
  registrations).
- External users can browse the project in the list of open projects and submit registration requests (individual or
  group).

→ See [Registration Period](/functional/business-objects/registration/period) and [Registration Request](/functional/business-objects/registration/request) for the full reference.

::: info
Special note: if the organization does not allow `REGISTRATION`, external users cannot view projects open for
registration.
:::
