# Components – BFF

The BFF is the sole entry point for the frontend. It owns the full OIDC authentication flow, enforces authorisation, and
delegates domain operations to the backend modules through their inbound service interfaces.

```mermaid
C4Component
    title Component Diagram — BFF

    Container_Ext(nuxt, "Web Application", "Nuxt / Vue", "")
    System_Ext(keycloak, "Keycloak", "Identity broker")
    Container_Ext(core, "Core Module", "Kotlin / Spring Boot WebFlux", "")
    Container_Ext(operation, "Operation Module", "Kotlin / Spring Boot WebFlux", "")
    Container_Ext(registration, "Registration Module", "Kotlin / Spring Boot WebFlux", "")

    Container_Boundary(bff, "BFF") {
        Component(restApi, "REST API", "Spring WebFlux Router / Inbound Adapter", "Exposes all endpoints consumed by the frontend")
        Component(authFilter, "Auth Filter", "Spring Security / OAuth2 Client + Resource Server", "Handles OIDC login flow and validates JWT on every request")
        Component(coreDelegate, "Core Service Delegate", "Kotlin / Outbound Port", "In-process interface to the Core module")
        Component(operationDelegate, "Operation Service Delegate", "Kotlin / Outbound Port", "In-process interface to the Operation module")
        Component(registrationDelegate, "Registration Service Delegate", "Kotlin / Outbound Port", "In-process interface to the Registration module")
        Component(stats, "Statistics Aggregator", "Kotlin", "Collects and merges statistics from all three module delegates")
    }

    Rel(nuxt, restApi, "API calls + auth initiation", "REST / HTTPS")
    Rel(restApi, authFilter, "Passes through")
    Rel(authFilter, keycloak, "Handles OIDC flow and validates JWT", "HTTPS")
    Rel(restApi, coreDelegate, "Uses")
    Rel(restApi, operationDelegate, "Uses")
    Rel(restApi, registrationDelegate, "Uses")
    Rel(restApi, stats, "Uses")
    Rel(stats, coreDelegate, "Uses")
    Rel(stats, operationDelegate, "Uses")
    Rel(stats, registrationDelegate, "Uses")
    Rel(coreDelegate, core, "Calls", "Service interface")
    Rel(operationDelegate, operation, "Calls", "Service interface")
    Rel(registrationDelegate, registration, "Calls", "Service interface")
```

## Components

| Component                     | Technology                                        | Role                                                                                                 |
|-------------------------------|---------------------------------------------------|------------------------------------------------------------------------------------------------------|
| REST API                      | Spring WebFlux Router                             | Inbound adapter — exposes all endpoints to the frontend                                              |
| Auth Filter                   | Spring Security / OAuth2 Client + Resource Server | Handles the full OIDC login flow; validates JWT on every subsequent request                          |
| Core Service Delegate         | Kotlin / Outbound Port                            | In-process interface to the Core module                                                              |
| Operation Service Delegate    | Kotlin / Outbound Port                            | In-process interface to the Operation module                                                         |
| Registration Service Delegate | Kotlin / Outbound Port                            | In-process interface to the Registration module                                                      |
| Statistics Aggregator         | Kotlin                                            | Collects and merges statistics from all three module delegates into a single project-scoped response |
