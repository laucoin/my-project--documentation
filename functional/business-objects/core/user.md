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
an app account), but the two records remain independent. Linking them is optional and never mandatory. Moreover the participant is limited to a project scope where the user is in the organization scope.
:::

```
Organization
└── User
```

## Identity and authentication

User accounts are backed by **Keycloak**. The `oidc_id` field stores the Keycloak user UUID, which links the
application record to the IdP identity. First name, last name, and email are synchronized from the Keycloak token on
first login and user information are updated on each login.

## Main attributes

| Attribute | Description                                                                      |
|-----------|----------------------------------------------------------------------------------|
| Firstname | Populated from the Keycloak token on first login                                 |
| Lastname  | Populated from the Keycloak token on first login                                 |
| Email     | Populated from the Keycloak token on first login, unique within the organization |
| Role      | Application scope role (check full role list [here](/functional/roles#global))   |

### Status

A user does not have an explicit status field. Its state is derived from:

| Situation                                    | Implied state         |
|----------------------------------------------|-----------------------|
| Have been soft deleted                       | Blocked               |
| Last login date is equal or more than 1 year | Inactif (since X)     |
| Have not been soft deleted                   | Active (last login X) |

## Action

### Creation

- Name: Creation
- Allowed roles: **No one can create a user in app**
- Constraints:
	- User is automatically insert in the app on login.
	- A user cannot register, it must be in the organization active directory.
	- Firstname, Lastname and email must be provided.
	- Role is automatically defined (check [here](/functional/roles#global) for more information)

### Light user creation

A **light user** is a partial user record created automatically when a someone invites an email address that
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

- Name: Edition
- Allowed roles: **No one can edit a user in app**
- Constraints:
	- User is automatically updated in the app on login.

### Soft-delete

- Name: Delete
- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- The user concerned cannot access application anymore.
	- `PROJECT_ADMIN`s and `ORGANIZATION_ADMIN`s still see the user but it should be marked “blocked”
	  (refer to [status](#status)).
	- It must have at least one permanent profile with role `PROJECT_ADMIN` and type `DEFAULT` in the project.

### Enable-back

- Name: Enable Back
- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
- Constraints:
	- Only applicable to soft-deleted participants

### Purge (GDPR)

Condition to purge:

- Participant has no related action in [operations](/functional/business-objects/operations) since 1 year.

- Name: Purge
- Allowed roles:
	- `SUPER_ADMIN`
	- `ORGANIZATION_ADMIN`
	- Any user for himself
- Constraints:
	- The deletion MUST impact module [operations](/functional/business-objects/operations).
	- The deletion cannot be rollback

### Data extraction (GDPR)

- Name: Data extraction
- Allowed roles:
	- `PROJECT_ADMIN`
	- `PROJECT_MANAGER`
	- Any user for himself
- Constraints:
	- Should not include other participant personal data
	- Should not include other user personal data

#### Extraction content

- User [information](#main-attributes)
- Profiles
- Participants: Should include all linked [participant data](/functional/business-objects/core/participant#extraction-content)

## Relationships

| Related object | Relationship                                                   |
|----------------|----------------------------------------------------------------|
| Organization   | A user belongs to one organization                             |
| Profile        | A user can hold zero or more project profiles                  |
| Participant    | A user can optionally be linked to one participant per project |
