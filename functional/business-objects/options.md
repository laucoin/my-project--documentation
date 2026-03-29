---
outline: deep
---

# Options

Options are a mechanism for enabling or disabling specific features at the project level. They are pre-allowed at the
organisation level and selectively activated per project.

## How options work

1. An **Organisation** selects which options are available across its projects.
2. Each **Project** can then activate zero or more of those available options.

This allows organisations to tailor the feature set of each project without exposing features that are irrelevant or not
authorised.

## Available options

| Option          | Feature unlocked                                                                                      | Dependency               |
|-----------------|-------------------------------------------------------------------------------------------------------|--------------------------|
| `VEHICLE`       | Vehicles can be created and attached to movements                                                     | None                     |
| `ACTIVITY`      | Activities can be created and attached to movements                                                   | None                     |
| `COMMUNICATION` | Outgoing movements linked to an activity can have a communication thread                              | Requires `ACTIVITY`      |
| `ALERT`         | Alerts can be created with a status, topic, and communication thread referencing any outside activity | Requires `COMMUNICATION` |
| `REGISTRATION`  | A registration period can be created, allowing external users to submit registration requests         | None                     |

## Option dependencies

Some options can only be activated if their dependency is already enabled:

```
VEHICLE        (independent)
ACTIVITY       (independent)
  └── COMMUNICATION
          └── ALERT
REGISTRATION   (independent)
```

::: warning
Disabling an option that another option depends on is not permitted while the dependent option is still active. For
example, `ACTIVITY` cannot be disabled while `COMMUNICATION` is enabled.
:::

## Summary of features per option

### VEHICLE

- A project can define vehicles with a license plate, brand, and model.
- A vehicle can be attached to any movement.
- The driver must be identified in the movement.

### ACTIVITY

- A project can define recurring activities with a name, duration, min/max participants, and availability dates.
- An activity can be attached to any movement to provide context.

### COMMUNICATION

- An outgoing movement linked to an activity gains a **communication thread**.
- In this thread, messages can be sent on behalf of the user or the movement's activity.

### ALERT

- Alerts can be created at any time with a title and a status (`IN_PROGRESS`, `RESOLVED`, `CANCELLED`).
- Each alert contains a communication thread where any currently outside activity can be selected as sender.

### REGISTRATION

- A project admin can create a registration period (with dates, audience, pricing, and a maximum number of
  registrations).
- External users can browse the project in the list of open projects and submit registration requests (individual or
  group).

::: info
Special note regarding this option: If the organization does not allow REGISTRATION, an external user cannot view
projects open for registration.
:::
