# 001 – Modular Monolith

|              |                          |
|--------------|--------------------------|
| **Status**   | Accepted                 |
| **Concerns** | Architecture, Deployment |

## Context

The system covers three distinct domains — project core, operations, and registration — each with its own data model and
lifecycle. A fully distributed architecture (microservices from day one) would introduce operational complexity (service
discovery, distributed tracing, independent deployments) that is disproportionate for the current team size and scale.

At the same time, the domains are distinct enough that a flat, unconstrained monolith would risk tight coupling and make
future extraction impractical.

## Decision

Adopt a **modular monolith**: a single deployable Spring Boot application composed of three independent modules (Core,
Operation, Registration). Each module:

- owns its own package structure and domain logic
- owns exactly one database schema
- exposes its domain operations through a **Kotlin service interface (inbound port)** — the only entry point for other
  modules; there are no `@RestController` endpoints between modules, no shared domain objects, and no cross-module
  repository calls
- follows a **hexagonal architecture** internally: inbound port → domain services → outbound repository ports

The BFF calls each module exclusively through its inbound service interface. These interfaces are designed so that if a
module is extracted into a standalone service, the contract can be backed by an HTTP client with no changes to the
callers.

## Consequences

- Single deployment unit — simple CI/CD, no service mesh required.
- Inter-module contracts are designed for extraction: if a module needs to become an independent service, the service
  interface contract and data boundary already exist.
- Developers must respect module boundaries. Cross-module access must go through the inbound service interface, not
  shared repositories or domain objects.
