---
module: core
scope: organization
object_name: user
created: 2026-04-12
last_update: 2026-04-12
---

# User

## Definition

A **User** is a person (or an application account) who can log in and interact with the platform.

::: info User ≠ Participant
A user and a participant are separate concepts. The same individual can be both (e.g. a participant who also has
an app account), but the two records remain independent. Linking them is optional and never mandatory. Moreover, a participant is scoped to a project, whereas a user is scoped to an organization.
:::

```
Organization
└── User
```

## Identity and authentication

User accounts are backed by **Keycloak**. The `oidc_id` field stores the Keycloak user UUID, which links the
application record to the IdP identity. First name, last name, and email are synchronized from the Keycloak token on
first login and user information is updated on each login.

For role attributions and application access check [here](/functional/roles#auto-attribution)

## Main attributes

| Attribute | Description                                                                      |
|-----------|----------------------------------------------------------------------------------|
| Firstname | Populated from the Keycloak token on first login                                 |
| Lastname  | Populated from the Keycloak token on first login                                 |
| Email     | Populated from the Keycloak token on first login, unique within the organization |

### Status

A user does not have an explicit status field. Its state is derived from:

| Situation                                    | Implied state |
|----------------------------------------------|---------------|
| Have been soft deleted                       | `BLOCKED`     |
| Last login date is equal or more than 1 year | `INACTIVE`    |
| Have not been soft deleted                   | `ACTIVE`      |

## Action

### Read & Search

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- Search are allowed on following field but not required:
		- Text search on firstname, lastname, email
		- Status equal at least one given statuses

### Creation

- Allowed roles: **No one can create a user in app**
- Constraints:
	- User is automatically insert in the app on login.
	- A user cannot self-register; they must exist in the organization's active directory.
	- First name, last name, and email must be provided.
	- Role is automatically assigned (check [here](/functional/roles#auto-attribution) for more information)

### Light user creation

A **light user** is a partial user record created automatically when someone invites an email address that
does not yet correspond to any account in the organization.

A light user has:

- A valid `email` — the only populated identity field
- No OIDC identity linked
- No firstname or lastname
- A pending profile invitation on the project that triggered the creation

When the person logs in for the first time, Keycloak authenticates them and the application matches the authenticated
email against the light user record. The OIDC identity is linked, the name fields are populated from the token, and
the user immediately sees their pending invitation.

::: info
A light user is indistinguishable from a full user. The only indicator is the absence of OIDC identity linked.
:::

### Edition

- Allowed roles: **No one can edit a user in app**
- Constraints:
	- User is automatically updated in the app on login.

### Soft-delete

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- The user concerned cannot access application anymore.
	- `PROJECT_ADMIN`s and `ORGANIZATION_ADMIN`s still see the user but it should be marked “blocked”
	  (refer to [status](#status)).
	- It must have at least one permanent profile with role `PROJECT_ADMIN` and type `DEFAULT` in the project.

### Enable-back

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- Only applicable to soft-deleted users

### Purge (GDPR)

Purge condition: The user has had no related action in [operations](/functional/business-objects/operations) in the last year.

- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
	- Any user for themselves
- Constraints:
	- The deletion MUST affect the [operations](/functional/business-objects/operations) module.
	- The deletion cannot be rolled back

### Data extraction (GDPR)

- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- Any user for themselves
- Constraints:
	- Should not include other participant personal data
	- Should not include other user personal data

Refer [data policy](/functional/data-policy) to see expected format and data in the export.

## Relationships

| Related object | Relationship                                                   |
|----------------|----------------------------------------------------------------|
| Organization   | A user belongs to one organization                             |
| Profile        | A user can hold zero or more project profiles                  |
| Participant    | A user can optionally be linked to one participant per project |
