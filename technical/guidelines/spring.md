# Spring & Kotlin Conventions

> The backend stack is **Kotlin** throughout — Spring Boot WebFlux, R2DBC, and jOOQ with the R2DBC dialect.
> Code examples in this file are in Kotlin. Java interop is acceptable in configuration classes only.

---

## Hexagonal Architecture

**Convention: each module follows a strict hexagonal layout. The BFF calls inbound ports only.**

```
module-{name}/
└── src/main/kotlin/.../
    ├── domain/
    │   ├── constant/
    │   │   └── …Const.kt         # domain constants
    │   ├── enumeration/
    │   │   └── …Enum.kt          # domain enums
    │   ├── exception/
    │   │   └── …Exception.kt     # domain exceptions
    │   ├── model/
    │   │   └── …Model.kt         # domain models (no Spring, no infra)
    │   ├── port/
    │   │   └── I…Port.kt         # inbound port interface — the only entry point from the BFF
    │   └── service/
    │       └── …ServiceImpl.kt   # domain logic — implements I…Port
    ├── infrastructure/
    │   └── api/
    │       ├── adapter/
    │       │   └── …Adapter.kt   # outbound adapter — jOOQ / R2DBC queries
    │       ├── mapper/
    │       │   └── …Mapper.kt    # maps between domain models and DTOs/records
    │       ├── dto/
    │       │   └── …Dto.kt       # data transfer objects (API in/out shapes)
    │       └── config/
    │           └── …Config.kt    # infrastructure config (datasource, flyway, etc.)
    ├── config/
    │   └── …Config.kt            # module-level Spring config (beans, properties)
    └── utils/
        └── …Util.kt              # stateless utility functions
```

Rules:

- The BFF only imports and calls types from `domain/port/`
- Domain classes (`domain/`) must not depend on Spring or infrastructure types — no `@Component`, no jOOQ DSL
- Port interfaces use the `I` prefix — `I…Port.kt`
- Adapters in `infrastructure/api/adapter/` are the only classes allowed to use jOOQ DSL or R2DBC directly
- The inbound port must be designed as if it could be backed by an HTTP client tomorrow (extraction-ready)
- No `@RestController` endpoints between modules — all inter-module communication goes through inbound ports

---

## Inbound Port (Service Interface)

**Convention: interface prefixed with `I`, one per module, in `domain/port/`. Returns reactive types.**

```kotlin
// ✅ correct — domain/port/ICorePort.kt
interface ICorePort {
	fun findProject(id: UUID): Mono<ProjectModel>
	fun findAllProjects(organisationId: UUID): Flux<ProjectModel>
	fun createProject(command: CreateProjectCommand): Mono<ProjectModel>
}

// ❌ avoid — Spring annotations or blocking return types leaking into the port
interface ICorePort {
	@Transactional                        // leaks Spring into the domain
	fun findProject(id: UUID): ProjectModel  // blocking — breaks the reactive contract
}
```

The BFF depends on the interface, never on the implementation:

```kotlin
// BFF handler — depends on the inbound port only
class ProjectHandler(private val corePort: ICorePort)
```

The implementation lives in `domain/service/`:

```kotlin
// domain/service/CoreServiceImpl.kt
@Service
class CoreServiceImpl(
	private val projectAdapter: ProjectAdapter,  // outbound dependency
): ICorePort {
	override fun findProject(id: UUID): Mono<ProjectModel> =
		projectAdapter.findById(id)
			.switchIfEmpty(Mono.error(ProjectNotFoundException(id)))
}
```

---

## Multi-Module Structure

**Convention: each module owns its database config, its migrations, and its R2DBC beans.**

```
module-{name}/
├── src/main/kotlin/.../
│   └── config/
│       └── {Name}DbConfig.kt   # DataSource + Flyway + ConnectionFactory
└── src/main/resources/
    └── db/migrations/
        └── V20260401_001__init_…s.sql
```

No module shares a database config class with another module. The BFF module only wires them together.

---

## Bean Naming with Multiple DataSources

**Convention: qualify all beans with the module name as prefix.**

```kotlin
// ✅ correct
@Bean("coreDataSource")
@Bean("coreFlyway")
@Bean("coreConnectionFactory")

// ❌ avoid — conflicts with other modules and Spring auto-config
@Bean
@Primary
fun dataSource(): DataSource {
	...
}
```

When injecting, always use `@Qualifier`:

```kotlin
class CoreRepositoryImpl(
	@Qualifier("coreDatabaseClient") private val db: DatabaseClient
)
```

---

## Auto-Configuration

**Convention: disable Spring Boot auto-configuration for DataSource, Flyway, and R2DBC in the BFF module.**

```kotlin
@SpringBootApplication(
	exclude = [
		org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration::class,
		org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration::class,
		org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration::class,
		org.springframework.boot.autoconfigure.r2dbc.R2dbcAutoConfiguration::class,
		org.springframework.boot.autoconfigure.r2dbc.R2dbcTransactionManagerAutoConfiguration::class,
	]
)
class BffApplication
```

