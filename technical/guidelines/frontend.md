# Frontend Conventions

Stack: **Nuxt** structured with **Nuxt Layers** (see [ADR 006](/technical/adr/006-nuxt-layers)).

---

## Layer Structure

**Convention: one layer per domain, mirroring the backend module structure.**

```
app/                        # APP Layer — entry point
├── app.vue
├── layouts/
├── middleware/             # auth guard
└── nuxt.config.ts          # composes all layers

layer-core/                 # Project Core Layer
├── components/
├── composables/
├── pages/
└── nuxt.config.ts

layer-operation/            # Operation Layer
layer-registration/         # Registration Layer
```

**Rules:**

- Each layer owns its pages, components, composables, and API calls to the BFF
- No cross-layer imports — a layer never imports from another domain layer
- Cross-cutting concerns (auth, layout, i18n, shared UI primitives) belong to the APP layer
- The frontend never communicates directly with Keycloak — authentication is handled entirely by the BFF

---

## File and Folder Naming

| Type             | Convention                        | Example                         |
|------------------|-----------------------------------|---------------------------------|
| Component        | PascalCase                        | `ParticipantCard.vue`           |
| Page             | kebab-case                        | `participant-detail.vue`        |
| Composable       | camelCase, `use` prefix           | `useParticipant.ts`             |
| API module       | kebab-case                        | `participant-api.ts`            |
| Store (Pinia)    | camelCase, `use` prefix + `Store` | `useParticipantStore.ts`        |
| Type / Interface | PascalCase                        | `Participant.ts`, `GroupDto.ts` |
| Utils            | camelCase                         | `formatDate.ts`                 |

---

## Component Naming

**Convention: PascalCase, domain-prefixed for domain-specific components.**

```
// ✅ correct — clear domain ownership
ParticipantCard.vue
GroupListItem.vue
RegistrationPeriodForm.vue

// shared / generic components in APP layer — no prefix
BaseButton.vue
BaseModal.vue
DataTable.vue

// ❌ avoid — too generic, ambiguous across layers
Card.vue
Form.vue
List.vue
```

---

## Composables

**Convention: `use` prefix, one concern per composable, typed return.**

```ts
// ✅ correct
export function useParticipant(id: Ref<string>) {
	const participant = ref<Participant | null>(null)
	const isLoading = ref(false)
	const error = ref<Error | null>(null)

	async function fetch() {
		isLoading.value = true
		try {
			participant.value = await participantApi.findById(id.value)
		} catch (e) {
			error.value = e as Error
		} finally {
			isLoading.value = false
		}
	}

	return { participant, isLoading, error, fetch }
}

// ❌ avoid — mixing multiple concerns in one composable
export function useParticipantAndGroupAndActivity() { ... }
```

---

## API Calls

**Convention: API calls are isolated in dedicated `*-api.ts` files per layer, never inline in components.**

```ts
// layer-core/api/participant-api.ts
export const participantApi = {
	findById: (id: string): Promise<Participant> =>
		$fetch(`/api/participants/${id}`),

	findAll: (groupId: string): Promise<Participant[]> =>
		$fetch(`/api/groups/${groupId}/participants`),

	create: (payload: CreateParticipantRequest): Promise<Participant> =>
		$fetch('/api/participants', { method: 'POST', body: payload }),
}
```

```vue
<!-- ✅ correct — component delegates to composable -->
<script setup lang="ts">
  const { participant, isLoading } = useParticipant(id)
</script>

<!-- ❌ avoid — API call inline in component -->
<script setup lang="ts">
  const participant = await $fetch(`/api/participants/${id}`)
</script>
```

---

## TypeScript

**Convention: strict typing, no `any`.**

```ts
// ✅ correct
interface Participant {
	id: string
	firstName: string
	lastName: string
	groupId: string
}

function formatName(participant: Participant): string {
	return `${participant.firstName} ${participant.lastName}`
}

// ❌ avoid
function formatName(participant: any): any { ... }
```

**Rules:**

- All props, emits, composable returns, and API responses must be typed
- Prefer `interface` over `type` for object shapes
- Use `string` for UUIDs — do not create a custom UUID type alias
- Never use `as any` to silence TypeScript errors — fix the type instead

---

## Props and Emits

**Convention: always typed with `defineProps` and `defineEmits`, no optional props without defaults.**

```vue

<script setup lang="ts">
  // ✅ correct
  const props = defineProps<{
    participantId: string
    isEditable?: boolean
  }>()

  withDefaults(defineProps<{ isEditable?: boolean }>(), {
    isEditable: false,
  })

  const emit = defineEmits<{
    saved: [ participant: Participant ]
    cancelled: []
  }>()

  // ❌ avoid — untyped props
  defineProps([ 'participantId', 'isEditable' ])
</script>
```

---

## State Management

**Convention: prefer composables for local/server state, Pinia only for truly global shared state.**

| Use case                                  | Solution                |
|-------------------------------------------|-------------------------|
| Server data fetched for a page            | Composable + `$fetch`   |
| Form state local to a component           | `ref` / `reactive`      |
| State shared across multiple pages/layers | Pinia store             |
| Auth state (current user, roles)          | Pinia store (APP layer) |

Do not create a Pinia store for every entity by default — start with a composable and promote to a store only when
sharing is needed.

---

## i18n

**Convention: flat namespaced keys in snake_case, translations managed via Weblate.**

```ts
// ✅ correct
t('participant.form.first_name_label')
t('common.action.save')
t('error.not_found')

// ❌ avoid
t('participantFormFirstNameLabel')  // no namespace, hard to organise
t('Prénom')                         // hardcoded string, not a key
```

**Rules:**

- Each layer owns its translation keys under its namespace (e.g. `participant.*`, `operation.*`)
- Shared keys live under `common.*` in the APP layer
- Never hardcode user-facing strings — always go through `t()`
- Translations are pulled from Weblate, never edited directly in the repo JSON files

---

## Forbidden Patterns

| Pattern                                       | Why                                       | Alternative                        |
|-----------------------------------------------|-------------------------------------------|------------------------------------|
| Direct Keycloak calls from frontend           | Auth is delegated to BFF                  | Use BFF auth endpoints             |
| Cross-layer component imports                 | Breaks domain boundaries                  | Move shared component to APP layer |
| Inline `$fetch` in component `<script setup>` | Mixes UI and data concerns                | Composable + API module            |
| `any` type                                    | Defeats TypeScript safety                 | Proper interface or type           |
| Hardcoded user-facing strings                 | Not translatable                          | `t()` with Weblate key             |
| Pinia store for every entity                  | Unnecessary global state, memory overhead | Composable first                   |
| `console.log` in committed code               | Not structured, leaks in production       | Remove before commit               |
