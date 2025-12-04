<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const CasesPage = defineAsyncComponent(() => import('../../pages/CasesPage.vue'))

const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
// Отключаем lazy loading для правильной работы анимации наслаивания
// Контент загружается сразу, чтобы GSAP мог правильно настроить анимацию
const isVisible = ref(true)
const hasLoaded = ref(true)

// Настраиваем обработчик wheel для внутреннего скролла
onMounted(() => {
  const setupScrollHandler = () => {
    if (!scrollContainerRef.value) {
      setTimeout(setupScrollHandler, 100)
      return
    }

    const scrollContainer = scrollContainerRef.value
    if ((scrollContainer as any).__scrollHandler) return

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const threshold = 10
      const isAtTop = scrollTop <= threshold
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold

      if (e.deltaY > 0) {
        // Скроллим вниз
        if (!isAtBottom) {
          e.stopPropagation()
        }
      } else if (e.deltaY < 0) {
        // Скроллим вверх
        if (!isAtTop) {
          e.stopPropagation()
        }
      }
    }

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    ;(scrollContainer as any).__scrollHandler = handleWheel
  }

  // Ждем загрузки контейнера
  setTimeout(setupScrollHandler, 500)
  setTimeout(setupScrollHandler, 1500)
})
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar h-screen bg-bg flex flex-col items-center justify-start rounded-t-3xl py-[5rem]"
    style="min-height: 800px; box-sizing: border-box; contain: layout style paint"
  >
    <div
      class="internal-scroll-container w-full h-full overflow-y-auto overflow-x-hidden"
      ref="scrollContainerRef"
    >
      <Suspense>
      <template #default>
        <CasesPage />
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
    </div>
  </section>
</template>

<style scoped></style>






