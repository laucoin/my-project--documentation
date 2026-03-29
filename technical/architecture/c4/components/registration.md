# Components – Registration Module

The Registration module manages registration periods and requests. It follows a hexagonal architecture — the BFF calls it through an inbound service interface, and persistence is abstracted behind outbound repository interfaces. It is available only when the REGISTRATION option is enabled on both the organisation and the project.

```mermaid
C4Component
    title Component Diagram — Registration Module

    Container_Ext(bff, "BFF", "Kotlin / Spring Boot WebFlux", "")
    ContainerDb_Ext(db, "PostgreSQL", "PostgreSQL", "registration schema")

    Container_Boundary(registration, "Registration Module") {
        Component(inbound, "Registration Service Interface", "Kotlin Interface / Inbound Port", "Entry point for BFF calls — exposes all domain operations")
        Component(periodService, "Period Service", "Kotlin / Domain", "Manages registration periods — window dates, coverage dates, and pricing tiers")
        Component(requestService, "Request Service", "Kotlin / Domain", "Manages registration requests and their lifecycle")
        Component(repoPort, "Repository Interfaces", "Kotlin Interface / Outbound Port", "Persistence contracts defined by the domain")
        Component(repos, "Repositories", "jOOQ / R2DBC / Outbound Adapter", "Implements repository interfaces against the registration schema")
    }

    Rel(bff, inbound, "Calls", "Service interface")
    Rel(inbound, periodService, "Delegates to")
    Rel(inbound, requestService, "Delegates to")
    Rel(periodService, repoPort, "Uses")
    Rel(requestService, repoPort, "Uses")
    Rel(repoPort, repos, "Implemented by")
    Rel(repos, db, "Reads / Writes", "R2DBC")
```

## Components

| Component | Technology | Role |
|-----------|-----------|------|
| Registration Service Interface | Kotlin Interface | Inbound port — exposes all domain operations to the BFF |
| Period Service | Kotlin / Domain | Registration period management — window dates, coverage dates, and pricing configuration |
| Request Service | Kotlin / Domain | Registration request lifecycle — from submission to confirmation or refusal |
| Repository Interfaces | Kotlin Interface | Outbound port — persistence contracts defined by the domain |
| Repositories | jOOQ / R2DBC | Outbound adapter — implements repository interfaces against the `registration` schema |
