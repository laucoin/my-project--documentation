# Security Conventions

Authentication and authorisation architecture is covered in [Security](/technical/security).
These guidelines define the **coding conventions** derived from those decisions.

---

## Authorization Boundary

**Convention: authorization is enforced exclusively at the BFF level. Modules never validate sessions or tokens.**

```kotlin
// ✅ correct — BFF resolves auth and calls module service
@GetMapping("/projects/{id}")
suspend fun getProject(
	@PathVariable id: UUID,
	authentication: Authentication,  // resolved by Spring Security at BFF level
): ProjectResponse {
	val roles = authentication.extractRoles()
	authorizationService.requireProjectAccess(id, roles)
	return coreService.findProject(id).toResponse()
}

// ❌ avoid — module service re-validating auth
class CoreServiceImpl: CoreService {
	override fun findProject(id: UUID): Mono<Project> {
		// modules must NOT check tokens or sessions here
		// they receive pre-authorized calls through the inbound port
	}
}
```

**Rationale:** ADR 002 – BFF is the single auth choke point. If modules validated auth independently,
a future extraction into microservices would require duplicating auth logic in every service.

---

## JWT and Session Handling

**Convention: the JWT never leaves the BFF. The frontend only receives and forwards a session cookie.**

```
Frontend ←──── SESSION cookie ────→ BFF ←──── JWT (server-side) ────→ Keycloak
```

Rules:

- Never include a JWT or any token in a BFF API response body
- Never set an `Authorization` header in a response to the frontend
- Session management (`Set-Cookie: SESSION=...`) is handled by Spring Session — do not implement it manually
- The session cookie must be `HttpOnly` and `Secure` in production

---

## AppRole Authority Format

Spring Security authorities are prefixed with `ROLE_`. Global and project roles are encoded as follows:

| Role | Authority string | Notes |
|---|---|---|
| `USER` | `ROLE_USER` | Default global role — every authenticated user |
| `SUPER_ADMIN` | `ROLE_SUPER_ADMIN` | Platform administrator |
| `PROJECT_ADMIN` on project X | `ROLE_PROJECT_ADMIN_<projectId>` | UUID appended as suffix |
| `PROJECT_COORDINATOR` on project X | `ROLE_PROJECT_COORDINATOR_<projectId>` | UUID appended as suffix |
| `PROJECT_PARTICIPANT` on project X | `ROLE_PROJECT_PARTICIPANT_<projectId>` | UUID appended as suffix |

Example for a user who is `PROJECT_ADMIN` on project `a1b2c3d4-…`:

```
ROLE_USER
ROLE_PROJECT_ADMIN_a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Global roles (`USER`, `SUPER_ADMIN`) come from Keycloak realm roles via `realm_access.roles`. Project roles are
loaded from `core.profiles` on each request and added to the `Authentication` as additional authorities.

```kotlin
// AppRole sealed class — mirrors the authority string convention
sealed class AppRole {
    object User       : AppRole()
    object SuperAdmin : AppRole()
    data class ProjectAdmin(val projectId: UUID)       : AppRole()
    data class ProjectCoordinator(val projectId: UUID) : AppRole()
    data class ProjectParticipant(val projectId: UUID) : AppRole()

    companion object {
        fun fromAuthority(authority: String): AppRole? = when {
            authority == "ROLE_USER"       -> User
            authority == "ROLE_SUPER_ADMIN" -> SuperAdmin
            authority.startsWith("ROLE_PROJECT_ADMIN_") ->
                ProjectAdmin(UUID.fromString(authority.removePrefix("ROLE_PROJECT_ADMIN_")))
            authority.startsWith("ROLE_PROJECT_COORDINATOR_") ->
                ProjectCoordinator(UUID.fromString(authority.removePrefix("ROLE_PROJECT_COORDINATOR_")))
            authority.startsWith("ROLE_PROJECT_PARTICIPANT_") ->
                ProjectParticipant(UUID.fromString(authority.removePrefix("ROLE_PROJECT_PARTICIPANT_")))
            else -> null
        }
    }
}
```

---

## Role Extraction

**Convention: extract roles from `Authentication` using a shared utility — never parse claims manually.**

```kotlin
// ✅ correct — centralized extraction
fun Authentication.extractRoles(): Set<AppRole> =
	authorities.mapNotNull { AppRole.fromAuthority(it.authority) }.toSet()

fun Authentication.organizationSlug(): String =
	(principal as OidcUser).getAttribute("organization") ?: error("Missing organization claim")

// ❌ avoid — manual claim parsing scattered across handlers
val roles = (authentication.principal as OidcUser)
	.idToken.claims["roles"] as? List<*>  // fragile, duplicated
```

---

## Role-Based Access Pattern

**Convention: authorization checks happen in a dedicated `AuthorizationService`, not inline in handlers.**

```kotlin
// ✅ correct — explicit, testable
@Component
class AuthorizationService {

	fun requireProjectAccess(projectId: UUID, roles: Set<AppRole>) {
		if (AppRole.SUPER_ADMIN in roles) return
		if (roles.none { it.projectId == projectId }) {
			throw AccessDeniedException("No access to project $projectId")
		}
	}

	fun requireProjectAdmin(projectId: UUID, roles: Set<AppRole>) {
		if (AppRole.SUPER_ADMIN in roles) return
		if (roles.none { it == AppRole.PROJECT_ADMIN && it.projectId == projectId }) {
			throw AccessDeniedException("Project admin role required for $projectId")
		}
	}
}

// ❌ avoid — inline role check in handler
if (!authentication.authorities.any { it.authority == "ROLE_PROJECT_ADMIN_$id" }) {
	throw ResponseStatusException(HttpStatus.FORBIDDEN)
}
```

---

## Organization Slug

**Convention: the organization slug is immutable once assigned. Never expose an update endpoint for it.**

The slug is the routing key for the entire authentication flow (ADR 005).
Changing it mid-life would break all users' login URLs and any external IdP configuration.

```kotlin
// ❌ forbidden
fun updateOrganization(id: UUID, request: UpdateOrganizationRequest): Mono<Organization> {
	// slug must not be updatable — reject requests that include slug changes
}
```

If a rename is ever required, it must go through a formal migration process with coordination with all
affected organizations' IdP configurations.

---

## Sensitive Data in Logs

**Convention: never log JWT claims, session IDs, or personal data.**

```kotlin
// ✅ correct
log.debug("Project access granted for projectId={}", projectId)

// ❌ avoid
log.debug("Auth: token={}, claims={}", token, claims)  // leaks JWT
log.debug("User: email={}, name={}", user.email, user.name)  // leaks PII
```

---

## Forbidden Patterns

| Pattern                                       | Why                                         | Alternative                        |
|-----------------------------------------------|---------------------------------------------|------------------------------------|
| Module validating JWT / session independently | Auth is BFF-only (ADR 002)                  | Trust the inbound port call        |
| JWT in API response body or header            | Frontend must never hold a token            | Session cookie only                |
| Manual claim parsing inline in a handler      | Fragile, duplicated, hard to test           | Shared `Authentication` extension  |
| Inline role check in handler                  | Not testable, logic scattered               | `AuthorizationService`             |
| Updating the organization slug                | Breaks auth routing and external IdP config | Immutable — migration process only |
| Logging session IDs, tokens, or PII           | Security and GDPR risk                      | Log only technical IDs (UUIDs)     |
