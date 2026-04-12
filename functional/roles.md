# Roles

The application has two levels of roles:

- Organization
- Project

::: warning Organization global roles
In addition to those 2 levels, an organization can grant **global roles** in special cases that apply to the platform
as a whole.
:::

## Organization

| Role                 | Description                |
|----------------------|----------------------------|
| `ORGANIZATION_ADMIN` | Organization administrator |
| `ORGANIZATION_USER`  | Standard user              |

:::info Admin scope
The administrator does not have access to all of the organization's projects. They can see them but cannot see their
content. As described in [profiles](/functional/business-objects/core/profile#support-profile), they can create a
support profile to access a project (for audit purposes).
:::

:::warning Role scope
The organization role is only scoped to a specific organization. This means that an `ORGANIZATION_ADMIN` role is limited
to one organization (not all of them). Except for `SUPER_ADMIN`.
:::

### Auto attribution

When a user logs in with their organization's OIDC provider, the organization role can be automatically assigned.
If the OIDC provider returns a `MY_PROJECT-ORGANIZATION_ADMIN` or `MY_PROJECT-ORGANIZATION_USER` claim, the user is
automatically assigned the corresponding role.

:::warning
If an organization has "strict auth" enabled, the user cannot access the application unless the OIDC provider returns
one of the roles listed above.
:::

### Special case

As described in [organization](/functional/business-objects/core/organization#main-attributes), there is a field
"Is main". When an organization is marked as main, all of its users obtain the `SUPER_ADMIN` role.

:::info Role attribution
This role is not directly linked to individual users. All users in the organization obtain this role automatically.
If the organization is no longer designated as main, all of its users lose their `SUPER_ADMIN` role.
:::

A `SUPER_ADMIN`:

- Can manage organizations
- Can do the same things as an `ORGANIZATION_ADMIN` for any organization

## Project

| Role              | Description           |
|-------------------|-----------------------|
| `PROJECT_ADMIN`   | Project administrator |
| `PROJECT_MANAGER` | Project manager       |
| `PROJECT_USER`    | Project user          |

Main idea about the 3 roles (check objects' actions for details):

- Project admin has full access to the project
- Project manager has:
	- Limited access to the core module scope (Read, create, update, soft-delete)
	- Full access to the operations module scope
	- Limited access to the registration module scope (Read, but can only respond to registration requests)
- Project user has:
	- Limited access to the core module scope (Read, except for guest creation through movement)
	- Limited access to the operations module scope (Read, create, update, soft-delete)
	- No access to the registration module scope

:::warning Role scope
The project role is only scoped to a specific project (via a profile). This means that a `PROJECT_ADMIN` role is
limited to one project (not all of them).
:::
