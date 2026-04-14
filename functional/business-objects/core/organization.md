---
type: business-object
modules:
  - core
scope:
object_name: organization
required_options:
tags:
  - organization
outline: deep
created: 2026-04-11
last_update: 2026-04-11
---

# Organization

## Definition

An **Organization** is the top-level entity in the application. It represents a legal or operational structure (such as
a company, an association, or a scouting body).

```
Organization
```

## Identity and authentication

Organizations are backed by this **OIDC provider**. The `slug` field stores the organization ID, which links the
application record to the IdP identity. The name is synchronized from the token on first login and is updated on each
subsequent login.

> Related to OIDC provider organization [feature](https://medium.com/keycloak/exploring-keycloak-26-introducing-the-organization-feature-for-multi-tenancy-fb5ebaaf8fe4)

## Main attributes

| Attribute      | Description                                                                                              |
|----------------|----------------------------------------------------------------------------------------------------------|
| Slug           | Organization identifier                                                                                  |
| Name           | The official name of the organization                                                                    |
| Options        | List of available options                                                                                |
| Is strict auth | Controls strict authentication behavior — see impact [here](/functional/features/roles#auto-attribution) |
| Is main        | Designates a cross-organization main role — see impact [here](/functional/features/roles#special-case)   |

### Options

The application has some [options](/functional/features/options). An organization can limit which options are available for its projects.

### Status

An organization does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | `BLOCKED`     |
| Have not been soft deleted | `ENABLED`     |

## Relationships

| Related object | Relationship                                   |
|----------------|------------------------------------------------|
| User           | An organization contains zero or more users    |
| Project        | An organization contains zero or more projects |
