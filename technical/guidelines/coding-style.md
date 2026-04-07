# Coding Style

> The backend stack is **Kotlin** throughout. All examples below are in Kotlin.
> Frontend conventions (TypeScript / Vue) are covered in [Frontend Conventions](/technical/guidelines/frontend).

---

## Naming Conventions

### Classes

| Type                 | Convention                                              | Example                 |
|----------------------|---------------------------------------------------------|-------------------------|
| Entity               | PascalCase, singular                                    | `User`, `Organization`  |
| Repository           | `{Entity}Repository`                                    | `UserRepository`        |
| Service              | `{Entity}Service`                                       | `UserService`           |
| Handler              | `{Entity}Handler`                                       | `UserHandler`           |
| Config               | `{Module}Config` or `{Module}DatabaseConfig`            | `CoreDatabaseConfig`    |
| DTO                  | `{Entity}Dto` or `{Entity}Request` / `{Entity}Response` | `UserResponse`          |
| Exception            | `{Context}Exception`                                    | `UserNotFoundException` |

### Methods

| Type             | Convention                | Example                      |
|------------------|---------------------------|------------------------------|
| Boolean return   | `is`, `has`, `can` prefix | `isActive()`, `hasRole()`    |
| Fetch single     | `find` prefix             | `findById()`, `findBySlug()` |
| Fetch collection | `findAll` prefix          | `findAllByOrganization()`    |
| Create           | `create` prefix           | `createUser()`               |
| Update           | `update` prefix           | `updateProfile()`            |
| Delete           | `delete` prefix           | `deleteById()`               |

### Properties and Fields

```kotlin
// ✅ correct — camelCase, descriptive
val organizationId: UUID
val createdAt: OffsetDateTime
val isActive: Boolean

// ❌ avoid — too short, abbreviations, unclear
val oid: UUID
val dt: OffsetDateTime
val flag: Boolean
```

### Constants

```kotlin
// ✅ correct — SCREAMING_SNAKE_CASE in companion object
companion object {
    const val DEFAULT_SCHEMA = "user_schema"
    const val MAX_RETRY_COUNT = 3
}
```

### Packages

```
com.example.{module}.config
com.example.{module}.domain.model
com.example.{module}.domain.port
com.example.{module}.domain.service
com.example.{module}.infrastructure.api.adapter
com.example.{module}.infrastructure.api.dto
com.example.{module}.infrastructure.api.mapper
```

No cross-module imports between sub-modules — only the BFF wires them together.

---

## Method Size

**Convention: a method should do one thing. If you need to scroll to read it, it's too long.**

- **Target:** under 20 lines
- **Hard limit:** 40 lines — beyond this, extract into private methods or a collaborator class
- **Reactive chains:** each operator on its own line, grouped by concern

```kotlin
// ✅ correct — readable reactive chain
return userRepository.findById(id)
    .switchIfEmpty(Mono.error(UserNotFoundException(id)))
    .flatMap { user -> enrichWithOrganization(user) }
    .map { UserResponse.from(it) }
    .doOnSuccess { log.debug("User fetched: {}", it.id) }

// ❌ avoid — everything inlined, hard to read and test
return userRepository.findById(id).switchIfEmpty(Mono.error(UserNotFoundException(id))).flatMap { user -> organizationRepository.findById(user.organizationId).map { org -> UserResponse.from(user.copy(organization = org)) } }
```

---

## Error Handling

**Convention: use domain-specific exceptions, never return `null` from a service.**

```kotlin
// ✅ correct
fun findById(id: UUID): Mono<User> =
    userRepository.findById(id)
        .switchIfEmpty(Mono.error(UserNotFoundException(id)))

// ❌ avoid
fun findById(id: UUID): Mono<User> =
    userRepository.findById(id) // caller gets an empty Mono silently
```

Exception classes carry context:

```kotlin
class UserNotFoundException(id: UUID) : RuntimeException("User not found: $id")
```

### Error Response DTO

**Convention: all error responses use a single `ErrorDto`. Never return ad-hoc error shapes or plain strings.**

```kotlin
@JsonInclude(NON_NULL)
data class ErrorDto(
    var statusCode: Int,
    var statusName: String,
    var code: String,
    var title: String,
    var message: String,
)
```

Fields:

| Field | Type | Description |
|---|---|---|
| `statusCode` | `Int` | HTTP status code (e.g., `404`) |
| `statusName` | `String` | HTTP status reason phrase (e.g., `Not Found`) |
| `code` | `String` | Machine-readable error code in `SCREAMING_SNAKE_CASE` (e.g., `PROJECT_NOT_FOUND`) |
| `title` | `String` | Short human-readable title — **translated** via `Accept-Language` |
| `message` | `String` | Detailed human-readable explanation — **translated** via `Accept-Language` |

`@JsonInclude(NON_NULL)` allows any field to be omitted from the response when `null` — useful for partial error
responses, but in practice all fields must be populated.

#### i18n: title and message

`title` and `message` are resolved from Spring's `MessageSource` using the `Accept-Language` request header.
They must **never** be hardcoded strings in the exception handler.

Message bundle convention — key pattern: `error.{CODE}.title` / `error.{CODE}.message`:

