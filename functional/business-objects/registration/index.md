# Business Objects - Registration

This section describes the registration entities managed by the application and their relationships.

::: info Option required
Registration is only available if the **REGISTRATION** option is enabled on the project.
:::

## Entity hierarchy

To illustrate which **Project
** it belongs to, the project appears in the diagram, but it is actually the one from the core module.

```
Project
└── Period
    ├── Request
    └── Field
```

## Entities

| Entity                                                       | Description                                            |
|--------------------------------------------------------------|--------------------------------------------------------|
| [Period](/functional/business-objects/registration/period)   | How a project opens itself to registration requests    |
| [Field](/functional/business-objects/registration/field)     | Field attached to a period and filled in by requesters |
| [Request](/functional/business-objects/registration/request) | How a user submits a request and how it is processed   |

## Dates and attendance

Unlike the core module, operation entities do not have an optional date. HOWEVER, these entities cannot be created with core entities that are not available (e.g., A time period cannot be selected outside the project's date range.).

::: info
For more information check each business object's documentation, which specifies how core entities impact the operations entities.
:::
