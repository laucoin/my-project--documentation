---
type: business-object
modules:
  - core
scope: organization
object_name: project
required_options:
tags:
  - project
outline: deep
created: 2026-04-11
last_update: 2026-04-11
---

# Project

## Definition

The **Project** is the central object of the application. In the legal sense, it represents a group care facility for
minors: a structured context defined by a period.

```
Organization
└── Project
```

## Main attributes

| Attribute      | Description                                           |
|----------------|-------------------------------------------------------|
| Name           | The project name                                      |
| Options        | List of enable options                                |
| Schedule range | Date and time range to identify project start and end |

### Options

The organization has some available [options](/functional/features/options). A project’s options are limited to those enabled by its organization.

### Status

A project does not have an explicit status field. Its state is derived from:

| Situation                            | Implied state |
|--------------------------------------|---------------|
| Project has been soft deleted        | `BLOCKED`     |
| No dates set                         | `PERMANENT`   |
| Start date is in the future          | `UPCOMING`    |
| Today is between start and end dates | `IN_PROGRESS` |
| End date is in the past              | `ARCHIVED`    |

## Relationships

| Related object | Relationship                                                              |
|----------------|---------------------------------------------------------------------------|
| Organization   | A project belongs to one organization                                     |
| Profile        | A project contains one or more profiles                                   |
| Group          | A project contains zero or more groups                                    |
| Participant    | A project contains zero or more participants                              |
| Movement       | A project contains zero or more movements                                 |
| Activity       | A project contains zero or more activities *(if option enabled)*          |
| Vehicle        | A project contains zero or more vehicles *(if option enabled)*            |
| Communication  | A project contains zero or more communications *(if option enabled)*      |
| Alert          | A project contains zero or more alerts *(if option enabled)*              |
| Period         | A project contains zero or more registration period *(if option enabled)* |
