# Configure Keycloak

::: info
Here a configuration for the local development environment is provided. For production, the same steps apply but the Keycloak instance will likely be hosted separately (e.g. Keycloak Cloud, self-hosted on a VM,etc.) and not via Docker Compose.
:::

This guide walks through the Keycloak setup required for the BFF to authenticate users via the OAuth2 authorization code
flow. The local development environment runs Keycloak on `http://localhost:8080` via `compose.yaml`.

> For context on why Keycloak and its Organizations feature were chosen, see
> [ADR 005 – Keycloak Organizations](/technical/adr/005-keycloak-organizations).

---

## 1. Access the admin console

Start the local environment:

```bash
docker compose up -d
```

Then open `http://localhost:8080` and sign in with:

| Field    | Value    |
|----------|----------|
| Username | `admin`  |
| Password | `dev123` |

---

## 2. Create the realm

1. In the top-left dropdown, click **Create realm**.
2. Set **Realm name** to `project`.
3. Click **Create**.

All subsequent steps are performed inside the `project` realm.

---

## 3. Enable Organizations

1. Go to **Realm settings → General**.
2. Enable the **Organizations** toggle.
3. Click **Save**.

This is required for the `organization` parameter forwarded by the BFF during the authorization request.

---

## 4. Create the client

1. Go to **Clients → Create client**.
2. Fill in the **General settings** step:
   | Field | Value |
   |-----------|-------|
   | Client ID | `bff` |

3. In the **Capability config** step:
	- Enable **Client authentication** (makes it a confidential client).
	- Keep **Standard flow** checked; uncheck everything else.

4. In the **Login settings** step:
   | Field | Value |
   |-----------------------|-----------------------------------------------------|
   | Valid redirect URIs | `http://localhost:8081/login/oauth2/code/keycloak`  |
   | Web origins | `http://localhost:8081`                             |

5. Click **Save**.

### Retrieve the client secret

Go to **Clients → bff → Credentials** and copy the **Client secret**. Set it as the `KEYCLOAK_CLIENT_SECRET`
environment variable when running the BFF.

---

## 5. Configure realm roles

The BFF reads `realm_access.roles` from the ID token and maps each value to a Spring Security authority prefixed with
`ROLE_`. Keycloak includes realm roles in tokens by default.

Create the following realm roles under **Realm roles → Create role**:

| Role name     |
|---------------|
| `USER`        |
| `SUPER_ADMIN` |

Project-level roles (`PROJECT_ADMIN`, `PROJECT_COORDINATOR`, `PROJECT_PARTICIPANT`) are managed by the application
itself via project profiles — they do not need to be created as Keycloak realm roles.

Assign the `USER` role to every user who should be able to sign in.

---

## 6. Create a test user

1. Go to **Users → Create new user**.
2. Set a username and click **Create**.
3. In the **Credentials** tab, set a password (disable **Temporary**).
4. In the **Role mapping** tab, assign the `USER` realm role.

---

## 7. Create an organization

Each organization in the application corresponds to a Keycloak Organization identified by a **slug**.

1. Go to **Organizations → Create organization**.
2. Fill in:
   | Field | Value |
   |--------|---------------------------------------------------------------------|
   | Name | Display name (e.g. `Scouts de France`)                              |
   | Domain | The organization's email domain (used for member matching, optional) |

3. After saving, note the **slug** shown on the organization detail page. This slug is what users enter on the
   pre-login screen and what the BFF forwards as `?organization=<slug>`.

4. Add members to the organization via **Organizations → \<org\> → Members**.

---

## 8. Configure an external IdP (optional)

For organizations that federate identity through an external IdP:

1. Go to **Identity providers → Add provider** (OIDC or SAML).
2. Configure the provider with the credentials from the external IdP.
3. Under the **Mappers** tab of the identity provider, create a mapper to translate the external role claim:
   | Mapper type | Sync mode | Claim | Realm role target |
   |-------------------|-----------|------------------|-------------------|
   | Hardcoded role | Inherit | — | `USER`            |
   | Claim to role | Inherit | `MY_PROJECT_SUPER_ADMIN` → value `true` | `SUPER_ADMIN` |

4. Link the IdP to the organization: **Organizations → \<org\> → Identity providers → Link**.

---

## 9. Environment variables summary

```bash
KEYCLOAK_CLIENT_ID=bff
KEYCLOAK_CLIENT_SECRET=<from Credentials tab>
KEYCLOAK_ISSUER_URI=http://localhost:8080/realms/project
```

These correspond to the defaults in `application.yaml` and only need to be set explicitly when overriding them (e.g. in
production).