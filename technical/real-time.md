---
outline: deep
---

# Real-Time Push

The application uses **Server-Sent Events (SSE)** to push domain events from the BFF to connected clients without
polling. This page documents the event wire format, the reconnection contract, and the client-side state management
strategy. See [ADR 007](/technical/adr/007-sse-vs-websocket) for the rationale behind choosing SSE over WebSocket.

---

## Event Format

### Wire format

Each SSE frame follows the standard text/event-stream protocol:

```
id: 2026-04-07T10:23:45.123Z
event: MOVEMENT_CREATED
data: {"type":"MOVEMENT_CREATED","projectId":"a1b2…","occurredAt":"2026-04-07T10:23:45.123Z","payload":{…}}
retry: 5000

```

| Field   | Required | Description                                                                                         |
|---------|----------|-----------------------------------------------------------------------------------------------------|
| `id`    | Yes      | ISO-8601 timestamp in UTC (millisecond precision) — acts as the reconnection cursor                 |
| `event` | Yes      | Event type discriminant — matches the `type` field inside `data` (see catalogue below)             |
| `data`  | Yes      | JSON-encoded event envelope (single line)                                                           |
| `retry` | Yes      | Reconnection delay in milliseconds sent once when the stream opens — set to `5000`                 |

::: info Keepalive comments
The server emits a `: keepalive` comment line every **25 seconds** on idle streams to prevent proxy and load-balancer
timeout. Comment lines are silently discarded by the `EventSource` API and do not trigger a `message` event.
:::

---

### Envelope

Every `data` payload conforms to the same top-level envelope:

```ts
interface SseEnvelope<T> {
  type:        EventType       // discriminant — matches the SSE `event` field
  projectId:   string          // UUID of the project that originated the event
  occurredAt:  string          // ISO-8601 UTC timestamp (same value as the SSE `id`)
  payload:     T               // event-specific payload (see catalogue)
}
```

Using a typed envelope instead of raw payloads makes client-side discriminated unions straightforward:

```ts
type ProjectEvent =
  | SseEnvelope<MovementCreatedPayload>    // type: "MOVEMENT_CREATED"
  | SseEnvelope<MovementDeletedPayload>    // type: "MOVEMENT_DELETED"
  | SseEnvelope<AlertCreatedPayload>       // type: "ALERT_CREATED"
  | SseEnvelope<AlertStatusChangedPayload> // type: "ALERT_STATUS_CHANGED"
  | SseEnvelope<MessageAddedPayload>       // type: "ALERT_MESSAGE_ADDED" | "MOVEMENT_MESSAGE_ADDED"
```

---

### Event catalogue

#### `MOVEMENT_CREATED`

Emitted when a movement is successfully recorded.

```ts
interface MovementCreatedPayload {
  movementId: string       // UUID
  type:       'IN' | 'OUT'
  datetime:   string       // ISO-8601 — when the movement occurred
  createdBy:  string       // UUID of the user who recorded it
}
```

#### `MOVEMENT_DELETED`

Emitted when a movement is soft-deleted.

```ts
interface MovementDeletedPayload {
  movementId: string
  deletedBy:  string       // UUID
}
```

#### `ALERT_CREATED`

Emitted when a new alert is opened.

```ts
interface AlertCreatedPayload {
  alertId:   string        // UUID
  title:     string
  createdBy: string        // UUID
}
```

#### `ALERT_STATUS_CHANGED`

Emitted when an alert transitions to `RESOLVED` or `CANCELLED`.

```ts
interface AlertStatusChangedPayload {
  alertId:   string
  status:    'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'
  updatedBy: string        // UUID
}
```

#### `ALERT_MESSAGE_ADDED`

Emitted when a message is appended to an alert's communication thread.

```ts
interface MessageAddedPayload {
  threadId:  string        // UUID — alert ID
  messageId: string        // UUID
  sender:    string        // display name or activity name
}
```

#### `MOVEMENT_MESSAGE_ADDED`

Emitted when a message is appended to a movement's classic communication thread.

```ts
interface MessageAddedPayload {
  threadId:  string        // UUID — movement ID
  messageId: string        // UUID
  sender:    string
}
```

