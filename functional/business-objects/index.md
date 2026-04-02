# Business Objects

This section describes the core entities managed by the application and their relationships.

## Entity hierarchy

All objects are scoped to a **Project**, which itself belongs to an **Organisation**. Objects are never shared between
projects.

```
Organisation
└── Project
    ├── Group
    │   └── Participant (member of, dates fallback)
    ├── Participant
    ├── Activity
    └── Vehicle
```

## Entities

| Entity                                                    | Description                                                              |
|-----------------------------------------------------------|--------------------------------------------------------------------------|
| [Organisation](/functional/business-objects/organisation) | Top-level structure that owns one or more projects                       |
| [Project](/functional/business-objects/project)           | The central object — a group care facility for minors                    |
| [Options](/functional/business-objects/options)           | Feature flags that control which capabilities are available on a project |
| [User](/functional/business-objects/user)                 | An application account — the identity that logs in and operates the app  |
| [Group](/functional/business-objects/group)               | A named collection of participants within a project                      |
| [Participant](/functional/business-objects/participant)   | A person (minor or major) registered in a project                        |
| [Activity](/functional/business-objects/activity)         | A recurring event that can be attached to a movement                     |
| [Vehicle](/functional/business-objects/vehicle)           | A vehicle used during movements                                          |

## Dates and attendance

All objects have optional dates. When no dates are specified, the object is considered active for the full duration of
its parent (or perpetually if the project itself has no dates).

### Attendance fallback for participants

When a participant has no attendance dates of their own, the application resolves them in this order:

| Priority | Source                                                       |
|----------|--------------------------------------------------------------|
| 1        | The participant's own dates *(if set)*                       |
| 2        | Their group's dates *(if set, and the participant has none)* |
| 3        | The project's dates *(final fallback)*                       |

::: info
A participant's dates must stay within the **project** dates. They can extend beyond their group's dates if needed —
group dates serve only as a fallback, not as a hard constraint.
:::

### Activities and vehicles

Activity and vehicle availability is bounded **directly by the project's dates**, independently of any group or
participant.
