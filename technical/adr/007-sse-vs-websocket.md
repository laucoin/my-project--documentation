# 007 – Real-Time Push: SSE vs WebSocket

|              |                                                  |
|--------------|--------------------------------------------------|
| **Status**   | Accepted                                         |
| **Concerns** | Architecture, Real-Time, Performance, Technology |

## Context

ADR 004 notes that real-time push is used exclusively for the **communications feature** — specifically, pushing
server-side events (alerts, movement updates, status changes) to connected supervisory staff without polling. The
application needs to choose a transport protocol for this unidirectional server-to-client push channel.

Two candidates were evaluated:

| Criterion                   | SSE (Server-Sent Events)                           | WebSocket                                            |
|-----------------------------|----------------------------------------------------|------------------------------------------------------|
| **Communication direction** | Unidirectional — server → client only              | Bidirectional — server ↔ client                      |
| **Protocol**                | HTTP/1.1 or HTTP/2 (plain HTTP)                    | Upgraded TCP connection (`ws://` / `wss://`)         |
| **Spring WebFlux support**  | Native — `Flux<ServerSentEvent<T>>` return type    | Supported via `WebSocketHandler`, more boilerplate   |
| **Proxy / firewall**        | Transparent — travels over standard HTTP ports     | May require specific proxy configuration             |
| **Auto-reconnect**          | Built into the browser `EventSource` API           | Must be implemented manually in the client           |
| **Multiplexing (HTTP/2)**   | Multiple SSE streams share a single connection     | Each stream requires its own connection              |
| **Complexity**              | Low — no handshake, no framing, no ping/pong       | Higher — custom framing, heartbeat, session tracking |
| **Client-to-server events** | Not supported (requires a separate HTTP request)   | Built-in                                             |

## Decision

Use **SSE (Server-Sent Events)** as the real-time push transport for the communications feature.

The backend exposes a `GET /events` endpoint (per module) that returns a `Flux<ServerSentEvent<T>>`, leveraging the
existing Spring WebFlux reactive stack. The Nuxt frontend subscribes via the browser-native `EventSource` API or the
`useEventSource` composable.

User actions that modify state (e.g. acknowledging an alert) continue to use standard REST calls — no real-time
client-to-server channel is needed.

## Rationale

- **Unidirectional is sufficient** — all real-time use cases in this application are server-initiated: alert creation,
  movement status changes, and presence updates. Clients do not need to push a continuous stream back to the server.
- **Native WebFlux integration** — returning a `Flux<ServerSentEvent<T>>` requires no additional infrastructure or
  handler registration; it is a standard controller return type in Spring WebFlux.
- **Lower operational complexity** — SSE travels over plain HTTPS on standard ports. No special load-balancer or proxy
  configuration is required, unlike WebSocket upgrades which can be silently dropped by certain intermediaries.
- **Automatic reconnection** — the browser `EventSource` API reconnects automatically on connection loss, reducing
  client-side error handling code.
- **HTTP/2 multiplexing** — when deployed behind an HTTP/2-capable reverse proxy, multiple SSE streams share a single
  TCP connection, avoiding the per-connection overhead of WebSocket.
- **Consistent reactive model** — a `Flux`-based SSE endpoint fits naturally into the existing reactive pipeline
  established in ADR 004, without introducing a separate programming model.

## Consequences

- All server-to-client push is handled through SSE endpoints returning `Flux<ServerSentEvent<T>>`.
- Client-initiated real-time communication (e.g. a future collaborative chat feature) would require a separate REST call
  or a new WebSocket channel at that time. This is acceptable given current requirements.
- Long-lived HTTP connections must be accounted for in reverse-proxy timeout configuration (e.g. Nginx
  `proxy_read_timeout`).
- In a future horizontal scaling scenario, SSE connections are pinned to a single backend instance. An event broker
  (e.g. Redis Pub/Sub) would be needed to fan out events across instances — the same constraint applies to WebSocket.