---

### Backend — Spring WebFlux

The BFF exposes one SSE endpoint per project. The endpoint is protected by the standard session auth filter — an
unauthenticated request returns `401` before reaching the handler.

```kotlin
// BFF router
"/api/v1/projects/{projectId}/events".nest {
    GET("", sseHandler::stream)
}
```

```kotlin
// BFF handler
@Component
class SseHandler(private val eventBus: ProjectEventBus) {

    fun stream(request: ServerRequest): Mono<ServerResponse> {
        val projectId = UUID.fromString(request.pathVariable("projectId"))
        val lastEventId = request.headers().firstHeader("Last-Event-ID")

        val events: Flux<ServerSentEvent<SseEnvelope<*>>> = eventBus
            .streamFor(projectId, since = lastEventId)
            .map { envelope ->
                ServerSentEvent.builder(envelope)
                    .id(envelope.occurredAt)
                    .event(envelope.type.name)
                    .build()
            }

        return ServerResponse.ok()
            .contentType(MediaType.TEXT_EVENT_STREAM)
            .body(events, object : ParameterizedTypeReference<ServerSentEvent<SseEnvelope<*>>>() {})
    }
}
```

`ProjectEventBus` is a domain-level interface backed by a `Sinks.Many<SseEnvelope<*>>` hot publisher with a bounded
replay buffer (see reconnection section below).

---

## Reconnection Management

### Browser behaviour

The `EventSource` API reconnects automatically after a connection loss. Before reconnecting, the browser:

1. Waits for the duration specified in the last received `retry` field (default: browser-defined, overridden to `5000 ms`
   by the server on stream open).
2. Sends a `Last-Event-ID` request header containing the `id` of the last successfully received event.

The server uses this header as a **cursor** to replay any events that were emitted while the client was disconnected.

```
GET /api/v1/projects/{projectId}/events
Last-Event-ID: 2026-04-07T10:23:40.000Z
```

### Replay buffer

The BFF maintains a bounded in-memory replay buffer per project using a `Sinks.Many` replay sink:

```kotlin
val sink: Sinks.Many<SseEnvelope<*>> =
    Sinks.many().replay().limit(Duration.ofMinutes(2))
```

When `Last-Event-ID` is present, `ProjectEventBus.streamFor()` filters the buffer to events strictly after the cursor
before switching to the live stream:

```kotlin
fun streamFor(projectId: UUID, since: String?): Flux<SseEnvelope<*>> {
    val cursor = since?.let { Instant.parse(it) }
    return sink.asFlux()
        .filter { it.projectId == projectId.toString() }
        .let { flux ->
            if (cursor != null)
                flux.filter { Instant.parse(it.occurredAt).isAfter(cursor) }
            else
                flux
        }
}
```

