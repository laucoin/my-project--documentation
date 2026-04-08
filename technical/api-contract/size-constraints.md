---
outline: deep
---

# Size Constraints

This page documents the maximum field lengths and collection size limits enforced by the API. Requests that exceed these constraints are rejected with `400 Bad Request` and a structured error body that identifies the offending field.

::: tip Source
Constraints marked **[DB]** are enforced at the database column level (e.g. `VARCHAR(n)` in the migration). All other constraints are enforced at the application validation layer (`@field:Size`, `@field:NotBlank`, etc.). Any constraint not yet present in a migration or validation annotation is marked **[pending]** and must be implemented before release.
:::

---

## Text field limits

### Organisation

| Field    | Min | Max   | Required | Source  | Notes                                               |
|----------|-----|-------|----------|---------|-----------------------------------------------------|
| `name`   | 1   | 100   | Yes      | [pending] |                                                   |
| `slug`   | 1   | 63    | Yes      | [pending] | Unique platform-wide; lowercase letters and hyphens only |

### Project

| Field    | Min | Max | Required | Source    | Notes |
|----------|-----|-----|----------|-----------|-------|
| `name`   | 1   | 100 | Yes      | [pending] |       |

::: warning Old contract divergence
The v2 `ProjectWriterDto` declared `maxLength=150` for `name`. This limit is reduced to 100 to align with the rest of the domain. If existing data contains names between 101 and 150 characters it must be migrated before enforcement.
:::

### Group

| Field    | Min | Max | Required | Source    | Notes                     |
|----------|-----|-----|----------|-----------|---------------------------|
| `name`   | 1   | 100 | Yes      | [pending] | Unique within the project |

::: warning Old contract divergence
The v2 `GroupWriterDto` declared `maxLength=150`. Reduced to 100.
:::

### Participant

| Field       | Min | Max | Required | Source    | Notes |
|-------------|-----|-----|----------|-----------|-------|
| `firstName` | 1   | 100 | Yes      | [pending] |       |
| `lastName`  | 1   | 100 | Yes      | [pending] |       |

::: warning Old contract gap
The v2 `ParticipantWriterDto` declared `minLength=1` but **no `maxLength`** on `firstName` and `lastName`. This means the old API accepted arbitrarily long names. A `maxLength=100` constraint must be added.
:::

### User

| Field       | Min | Max | Required | Source   | Notes                               |
|-------------|-----|-----|----------|----------|-------------------------------------|
| `firstName` | 0   | 100 | No       | [pending] | Nullable — populated from OIDC token |
| `lastName`  | 0   | 100 | No       | [pending] | Nullable — populated from OIDC token |
| `email`     | 0   | 320 | No       | **[DB]** | RFC 5321 maximum — `VARCHAR(320)` in migration |

### Activity

| Field         | Min | Max  | Required | Source    | Notes              |
|---------------|-----|------|----------|-----------|---------------------|
| `name`        | 1   | 100  | Yes      | [pending] |                    |
| `description` | 0   | 1000 | No       | [pending] | Optional free text |

::: warning Old contract divergence
The v2 `ActivityWriterDto` declared `maxLength=150` for `name` and `maxLength=2000` for `description`. Both are reduced.
:::

### Vehicle

| Field          | Min | Max | Required | Source    | Notes |
|----------------|-----|-----|----------|-----------|-------|
| `licensePlate` | 1   | 20  | Yes      | [pending] | The v2 value of 20 is retained — matches real plate formats |
| `brand`        | 1   | 100 | Yes      | [pending] |       |
| `model`        | 1   | 100 | Yes      | [pending] |       |

::: warning Old contract divergence
The v2 `VehicleWriterDto` declared `maxLength=150` for `brand` and `model`. Both are reduced to 100.
:::

### Alert

| Field     | Min | Max | Required | Source    | Notes                                             |
|-----------|-----|-----|----------|-----------|---------------------------------------------------|
| `title`   | 1   | 100 | Yes      | [pending] | Used as heading in the UI                         |
| `dateTime`| —   | —   | Yes      | —         | ISO 8601 datetime, no length constraint           |

