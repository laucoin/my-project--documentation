# Data Policy

The application enforces data retention and access rules in compliance with GDPR requirements. Personal data is never
kept longer than necessary, and every user may access or export their data at any time.

## Right of access and data export

In accordance with GDPR Article 15, any authenticated user may request a full export of their personal data at any
time. The export covers all personal data the application holds for that user across every module.

### Scope of the export

| Data category | Content |
|---|---|
| Account | Name, email address, organisation slug, account creation date |
| Project profiles | List of projects the user is a member of, with their role and profile creation date |
| Participant link | Identifier and name of the participant record linked to this user account, if any |
| Movements | All movement records in which the user appears as the registered participant (via participant link) |
| Registration requests | All registration requests submitted by or on behalf of the user |

Data that has already been automatically purged per the retention rules below is no longer held by the system and
is therefore not included in the export.

### Export format

The export is delivered as a **structured JSON file**. Each data category is a top-level key. Fields map directly
to the attribute names used in the application's domain model.

```json
{
  "account": {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "organisationSlug": "acme",
    "createdAt": "2025-01-15T08:30:00Z"
  },
  "projectProfiles": [
    {
      "projectId": "...",
      "projectName": "Summer Camp 2025",
      "role": "PROJECT_COORDINATOR",
      "createdAt": "2025-02-01T10:00:00Z"
    }
  ],
  "participantLink": {
    "participantId": "...",
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "movements": [...],
  "registrationRequests": [...]
}
```

The export does not include data owned by other users, aggregate statistics, or internal technical identifiers
that carry no personal meaning.

### How to request an export

A user initiates the export from their account settings page. The file is generated on demand and made available
for download immediately. No email delivery or delayed processing is involved.

---

## Automatic purge rules

### Operations and registrations

Personal data linked to movements and registration requests is automatically and permanently deleted **one year after**
the event or the end of the registration process.

### Inactive projects

A project and all its associated data are automatically and permanently deleted **one year after the last recorded
activity** on that project.

## User-initiated purge

A user can request the deletion of their personal data at any time, subject to the following conditions.

### Project admin constraint

A user **cannot be deleted** if they are the sole permanent `PROJECT_ADMIN` on one or more projects. Before their account can be
removed, they must either:

- Assign another user as a permanent `PROJECT_ADMIN` on each of those projects, or
- Delete the project(s) entirely

### Participant link constraint

If a user is linked to a participant who was active in a project **less than one year ago**, the user account is
dissociated from that participant, but the participant record itself is **not deleted** — it remains for data integrity
and legal compliance.

### What is deleted

Upon purge, all personal information associated with the user's account is permanently removed from the system. Any
remaining data (such as participant records that cannot yet be purged) is preserved without the personal user link.

::: danger Irreversible action
All data purges — whether automatic or user-initiated — are permanent and cannot be undone.
:::
