# Level 1 – System Context

This diagram shows the system as a whole, the people who interact with it, and the external systems it depends on.

```mermaid
C4Context
    title System Context — Group Care Management

    Person(staff, "Staff Member", "Project admins and coordinators managing a project")
    Person(youth, "Youth Participant", "Participant with a PROJECT_PARTICIPANT profile — access to operation entities only")
    Person(superadmin, "Super Admin", "Platform administrator")

    System(app, "Group Care Management", "Manages group care facilities for minors across multiple organisations")

    System_Ext(keycloak, "Keycloak", "Identity broker — handles multi-organisation authentication and routing")
    System_Ext(idp, "Organisation IdP", "External identity provider configured per organisation (optional)")
    Rel(staff, app, "Uses", "HTTPS")
    Rel(youth, app, "Uses", "HTTPS")
    Rel(superadmin, app, "Administers", "HTTPS")
    Rel(app, keycloak, "Delegates authentication to", "OIDC")
    Rel(keycloak, idp, "Federates identity from", "OIDC / SAML")
```

## Elements

| Element               | Type            | Description                                                                                                                 |
|-----------------------|-----------------|-----------------------------------------------------------------------------------------------------------------------------|
| Staff Member          | Person          | Project admins and coordinators who manage projects, participants, movements, and registrations                             |
| Youth Participant     | Person          | A participant with a `PROJECT_PARTICIPANT` profile — can record movements, manage alerts, and participate in communications |
| Super Admin           | Person          | Platform administrator — manages users and can access any project via a temporary profile                                   |
| Group Care Management | System          | This application                                                                                                            |
| Keycloak              | External system | Identity broker — issues JWTs, routes users to the correct IdP based on their organisation slug                             |
| Organisation IdP      | External system | An optional external identity provider (e.g. Microsoft Entra, Google Workspace) configured per organisation                 |
