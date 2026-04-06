---
outline: deep
---

# Registration Request

A **Registration Request** is submitted by a logged-in user who wishes to join a project. The user can browse all
projects with an active registration period and submit requests for one or more.

## Registration form

When submitting a request, the user is presented with the custom form attached to the registration period and must
fill in all required fields before the request can be submitted. See
[Registration Form](/functional/registration/registration-form).

## Individual vs. group request

The type of request depends on what the project's registration period allows.

| Type           | Description                               |
|----------------|-------------------------------------------|
| **Individual** | A single person registers for the project |
| **Group**      | Several people register together          |

### Group request — two-step process

A group registration follows two steps:

1. **Initial submission** — the user provides the number of participants (non-nominative). The request is submitted with
   a headcount only.
2. **Specification** — once the admin moves the request to `NEED_SPECIFICATION`, the user provides:
    - The full identity of each participant
    - Optionally, more restrictive presence dates per participant *(used for day variable price calculation)*

## Lifecycle

### Individual registration

```
PENDING ──► ACCEPTED
        └─► REJECTED
        └─► CANCELLED
```

### Group registration

```
PENDING ──► NEED_SPECIFICATION ──► CONFIRMATION ──► ACCEPTED
        └─► REJECTED
        └─► CANCELLED
```

### Status descriptions

| Status               | Applies to | Description                                            |
|----------------------|------------|--------------------------------------------------------|
| `PENDING`            | All        | Submitted and awaiting review                          |
| `NEED_SPECIFICATION` | Group only | Approved pending participant details                   |
| `CONFIRMATION`       | Group only | Participant details submitted; awaiting final approval |
| `ACCEPTED`           | All        | Definitively approved                                  |
| `REJECTED`           | All        | Denied                                                 |
| `CANCELLED`          | All        | Cancelled                                              |

### Cancellation rules

| Actor             | Condition                                                                                                |
|-------------------|----------------------------------------------------------------------------------------------------------|
| **User**          | Can cancel while the request is still in a pending state — not after `ACCEPTED` or `REJECTED`            |
| **Project ADMIN** | Can cancel at any time, regardless of status *(including after `ACCEPTED`, to handle exceptional cases)* |

## Requests across multiple projects

A user can submit registration requests for multiple projects simultaneously. When they do, they are asked to **rank
their requests by order of preference**. This ranking is visible to project admins as informational context when
reviewing requests.

## Actions

### User

- Submit a new request
- Edit their request *(only while status is `PENDING`)*
- Provide participant details and presence dates *(when status is `NEED_SPECIFICATION`)*
- Rank their requests across multiple projects
- Cancel their request *(before `ACCEPTED`)*

### Project ADMIN

- Review incoming requests and see each requester's priority ranking
- Move a group request to `NEED_SPECIFICATION`
- Accept or reject a request
- Add a comment to a request
- Cancel a request at any time