```properties
# messages_en.properties
error.PROJECT_NOT_FOUND.title=Project not found
error.PROJECT_NOT_FOUND.message=The requested project does not exist or you do not have access to it.

error.ACCESS_DENIED.title=Access denied
error.ACCESS_DENIED.message=You do not have permission to perform this action.

error.SESSION_EXPIRED.title=Session expired
error.SESSION_EXPIRED.message=Your session has expired. Please log in again.

error.INTERNAL_ERROR.title=Internal server error
error.INTERNAL_ERROR.message=An unexpected error occurred. Please try again later.
```

```properties
# messages_fr.properties
error.PROJECT_NOT_FOUND.title=Projet introuvable
error.PROJECT_NOT_FOUND.message=Le projet demandé n'existe pas ou vous n'avez pas accès à celui-ci.

error.ACCESS_DENIED.title=Accès refusé
error.ACCESS_DENIED.message=Vous n'avez pas la permission d'effectuer cette action.

error.SESSION_EXPIRED.title=Session expirée
error.SESSION_EXPIRED.message=Votre session a expiré. Veuillez vous reconnecter.

error.INTERNAL_ERROR.title=Erreur interne
error.INTERNAL_ERROR.message=Une erreur inattendue s'est produite. Veuillez réessayer plus tard.
```

#### Global exception handler

Map domain exceptions to `ErrorDto` in a single `WebExceptionHandler`. Never catch and re-map exceptions in
individual handlers.

```kotlin
// ✅ correct — single mapping point, i18n-aware
@Component
@Order(-2)   // must run before DefaultErrorWebExceptionHandler (order -1)
class GlobalExceptionHandler(
    private val objectMapper: ObjectMapper,
    private val messageSource: MessageSource,
) : WebExceptionHandler {

    override fun handle(exchange: ServerWebExchange, ex: Throwable): Mono<Void> {
        val locale = exchange.localeContext.locale ?: Locale.getDefault()
        val (status, code) = ex.toStatusAndCode()
        val dto = ErrorDto(
            statusCode = status.value(),
            statusName = status.reasonPhrase,
            code = code,
            title = messageSource.getMessage("error.$code.title", null, locale),
            message = messageSource.getMessage("error.$code.message", null, locale),
        )
        val response = exchange.response
        response.statusCode = status
        response.headers.contentType = MediaType.APPLICATION_JSON
        return response.writeWith(
            Mono.just(response.bufferFactory().wrap(objectMapper.writeValueAsBytes(dto)))
        )
    }

    private fun Throwable.toStatusAndCode(): Pair<HttpStatus, String> = when (this) {
        is ProjectNotFoundException  -> HttpStatus.NOT_FOUND  to "PROJECT_NOT_FOUND"
        is AccessDeniedException     -> HttpStatus.FORBIDDEN   to "ACCESS_DENIED"
        is ValidationException       -> HttpStatus.BAD_REQUEST to "VALIDATION_ERROR"
        else                         -> HttpStatus.INTERNAL_SERVER_ERROR to "INTERNAL_ERROR"
    }
}

// ❌ avoid — error shape defined inline in a handler
@GetMapping("/projects/{id}")
suspend fun getProject(@PathVariable id: UUID): ResponseEntity<*> {
    return try {
        ResponseEntity.ok(corePort.findProject(id))
    } catch (ex: ProjectNotFoundException) {
        ResponseEntity.status(404).body(mapOf("error" to "not found"))  // ad-hoc shape, not i18n
    }
}
```

---

## Comments and KDoc

**Convention: code should be self-explanatory. Comments explain *why*, not *what*.**

```kotlin
// ✅ correct — explains a non-obvious decision
// R2DBC determines INSERT vs UPDATE by checking whether the id field is null.
// We generate the UUID here to ensure Spring issues an INSERT, not an UPDATE.
entity.id = UUID.randomUUID()

// ❌ avoid — restates the code
// Set the user id
entity.id = UUID.randomUUID()
```

KDoc is required for:

- All `public` methods in service classes
- All exception classes
- All configuration classes

---

## Logging

**Convention: use `log.debug` for flow, `log.warn` for recoverable issues, `log.error` for failures.**

```kotlin
// ✅ correct
log.debug("Fetching user by id: {}", id)
log.warn("User not found, returning empty: {}", id)
log.error("Failed to connect to database", ex)

// ❌ avoid
log.info("Fetching user")         // too vague
println("user: $user")            // never in production code
```

Never log sensitive data (passwords, tokens, personal information).

---

## Forbidden Patterns

| Pattern                        | Why                                      | Alternative                    |
|--------------------------------|------------------------------------------|--------------------------------|
| `block()` in reactive code     | Blocks the event loop, kills performance | Compose with `flatMap` / `zip` |
| `@Autowired` on fields         | Makes testing harder, hides dependencies | Constructor injection          |
| `@Primary` on datasource beans | Conflicts in multi-module context        | `@Qualifier` explicitly        |
| `!!` (non-null assertion)      | Throws unchecked `NullPointerException`  | `?: throw DomainException(…)`  |
| Raw `Exception` catch          | Swallows context, hard to debug          | Catch specific exception types |
| `println` / `System.out`       | Not configurable, not structured         | SLF4J logger                   |
