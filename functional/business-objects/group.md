# Group

A **Group** is a named collection of participants within a project. It is used to organise participants into sub-units
and to simplify operations such as collective check-outs.

## Scope

A group is unique to its project — it cannot be shared across projects.

## Attendance dates

A group can have its own attendance dates (arrival and departure). These are optional. If not set, the group is
considered present for the full duration of the project.

The sole purpose of a group's attendance dates is to serve as a **fallback for participants who have no attendance dates
of their own**. When a participant belongs to a group and has no personal attendance dates, the group's dates are used.

::: info
Group dates do **not** constrain participant dates. A participant's attendance period is bounded by the **project**
dates — not by their group's dates. A participant may therefore have a wider attendance range than their group.
:::

## Key attributes

| Attribute             | Description                                                  |
|-----------------------|--------------------------------------------------------------|
| Name                  | The name of the group                                        |
| Arrival date & time   | When the group arrives (optional, defaults to project start) |
| Departure date & time | When the group departs (optional, defaults to project end)   |
| Active                | Whether the group is active                                  |

## Relationships

| Related object | Relationship                               |
|----------------|--------------------------------------------|
| Project        | A group belongs to one project             |
| Participant    | A group contains zero or more participants |
