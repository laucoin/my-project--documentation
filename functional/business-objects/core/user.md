---
type: business-object
modules:
  - core
scope: organization
object_name: user
required_options:
tags:
  - user
  - roles
  - permissions
  - data
  - privacy
outline: deep
created: 2026-04-12
last_update: 2026-04-12
---

# User

## Definition

A **User** is a person (or an application account) who can log in and interact with the platform.

::: warning User ≠ Participant
A user and a participant are separate concepts. The same individual can be both (e.g. a participant who also has
an app account), but the two records remain independent. Linking them is optional and never mandatory. Moreover, a participant is scoped to a project, whereas a user is scoped to an organization.
:::

```
Organization
└── User
```

## Identity and authentication

User accounts are backed by an **OIDC provider**. The `oidc_id` field stores the provider user UUID, which links the
application record to the identity provider. First name, last name, and email are synchronized from the OIDC token on
first login and user information is updated on each login.

For role attributions and application access check [here](/functional/features/roles#auto-attribution)

## Main attributes

| Attribute | Description                                                                  |
|-----------|------------------------------------------------------------------------------|
| Firstname | Populated from the OIDC token on first login                                 |
| Lastname  | Populated from the OIDC token on first login                                 |
| Email     | Populated from the OIDC token on first login, unique within the organization |

### Status

A user does not have an explicit status field. Its state is derived from:

| Situation                                    | Implied state |
|----------------------------------------------|---------------|
| Have been soft deleted                       | `BLOCKED`     |
| Last login date is equal or more than 1 year | `INACTIVE`    |
| Have not been soft deleted                   | `ACTIVE`      |

## Relationships

| Related object | Relationship                                                   |
|----------------|----------------------------------------------------------------|
| Organization   | A user belongs to one organization                             |
| Profile        | A user can hold zero or more project profiles                  |
| Participant    | A user can optionally be linked to one participant per project |
