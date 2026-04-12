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

Organizations are backed by **Keycloak**. The `slug` field stores the Keycloak organization ID, which links the
application record to the IdP identity. The name is synchronized from the Keycloak token on
first login and is updated on each subsequent login.

> Related to Keycloak organization [feature](https://medium.com/keycloak/exploring-keycloak-26-introducing-the-organization-feature-for-multi-tenancy-fb5ebaaf8fe4)

## Main attributes

| Attribute      | Description                                                                                                     |
|----------------|-----------------------------------------------------------------------------------------------------------------|
| Slug           | Organization identifier                                                                                             |
| Name           | The official name of the organization                                                                               |
| Options        | List of available options                                                                                           |
| Is strict auth | Controls strict authentication behavior — see impact [here](/functional/roles#auto-attribution)                     |
| Is main        | Designates a cross-organization main role — see impact [here](/functional/roles#special-case)                       |

### Options

The application has some [options](/functional/options). An organization can limit which options are available for its projects.

### Status

An organization does not have an explicit status field. Its state is derived from:

| Situation                  | Implied state |
|----------------------------|---------------|
| Have been soft deleted     | `BLOCKED`     |
| Have not been soft deleted | `ACTIVE`      |

## Action

### Read & Search

- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- Search are allowed on following field but not required:
		- Text search on name or slug
		- Is strict auth
		- Is main
		- Options includes options (one or multiples)
		- Status equal at least one given statuses

### Creation

- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- Name is required
	- Slug is required
	- Options are optional (no option given mean no option active)
	- Is strict auth is required
	- Is main is required

### Edition

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints (differences with creation):
	- `ORGANIZATION_ADMIN`s cannot edit slug or is main field.

### Soft-delete

- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- All users belonging to that organization are prevented from logging in. Their Keycloak authentication will succeed, but the application will reject the session because no active organization can be resolved for the slug.
	- Existing data (projects, participants, movements, etc.) is preserved.

### Enable-back

- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- Only applicable to soft-deleted organizations

### Delete

::: info Delete ≠ Soft-Delete
Delete is a real deletion from database which on is definitive.
:::

- Allowed roles:
	- `SUPER_ADMIN`
- Constraints:
	- Should delete all operation content (project, etc.)
	- The deletion cannot be rolled back

## Relationships

| Related object | Relationship                                   |
|----------------|------------------------------------------------|
| User           | An organization contains zero or more users    |
| Project        | An organization contains zero or more projects |
