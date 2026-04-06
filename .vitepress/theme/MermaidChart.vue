<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const props = defineProps<{ code: string }>()

const MIN_ZOOM = 0.5
const INITIAL_ZOOM = 1.2
const MAX_ZOOM = 5
const ZOOM_STEP = 0.2

const diagramHtml = ref('')
const zoomLevel = ref(INITIAL_ZOOM)
const dialogEl = ref<HTMLDialogElement>()

const clampZoom = (value: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))

const renderDiagram = async (): Promise<void> => {
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: 'default' })

  const id = `mermaid-${Math.random().toString(36).slice(2)}`
  const decoded = atob(props.code)
  const { svg } = await mermaid.render(id, decoded)
  diagramHtml.value = svg
}

const openDialog = (): void => {
  zoomLevel.value = INITIAL_ZOOM
  dialogEl.value?.showModal()
}

const closeDialog = (): void => {
  dialogEl.value?.close()
}

const zoomIn = (): void => {
  zoomLevel.value = clampZoom(zoomLevel.value + ZOOM_STEP)
}

const zoomOut = (): void => {
  zoomLevel.value = clampZoom(zoomLevel.value - ZOOM_STEP)
}

const resetZoom = (): void => {
  zoomLevel.value = INITIAL_ZOOM
}

const onDialogClick = (event: MouseEvent): void => {
  if (event.target === dialogEl.value) {
    closeDialog()
  }
}

const onDialogWheel = (event: WheelEvent): void => {
  if (!event.ctrlKey && !event.metaKey) {
    return
  }

  event.preventDefault()
  const direction = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
  zoomLevel.value = clampZoom(zoomLevel.value + direction)
}

onMounted(async () => {
  await renderDiagram()
})
</script>

<template>
  <div class="mermaid-diagram-wrapper">
    <button
      aria-label="Open Mermaid diagram in dialog"
      class="mermaid-diagram-trigger"
      type="button"
      @click="openDialog"
    >
      <span class="mermaid-diagram" v-html="diagramHtml" />
    </button>

    <dialog ref="dialogEl" class="mermaid-dialog" @click="onDialogClick">
      <div class="mermaid-dialog__panel">
        <div class="mermaid-dialog__actions">
          <button aria-label="Zoom out" class="mermaid-action" type="button" @click="zoomOut">
            <svg aria-hidden="true" class="mermaid-action__icon" viewBox="0 0 24 24">
              <path d="M5 12h14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
            </svg>
          </button>
          <button aria-label="Zoom in" class="mermaid-action" type="button" @click="zoomIn">
            <svg aria-hidden="true" class="mermaid-action__icon" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
            </svg>
          </button>
          <button aria-label="Reset zoom" class="mermaid-action" type="button" @click="resetZoom">
            <svg aria-hidden="true" class="mermaid-action__icon" viewBox="0 0 24 24">
              <path d="M20 11a8 8 0 1 0 1 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
              <path d="M20 4v7h-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
          <button aria-label="Close dialog" class="mermaid-action" type="button" @click="closeDialog">
            <svg aria-hidden="true" class="mermaid-action__icon" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
            </svg>
          </button>
        </div>

        <div class="mermaid-dialog__body" @wheel="onDialogWheel">
          <div
              :style="{ transform: `scale(${zoomLevel})` }"
              class="mermaid-dialog__diagram"
              v-html="diagramHtml"
          />
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.mermaid-diagram-wrapper {
  width: 100%;
}

.mermaid-diagram-trigger {
  width: 100%;
  background: transparent;
  border: 0;
  padding: 0;
  text-align: left;
  cursor: zoom-in;
}

.mermaid-diagram {
  width: 100%;
  overflow-x: auto;
}

.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-dialog {
  width: min(95vw, 1400px);
  height: min(90vh, 900px);
  border: 0;
  border-radius: 12px;
  padding: 0;
}

.mermaid-dialog::backdrop {
  background: rgba(0, 0, 0, 0.55);
}

.mermaid-dialog__panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vp-c-bg);
}

.mermaid-dialog__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.mermaid-action {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mermaid-action__icon {
  width: 18px;
  height: 18px;
}

.mermaid-dialog__body {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.mermaid-dialog__diagram {
  transform-origin: top left;
  width: max-content;
}
</style>
