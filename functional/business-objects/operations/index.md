# Business Objects - Operations

This section describes the operations entities managed by the application and their relationships.

::: info Option required
Some objects are related to [options](/functional/business-objects/core/options), which are features that can be enabled or disabled on a per-project basis.
:::

## Entity hierarchy

To illustrate which **Project
** it belongs to, the project appears in the diagram, but it is actually the one from the core module.

```
Project
├── Movement
│   └── Communication (same as alert communication)
└── Alert
    └── Communication (same as movement communication)
```

## Entities

| Entity                                                                 | Description                                                      |
|------------------------------------------------------------------------|------------------------------------------------------------------|
| [Movement](/functional/business-objects/operations/movement)           | Recording of any entry into or exit from the project site        |
| [Alert](/functional/business-objects/operations/alert)                 | Structured container for tracking situations requiring follow-up |
| [Communication](/functional/business-objects/operations/communication) | Notes took related to movement or alert (to assure follow-up)    |

## Dates and attendance

Unlike the core module, operation entities do not have an optional date. HOWEVER, these entities cannot be created with core entities that are not available (e.g., an event scheduled for April 10, 2026, at 9:03 AM cannot be created with a participant who joins the project on April 23, 2026, at 10:27 AM).

::: info
For more information check each business object's documentation, which specifies how core entities impact the operations entities.
:::
