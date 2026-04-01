---
type: feature
modules:
  - core
objects:
  - profile
required_options:
tags:
  - authentication
  - profile
outline: deep
created: 2026-04-13
last_update: 2026-04-13
---

# Authentication

## Objects used

- [Profile](/functional/business-objects/core/profile)

## Login

Each organization has a unique **slug** used to identify it on the platform. The user enters their organization slug
to be redirected to the appropriate login page.

### Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> App: Enter organization slug
    App -->> John DOE: Redirect to login page
    John DOE ->> App: Authenticate (credentials)
    App -->> John DOE: Access granted
```

### External IdP

Organizations can configure their own identity provider. In that case, the user authenticates through their organization's login page instead of the default one.

Roles can be automatically assigned based on claims returned by the identity provider. This is configured during the organization onboarding process.

## Organization scope

All requests are automatically scoped to the user's organization context established at login.

::: warning
An exception is done for the `SUPER_ADMIN`. See [Roles](/functional/features/roles) for the full role model.
:::

## Project scope access check

Any request made in a project scope is automatically gated by a profile check. Before the request reaches the business logic, the BFF verifies that the authenticated user holds an active profile for the requested project.

If no active profile is found, the request is rejected.

### Workflow

```mermaid
sequenceDiagram
    autonumber
    actor John DOE
    John DOE ->> BFF: Any request in project X scope
    BFF ->> Core: Check John DOE has an active profile for project X
    alt No active profile found
        Core -->> BFF: Not found
        BFF -->> John DOE: 403 Forbidden
    else Active profile found
        Core -->> BFF: John DOE profile for project X
        BFF ->> Core: Pass original request
        Core -->> BFF: Response
        BFF -->> John DOE: Response
    end
```
