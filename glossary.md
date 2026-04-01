---
outline: deep
---

# Glossary

This page defines the key terms and concepts used throughout the documentation.

## Architecture

### BFF — Backend For Frontend

An intermediate server layer that sits between the frontend and the backend services (Core, Operations, Registration). The BFF handles request orchestration, authentication checks, and aggregation of responses from multiple services. It is the only entry point for the frontend.

### Core

The backend service responsible for the fundamental entities of the application: organizations, users, projects, profiles, groups, participants, activities, and vehicles. It owns the relational source of truth.

### Operations

The backend service responsible for runtime tracking: movements, alerts, and communications. It is the service queried when recording or reading entries and exits at a project site.

### Registration

The backend service responsible for the registration process: registration periods, fields, and requests submitted by external users.

---

## Domain concepts

### Organization

The top-level entity. Represents a legal or operational structure (association, company, scouting body). All users and projects belong to an organization.

### Project

A group care facility for minors in the legal sense, defined by a period and one or more locations. It is the central entity around which all operational data is organized.

### User

A person who authenticates into the application. A user belongs to one organization and can be linked to zero or more projects via [profiles](#profile).

### Profile

The link between a [user](#user) and a [project](#project). It carries the user's role within the project, access dates, and invitation status. A user has no access to a project's content without an active profile.

::: info Profile ≠ User ≠ Participant
These are three distinct concepts. A **user** logs into the app. A **profile** defines their access to a specific project. A **participant** is a person tracked within a project — they may or may not be linked to a user.
:::

#### Support Profile

A special profile type (`SUPPORT`) created by an `ORGANIZATION_ADMIN` or `SUPER_ADMIN` to gain temporary `PROJECT_ADMIN` access to a project for audit purposes. Its access window is fixed at 1 hour and is enforced server-side.

### Participant

A person registered in a project whose presence, movements, and registrations are tracked. A participant is not necessarily an application user — the two can optionally be linked but remain distinct.

#### Registered participant

A participant pre-registered in a project (`type = REGISTERED`). They have a full project history.

#### Guest participant

A lightweight participant created inline at movement time (`type = GUEST`). They are not pre-registered. Their lifecycle is limited to one `IN` movement and one `OUT` movement.

### Group

An optional grouping mechanism for participants within a project. Groups are not a hierarchy — a participant belongs to a project first, and may optionally be assigned to one or more groups. Requires the `GROUP` option.

### Movement

A record of an entry (`IN`) or exit (`OUT`) at the project site at a given timestamp. A movement includes one or more participants and is immutable once created — editing a movement soft-deletes the original and creates a corrected replacement.

### Alert

A named incident or situation tracked within a project, with a status (`IN_PROGRESS`, `RESOLVED`, `CANCELED`) and an optional communication thread. Requires the `ALERT` option.

### Communication

A message posted in a movement thread or an alert thread. Requires the `COMMUNICATION` option.

---

## Statuses and lifecycle

### Soft-delete

A reversible deactivation. The record is preserved in the database but hidden from the UI and excluded from operations. The term used varies by entity type:

| Entity                              | Soft-delete state |
|-------------------------------------|-------------------|
| Organization, Project, Profile, User | `BLOCKED`         |
| Group, Participant, Activity, Vehicle | `DISABLED`        |
| Movement, Communication             | `HIDDEN`          |

### Purge

A permanent, irreversible deletion. Used for GDPR compliance (user and participant purge) and for automatic data retention enforcement (movements older than 1 year, etc.). See [Data Policy](/functional/features/data-policy) for the full retention rules.

### Presence status

The current presence state of a participant or vehicle, derived dynamically from their last movement. It is not stored as a field — it is computed from the movements recorded in Operations.

### Derived status

Any status field that is not stored explicitly but computed at read time from the object's own attributes or related data. Participant status, vehicle status, and profile usage status are all derived.

---

## Options

A feature-flag mechanism that enables or disables specific capabilities at the project level. Options are pre-allowed at the organization level and selectively activated per project. Disabling an option masks existing data — it does not delete it. See [Options](/functional/features/options) for the full list.

---

## Authentication

### Slug

The unique string identifier of an organization on the platform. Used at login to route the user to the correct identity provider. It is synchronized from the OIDC token.

### OIDC

OpenID Connect. The authentication protocol used by the application. Each organization configures its own identity provider. Roles can be automatically assigned from claims returned at login.

### Strict auth

An organization-level setting. When enabled, a user cannot access the application unless the OIDC provider returns a recognized role claim. Users with no claim are denied access entirely.

---

## Roles

### SUPER_ADMIN

A cross-organization role automatically granted to all users of the organization designated as "main". Can manage all organizations and act as `ORGANIZATION_ADMIN` on any organization.

### ORGANIZATION_ADMIN

An administrator scoped to a single organization. Can manage that organization's users and projects, but cannot see project content without creating a [support profile](#support-profile).

### ORGANIZATION_USER

A standard user scoped to a single organization. Can access projects they have an active profile for.

### PROJECT_ADMIN

Full access to a project. Scoped to a single project via a profile.

### PROJECT_MANAGER

Partial access to a project. Read/write on core entities, full access to operations, limited access to registration.

### PROJECT_USER

Read access to core entities, limited write access to operations. No access to registration.
