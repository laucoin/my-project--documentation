# Data Policy

The application enforces automatic data retention rules in compliance with GDPR requirements. Personal data is never kept longer than necessary.

## Automatic purge rules

### Operations and registrations

Personal data linked to movements and registration requests is automatically and permanently deleted **one year after** the event or the end of the registration process.

### Inactive projects

A project and all its associated data are automatically and permanently deleted **one year after the last recorded activity** on that project.

## User-initiated purge

A user can request the deletion of their personal data at any time, subject to the following conditions.

### Project admin constraint

A user **cannot be deleted** if they are the sole permanent `ADMIN` on one or more projects. Before their account can be removed, they must either:
- Assign another user as a permanent `ADMIN` on each of those projects, or
- Delete the project(s) entirely

### Participant link constraint

If a user is linked to a participant who was active in a project **less than one year ago**, the user account is dissociated from that participant, but the participant record itself is **not deleted** — it remains for data integrity and legal compliance.

### What is deleted

Upon purge, all personal information associated with the user's account is permanently removed from the system. Any remaining data (such as participant records that cannot yet be purged) is preserved without the personal user link.

::: danger Irreversible action
All data purges — whether automatic or user-initiated — are permanent and cannot be undone.
:::
