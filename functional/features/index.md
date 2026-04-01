---
outline: deep
---

# Features

This section documents the available actions across all business objects. Each feature describes its required roles, constraints, and any dependencies on other objects or [options](/functional/features/options).

## Organization

| Feature                                                           | Description                        |
|-------------------------------------------------------------------|------------------------------------|
| [Search organizations](/functional/features/search-organizations) | List and filter organizations      |
| [Create organization](/functional/features/create-organization)   | Create a new organization          |
| [Edit organization](/functional/features/edit-organization)       | Update an existing organization    |
| [Block organization](/functional/features/block-organization)     | Soft-delete an organization        |
| [Unblock organization](/functional/features/unblock-organization) | Re-enable a blocked organization   |
| [Delete organization](/functional/features/delete-organization)   | Permanently remove an organization |

## User

| Feature                                                   | Description                      |
|-----------------------------------------------------------|----------------------------------|
| [Search users](/functional/features/search-users)         | List and filter users            |
| [Block user](/functional/features/block-user)             | Soft-delete a user               |
| [Unblock user](/functional/features/unblock-user)         | Re-enable a blocked user         |
| [Purge user](/functional/features/purge-user)             | GDPR permanent removal of a user |
| [Export user data](/functional/features/export-user-data) | GDPR data extraction for a user  |

## Project

| Feature                                                 | Description                  |
|---------------------------------------------------------|------------------------------|
| [Search projects](/functional/features/search-projects) | List and filter projects     |
| [Create project](/functional/features/create-project)   | Create a new project         |
| [Edit project](/functional/features/edit-project)       | Update an existing project   |
| [Block project](/functional/features/block-project)     | Soft-delete a project        |
| [Unblock project](/functional/features/unblock-project) | Re-enable a blocked project  |
| [Delete project](/functional/features/delete-project)   | Permanently remove a project |

## Profile

| Feature                                                                     | Description                            |
|-----------------------------------------------------------------------------|----------------------------------------|
| [Search profiles](/functional/features/search-profiles)                       | List and filter profiles                              |
| [Invite user to project](/functional/features/invite-user-to-project)         | Create a profile invitation for a user                |
| [Edit profile](/functional/features/edit-profile)                             | Update a profile                                      |
| [Answer project invitation](/functional/features/answer-project-invitation)   | Accept or reject a profile invitation                 |
| [Block profile](/functional/features/block-profile)                           | Soft-delete a profile                                 |
| [Unblock profile](/functional/features/unblock-profile)                       | Re-enable a blocked profile                           |
| [Create support profile](/functional/features/create-support-profile)         | Grant temporary admin access to a project (1h)        |

## Group *(requires `GROUP` option)*

| Feature                                             | Description                |
|-----------------------------------------------------|----------------------------|
| [Search groups](/functional/features/search-groups) | List and filter groups     |
| [Create group](/functional/features/create-group)   | Create a new group         |
| [Edit group](/functional/features/edit-group)       | Update a group             |
| [Disable group](/functional/features/disable-group) | Soft-delete a group        |
| [Enable group](/functional/features/enable-group)   | Re-enable a disabled group |

## Participant

| Feature                                                                 | Description                              |
|-------------------------------------------------------------------------|------------------------------------------|
| [Search participants](/functional/features/search-participants)         | List and filter participants             |
| [Create participant](/functional/features/create-participant)           | Create a registered or guest participant |
| [Edit participant](/functional/features/edit-participant)               | Update a participant                     |
| [Disable participant](/functional/features/disable-participant)         | Soft-delete a participant                |
| [Enable participant](/functional/features/enable-participant)           | Re-enable a disabled participant         |
| [Purge participant](/functional/features/purge-participant)             | GDPR permanent removal of a participant  |
| [Export participant data](/functional/features/export-participant-data) | GDPR data extraction for a participant   |
| [Delete participant](/functional/features/delete-participant)           | Permanently remove a participant         |

## Activity *(requires `ACTIVITY` option)*

| Feature                                                     | Description                    |
|-------------------------------------------------------------|--------------------------------|
| [Search activities](/functional/features/search-activities) | List and filter activities     |
| [Create activity](/functional/features/create-activity)     | Create a new activity          |
| [Edit activity](/functional/features/edit-activity)         | Update an activity             |
| [Disable activity](/functional/features/disable-activity)   | Soft-delete an activity        |
| [Enable activity](/functional/features/enable-activity)     | Re-enable a disabled activity  |
| [Delete activity](/functional/features/delete-activity)     | Permanently remove an activity |

## Vehicle *(requires `VEHICLE` option)*

| Feature                                                 | Description                  |
|---------------------------------------------------------|------------------------------|
| [Search vehicles](/functional/features/search-vehicles) | List and filter vehicles     |
| [Create vehicle](/functional/features/create-vehicle)   | Create a new vehicle         |
| [Edit vehicle](/functional/features/edit-vehicle)       | Update a vehicle             |
| [Disable vehicle](/functional/features/disable-vehicle) | Soft-delete a vehicle        |
| [Enable vehicle](/functional/features/enable-vehicle)   | Re-enable a disabled vehicle |
| [Delete vehicle](/functional/features/delete-vehicle)   | Permanently remove a vehicle |

## Movement

| Feature                                                   | Description                                 |
|-----------------------------------------------------------|---------------------------------------------|
| [Search movements](/functional/features/search-movements) | List and filter movements                   |
| [Create movement](/functional/features/create-movement)   | Record a new IN or OUT movement             |
| [Edit movement](/functional/features/edit-movement)       | Correct a movement (soft-delete + recreate) |
| [Hide movement](/functional/features/hide-movement)       | Soft-delete a movement                      |
| [Restore movement](/functional/features/restore-movement) | Re-enable a hidden movement                 |

## Alert *(requires `ALERT` option)*

| Feature                                             | Description                               |
|-----------------------------------------------------|-------------------------------------------|
| [Search alerts](/functional/features/search-alerts) | List and filter alerts                    |
| [Create alert](/functional/features/create-alert)   | Create a new alert                        |
| [Edit alert](/functional/features/edit-alert)       | Update alert title, description or status |

## Communication *(requires `COMMUNICATION` option)*

| Feature                                                             | Description                                      |
|---------------------------------------------------------------------|--------------------------------------------------|
| [Create communication](/functional/features/create-communication)   | Post a message in an alert or movement thread    |
| [Edit communication](/functional/features/edit-communication)       | Correct a communication (soft-delete + recreate) |
| [Hide communication](/functional/features/hide-communication)       | Soft-delete a communication                      |
| [Restore communication](/functional/features/restore-communication) | Re-enable a hidden communication                 |

## Maintenance *(requires `SUPER_ADMIN` role)*

| Feature                                                                         | Description                                          |
|---------------------------------------------------------------------------------|------------------------------------------------------|
| [Purge orphans — Core](/functional/features/purge-orphan-core)                  | Delete core objects no longer linked to a parent     |
| [Purge orphans — Operations](/functional/features/purge-orphan-operations)      | Delete operations objects no longer linked to a project |
| [Purge orphans — Registration](/functional/features/purge-orphan-registration)  | Delete registration objects no longer linked to a project |
