<script setup lang="ts">
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const CasesPage = defineAsyncComponent(() => import('../../pages/CasesPage.vue'))

const rootEl = ref<HTMLElement | null>(null)
const visible = ref(false)
useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry.isIntersecting) visible.value = true
  },
  { rootMargin: '200px' }
)
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar bg-gradient-to-br bg-[var(--color-purple))] h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
  >
    <CasesPage v-if="visible" />
  </section>
</template>

<style scoped></style>


