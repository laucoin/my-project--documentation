---
outline: deep
---

# Business Objects - Operations

This section describes the operations entities managed by the application and their relationships.

## Entities

To illustrate which **Project** it belongs to, the project appears in the diagram, but it is actually the one from
the core module.

- [Project](/functional/business-objects/core/project)
	- [Movement](/functional/business-objects/operations/movement)
		- [Communication](/functional/business-objects/operations/communication) *(movement with activity only)*
	- [Alert](/functional/business-objects/operations/alert)
		- [Communication](/functional/business-objects/operations/communication)
	- [Participant](/functional/business-objects/core/participant)
		- [Comment](/functional/business-objects/operations/comment)
		- [Completion Notice](/functional/business-objects/operations/completion-notice) *(0:1 Internal, 0:1 External)*

## Structure

```mermaid
erDiagram
    Project ||..o{ Movement: contains
    Movement ||..o{ Vehicle: contains
    Movement ||..o{ Activity: contains
    Project ||..o{ Comments: contains
    Comments ||..o{ Participant: comments
    Project ||..o{ Completion_Notice: contains
    Completion_Notice ||..o{ Participant: evaluates
    Movement ||..|{ Participant: contains
    Movement ||..o{ Group: contains
    Project ||..o{ Communication: contains
    Movement ||--o{ Communication: details
    Project ||..o{ Alert: contains
    Alert ||--o{ Communication: details
```

> Dot relationships (`..`) are used to indicate related entities is from another module, while solid relationships (
`--`) indicate entities from the same module.
> All element are scoped to a project, but for readability we only show the project relationship on top-level entities (movement, alert, etc.).
