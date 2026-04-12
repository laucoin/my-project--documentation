# 008 – Testing Strategy

|              |                                    |
|--------------|------------------------------------|
| **Status**   | Accepted                           |
| **Concerns** | Quality, Architecture, Development |

## Context

The application is a reactive modular monolith (Kotlin / Spring Boot WebFlux, R2DBC, jOOQ) with a Nuxt/Vue frontend
and Keycloak for authentication. It manages group care for minors, meaning it carries legal and operational
responsibilities: presence tracking, registration workflows, role-based access, and GDPR compliance.

Several areas of the domain contain non-trivial business logic — derived project states, dynamic minor/major
classification, attendance date resolution, pricing calculations, profile access rules — that need to be verified at
multiple levels. Additionally, the reactive stack and multi-schema architecture introduce specific constraints on how
tests interact with the database and how concurrency is handled.

This ADR captures the agreed testing strategy for the project.

## Decision

### Test levels

**Unit tests** target the `domain/service` layer exclusively. They cover logic that requires no infrastructure:
project status derivation from dates, minor/major classification based on birthdate vs. today, presence status
computation (`NOT_ARRIVED_YET`, `IN`, `OUT`, `LEFT`), attendance date fallback chain (participant → group → project),
and pricing calculations (fixed, variable, day variable — including the interval counting rule). These tests must
have no Spring context, no database, and no reactive subscription overhead. `StepVerifier` may be used if the service
returns a reactive type, but the logic under test must be pure.

**Integration tests** target each module slice (Core, Operation, Registration) independently, using a real PostgreSQL
instance via Testcontainers and Flyway migrations. They verify adapter correctness (jOOQ queries, soft-delete,
auditing fields), transactional invariants (last permanent admin constraint, registration period deletion constraint,
movement immutability), and the full port → service → adapter call chain. `StepVerifier` is mandatory for all
reactive assertions — `.block()` is forbidden in tests.

**End-to-end tests** target the BFF's REST API. They are kept small and cover only critical user flows: full
registration request lifecycle, movement recording and resulting presence status, role-based access control
(ADMIN vs COORDINATOR vs PARTICIPANT), and a smoke test of the OIDC authentication flow. These tests are slow and
must not duplicate coverage already provided by integration tests.

### Edge cases

The following cases must be explicitly covered by tests at the appropriate level.

**Project status boundaries:**
- Project with no dates → perpetual; no date-based restrictions apply
- `today == start_date` (boundary at 00:00) → in-progress
- `today == end_date` (boundary at 23:59) → still in-progress
- `today == end_date + 1` → ended; any side effects on movement creation must be documented and tested

**Participant:**
- Participant born today → classified as minor or major? The boundary must be specified and enforced consistently
- Participant who turns 18 during the project → re-evaluated dynamically on each request
- Participant with `LEFT` status (resolved departure date in the past) → `LEFT` overrides last movement direction
- Attendance dates outside project dates → rejected
- Attendance dates outside group dates but within project dates → accepted (group dates are a fallback, not a constraint)
- `GUEST` participant → blocked from any movement after their first `OUT`

**Profile that expires on D-Day:**
- `end_access = today` → access still active? Specify whether the 23:59 convention applies, and test the boundary
- Profile with status `INVITED` and expired date range → inaccessible
- Removing the last permanent `PROJECT_ADMIN` → rejected
- Self-edit attempt by the profile owner → rejected

**Registration:**
- Request submitted outside the registration window (before open or after close) → rejected
- Deleting a registration period with at least one non-canceled request → rejected
- `day_variable_price` configured but no date reference on the period or the project → clear error
- Pricing calculation: J1 to J3 = 2 intervals (not 3 calendar days)
- `max_registrations` reached → subsequent acceptance blocked
- Request type (individual / group) not matching the period's audience → rejected

**Soft-deleted references in movements:**
- Movement referencing a soft-deleted participant → displays preserved name with a visual label; not blocked
- Movement referencing a soft-deleted activity → same behavior

**GDPR purge:**
- User who is the sole permanent `PROJECT_ADMIN` → deletion blocked
- User linked to a participant active less than one year ago → account dissociated, participant record preserved
- Auto-purge trigger (1 year after last activity on an inactive project)

### Test data

A dedicated Flyway seed migration, activated only under the `test` Spring profile, provides a fixed baseline.
All records use deterministic UUIDs so test assertions can reference known identifiers.

The baseline must include:

- One organization
- Projects in each derived state: perpetual, upcoming, in-progress, ended — with representative option combinations
- Users with each global role (`USER`, `SUPER_ADMIN`)
- Profiles in each status (`INVITED`, `ACCEPTED`, `REJECTED`) and each project role, including one profile with
  `end_access = today` and one profile with `end_access` in the past
- Participants: minor, major, borderline (born today), `REGISTERED` and `GUEST` types
- Groups with and without date overrides
- Movements covering: `IN` / `OUT` directions, with and without activity, with and without vehicle, referencing
  soft-deleted participants and activities
- Registration periods in each window state (open, closed, upcoming), including one period at `max_registrations - 1`
- Registration requests in each lifecycle status (`PENDING`, `NEED_SPECIFICATION`, `CONFIRMATION`, `ACCEPTED`,
  `REJECTED`, `CANCELED`)

### Concurrent access

The documentation does not specify any locking mechanism. The following decisions apply.

**Optimistic locking on mutable entities.** A `@Version` field must be added to all entities that can be concurrently
edited: `Project`, `Profile`, `RegistrationPeriod`, `RegistrationRequest`. Spring Data R2DBC supports `@Version`
natively. A concurrent write conflict results in an `OptimisticLockingFailureException`, which the BFF maps to
HTTP 409. Integration tests must verify this behavior explicitly.

**Database-level protection for critical invariants.** Optimistic locking is not sufficient for invariants that
involve aggregate counts checked across concurrent transactions. Two specific cases require a transactional count
check with row-level locking (or equivalent):

- *Last permanent admin removal* — two concurrent requests could both pass the "is there another permanent admin?"
  check before either commits. The count and the update must occur within the same serializable transaction.
- *Registration quota* — two concurrent accept operations when one slot remains could both succeed. The quota check
  must be performed inside the same transaction as the status update, using `SELECT ... FOR UPDATE` on the period row
  or equivalent.

**Fault-tolerant movement recording.** As documented, a participant can receive an `IN` after an `IN` or an `OUT`
after an `OUT`. The application accepts the movement and derives the current presence status from the last recorded
entry. This behavior is intentional. Tests must verify it is preserved and not accidentally "fixed" by future
refactoring.

## Consequences

- Domain services are fully testable without Spring or database — fast feedback loop.
- Integration tests use Testcontainers; a local Docker daemon is required in the development environment.
- The `test` Spring profile activates the seed migration; it must never be activated in production.
- Entities gain a `@Version` field — all existing migration scripts for affected tables must add the column, and all
  BFF update endpoints must accept and return the version for client-side conflict detection.
- The last-permanent-admin and registration-quota invariants require explicit transactional logic in the service layer,
  not just application-level guards.

## Alternatives considered

**No seed migration — build fixtures programmatically in each test.** Rejected: leads to duplicated setup code,
slower tests, and inconsistent baseline state across test classes.

**Pessimistic locking everywhere.** Rejected: too costly on a reactive stack with R2DBC. Optimistic locking covers
the common case; database-level serialization is reserved for the two identified critical invariants.

**Skipping end-to-end tests entirely.** Rejected: role-based access control and the OIDC flow cannot be meaningfully
verified at the unit or integration level.
