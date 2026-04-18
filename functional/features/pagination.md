---
type: reference
modules:
scope:
object_name:
required_options:
tags:
  - pagination
  - search
  - reference
outline: deep
created: 2026-04-13
last_update: 2026-04-17
---

# Pagination

All `search-*` features return paginated results. Pagination is **offset-based
**: the caller provides the page number and page size, and the response returns the requested slice plus enough metadata to render a pager.

## Request parameters

| Parameter | Type    | Default | Description                           |
|-----------|---------|---------|---------------------------------------|
| `page`    | integer | `1`     | 1-based index of the page to return   |
| `size`    | integer | `20`    | Number of items per page (max: `100`) |

Requests that omit `page` or `size` receive the defaults above. A request with `size` greater than
`100` is rejected with a validation error.

## Response envelope

All paginated endpoints return the same envelope shape:

| Field         | Type    | Description                                        |
|---------------|---------|----------------------------------------------------|
| `items`       | array   | The items for the requested page                   |
| `page`        | integer | The 1-based page index that was served             |
| `size`        | integer | The page size that was applied                     |
| `total`       | integer | Total number of items matching the current filters |
| `total_pages` | integer | `ceil(total / size)`                               |

> Sort order is defined per feature (see each individual
`search-*` page). Pagination is applied after filtering and sorting.

## Example

```json5
{
  "items": [
    /* ... */
  ],
  "page": 2,
  "size": 20,
  "total": 147,
  "total_pages": 8
}
```

## Edge cases

- Requesting a page beyond `total_pages` returns an empty `items` array with the requested `page` and
  `size` echoed back; `total` remains accurate.
- Filters that affect `total` (search criteria, option masking, soft-delete) are applied before pagination.
- When an option is disabled on a project, records masked by that option are excluded from both `items` and `total`.
