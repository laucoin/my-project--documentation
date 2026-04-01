# Level 2 – Containers

This diagram shows the deployable units that make up the system and how they communicate.

```mermaid
C4Container
    title Container Diagram — Group Care Management

    Person(staff, "Staff Member", "Project admins and coordinators managing a project")
    Person(youth, "Youth Participant", "Participant with limited operational access")

    System_Ext(keycloak, "Keycloak", "Identity broker")
    System_Ext(idp, "Organisation IdP", "External IdP — optional per organisation")
    System_Ext(weblate, "Weblate", "Translation management")

    Container(nuxt, "Web Application", "Nuxt / Vue", "User interface structured in layers mirroring backend modules")

    System_Boundary(monolith, "Spring Boot Modular Monolith") {
        Container(bff, "BFF", "Kotlin / Spring Boot WebFlux", "Single entry point — handles authentication and delegates to internal modules")
        Container(core, "Core Module", "Kotlin / Spring Boot WebFlux", "Manages organisations, projects, users, participants, groups, activities, vehicles")
        Container(operation, "Operation Module", "Kotlin / Spring Boot WebFlux", "Manages movements, alerts, and communications")
        Container(registration, "Registration Module", "Kotlin / Spring Boot WebFlux", "Manages registration periods and requests")
        ContainerDb(db, "PostgreSQL", "PostgreSQL", "One database — three isolated schemas, one per domain module")
    }

    Rel(staff, nuxt, "Uses", "HTTPS")
    Rel(youth, nuxt, "Uses", "HTTPS")
    Rel(keycloak, idp, "Federates identity from", "OIDC / SAML")
    Rel(nuxt, bff, "API calls + auth initiation", "REST / HTTPS")
    Rel(nuxt, weblate, "Pulls translations", "HTTPS")
    Rel(bff, keycloak, "Handles OIDC flow", "HTTPS")
    Rel(bff, core, "Calls", "Service interface")
    Rel(bff, operation, "Calls", "Service interface")
    Rel(bff, registration, "Calls", "Service interface")
    Rel(core, db, "Reads / Writes", "R2DBC — core schema")
    Rel(operation, db, "Reads / Writes", "R2DBC — operation schema")
    Rel(registration, db, "Reads / Writes", "R2DBC — registration schema")
```

## Containers

| Container           | Technology                   | Description                                                         |
|---------------------|------------------------------|---------------------------------------------------------------------|
| Web Application     | Nuxt / Vue                   | Frontend — structured in four layers (APP + one per backend module) |
| BFF                 | Kotlin / Spring Boot WebFlux | Backend For Frontend — the only container exposed to the frontend   |
| Core Module         | Kotlin / Spring Boot WebFlux | Domain core — organisations, projects, users, participants          |
| Operation Module    | Kotlin / Spring Boot WebFlux | Operations — movements, alerts, communications                      |
| Registration Module | Kotlin / Spring Boot WebFlux | Registrations — periods and requests                                |
| PostgreSQL          | PostgreSQL                   | Single database with three isolated schemas                         |

## Notes

- The Web Application is a separate Nuxt deployment. BFF, Core, Operation, and Registration are co-deployed as a single
  Spring Boot application (modular monolith).
- The BFF is the **only** container accessible from the frontend. Backend modules are internal.
- Each module owns exactly one database schema. No module queries another module's schema directly.
