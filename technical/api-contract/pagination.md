---
outline: deep
---

# Pagination

Pagination is **mandatory** on all endpoints that return collections. No collection endpoint returns an unbounded list.

::: tip Required header
All requests must include `X-Organization-Slug`. See [General conventions](/technical/api-contract/#required-headers).
:::

## Strategy

The API uses **offset-based pagination** via `page` and
`size` query parameters. This strategy was chosen over cursor-based pagination because:

- Data sets (participants, groups, movements) are bounded and project-scoped — no global unbounded collections exist.
- Clients need random access by page number (e.g. jump to page 3 of the participant list).
- The total element count is always returned, which list views require to render a page navigator.

::: info Cursor-based pagination — when to consider it
Cursor-based pagination (
`after=<cursor>`) would be appropriate for the movement log if high-volume real-time streaming were required. At current scale, offset pagination is sufficient. This decision should be revisited if movement volume exceeds ~100k records per project.
:::

## Request parameters

| Parameter | Type    | Default | Description                                |
|-----------|---------|---------|--------------------------------------------|
| `page`    | integer | `0`     | Zero-based page index                      |
| `size`    | integer | `30`    | Number of items per page — capped at `100` |

::: warning
`page` is **zero-indexed**. The first page is `page=0`, not `page=1`.
:::

### Example

```http
GET /api/v2/projects/{projectId}/participants?page=0&size=30
GET /api/v2/projects/{projectId}/movements?page=2&size=50
```

## Response format

All paginated endpoints return HTTP **`206 Partial Content`** and a JSON envelope with the following structure:

```json
{
  "content": [
    /* array of resource objects */
  ],
  "page": {
    "number": 0,
    "size": 30,
    "totalElements": 87,
    "totalPages": 3
  }
}
```

| Field                | Type    | Description                                                   |
|----------------------|---------|---------------------------------------------------------------|
| `content`            | array   | The items for this page                                       |
| `page.number`        | integer | Current zero-based page index                                 |
| `page.size`          | integer | Effective page size (may be less than requested on last page) |
| `page.totalElements` | integer | Total number of matching items across all pages               |
| `page.totalPages`    | integer | Total number of pages — `ceil(totalElements / size)`          |

::: tip Empty result
An empty collection returns HTTP `206` with `content: []` and `page.totalElements: 0`. It does **not** return `404`.
:::

## Partial responses — `fields` parameter

Any endpoint (paginated or not) accepts a
`fields` query parameter to restrict which attributes are returned. This reduces payload size for clients that only need a subset of the resource.

```http
GET /api/v2/projects/{projectId}/participants?fields=id,firstName,lastName
```

```json
{
  "content": [
    {
      "id": "...",
      "firstName": "Alice",
      "lastName": "Martin"
    }
  ],
  "page": {
    ...
  }
}
```

## HATEOAS links

Paginated responses should include navigational hypermedia links where the client implementation requires it:

```json
{
  "content": [
    ...
  ],
  "page": {
    ...
  },
  "_links": {
    "self": {
      "href": "/api/v2/projects/{projectId}/participants?page=1&size=30"
    },
    "first": {
      "href": "/api/v2/projects/{projectId}/participants?page=0&size=30"
    },
    "prev": {
      "href": "/api/v2/projects/{projectId}/participants?page=0&size=30"
    },
    "next": {
      "href": "/api/v2/projects/{projectId}/participants?page=2&size=30"
    },
    "last": {
      "href": "/api/v2/projects/{projectId}/participants?page=2&size=30"
    }
  }
}
```

`prev` is omitted on the first page; `next` is omitted on the last page.
