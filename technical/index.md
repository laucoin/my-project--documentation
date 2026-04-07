# Technical Documentation

This section covers the technical architecture of the application: how it is structured, how it handles authentication,
how data is organised, and the key decisions that shaped the design.

## Sections

### [Architecture](/technical/architecture/)

The system architecture described using the C4 model, from the high-level system context down to the internal components
of each module.

### [Security](/technical/security)

Authentication and authorisation — the OAuth2 flow, Keycloak organisation routing, and how roles are mapped from tokens
to application permissions.

### [Database](/technical/database)

The database schema structure, module ownership rules, and the migration strategy.

### [Real-Time Push](/technical/real-time)

The SSE event format, reconnection contract, and client-side state management strategy for real-time push
(see [ADR 007](/technical/adr/007-sse-vs-websocket)).

### [Decision Records](/technical/adr/)

A log of the key architectural decisions made during the design of the system, with context and rationale.

### [Coding guidelines](/technical/guidelines/)

Conventions and standards adopted across all modules — covering database schema, Spring & Kotlin patterns, security boundaries, frontend structure, and coding style.

### [How-To Guides](/technical/how-to/)

Step-by-step guides for setting up and operating the infrastructure components the application depends on.
