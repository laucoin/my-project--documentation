---
type: feature
modules:
  - document
objects:
  - document
required_options:
tags:
  - document
  - download
  - storage
outline: deep
created: 2026-04-14
last_update: 2026-04-14
---

# Download Document

## Objects used

- [Document](/functional/business-objects/document/)

## Allowed roles

Permissions depend on the document type. The document type configuration defines which roles are authorized to download documents of that type.

## Constraints

- Document must exist
- Document status must be `CLEAN`; a document in `PENDING` status is not yet accessible

## Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    User ->> BFF: Request document download (document ID)
    BFF ->> Document: Check existence and status
    alt Document not found
        Document -->> BFF: 404
        BFF -->> User: 404 Not Found
        Note over BFF,User: May indicate the file was infected and purged
    else Status is PENDING
        Document -->> BFF: 403
        BFF -->> User: 403 Forbidden — scan not yet complete
    else Status is CLEAN
        Document ->> Storage: Retrieve file
        Storage -->> Document: File stream
        Document -->> BFF: File stream + metadata
        BFF -->> User: 200 OK (file download)
    end
```
