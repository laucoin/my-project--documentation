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

### Organization

| Field    | Min | Max   | Required | Source    | Notes                                                    |
|----------|-----|-------|----------|-----------|----------------------------------------------------------|
| `name`   | 1   | 100   | Yes      | [pending] |                                                          |
| `slug`   | 1   | 63    | Yes      | [pending] | Unique platform-wide; lowercase letters and hyphens only |

### Project

| Field  | Min | Max | Required | Source    | Notes |
|--------|-----|-----|----------|-----------|-------|
| `name` | 1   | 100 | Yes      | [pending] |       |

### Group

| Field  | Min | Max | Required | Source    | Notes                     |
|--------|-----|-----|----------|-----------|---------------------------|
| `name` | 1   | 100 | Yes      | [pending] | Unique within the project |

### Participant

| Field       | Min | Max | Required | Source    | Notes |
|-------------|-----|-----|----------|-----------|-------|
| `firstName` | 1   | 100 | Yes      | [pending] |       |
| `lastName`  | 1   | 100 | Yes      | [pending] |       |

### User

| Field       | Min | Max | Required | Source    | Notes                                 |
|-------------|-----|-----|----------|-----------|---------------------------------------|
| `firstName` | 0   | 100 | No       | [pending] | Nullable — populated from OIDC token  |
| `lastName`  | 0   | 100 | No       | [pending] | Nullable — populated from OIDC token  |
| `email`     | 0   | 320 | No       | **[DB]**  | RFC 5321 maximum — `VARCHAR(320)` in migration |

### Activity

| Field         | Min | Max  | Required | Source    | Notes              |
|---------------|-----|------|----------|-----------|--------------------|
| `name`        | 1   | 100  | Yes      | [pending] |                    |
| `description` | 0   | 1000 | No       | [pending] | Optional free text |

### Vehicle

| Field          | Min | Max | Required | Source    | Notes                              |
|----------------|-----|-----|----------|-----------|------------------------------------|
| `licensePlate` | 1   | 20  | Yes      | [pending] | Matches real plate formats         |
| `brand`        | 1   | 100 | Yes      | [pending] |                                    |
| `model`        | 1   | 100 | Yes      | [pending] |                                    |

### Alert

| Field      | Min | Max | Required | Source    | Notes                   |
|------------|-----|-----|----------|-----------|-------------------------|
| `title`    | 1   | 100 | Yes      | [pending] | Used as heading in UI   |
| `dateTime` | —   | —   | Yes      | —         | ISO 8601 datetime       |

### Communication / message

| Field     | Min | Max | Required | Source    | Notes                                  |
|-----------|-----|-----|----------|-----------|----------------------------------------|
| `message` | 0   | 500 | No       | [pending] | Attached to a movement or alert thread |

### Registration form fields

| Field         | Min | Max | Required | Source    | Notes                                  |
|---------------|-----|-----|----------|-----------|----------------------------------------|
| `label`       | 1   | 200 | Yes      | [pending] | Question shown to the user             |
| `placeholder` | 0   | 200 | No       | [pending] | Hint text inside the input             |
| `helper`      | 0   | 500 | No       | [pending] | Explanatory text shown below the field |

### Form field answers (registration requests)

| Field   | Min | Max  | Required | Source    | Notes                                        |
|---------|-----|------|----------|-----------|----------------------------------------------|
| `value` | 0   | 2000 | No       | [pending] | Applies to `TEXT` and `TEXTAREA` field types |

---

## Collection size limits

### Participants per movement

| Constraint                           | Limit | Notes                                                        |
|--------------------------------------|-------|--------------------------------------------------------------|
| Registered participants per movement | 200   | Combined total of individually added participants and groups |
| Guests per movement                  | 50    | Guests added inline at movement creation time                |
| Total people per movement            | 250   | Hard cap — sum of all registered participants and guests     |

::: warning
Attempting to create a movement that exceeds these limits returns `400 Bad Request` with error code `MOVEMENT_PARTICIPANT_LIMIT_EXCEEDED`.
:::

### Groups

| Constraint             | Limit | Notes                                                 |
|------------------------|-------|-------------------------------------------------------|
| Groups per project     | 500   |                                                       |
| Participants per group | none  | Bounded by the total participant count of the project |

### Profiles (invitations)

| Constraint                           | Limit | Notes                               |
|--------------------------------------|-------|-------------------------------------|
| User IDs per bulk invite (`userIds`) | 50    | `minItems=1`, `maxItems=50`         |

### Registration form

| Constraint                 | Limit | Notes                         |
|----------------------------|-------|-------------------------------|
| Fields per form            | 50    | Per registration period       |
| Options per `SELECT` field | 50    | Number of choices in a select |

### Pagination

See [Pagination](/technical/api-contract/pagination) for page size defaults and limits.

---

## Error response format

When a constraint is violated, the API responds with `400 Bad Request` using the standard [`ErrorDto`](/technical/guidelines/coding-style#error-response-dto) shape, with the `violations` array populated:

```json
{
  "statusCode": 400,
  "statusName": "Bad Request",
  "code": "VALIDATION_ERROR",
  "title": "Validation failed",
  "message": "One or more fields did not pass validation.",
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
The `violations` field is `null` (and omitted from JSON) for all non-validation error responses.
