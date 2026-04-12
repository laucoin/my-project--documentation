# Business Objects - Operations

This section describes the operations entities managed by the application and their relationships.

## Entities

To illustrate which **Project** it belongs to, the project appears in the diagram, but it is actually the one from
the core module.

- [Project](/functional/business-objects/core/project)
	- [Movement](/functional/business-objects/operations/movement)
		- [Communication](/functional/business-objects/operations/communication)
	- [Alert](/functional/business-objects/operations/alert)
		- [Communication](/functional/business-objects/operations/communication)

## Statuses

Some entities have a status field defined as a priority list. The first status that matches the object's state is applied.

Example: if a movement matches the conditions at both line 1 and line 3 of the status table, its displayed status is the one at line 1.

## Main attributes

All objects have a “Main attributes” section. This section covers functionally relevant fields but is not an exhaustive list. For the full attribute list, refer to the [technical documentation](/technical).
