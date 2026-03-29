import DefaultTheme from 'vitepress/theme'
import MermaidChart from './MermaidChart.vue'
import type { Theme } from 'vitepress'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('MermaidChart', MermaidChart)
  },
} satisfies Theme
