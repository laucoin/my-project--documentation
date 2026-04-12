# Business Objects - Core

This section describes the core entities managed by the application (core module) and their relationships.

## Entities

- [Organization](/functional/business-objects/core/organization)
	- [User](/functional/business-objects/core/user)
	- [Project](/functional/business-objects/core/project)
		- [Profile](/functional/business-objects/core/profile)
		- [Group](/functional/business-objects/core/group)
		- [Participant](/functional/business-objects/core/participant)
		- [Activity](/functional/business-objects/core/activity)
		- [Vehicle](/functional/business-objects/core/vehicle)

## Statuses

Some entities have a status field defined as a priority list. The first status that matches the object's state is applied.

Example: if a participant matches the conditions at both line 1 and line 3 of the status table, their displayed status is the one at line 1.

## Main attributes

All objects have a “Main attributes” section. This section covers functionally relevant fields but is not an exhaustive list. For the full attribute list, refer to the [technical documentation](/technical).
