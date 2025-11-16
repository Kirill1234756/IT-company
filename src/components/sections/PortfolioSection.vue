<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const CasesPage = defineAsyncComponent(() => import('../../pages/CasesPage.vue'))

const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const hasLoaded = ref(false)

const { stop } = useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry && entry.isIntersecting) {
      isVisible.value = true
      hasLoaded.value = true
      stop()
    }
  },
  { rootMargin: '200px' }
)

onMounted(() => {
  // Загружаем секцию немедленно, если пользователь пришёл по якорю
  if (typeof window !== 'undefined') {
    const hash = window.location.hash
    if (hash === '#cases' || hash === '#portfolio') {
      isVisible.value = true
      hasLoaded.value = true
      stop()
    }
  }
})
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar h-screen bg-bg flex flex-col items-center justify-start rounded-t-3xl py-[5rem]"
    style="min-height: 800px; box-sizing: border-box; contain: layout style paint"
  >
    <Suspense>
      <template #default>
        <CasesPage v-if="hasLoaded && isVisible" />
      </template>
      <template #fallback>
        <div
          class="flex flex-col items-center justify-center w-full h-full text-center text-white/60"
        >
          <p class="text-xl font-semibold mb-4">Загружаем портфолио...</p>
          <p class="text-sm max-w-md">
            Раздел появится, как только вы прокрутите страницу — это помогает ускорить начальную
            загрузку сайта.
          </p>
        </div>
      </template>
    </Suspense>
  </section>
</template>

<style scoped></style>