::: warning Old contract divergence
The v2 `AlertWriterDto` declared `maxLength=50` for `title`. This is extremely restrictive for a heading field. Raised to 100. Review with the product team if titles can exceed 50 characters in practice.
:::

### Communication / message

| Field     | Min | Max  | Required | Source    | Notes                                           |
|-----------|-----|------|----------|-----------|-------------------------------------------------|
| `message` | 0   | 500  | No       | [pending] | Attached to a movement or alert thread          |

::: warning Old contract divergence
The v2 `CommunicationWriterDto` declared `maxLength=250` for `message`. Raised to 500 to allow more expressive messages. The v2 `AlertCreationWriterDto` also had `maxLength=250` for the initial creation message — same limit applies.
:::

### Registration form fields

| Field         | Min | Max  | Required | Source    | Notes                                   |
|---------------|-----|------|----------|-----------|-----------------------------------------|
| `label`       | 1   | 200  | Yes      | [pending] | Question shown to the user              |
| `placeholder` | 0   | 200  | No       | [pending] | Hint text inside the input              |
| `helper`      | 0   | 500  | No       | [pending] | Explanatory text shown below the field  |

### Form field answers (registration requests)

| Field   | Min | Max  | Required | Source    | Notes                                         |
|---------|-----|------|----------|-----------|-----------------------------------------------|
| `value` | 0   | 2000 | No       | [pending] | Applies to `TEXT` and `TEXTAREA` field types  |

---

## Collection size limits

### Participants per movement

| Constraint                           | Limit | Notes                                                       |
|--------------------------------------|-------|-------------------------------------------------------------|
| Registered participants per movement | 200   | Combined total of individually added participants and groups |
| Guests per movement                  | 50    | Guests added inline at movement creation time               |
| Total people per movement            | 250   | Hard cap — sum of all registered participants and guests    |

::: warning
Attempting to create a movement that exceeds these limits returns `400 Bad Request` with error code `MOVEMENT_PARTICIPANT_LIMIT_EXCEEDED`.
:::

::: warning Old contract gap
The v2 `ParticipantMovementWriterDto` declared `participantIds` as an array with **no `maxItems`** constraint. This was exploitable. The limits above must be enforced with explicit `@field:Size(max=200)` annotations.
:::

### Groups

| Constraint               | Limit | Notes                                                           |
|--------------------------|-------|-----------------------------------------------------------------|
| Groups per project       | 500   |                                                                 |
| Participants per group   | none  | Bounded by the total participant count of the project           |

### Profiles (invitations)

| Constraint                          | Limit | Notes                                                     |
|-------------------------------------|-------|-----------------------------------------------------------|
| User IDs per bulk invite (`userIds`)| 50    | `ProjectProfilesWriterDto.userIds` — v2 had `minItems=1` but no `maxItems` |

::: warning Old contract gap
The v2 `ProjectProfilesWriterDto.userIds` had `minItems=1` but no `maxItems`. A bulk invite with thousands of UUIDs was accepted. Cap at 50.
:::

### Registration form

| Constraint                  | Limit | Notes                          |
|-----------------------------|-------|--------------------------------|
| Fields per form             | 50    | Per registration period        |
| Options per `SELECT` field  | 50    | Number of choices in a select  |

### Pagination

| Constraint              | Limit | Notes                                          |
|-------------------------|-------|------------------------------------------------|
| Default page size       | 30    | Applied when `size` is absent                  |
| Maximum page size       | 100   | Requests above this are rejected with `400`    |

---

## Error response format

When a constraint is violated, the API responds with `400 Bad Request`:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "violations": [
    {
      "field": "firstName",
      "message": "must not exceed 100 characters",
      "rejectedValue": "Aaaaaaa... (102 chars)"
    }
  ]
}
```

Multiple violations can be returned in a single response — the client must display all of them.

::: warning Old contract gap
The v2 OpenAPI specifications **define no error response schema** for `400` or `404` responses. Every error-returning endpoint must explicitly declare its error response body in the new contract, referencing a shared `ErrorResponse` component schema.
:::
