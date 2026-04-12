---
module: core
object_name: organization
created: 2026-04-11
last_update: 2026-04-11
---

# Organization

## Definition

An **Organization** is the top-level entity in the application. It represents a legal or operational structure — such as
a company, an association, or a scouting body.

```
Organization
```

## Identity and authentication

Organization are backed by **Keycloak**. The `slug` field stores the Keycloak organization ID, which links the
application record to the IdP identity. Name is synchronized from the Keycloak token on
first login and is updated on each login.

> Related to Keycloak organization [feature](https://medium.com/keycloak/exploring-keycloak-26-introducing-the-organization-feature-for-multi-tenancy-fb5ebaaf8fe4)

## Main attributes

| Attribute | Description                                                                                                     |
|-----------|-----------------------------------------------------------------------------------------------------------------|
| Slug      | Organization identifier used                                                                                    |
| Name      | The official name of the organization                                                                           |
| Options   | List of available options                                                                                       |
| Is main   | Has a main role (cross organization), check impact of main organization [here](/functional/roles#organization)) |

### Options

The application has some [options](/functional/options). An organization can limit available options in his projects.

### Status

A organization does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | Disabled      |
| Have not been soft deleted | Active        |

## Action

### Soft-delete

- Name: Delete
- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- All users belonging to that organization are prevented from logging in. Their Keycloak authentication will succeed, but the application will reject the session because no active organization can be resolved for the slug.
	- Existing data (projects, participants, movements, etc.) is preserved.

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- Only applicable to soft-deleted organizations

### Delete

::: info Delete ≠ Soft-Delete
Delete is a real deletion from database which on is definitive.
:::

- Name: Permanent delete
- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- Should delete all operation content (project, etc.)
	- The deletion cannot be rollback

## Relationships

| Related object | Relationship                             |
|----------------|------------------------------------------|
| User           | A project contains zero or more users    |
| Project        | A project contains zero or more projects |
