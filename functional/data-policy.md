# Data Policy

The application enforces data retention and access rules in compliance with GDPR requirements. Personal data is never
kept longer than necessary, and every user may access or export their data at any time.

## Right of access and data export

In accordance with GDPR Article 15, any authenticated user may request a full export of their personal data at any
time. The export covers all personal data the application holds for that user across every module.

### Scope of the export

| Data category         | Content                                                                                             |
|-----------------------|-----------------------------------------------------------------------------------------------------|
| User                  | Name, email address, organization slug, account creation date                                       |
| Profiles              | List of projects the user is a member of, with their role and profile creation date                 |
| Participant link      | Identifier and name of the participant record linked to this user account, if any                   |
| Movements             | All movement records in which the user appears as the registered participant (via participant link) |
| Communications        | All communications records in which the user is the author                                          |
| Registration requests | All registration requests submitted by or on behalf of the user                                     |

Data that has already been automatically purged per the retention rules below is no longer held by the system and
is therefore not included in the export.

### Export format

The export is delivered as a **structured JSON file**. Each data category is a top-level key. Fields map directly
to the attribute names used in the application's domain model.

```json5
{
  "user": {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "organizationSlug": "acme",
    "createdAt": "2025-01-15T08:30:00Z"
  },
  "profiles": [
    {
      "projectId": "...",
      "projectName": "Summer Camp 2025",
      "role": "PROJECT_COORDINATOR",
      "createdAt": "2025-02-01T10:00:00Z"
    }
  ],
  "participants": [
    {
      "participantId": "...",
      "firstName": "Jane",
      "lastName": "Doe"
    }
  ],
  "movements": [
    // ...
  ],
  "requests": [
    // ...
  ]
}
```

The export does not include data:

- Owned by other users
- Aggregate statistics
- Internal technical identifiers (like data created or updated by the concerned user that carry no personal meaning)

### How to request an export

#### User

A user initiates the export from their account settings page. The file is generated on demand and made available
for download immediately. No email delivery or delayed processing is involved.

#### Participant

::: tip
If the participant is linked to a user, refer to the [user section](#user) above.
:::

The participant must ask their organization to provide all data related to them. That organization should have a process in place to automatically or manually retrieve the participant’s data. This application provides a way to do so — it is the organization’s responsibility to use that feature and deliver the export to the concerned participant.

Birthday is a mandatory field for participants for identification purposes.

## Automatic purge rules

### User

- Concerned data
	- User information
	- Link to his participant
- Conditions:
	- Not logged in since 1 year
	- Not the last `ORGANIZATION_ADMIN` of an organization
	- Not the last `PROJECT_ADMIN` of a project (without expiration date and with a profile type `DEFAULT`)

### Movement

- Concerned data
	- Movement with their content
	- Related communication if not related to an alert
- Conditions:
	- Movement timestamp is older than 1 year

### Alert

- Concerned data
	- Alert with their communications
- Conditions:
	- 1 year after status marked as `RESOLVED` or `CANCELED`

### Participant

- Concerned data
	- Participant information
- Conditions:
	- Not related to any movement (Movements are deleted 1 year after their timestamp, meaning the participant is deleted 1 year after their last movement)

### Group

- Concerned data
	- Group information
- Conditions:
	- No longer contains any participants (due to purged participants or participants who were never assigned)

### Project

- Concerned data
	- Project information
	- All object scoped to project (and their children)
- Conditions:
	- Created since 1 year
	- No movement or registration

## Time referential

1 year duration was chosen for multiple reasons:

- If there are problems during a movement, a victim has 1 year to take legal action. We need to be able to indicate who was present.
- If a participant drives a vehicle and a traffic ticket is issued, we must identify the driver. Traffic tickets expire after one year.
- Not storing data in the database unnecessarily saves money and improves performance.
