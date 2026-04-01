# 004 – Reactive Stack

|              |                                       |
|--------------|---------------------------------------|
| **Status**   | Accepted                              |
| **Concerns** | Architecture, Performance, Technology |

## Context

The BFF aggregates responses from multiple modules in parallel on every statistics request. A blocking I/O model would
require a thread per concurrent request and per parallel call, which does not scale efficiently for this workload.
Additionally, adopting a consistent reactive stack across all layers avoids impedance mismatch between blocking and
non-blocking code.

## Decision

Use a **fully reactive, non-blocking stack** across all backend containers:

| Layer         | Technology                   |
|---------------|------------------------------|
| HTTP          | Spring Boot WebFlux          |
| Database      | R2DBC                        |
| Query builder | jOOQ (with R2DBC dialect)    |
| Migrations    | Flyway (JDBC — startup only) |

The entire runtime request path — from the BFF receiving a frontend call, through module service interfaces, down to
database queries — is non-blocking.

## Rationale

- **Parallel aggregation** — the BFF calls multiple module services concurrently without blocking threads, keeping
  resource usage low under load.
- **Consistent stack** — a uniform reactive model across all layers avoids mixing blocking and non-blocking code, which
  is error-prone in WebFlux.
- **Team skill development** — building on Project Reactor and WebFlux builds expertise in reactive programming that is
  transferable to future projects.

::: info
Real-time push (e.g. server-sent events or WebSocket) is only used for the communications feature. The reactive stack is
not adopted for real-time reasons across the rest of the application.
:::

## Consequences

- Parallel module calls in the BFF are efficient without blocking threads.
- The reactive programming model (Project Reactor) requires developers to work with `Mono`/`Flux` types throughout,
  which has a steeper learning curve than the traditional Spring MVC model.
- Debugging and stack traces are more complex in reactive pipelines.
- jOOQ provides type-safe SQL generation while remaining compatible with the R2DBC async driver.
- Flyway uses JDBC at startup for migrations — this is the only blocking I/O in the application.
