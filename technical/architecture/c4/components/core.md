# Components – Core Module

The Core module manages the central domain entities: organizations, projects, users, participants, groups, activities,
and vehicles. It follows a hexagonal architecture — the BFF calls it through an inbound service interface, and
persistence is abstracted behind outbound repository interfaces.

```mermaid
C4Component
    title Component Diagram — Core Module

    Container_Ext(bff, "BFF", "Kotlin / Spring Boot WebFlux", "")
    ContainerDb_Ext(db, "PostgreSQL", "PostgreSQL", "core schema")

    Container_Boundary(core, "Core Module") {
        Component(inbound, "Core Service Interface", "Kotlin Interface / Inbound Port", "Entry point for BFF calls — exposes all domain operations")
        Component(orgService, "Organization Service", "Kotlin / Domain", "Organization management and options configuration")
        Component(projectService, "Project Service", "Kotlin / Domain", "Project management and options configuration")
        Component(userService, "User Service", "Kotlin / Domain", "User and project profile management")
        Component(participantService, "Participant Service", "Kotlin / Domain", "Participant, group, and attendance date management")
        Component(activityService, "Activity Service", "Kotlin / Domain", "Activity creation and scheduling")
        Component(vehicleService, "Vehicle Service", "Kotlin / Domain", "Vehicle management and scheduling")
        Component(repoPort, "Repository Interfaces", "Kotlin Interface / Outbound Port", "Persistence contracts defined by the domain")
        Component(repos, "Repositories", "jOOQ / R2DBC / Outbound Adapter", "Implements repository interfaces against the core schema")
    }

    Rel(bff, inbound, "Calls", "Service interface")
    Rel(inbound, orgService, "Delegates to")
    Rel(inbound, projectService, "Delegates to")
    Rel(inbound, userService, "Delegates to")
    Rel(inbound, participantService, "Delegates to")
    Rel(inbound, activityService, "Delegates to")
    Rel(inbound, vehicleService, "Delegates to")
    Rel(orgService, repoPort, "Uses")
    Rel(projectService, repoPort, "Uses")
    Rel(userService, repoPort, "Uses")
    Rel(participantService, repoPort, "Uses")
    Rel(activityService, repoPort, "Uses")
    Rel(vehicleService, repoPort, "Uses")
    Rel(repoPort, repos, "Implemented by")
    Rel(repos, db, "Reads / Writes", "R2DBC")
```

## Components

| Component              | Technology       | Role                                                                          |
|------------------------|------------------|-------------------------------------------------------------------------------|
| Core Service Interface | Kotlin Interface | Inbound port — exposes all domain operations to the BFF                       |
| Organization Service   | Kotlin / Domain  | Organization management and options configuration                             |
| Project Service        | Kotlin / Domain  | Project management and options configuration                                  |
| User Service           | Kotlin / Domain  | User and project profile management                                           |
| Participant Service    | Kotlin / Domain  | Participant, group, and attendance date management                            |
| Activity Service       | Kotlin / Domain  | Activity creation and scheduling                                              |
| Vehicle Service        | Kotlin / Domain  | Vehicle management and scheduling                                             |
| Repository Interfaces  | Kotlin Interface | Outbound port — persistence contracts defined by the domain                   |
| Repositories           | jOOQ / R2DBC     | Outbound adapter — implements repository interfaces against the `core` schema |
