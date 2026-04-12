---
outline: deep
---

# Filtering & Sorting

::: tip Required header
All requests must include `X-Organization-Slug`. See [General conventions](/technical/api-contract/#required-headers).
:::

## General conventions

### Filtering

Filters are passed as query parameters using the pattern `attribute=value`. Multiple filters combine with
`AND` semantics. Array-valued filters accept multiple values and combine with `OR` within that dimension:

```http
GET /api/v2/projects/{projectId}/participants?status=IN&status=OUT
GET /api/v2/projects/{projectId}/activities?statuses=AVAILABLE&statuses=UNAVAILABLE
```

### Full-text search

Use the `q` parameter for free-text search across the relevant text fields of a resource:

```http
GET /api/v2/projects/{projectId}/participants?q=alice
```

### Sorting

Sort is expressed as a combined `sort` parameter using the format `field,direction`:

| Format           | Description                         |
|------------------|-------------------------------------|
| `sort=name,asc`  | Sort by `name`, ascending (default) |
| `sort=name,desc` | Sort by `name`, descending          |

Multiple sort criteria use repeated `sort` parameters:

```http
GET /api/v2/projects/{projectId}/participants?sort=lastName,asc&sort=firstName,asc
```

When no `sort` parameter is supplied, the **default sort
** documented per endpoint applies. All sort direction is expressed inline as `sort=field,asc` or `sort=field,desc`.

---

## Per-resource filter and sort reference

### Projects — `GET /api/v2/projects`

| Parameter  | Type                                                           | Description                                                                   |
|------------|----------------------------------------------------------------|-------------------------------------------------------------------------------|
| `q`        | string                                                         | Full-text search on `name`                                                    |
| `statuses` | array of `AVAILABLE` \| `UNAVAILABLE` \| `DISABLED`            | Filter by project status — multiple values allowed                            |
| `options`  | array of `VEHICLE` \| `ACTIVITY` \| `COMMUNICATION` \| `ALERT` | Filter projects that have all listed options enabled                          |
| `profile`  | boolean (default `true`)                                       | When `true`, restricts to projects where the authenticated user has a profile |
| `dateTime` | ISO 8601 datetime                                              | Restrict to projects active at this point in time                             |

Sortable fields: `name`, `beginDate`, `endDate`, `createdAt`. Default: `name,asc`.

---

### Participants — `GET /api/v2/projects/{projectId}/participants`

| Parameter  | Type                                    | Description                                            |
|------------|-----------------------------------------|--------------------------------------------------------|
| `q`        | string                                  | Full-text search on `firstName`, `lastName`            |
| `statuses` | array of `OUT` \| `IN` \| `UNAVAILABLE` | Presence status — multiple values allowed              |
| `types`    | array of `REGISTERED` \| `GUEST`        | Participant type filter                                |
| `groupId`  | UUID                                    | Restrict to participants belonging to a specific group |
| `dateTime` | ISO 8601 datetime                       | Resolve attendance status at this point in time        |

Sortable fields: `firstName`, `lastName`, `birthday`, `createdAt`. Default: `lastName,asc`.

::: info Status values
`PURGED` and
`DISABLED` are internal states — they must not be exposed as filterable values to regular consumers. Purged and soft-deleted participants are excluded from results by default.
:::

---

### Groups — `GET /api/v2/projects/{projectId}/groups`

| Parameter  | Type                                                | Description                                |
|------------|-----------------------------------------------------|--------------------------------------------|
| `q`        | string                                              | Full-text search on `name`                 |
| `statuses` | array of `AVAILABLE` \| `UNAVAILABLE` \| `DISABLED` | Filter by availability status              |
| `dateTime` | ISO 8601 datetime                                   | Resolve availability at this point in time |

Sortable fields: `name`, `createdAt`. Default: `name,asc`.

---

### Movements — `GET /api/v2/projects/{projectId}/movements`

| Parameter       | Type                            | Description                                   |
|-----------------|---------------------------------|-----------------------------------------------|
| `statuses`      | array of `ACTIVE` \| `DISABLED` | Movement active/soft-deleted filter           |
| `types`         | array of `IN` \| `OUT`          | Movement direction filter                     |
| `start`         | ISO 8601 datetime               | Movements recorded on or after this datetime  |
| `end`           | ISO 8601 datetime               | Movements recorded on or before this datetime |
| `activityId`    | UUID                            | Movements linked to a specific activity       |
| `participantId` | UUID                            | Movements that include a specific participant |

Sortable fields: `dateTime`, `createdAt`. Default: `dateTime,desc` (most recent first).

---

### Activities — `GET /api/v2/projects/{projectId}/activities`

| Parameter  | Type                                                | Description                                      |
|------------|-----------------------------------------------------|--------------------------------------------------|
| `q`        | string                                              | Full-text search on `name`, `description`        |
| `statuses` | array of `AVAILABLE` \| `UNAVAILABLE` \| `DISABLED` | Filter by availability status                    |
| `dateTime` | ISO 8601 datetime                                   | Restrict to activities available at this instant |

Sortable fields: `name`, `duration`, `createdAt`. Default: `name,asc`.

---

### Vehicles — `GET /api/v2/projects/{projectId}/vehicles`

| Parameter  | Type                                                  | Description                                          |
|------------|-------------------------------------------------------|------------------------------------------------------|
| `q`        | string                                                | Full-text search on `brand`, `model`, `licensePlate` |
| `statuses` | array of `IN` \| `OUT` \| `UNAVAILABLE` \| `DISABLED` | Vehicle presence/availability status                 |
| `dateTime` | ISO 8601 datetime                                     | Restrict to vehicles available at this instant       |

Sortable fields: `licensePlate`, `brand`, `model`, `createdAt`. Default: `brand,asc`.

---

### Alerts — `GET /api/v2/projects/{projectId}/alerts`

| Parameter  | Type                                                             | Description                               |
|------------|------------------------------------------------------------------|-------------------------------------------|
| `q`        | string                                                           | Full-text search on `title`               |
| `statuses` | array of `IN_PROGRESS` \| `RESOLVED` \| `CANCELED` \| `DISABLED` | Filter by alert status                    |
| `start`    | ISO 8601 datetime                                                | Alerts created on or after this datetime  |
| `end`      | ISO 8601 datetime                                                | Alerts created on or before this datetime |

Sortable fields: `dateTime`, `title`, `createdAt`. Default: `dateTime,desc`.

---

### Project profiles — `GET /api/v2/projects/{projectId}/profiles`

| Parameter            | Type                                                | Description                                               |
|----------------------|-----------------------------------------------------|-----------------------------------------------------------|
| `q`                  | string                                              | Full-text search on user `firstName`, `lastName`, `email` |
| `statuses`           | array of `AVAILABLE` \| `UNAVAILABLE` \| `DISABLED` | Filter by profile availability status                     |
| `invitationStatuses` | array of `INVITED` \| `ACCEPTED` \| `REJECTED`      | Filter by invitation acceptance state                     |
| `roles`              | array of string                                     | Filter by role name                                       |
| `dateTime`           | ISO 8601 datetime                                   | Resolve access availability at this instant               |

Sortable fields: `userFirstName`, `userLastName`, `userEmail`, `projectName`, `role`, `createdAt`. Default:
`userLastName,asc`.

---

### Users — `GET /api/v2/users`

| Parameter  | Type                           | Description                                          |
|------------|--------------------------------|------------------------------------------------------|
| `q`        | string                         | Full-text search on `firstName`, `lastName`, `email` |
| `statuses` | array of `ACTIVE` \| `BLOCKED` | Filter by user status (`PURGED` excluded)            |
| `roles`    | array of string                | Filter by global role name                           |

Sortable fields: `firstName`, `lastName`, `email`, `createdAt`. Default: `lastName,asc`.

---

## Movements sub-resource filters

Several resources expose movement history as a sub-collection. All share the same filter shape:

**`GET /api/v2/projects/{projectId}/participants/{id}/movements`**
**`GET /api/v2/projects/{projectId}/activities/{id}/movements`**
**`GET /api/v2/projects/{projectId}/vehicles/{id}/movements`**

| Parameter  | Type                            | Description                                   |
|------------|---------------------------------|-----------------------------------------------|
| `statuses` | array of `ACTIVE` \| `DISABLED` | Include soft-deleted movements or not         |
| `types`    | array of `IN` \| `OUT`          | Direction filter                              |
| `start`    | ISO 8601 datetime               | Movements recorded on or after this datetime  |
| `end`      | ISO 8601 datetime               | Movements recorded on or before this datetime |

Sortable fields: `dateTime`, `createdAt`. Default: `dateTime,desc`.

---

## Notes

**Soft-deleted records** are excluded from all collection responses by default. There is no
`includeDeleted` parameter for regular consumers.

**Boolean filters** accept `true` or `false` (case-insensitive).

**Enum filters** are case-insensitive at the API boundary — normalised to uppercase internally.

**Date/datetime filters** must conform to ISO 8601. A bare date (
`2026-04-08`) is interpreted as the start of that day in UTC when used with `start`/
`from`, and as the end of that day when used with `end`/`to`.

**`dateTime` snapshot filter** — several endpoints accept a
`dateTime` parameter that resolves whether a resource is "available" or "active" at that instant, rather than filtering by creation date. This replaces the need for separate
`available` boolean filters.
