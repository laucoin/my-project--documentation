---
outline: deep
---

# Statistics

Statistics are scoped to a single project and provide an overview of its activity. They are available to any user with
an active profile on the project.

Metrics that depend on an option are only visible when that option is enabled on the project.

## Calculation

All statistics are computed **on demand** at query time — there is no pre-calculation, cache, or background job
involved. Each request to the statistics endpoint triggers a fresh set of aggregation queries against the current
state of the database.

---

## Participants

| Metric                                  | Description                                                                                                                     |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Total participants                      | Total number of participants, filtered by type                                                                                  |
| Minor / major breakdown                 | Count and percentage of minors vs majors                                                                                        |
| Participants with custom presence dates | Percentage of participants whose attendance dates differ from their group or project defaults — split between minors and majors |
| Current occupancy                       | Number of participants currently on site vs total registered                                                                    |

### Calculation details

**Total participants** — the participant type scope is a parameter: the caller can request `REGISTERED` only,
`GUEST` only, or both. Soft-deleted participants are always excluded.

**Minor / major breakdown** — classification is evaluated against **today's date** at query time. A participant who
turns 18 during the project is counted as a major from that day onwards.

**Current occupancy** — "currently on site" means participants whose presence status is `IN` — i.e., whose last
recorded movement is an `IN`. Participants with status `NOT_ARRIVED_YET` or `LEFT` are not counted as on site.

---

## Movements & presence

| Metric                  | Description                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------|
| Total movements         | Total number of IN and OUT movements recorded                                                  |
| Average time outside    | Average duration between an OUT movement and its corresponding IN movement                     |
| OUT reason breakdown    | Count and percentage of OUT movements grouped by reason — see [Movement reasons](/functional/operations/movement#reasons-for-a-registered-participant-going-out) |
| Guest entries by reason | Count of guest IN movements grouped by reason — see [Guest IN reasons](/functional/operations/movement#reasons-for-a-guest-coming-in) |

### Calculation details

**Average time outside** — only complete OUT/IN pairs are included in the average. An OUT movement with no
subsequent IN (participant still outside at query time, or who left with reason `DEFINITIVE_DEPARTURE`) is
excluded from the calculation.

> `DEFINITIVE_DEPARTURE` sets the participant's departure date to the movement datetime. No IN will ever follow,
> so the pair will never be complete and is always excluded.

---

## Activities *(requires ACTIVITY option)*

| Metric                                   | Description                                                                                             |
|------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Total time in activity                   | Cumulative time all participants have spent outside for an activity                                     |
| Average time in activity per participant | Total activity time divided by the number of participants who took part in at least one activity outing |
| Most practised activities                | Activities ranked by number of associated outgoing movements                                            |
| Average participants per activity outing | Average number of participants per OUT movement linked to an activity                                   |

### Calculation details

**Total time in activity / Average time in activity** — duration is computed as the time between an OUT movement
linked to an activity and its corresponding IN movement. OUT movements with no subsequent IN are excluded from all
duration calculations — only complete OUT/IN pairs contribute.

---

## Vehicles *(requires VEHICLE option)*

| Metric             | Description                                                                        |
|--------------------|------------------------------------------------------------------------------------|
| Vehicle usage rate | Percentage of each vehicle's available time during which it was used in a movement |
| Most used vehicles | Vehicles ranked by number of movements they were attached to                       |
| Drivers            | List of participants who drove, with their number of trips                         |

### Vehicle usage rate — available time definition

The usage rate is computed as:

```
vehicle_usage_rate = (total duration of movements involving this vehicle)
                   / (vehicle's available time window)
                   × 100
```

**Available time window** is the period during which the vehicle is present at the project site with a status of
*inside* (i.e., not currently on an outing). It is determined as follows:

- If the vehicle has explicit `arrival` and `departure` dates set, the window runs from `arrival` to `departure`.
- If no availability dates are set, the window falls back to the full project duration (project `start` to project
  `end`).

A vehicle counts as "in use" for the duration of any OUT movement it is attached to — from the moment the movement
is recorded as OUT until the corresponding IN movement is recorded. Time outside that window (i.e., the vehicle is
inside the project) is counted as available but unused.

---

## Alerts *(requires ALERT option)*

| Metric                  | Description                                                                       |
|-------------------------|-----------------------------------------------------------------------------------|
| Total alerts            | Total number of alerts created                                                    |
| Status distribution     | Count and percentage of alerts by status (`IN_PROGRESS`, `RESOLVED`, `CANCELLED`) |
| Average resolution time | Average time between alert creation and transition to `RESOLVED`                  |

### Calculation details

**Average resolution time** — `CANCELLED` alerts are excluded. `IN_PROGRESS` alerts (not yet resolved) are
included in the average using the current query time as their provisional resolution time. This reflects the
ongoing cost of unresolved alerts rather than ignoring them.

---

## Registration *(requires REGISTRATION option)*

| Metric                        | Description                                                                               |
|-------------------------------|-------------------------------------------------------------------------------------------|
| Fill rate                     | Number of accepted registrations vs the defined maximum                                   |
| Acceptance rate               | Percentage of requests that were accepted vs rejected                                     |
| Average processing time       | Average time between submission (`PENDING`) and a final status (`ACCEPTED` or `REJECTED`) |
| Individual vs group breakdown | Count and percentage of individual vs group requests                                      |

### Calculation details

**Fill rate** — counted by **number of participants**, not by number of requests. For group requests, the
participant count declared at the `NEED_SPECIFICATION` step is used. The denominator is the maximum capacity
defined on the registration period.

**Acceptance rate** — the denominator includes only finalized requests: `ACCEPTED` and `REJECTED`. `PENDING`,
`NEED_SPECIFICATION`, `CONFIRMATION`, and `CANCELLED` requests are excluded.

**Average processing time** — `CANCELLED` requests are excluded. Only requests that reached a final status
(`ACCEPTED` or `REJECTED`) are included, measured from `PENDING` to that final status transition.