::: warning Scaling constraint
The replay buffer is in-memory and local to a single BFF instance. In a multi-instance deployment, a shared event bus
(e.g. Redis Pub/Sub or a Postgres `LISTEN`/`NOTIFY` channel) must replace the in-memory sink.
See [ADR 007 – Consequences](/technical/adr/007-sse-vs-websocket#consequences) for details.
:::

### Connection states

| `EventSource.readyState` | Value | Meaning                              |
|--------------------------|-------|--------------------------------------|
| `CONNECTING`             | `0`   | Initial connection or reconnecting   |
| `OPEN`                   | `1`   | Stream is active and receiving events|
| `CLOSED`                 | `2`   | Connection permanently closed (`EventSource.close()` was called) |

The browser never enters `CLOSED` automatically — it always retries. Call `close()` explicitly when the component
unmounts or the user navigates away from the project.

---

## Client State Management

### Architecture

Real-time state is global within a project session and must be accessible across multiple pages and layers. It is
therefore managed in a **Pinia store** in the APP layer (see [Frontend Conventions](/technical/guidelines/frontend)).

```
app/
├── stores/
│   └── useProjectEventStore.ts     # Pinia store — owns real-time state
└── composables/
    └── useProjectEventStream.ts    # Manages EventSource lifecycle
```

The composable owns the `EventSource` instance and dispatches parsed events to the store. Components never interact
with `EventSource` directly.

---

### Pinia store

```ts
// app/stores/useProjectEventStore.ts
import { defineStore } from 'pinia'

export type StreamStatus = 'connecting' | 'open' | 'closed' | 'error'

export const useProjectEventStore = defineStore('projectEvent', () => {
  const streamStatus = ref<StreamStatus>('closed')
  const lastEventId  = ref<string | null>(null)
  const events       = ref<ProjectEvent[]>([])

  function setStatus(status: StreamStatus) {
    streamStatus.value = status
  }

  function push(event: ProjectEvent) {
    lastEventId.value = event.occurredAt
    events.value.unshift(event)   // most recent first
    if (events.value.length > 200) events.value.splice(200)
  }

  function reset() {
    streamStatus.value = 'closed'
    lastEventId.value  = null
    events.value       = []
  }

  return { streamStatus, lastEventId, events, setStatus, push, reset }
})
```

---

### Composable

```ts
// app/composables/useProjectEventStream.ts
export function useProjectEventStream(projectId: Ref<string>) {
  const store = useProjectEventStore()
  let source: EventSource | null = null

  function open() {
    if (source) source.close()

    const url = `/api/v1/projects/${projectId.value}/events`
    source = new EventSource(url, { withCredentials: true })
    store.setStatus('connecting')

    source.addEventListener('open', () => {
      store.setStatus('open')
    })

    source.addEventListener('error', () => {
      // EventSource will retry automatically — reflect transitional state only
      if (source?.readyState === EventSource.CONNECTING) {
        store.setStatus('connecting')
      } else {
        store.setStatus('error')
      }
    })

    // typed event listeners — one per event type
    const eventTypes: EventType[] = [
      'MOVEMENT_CREATED',
      'MOVEMENT_DELETED',
      'ALERT_CREATED',
      'ALERT_STATUS_CHANGED',
      'ALERT_MESSAGE_ADDED',
      'MOVEMENT_MESSAGE_ADDED',
    ]

    for (const type of eventTypes) {
      source.addEventListener(type, (e: MessageEvent) => {
        const event = JSON.parse(e.data) as ProjectEvent
        store.push(event)
      })
    }
  }

  function close() {
    source?.close()
    source = null
    store.setStatus('closed')
  }

  // open when projectId is available, close on unmount
  watch(projectId, (id) => { if (id) open() }, { immediate: true })
  onUnmounted(() => close())

  return { open, close }
}
```

::: info Named event listeners vs `onmessage`
The composable registers a listener per named event type (`source.addEventListener(type, …)`) rather than a single
`source.onmessage` handler. Named listeners only fire when the SSE `event:` field matches — frames without an `event:`
field (such as the `: keepalive` comment) are silently ignored.
:::

---

### Connection status indicator

The `streamStatus` from the store drives a persistent UI indicator so users always know whether the real-time feed is
live:

| Status       | Indicator          | User-facing meaning                              |
|--------------|--------------------|--------------------------------------------------|
| `connecting` | Spinner / amber    | Establishing or re-establishing connection       |
| `open`       | Green dot          | Live — events arrive in real time                |
| `error`      | Red dot + toast    | Connection lost — retrying automatically         |
| `closed`     | No indicator       | Not connected (user navigated away from project) |

The indicator lives in the project layout (APP layer) and is always visible while a project page is active.

---

### Forbidden patterns

| Pattern                                             | Why                                                  | Alternative                          |
|-----------------------------------------------------|------------------------------------------------------|--------------------------------------|
| `new EventSource(…)` inside a component             | Lifecycle not controlled, duplicates connections     | `useProjectEventStream` composable   |
| Listening to `onmessage` for typed events           | Fires only on unnamed frames, misses named events    | `addEventListener(type, …)`          |
| Storing raw `MessageEvent` objects in the store     | Untyped, hard to consume                             | Parse to `ProjectEvent` before push  |
| Not calling `close()` on unmount                    | Leaves dangling connections after navigation         | `onUnmounted(() => close())`         |
| Polling as a fallback to SSE                        | Breaks the reactive model, unnecessary with retry    | Let `EventSource` handle reconnect   |
