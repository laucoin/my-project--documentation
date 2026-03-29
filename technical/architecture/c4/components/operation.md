# Components – Operation Module

The Operation module manages movements, alerts, and communications. It follows a hexagonal architecture — the BFF calls it through an inbound service interface, and persistence is abstracted behind outbound repository interfaces.

```mermaid
C4Component
    title Component Diagram — Operation Module

    Container_Ext(bff, "BFF", "Kotlin / Spring Boot WebFlux", "")
    ContainerDb_Ext(db, "PostgreSQL", "PostgreSQL", "operation schema")

    Container_Boundary(operation, "Operation Module") {
        Component(inbound, "Operation Service Interface", "Kotlin Interface / Inbound Port", "Entry point for BFF calls — exposes all domain operations")
        Component(movementService, "Movement Service", "Kotlin / Domain", "Records and manages participant movements (departures and returns)")
        Component(alertService, "Alert Service", "Kotlin / Domain", "Creates and manages alerts")
        Component(communicationService, "Communication Service", "Kotlin / Domain", "Manages communication threads attached to alerts")
        Component(repoPort, "Repository Interfaces", "Kotlin Interface / Outbound Port", "Persistence contracts defined by the domain")
        Component(repos, "Repositories", "jOOQ / R2DBC / Outbound Adapter", "Implements repository interfaces against the operation schema")
    }

    Rel(bff, inbound, "Calls", "Service interface")
    Rel(inbound, movementService, "Delegates to")
    Rel(inbound, alertService, "Delegates to")
    Rel(inbound, communicationService, "Delegates to")
    Rel(movementService, repoPort, "Uses")
    Rel(alertService, repoPort, "Uses")
    Rel(communicationService, repoPort, "Uses")
    Rel(repoPort, repos, "Implemented by")
    Rel(repos, db, "Reads / Writes", "R2DBC")
```

## Components

| Component | Technology | Role |
|-----------|-----------|------|
| Operation Service Interface | Kotlin Interface | Inbound port — exposes all domain operations to the BFF |
| Movement Service | Kotlin / Domain | Records departures and returns for participants |
| Alert Service | Kotlin / Domain | Creates and manages alerts, independent of movement state |
| Communication Service | Kotlin / Domain | Manages communication threads attached to alerts |
| Repository Interfaces | Kotlin Interface | Outbound port — persistence contracts defined by the domain |
| Repositories | jOOQ / R2DBC | Outbound adapter — implements repository interfaces against the `operation` schema |
