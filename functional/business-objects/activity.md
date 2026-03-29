# Activity

An **Activity** is a named, recurring event organised within a project. Its primary use is to enrich movements by
providing context for why participants are entering or leaving the project site.

::: info Option required
Activities are only available if the **ACTIVITY** option is enabled on the project.
:::

## Use in movements

Attaching an activity to a movement is optional. When attached, it indicates that the participants are leaving (or
returning to) the project site for that specific activity.

## Use in communications

When the **COMMUNICATION** option is enabled, an activity attached to an outgoing movement can be selected as the *
*sender** in a communication thread linked to that movement. This allows staff to write messages on behalf of the group
that is outside.

When the **ALERT** option is enabled, any activity currently linked to an outside movement can appear as a sender in an
alert's communication thread.

## Availability dates

An activity can have its own availability dates (start and end). These are optional. If not set, the activity is
considered available for the full duration of the project.

::: info Attendance date constraint
An activity's availability dates must stay within the **project** dates.
:::

## Key attributes

| Attribute                      | Description                                      |
|--------------------------------|--------------------------------------------------|
| Name                           | The name of the activity                         |
| Description                    | An optional description                          |
| Min participants               | The minimum number of participants required      |
| Max participants               | The maximum number of participants allowed       |
| Duration                       | The expected duration of the activity            |
| Availability start date & time | When the activity becomes available *(optional)* |
| Availability end date & time   | When the activity ends *(optional)*              |
| Active                         | Whether the activity is active                   |

## Relationships

| Related object | Relationship                                         |
|----------------|------------------------------------------------------|
| Project        | An activity belongs to one project                   |
| Movement       | An activity can be attached to one or more movements |
