# Coding Style

## Naming Conventions

### Classes

| Type                 | Convention                                              | Example                 |
|----------------------|---------------------------------------------------------|-------------------------|
| Entity               | PascalCase, singular                                    | `User`, `Organization`  |
| Repository           | `{Entity}Repository`                                    | `UserRepository`        |
| Service              | `{Entity}Service`                                       | `UserService`           |
| Controller / Handler | `{Entity}Handler`                                       | `UserHandler`           |
| Config               | `{Module}Config` or `{Module}DatabaseConfig`            | `UserDatabaseConfig`    |
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

### Variables and Fields

```java
// ✅ correct — camelCase, descriptive
private UUID organizationId;
private OffsetDateTime createdAt;
private boolean isActive;

// ❌ avoid — too short, abbreviations, unclear
private UUID oid;
private OffsetDateTime dt;
private boolean flag;
```

### Constants

```java
// ✅ correct — SCREAMING_SNAKE_CASE
public static final String DEFAULT_SCHEMA = "user_schema";
public static final int MAX_RETRY_COUNT = 3;
```

### Packages

```
com.example.{module}.config
com.example.{module}.entity
com.example.{module}.repository
com.example.{module}.service
com.example.{module}.dto
com.example.{module}.exception
```

No cross-module imports between sub-modules — only the BFF wires them together.

---

## Method Size

**Convention: a method should do one thing. If you need to scroll to read it, it's too long.**

- **Target:** under 20 lines
- **Hard limit:** 40 lines — beyond this, extract into private methods or a collaborator class
- **Reactive chains:** each operator on its own line, grouped by concern

```java
// ✅ correct — readable reactive chain
return userRepository.findById(id)
    .

switchIfEmpty(Mono.error(new UserNotFoundException(id)))
        .

flatMap(user ->

enrichWithOrganization(user))
        .

map(UserResponse::from)
    .

doOnSuccess(u ->log.

debug("User fetched: {}",u.id()));

// ❌ avoid — everything inlined, hard to read and test
        return userRepository.

findById(id).

switchIfEmpty(Mono.error(new UserNotFoundException(id))).

flatMap(user ->organizationRepository.

findById(user.getOrganizationId()).

map(org ->{user.

setOrganization(org); return UserResponse.

from(user); }));
```

---

## Error Handling

**Convention: use domain-specific exceptions, never return `null` from a service.**

```java
// ✅ correct
public Mono<User> findById(UUID id) {
    return userRepository.findById(id)
            .switchIfEmpty(Mono.error(new UserNotFoundException(id)));
}

// ❌ avoid
public Mono<User> findById(UUID id) {
    return userRepository.findById(id); // caller gets empty Mono silently
}
```

Exception classes carry context:

```java
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(UUID id) {
        super("User not found: " + id);
    }
}
```

---

## Comments and Javadoc

**Convention: code should be self-explanatory. Comments explain *why*, not *what*.**

```java
// ✅ correct — explains a non-obvious decision
// R2DBC determines INSERT vs UPDATE by checking id == null.
// We generate the UUID here to ensure Spring issues an INSERT.
entity.setId(UUID.randomUUID());

// ❌ avoid — restates the code
// Set the user id
        entity.

setId(UUID.randomUUID());
```

Javadoc is required for:

- All `public` methods in service classes
- All exception classes
- All configuration classes

---

## Logging

**Convention: use `log.debug` for flow, `log.warn` for recoverable issues, `log.error` for failures.**

```java
// ✅ correct
log.debug("Fetching user by id: {}",id);
log.

warn("User not found, returning empty: {}",id);
log.

error("Failed to connect to database",ex);

// ❌ avoid
log.

info("Fetching user");           // too vague
System.out.

println("user: "+user); // never in production code
```

Never log sensitive data (passwords, tokens, personal information).

---

## Forbidden Patterns

| Pattern                        | Why                                      | Alternative                    |
|--------------------------------|------------------------------------------|--------------------------------|
| `block()` in reactive code     | Blocks the event loop, kills performance | Compose with `flatMap` / `zip` |
| `@Autowired` on fields         | Makes testing harder, hides dependencies | Constructor injection          |
| `@Primary` on datasource beans | Conflicts in multi-module context        | `@Qualifier` explicitly        |
| `Optional.get()` without check | Throws unchecked exception               | `orElseThrow()`                |
| Raw `Exception` catch          | Swallows context, hard to debug          | Catch specific exception types |
| `System.out.println`           | Not configurable, not structured         | SLF4J logger                   |
