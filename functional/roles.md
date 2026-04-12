# Roles

The application has two levels of roles:

- Organization
- Project

::: warning Organization can gave a role
Moreover the 2 levels an organization can give in special case **global roles** that apply to the platform as a whole.
:::

## Organization

| Role                 | Description                |
|----------------------|----------------------------|
| `ORGANIZATION_ADMIN` | Organization administrator |
| `ORGANIZATION_USER`  | Standard user              |

:::info Admin scope
The administrator hasn’t access to whole organization’s projects. Indeed, he can see them but cannot see their content.
As it’s stipulated in [profiles](/functional/business-objects/core/profile#support-profile), he can create a support profile to access a project (for tracking access).
:::

:::warning Role scope
The organization role is only scoped to an organization. it means, when you got a `ORGANIZATION_ADMIN` it's limited to
a specific organization (not all ones). Excepted for `SUPER_ADMIN`.
:::

### Auto attribution

As a user is logged in with his organization OIDC provider. The organization role can automatically be defined.
If the OIDC provider give a `MY_PROJECT-ORGANIZATION_ADMIN` or `MY_PROJECT-ORGANIZATION_USER` the user is automatically

:::warning
If an organization "is strict auth", the user cannot access the application except the OIDC provider return one of the previous roles.
:::

### Special case

As you can see in [organization](/functional/business-objects/core/organization#main-attributes), there is a field "Is main".
When there is a main organization, all these user obtains `SUPER_ADMIN` role.

:::info Role attribution
This role is not directly linked to a user, that mean, all user in the organization obtain this role. But if the organization is not main anymore, all organization’s user lose their
`SUPER_ADMIN` role.
:::

A `SUPER_ADMIN`:

- Manage organizations
- Can do the same things as an `ORGANIZATION_ADMIN` of all organization.

## Project

| Role              | Description           |
|-------------------|-----------------------|
| `PROJECT_ADMIN`   | Project administrator |
| `PROJECT_MANAGER` | Project manager       |
| `PROJECT_USER`    | Project user          |

Main idea about the 3 roles (check objects’ actions for details):

- Project admin has full access on the project
- Project manager has:
	- Limited access to core module scope (Read, create, update, soft-delete)
	- Full access to operations module scope
	- Limited access to registration module scope (Read, but can only answer te registration request)
- Project user has:
	- Limited access to core module scope (Read, except for guest creation through movement)
	- Limited access to operations module scope (Read, create, update, soft-delete)
	- No access to registration module scope

:::warning Role scope
The project role is only scoped to a project (with a profile). it means, when you got a `PROJECT_ADMIN` it's limited to
a specific project (not all ones).
:::
