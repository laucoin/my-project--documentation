<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ code: string }>()
const el = ref<HTMLElement>()

onMounted(async () => {
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: 'default' })

  const id = `mermaid-${Math.random().toString(36).slice(2)}`
  const decoded = atob(props.code)
  const { svg } = await mermaid.render(id, decoded)
  el.value!.innerHTML = svg
})
</script>

<template>
  <div ref="el" class="mermaid-diagram" />
</template>