**Rationale:** Spring Boot's auto-configuration expects a single primary `DataSource`.
With multiple modules each declaring their own, the context fails to start without explicit exclusions.

---

## Flyway / R2DBC Initialization Order

**Convention: always declare `@DependsOn("moduleNameFlyway")` on the `ConnectionFactory` bean.**

```kotlin
@Bean("coreConnectionFactory")
@DependsOn("coreFlyway")   // ← ensures schema exists before R2DBC connects
fun coreConnectionFactory(...): ConnectionFactory {
	...
}
```

**Rationale:** Without this, the application may attempt reactive queries on a schema that hasn't been migrated yet.

---

## Module Auto-Discovery

**Convention: expose each module's config via Spring Boot auto-configuration registration.**

```
# src/main/resources/META-INF/spring/
# org.springframework.boot.autoconfigure.AutoConfiguration.imports

com.example.core.config.CoreDatabaseConfig
```

This allows the BFF to pick up module configs automatically when the module JAR is on the classpath,
without requiring an explicit `@Import` in `BffApplication`.

---

## Entity Conventions

**Convention: use `@Table` explicitly, never rely on class-name inference across modules.**

```kotlin
// ✅ correct
@Table("core.projects")
data class ProjectEntity(
	@Id val id: UUID,
	val name: String,
	@CreatedDate val createdAt: OffsetDateTime,
	@LastModifiedDate val updatedAt: OffsetDateTime,
)

// ❌ avoid — inferred table name is fragile
data class ProjectEntity(@Id val id: UUID, ...)
```

**Auditing** must be enabled per module config:

```kotlin
@Configuration
@EnableR2dbcAuditing
class CoreDatabaseConfig
```

---

## jOOQ Query Conventions

The query builder is **jOOQ with the R2DBC dialect**. See the [Database Conventions](/technical/guidelines/database) for
schema rules.

**Convention: always use jOOQ generated types for type-safe queries. Never write raw SQL strings at runtime.**

```kotlin
// ✅ correct — type-safe, refactorable
dslContext
	.select(PROJECTS.ID, PROJECTS.NAME)
	.from(PROJECTS)
	.where(PROJECTS.ORGANISATION_ID.eq(organisationId))
	.asFlow()

// ❌ avoid — raw SQL, no compile-time safety
dslContext.fetch("SELECT id, name FROM core.projects WHERE organisation_id = $organisationId")
```

Rules:

- jOOQ classes are generated from the schema — run code generation after every migration
- Never hardcode schema names in jOOQ queries — generated types already embed the schema
- `asFlow()` / `awaitFirst()` / `awaitSingle()` are the Kotlin coroutine extensions to use with jOOQ R2DBC
- Keep queries in the `infrastructure/` layer — never call jOOQ DSL from the domain or inbound port layer

---

## Coroutines vs Reactor

**Convention: prefer Kotlin coroutines (`suspend`) at the BFF handler layer. Reactor types (`Mono`/`Flux`) at the
service interface layer.**

```kotlin
// ✅ BFF handler — coroutine-friendly with WebFlux
@GetMapping("/projects/{id}")
suspend fun getProject(@PathVariable id: UUID): ProjectResponse =
	coreService.findProject(id).awaitSingle().toResponse()

// ✅ Service interface — Reactor types for extraction-readiness
interface CoreService {
	fun findProject(id: UUID): Mono<Project>
	fun findAllProjects(orgId: UUID): Flux<Project>
}

// ❌ avoid mixing — blocking calls inside a reactive pipeline
coreService.findProject(id).map { project ->
	anotherService.findSomething().block()  // ← blocks the event loop
}
```

---

## Configuration Properties

**Convention: namespace properties by module under `modules.{name}`.**

```yaml
modules:
  core:
    datasource:
      url: jdbc:postgresql://localhost:5432/mydb
    r2dbc:
      url: r2dbc:postgresql://localhost:5432/mydb
  operation:
    datasource:
      url: jdbc:postgresql://localhost:5432/mydb
    r2dbc:
      url: r2dbc:postgresql://localhost:5432/mydb
```

Avoid flat properties like `spring.datasource.*` — these are reserved for single-datasource auto-configuration.

---

## Forbidden Patterns

| Pattern                                       | Why                               | Alternative                        |
|-----------------------------------------------|-----------------------------------|------------------------------------|
| Cross-module repository calls                 | Breaks domain isolation (ADR 001) | Call the module's inbound port     |
| BFF importing module implementation classes   | Couples BFF to internals          | Import inbound port interface only |
| `block()` in reactive code                    | Blocks the event loop             | `awaitSingle()` / `flatMap`        |
| `@Primary` on datasource beans                | Conflicts in multi-module context | `@Qualifier` explicitly            |
| Raw SQL strings in jOOQ queries               | No compile-time safety, fragile   | jOOQ generated types               |
| Spring annotations leaking into inbound ports | Couples port to framework         | Plain Kotlin interface             |
