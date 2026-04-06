<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useYandexMetrika } from '../../composables/useYandexMetrika'

const CasesPage = defineAsyncComponent(() => import('../../pages/CasesPage.vue'))
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))

const route = useRoute()
const { trackCtaClick } = useYandexMetrika()

// Определяем, находимся ли мы на главной странице
const isOnHomePage = computed(() => {
  if (typeof window === 'undefined') return false
  return route.path === '/' || route.path === '/home'
})

const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
// Отключаем lazy loading для правильной работы анимации наслаивания
// Контент загружается сразу, чтобы GSAP мог правильно настроить анимацию
const isVisible = ref(true)
const hasLoaded = ref(true)

// Обработчики wheel удалены - используем чистый CSS scroll-snap
// .internal-scroll-container имеет overflow: hidden, поэтому скролл происходит только на уровне страницы
onMounted(() => {
  // Инициализация компонента
})
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar h-screen bg-bg flex flex-col items-center justify-start rounded-t-3xl py-[2rem]"
    style="min-height: 800px; box-sizing: border-box; contain: layout style paint"
  >
    <div
      class="internal-scroll-container w-full h-full"
      ref="scrollContainerRef"
    >
      <Suspense>
        <template #default>
          <CasesPage :use-swiper="isOnHomePage" />
        </template>
        <template #fallback>
          <div
            class="flex flex-col items-center justify-center w-full h-full text-center text-white/60"
          >
            <p class="text-xl font-semibold mb-4">Загружаем портфолио...</p>
           
          </div>
        </template>
      </Suspense>
      <!-- CTA-кнопка снизу блока портфолио на главной странице -->
      <div
        v-if="isOnHomePage"
        class="flex justify-center items-center w-full mt-6 md:mt-10 pb-4"
      >
        <CtaButton to="/cases" bgClass="bg-accent" textClass="text-bg" @click="trackCtaClick('cta_portfolio_cases', { location: 'portfolio_section' })">
          Все кейсы
        </CtaButton>
      </div>
    </div>
  </section>
</template>

<style scoped></style>






