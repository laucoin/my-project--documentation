# 005 – Keycloak Organizations

|              |                                         |
|--------------|-----------------------------------------|
| **Status**   | Accepted                                |
| **Concerns** | Authentication, Multi-tenancy, Security |

## Context

The system is multi-tenant: each organization has its own users, and some organizations federate their identity through
an external IdP (OIDC or SAML). Requirements:

- Users must authenticate in the context of their organization.
- The list of organizations must not be publicly exposed (no org picker on a public login screen).
- Organizations do not necessarily share an email domain, so email-domain-based routing is not reliable.
- Some organizations use an external IdP and need a way to designate their administrators.
- Machine-to-machine authentication may be needed in the future (e.g. BFF calling external APIs).

## Alternatives considered

| Solution     | Internal users | External IdP | Custom login page | Machine-to-machine |
|--------------|----------------|--------------|-------------------|--------------------|
| **Keycloak** | ✓              | ✓            | ✓                 | ✓                  |
| Authelia     | ✓              | ✓            | Limited           | ✗                  |
| Authentik    | ✓              | ✓            | ✓                 | ✓                  |
| Hanko        | ✓              | Limited      | ✓                 | ✗                  |
| SuperTokens  | ✓              | ✓            | ✓                 | Limited            |
| Ory.sh       | ✓              | ✓            | ✓                 | ✓                  |

Keycloak was selected because of its **Organizations feature** (26.x), which natively supports multi-tenant
authentication with per-organization IdP routing — exactly the model needed. Authentik and Ory.sh were strong
alternatives but their multi-tenancy model requires more custom configuration to achieve the same result.

## Decision

Use **Keycloak 26.x with the Organizations feature**.

Each organization is represented as a Keycloak Organization with a unique **business slug** (a human-readable string
identifier stored alongside the technical UUID). The authentication flow is:

1. The user enters their organization's business slug on a pre-login screen in the application.
2. The BFF initiates the OIDC flow with the `organization=<slug>` parameter.
3. Keycloak resolves the organization, applies the appropriate identity provider (built-in or federated), and completes
   the authorization code flow.

For organizations with an external IdP, the IdP must include role claims in its token. Keycloak identity provider
mappers translate those claims to application roles:

| IdP role claim value     | Application role       |
|--------------------------|------------------------|
| `MY_PROJECT_SUPER_ADMIN` | `SUPER_ADMIN` globally |

## Consequences

- No organization list is exposed publicly — users must know their slug to authenticate.
- Multi-tenancy is handled entirely within Keycloak; the application receives a standard JWT with organization and role
  claims.
- Organizations with an external IdP must configure the role claims on their side — this is documented in the onboarding
  process.
- The business slug must be unique across all organizations and is immutable once assigned.
- Keycloak's built-in client credentials grant covers future machine-to-machine authentication needs without additional
  tooling.
