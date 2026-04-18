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

### Preparation

The backend service responsible for project preparation: location, typical day, planning, pedagogy, menu, and budget. It is used before the project starts to organize all planning elements.

### Registration

The backend service responsible for the registration process: forms and registration requests submitted by external candidates.

---

## Domain concepts

### Organization

The top-level entity. Represents a legal or operational structure (association, company, scouting body). All users and projects belong to an organization.

### Project

A group care facility for minors in the legal sense. It is the central entity around which all operational data is organized.

### User

A person who authenticates into the application. A user belongs to one organization and can be linked to zero or more projects via [profiles](#profile).

### Profile

The link between a [user](#user) and a [project](#project). It carries the user's role within the project, access dates, and invitation status. A user has no access to a project's content without an active profile.

::: info Profile ≠ User ≠ Participant
These are three distinct concepts. A **user** logs into the app. A **profile
** defines their access to a specific project. A **participant
** is a person tracked within a project — they may or may not be linked to a user.
:::

#### Support Profile

A special profile type (`SUPPORT`) created by an `ORGANIZATION_ADMIN` or `SUPER_ADMIN` to gain temporary
`PROJECT_ADMIN` access to a project for audit purposes. Its access window is fixed at 1 hour and is enforced server-side.

### Participant

A person registered in a project whose presence, movements, and registrations are tracked. A participant is not necessarily an application user — the two can optionally be linked but remain distinct.

#### Registered participant

A participant pre-registered in a project (`type = REGISTERED`). They have a full project history.

#### Guest participant

A lightweight participant created inline at movement time (
`type = GUEST`). They are not pre-registered. Their lifecycle is limited to one `IN` movement and one `OUT` movement.

### Group

An optional grouping mechanism for participants within a project. Groups are not a hierarchy — a participant belongs to a project first, and may optionally be assigned to one or more groups. Requires the
`GROUP` option.

### Movement

A record of an entry (`IN`) or exit (
`OUT`) at the project site at a given timestamp. A movement includes one or more participants and is **immutable** once created: there is no edit feature. Movement is the only immutable entity in Operations; to correct one, soft-delete it (`hide-movement`) and record a new one.

### Alert

A named incident or situation tracked within a project, with a status (`IN_PROGRESS`, `RESOLVED`, `CANCELED`) and an optional communication thread. Alerts can be soft-deleted to the `HIDDEN` state. Requires the `ALERT` option.

### Communication

A timestamped message attached to an alert or a movement **that includes an activity**. Not all movements have a communication thread — only those linked to an activity. Communications are always available; the parent's own option (`ALERT` for alert threads, `MOVEMENT` for movement threads) gates their use.

### Comment

A message posted by a user on a specific entity. Two distinct technical entities share this name depending on their module:

- **Comment on Participant
  ** (Operations module): annotation and follow-up thread on a participant. Supports [tags](#tag).
- **Comment on Preparation element
  ** (Preparation module): annotation on a preparation sub-element (typical day, planning, pedagogy, menu, budget). Supports [tags](#tag).

Both are distinct from [Communication](#communication) in scope and implementation. Requires the `COMMENT` option.

### Tag

A project-scoped label that can be attached to a [comment](#comment) to categorize it. Tags are defined per project. The count of comments sharing a given tag is tracked and can be incremented without writing a full comment. Two distinct Tag catalogs exist, mirroring the Comment split:

- **Tag (Operations)** — labels for participant comments. See [Tag (Operations)](/functional/business-objects/operations/tag).
- **Tag (Preparation)** — labels for preparation comments. See [Tag (Preparation)](/functional/business-objects/preparation/tag).

The two catalogs are independent: a tag created in one module does not exist in the other. Management is restricted to `PROJECT_ADMIN` and `PROJECT_MANAGER` via [Manage tags](/functional/features/manage-tags).

### Preparation

The planning container attached to a project or a group (not both simultaneously). It groups all organizational elements to be defined before the project starts: location, typical day, planning, pedagogy, menu, and budget. Requires the
`PREPARATION` option.

### Location

A physical place where the project takes place, defined within a preparation. A preparation can have multiple locations, but only one can be active at a time.

### Typical day

A reusable day template defining the standard time slots of a project day. It serves as the base pattern for the planning. One per preparation.

### Planning

The day-by-day schedule of the project, built on top of the typical day. Individual days can override the typical day pattern. Can be synchronized with Google Calendar or Outlook. Planning slots can be linked to pedagogical objectives. One per preparation.

### Pedagogy

The document describing and justifying the educational approach of the project. Structured as a set of priorities, each containing one or more objectives. Objectives can be linked to planning slots. One per preparation.

### Menu

The list of meals (breakfast, lunch, snack, dinner) for every day of the project. One per preparation.

### Budget

The financial frame of the project: price per participant and a set of expense categories with allocated amounts. One per preparation.

### Form

A registration form opened on a project, through which external candidates can submit a registration request. A form is typed (
`INDIVIDUAL` or `GROUP`), has an opening date range, and can be scoped to a specific period of the project. Requires the
`REGISTRATION` option.

### Registration

A submission made by a candidate through a form. It holds the candidate's answers and tracks the validation lifecycle (
`PENDING`, `VALIDATED`,
`REJECTED`). Validating a registration automatically creates the corresponding participant(s) and, for group registrations, a dedicated group. Requires the
`REGISTRATION` option.

### Completion Notice

A formal document produced at the end of a project to summarize its outcome. A project can have at most one notice of each type:
`INTERNAL` (for the organization's internal stakeholders) and
`EXTERNAL` (for external recipients such as parents or partners). The two are independent. Requires the
`COMPLETION_NOTICE` option.

---

## Statuses and lifecycle

### Soft-delete

A reversible deactivation. The record is preserved in the database but hidden from the UI and excluded from operations. The term used varies by entity type:

| Entity                                    | Soft-delete state |
|-------------------------------------------|-------------------|
| Organization, Project, Profile, User      | `BLOCKED`         |
| Group, Participant, Activity, Vehicle     | `DISABLED`        |
| Movement, Alert, Communication, Comment   | `HIDDEN`          |
| Registration                              | `REJECTED`        |

### Purge

A permanent, irreversible deletion. Used for GDPR compliance (user and participant purge) and for automatic data retention enforcement (movements older than 1 year, etc.). See [Data Policy](/functional/features/data-policy) for the full retention rules.

### Presence status

The current presence state of a participant or vehicle, derived dynamically from their last movement. It is not stored as a field — it is computed from the movements recorded in Operations.

### Derived status

Any status field that is not stored explicitly but computed at read time from the object's own attributes or related data. Participant status, vehicle status, and profile usage status are all derived.

---

## Options

A feature-flag mechanism that enables or disables specific capabilities at the project level. Options are pre-allowed at the organization level and selectively activated per project. Disabling an option masks existing data — it does not delete it. See [Options](/functional/features/options) for the full list.

The current option set is: `ACTIVITY`, `ALERT`, `COMMENT`, `COMPLETION_NOTICE`, `GROUP`, `MOVEMENT`, `PREPARATION`, `REGISTRATION`, `VEHICLE`. All options are independent.

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

A cross-organization role automatically granted to all users of the organization designated as "main". Can manage all organizations and act as
`ORGANIZATION_ADMIN` on any organization.

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
