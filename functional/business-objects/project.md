# Project

The **Project** is the central object of the application. In the legal sense, it represents a group care facility for
minors: a structured context defined by a period and one or more physical locations.

Every other object — groups, participants, activities, vehicles — is scoped to a project and cannot be shared with
another.

## Dates

A project's dates are optional. If no dates are set, the project is considered perpetual.

When dates are set, only the **date** is specified — no time. The application applies the following convention:

| Date type  | Time applied |
|------------|--------------|
| Start date | 00:00        |
| End date   | 23:59        |

## Status

A project does not have an explicit status field. Its state is derived from its dates:

| Situation                            | Implied state |
|--------------------------------------|---------------|
| No dates set                         | Perpetual     |
| Start date is in the future          | Upcoming      |
| Today is between start and end dates | In progress   |
| End date is in the past              | Ended         |

## Key attributes

| Attribute  | Description                        |
|------------|------------------------------------|
| Name       | The name of the project            |
| Start date | When the project begins (optional) |
| End date   | When the project ends (optional)   |
| Active     | Whether the project is active      |

## Relationships

| Related object      | Relationship                                                              |
|---------------------|---------------------------------------------------------------------------|
| Organisation        | A project belongs to one organisation                                     |
| Group               | A project contains zero or more groups                                    |
| Participant         | A project contains zero or more participants                              |
| Activity            | A project contains zero or more activities *(if option enabled)*          |
| Vehicle             | A project contains zero or more vehicles *(if option enabled)*            |
| Registration period | A project contains zero or more registration period *(if option enabled)* |
| Options             | A project enables a subset of its organisation's available options        |
