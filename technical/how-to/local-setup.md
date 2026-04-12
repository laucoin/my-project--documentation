# Run the Application Locally

This guide walks through starting the full application stack on a developer machine: infrastructure services,
the BFF, and the Nuxt frontend. Follow the steps in order — the BFF requires the database and Keycloak to be
up before it can start.

---

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Docker + Docker Compose | Docker 24 | Required for PostgreSQL, Keycloak, Redis |
| JDK | 21 | Required to run the BFF via Gradle |
| Node.js | 22 | Required for the Nuxt frontend |
| pnpm | 9 | Frontend package manager |

---

## 1. Start the infrastructure

From the root of the repository:

```bash
docker compose up -d
```

This starts three services:

| Service | Default port | Purpose |
|---|---|---|
| PostgreSQL | `5432` | Application database (3 schemas: `core`, `operation`, `registration`) |
| Keycloak | `8080` | Authentication — admin console at `http://localhost:8080` |
| Redis | `6379` | Spring Session store |

Wait a few seconds for Keycloak to finish its startup before proceeding. You can check with:

```bash
docker compose ps
```

All services should show status `healthy` or `running`.

---

## 2. Configure Keycloak

If this is a fresh environment (first run or after a `docker compose down -v`), follow the Keycloak setup guide to
create the realm, client, roles, and a test organization:

→ [Configure Keycloak](/technical/how-to/keycloak-setup)

If you have already completed this step, skip ahead.

---

## 3. Start the BFF

From the root of the repository, in a separate terminal:

```bash
./gradlew bootRun
```

The BFF starts on **`http://localhost:8081`**. Flyway migrations run automatically on startup and create the three
schemas if they do not already exist.

::: info Default configuration
The BFF ships with local defaults in `application-local.yml`. No environment variables need to be set for a
standard local run. If you need to override any value (e.g. after retrieving a new Keycloak client secret),
set the following variables:

```bash
KEYCLOAK_CLIENT_ID=bff
KEYCLOAK_CLIENT_SECRET=<from Keycloak Clients → bff → Credentials>
KEYCLOAK_ISSUER_URI=http://localhost:8080/realms/project
```
:::

::: warning Wait for migrations
The first startup runs all Flyway migrations before the application becomes ready. This may take a few seconds
longer than subsequent startups.
:::

---

## 4. Start the frontend

From the `frontend/` directory, in a separate terminal:

```bash
pnpm install   # only needed on first run or after dependency changes
pnpm dev
```

The Nuxt dev server starts on **`http://localhost:3000`** with hot module replacement enabled.

::: info API base URL
The frontend is pre-configured to proxy API calls to `http://localhost:8081` in development. No `.env` file
is required for a standard local run.
:::

---

## 5. Access the application

Open `http://localhost:3000` in your browser. You will be prompted to enter your organization slug. Use the
slug of the organization you created in Keycloak during step 2.

---

## Stopping the stack

```bash
# Stop the frontend and BFF by pressing Ctrl+C in their respective terminals

# Stop and keep infrastructure data
docker compose stop

# Stop and discard all data (requires Keycloak setup on next run)
docker compose down -v
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| BFF fails with `Connection refused` on startup | PostgreSQL not ready | Wait a few seconds and retry |
| BFF fails with `JWKS` or `issuer` error | Keycloak not ready or realm not created | Check Keycloak is running; verify realm `project` exists |
| Login redirects to an error page | Redirect URI mismatch | Verify `http://localhost:8081/login/oauth2/code/keycloak` is in the Keycloak client's Valid redirect URIs |
| Frontend shows blank page | Nuxt build error | Check the terminal output of `pnpm dev` for compilation errors |
| `Session not found` after login | Redis not running | Verify Redis is up with `docker compose ps` |
