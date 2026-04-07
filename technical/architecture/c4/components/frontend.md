# Components – Web Application

The frontend is a **Nuxt application** structured using Nuxt Layers. Each layer encapsulates the UI concerns of one
domain module, mirroring the backend module structure. Authentication is handled entirely by the BFF — the frontend
never communicates directly with Keycloak.

```mermaid
C4Component
    title Component Diagram — Web Application (Nuxt)

    Container_Ext(bff, "BFF", "Kotlin / Spring Boot WebFlux", "")

    Container_Boundary(nuxt, "Web Application") {
        Component(app, "APP Layer", "Nuxt", "Application entry point — routing, authentication guard, global layout and navigation")
        Component(coreLayer, "Project Core Layer", "Vue / Nuxt Layer", "UI for project, group, participant, activity, and vehicle management")
        Component(operationLayer, "Operation Layer", "Vue / Nuxt Layer", "UI for movement recording, alert creation and management")
        Component(registrationLayer, "Registration Layer", "Vue / Nuxt Layer", "UI for registration period configuration and request management")
    }

    Rel(app, bff, "Auth initiation", "REST / HTTPS")
    Rel(app, coreLayer, "Composes")
    Rel(app, operationLayer, "Composes")
    Rel(app, registrationLayer, "Composes")
    Rel(coreLayer, bff, "API calls", "REST / HTTPS")
    Rel(operationLayer, bff, "API calls", "REST / HTTPS")
    Rel(registrationLayer, bff, "API calls", "REST / HTTPS")
```

## Components

| Component          | Technology       | Responsibility                                                 |
|--------------------|------------------|----------------------------------------------------------------|
| APP Layer          | Nuxt             | Entry point — routing, auth guard, shared layout, translations |
| Project Core Layer | Vue / Nuxt Layer | Project management, participants, groups, activities, vehicles |
| Operation Layer    | Vue / Nuxt Layer | Movements, alerts, communications                              |
| Registration Layer | Vue / Nuxt Layer | Registration periods and requests                              |
