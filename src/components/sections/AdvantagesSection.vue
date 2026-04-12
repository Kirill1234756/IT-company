<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import { useInViewOnce } from '../../composables/useInViewOnce'

const AdvantageCard = defineAsyncComponent(() => import('../AdvantageCard.vue'))
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))
const { trackCtaClick } = useYandexMetrika()
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))

const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const ctaRevealRef = ref<HTMLElement | null>(null)
const { isInView: ctaRevealed } = useInViewOnce(ctaRevealRef)
const isMobile = ref(false)

// Функция для обновления состояния мобильного устройства
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

// Our Advantages data
const advantages = [
  {
    title: 'Комплексный подход',
    description:
      'Мы можем взяться как за отдельные задачи, так и за весь проект целиком: от анализа рынка до разработки решений и продвижения «под ключ».',
  },
  {
    title: 'Бизнес‑задачи',
    description:
      'Все решения предлагаем исходя из целей вашего бизнеса — рост продаж, автоматизация, выстраивание коммуникаций с клиентами.',
  },
  {
    title: 'Каждый клиент важен',
    description:
      'Строим долгосрочные отношения: после разработки продолжаем работу над продвижением и аналитикой.',
  },
  {
    title: 'Высокая рабочая скорость',
    description:
      'Процессы внутри команды отлажены и гибко организованы — быстро включаемся в работу над проектом.',
  },
  {
    title: 'Выгодное предложение',
    description:
      'Вы не переплачиваете за бренд — получаете проект высокого уровня с оптимальным бюджетом.',
  },
  {
    title: 'Гибкая команда',
    description:
      'Небольшая команда адаптируется под процессы заказчика и оперативно принимает решения.',
  },
]

// Initialize component
onMounted(() => {
  // Инициализируем определение мобильного устройства
  updateIsMobile()

  // Отслеживаем изменения размера окна
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile)
  }

  // Обработчики wheel удалены - используем чистый CSS scroll-snap
  // .internal-scroll-container имеет overflow: hidden, поэтому скролл происходит только на уровне страницы
})

// Очистка обработчика при размонтировании
onUnmounted(() => {
  // Удаляем обработчик изменения размера окна
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }

  if (scrollContainerRef.value) {
    const scrollContainer = scrollContainerRef.value
    const containerWithHandler = scrollContainer as unknown as Record<string, unknown>
    const handler = containerWithHandler.__scrollHandler

    if (!isMobile.value && typeof handler === 'function') {
      // На десктопе удаляем wheel обработчик
      scrollContainer.removeEventListener('wheel', handler as (e: WheelEvent) => void, {
        capture: true,
      })
    }

    delete containerWithHandler.__scrollHandler
  }
})
</script>

<template>
  <section
    ref="rootEl"
    id="advantages"
    class="stack-section no-scrollbar bg-text h-screen flex flex-col items-center justify-start rounded-t-3xl py-[1rem]"
    style=" box-sizing: border-box; contain: layout style paint"
  >
    <!-- Внутренний скроллируемый контейнер для всех устройств -->
    <!-- Настроен так, чтобы не блокировать stack scroll на мобильных -->
    <div
      class="internal-scroll-container w-full h-full flex flex-col items-center"
      ref="scrollContainerRef"
      :class="{ 'mobile-advantages-container': isMobile }"
      style="padding-bottom: 0; margin-bottom: 0"
    >
      <SectionHeading
        :level="2"
        size="md"
        color="bg"
        align="center"
        weight="black"
        animation-class="animate-section-title"
        class="mb-8"
      >
        Наши преимущества
      </SectionHeading>

      <div class="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch">
        <AdvantageCard
          v-for="(a, i) in advantages"
          :key="a.title + i"
          :class="['animate-section-card', 'delay-' + Math.min(i, 5)]"
          :title="a.title"
          :description="a.description"
          :index="i"
          :isCentral="i === 2 || i === 3"
          class="adv-card"
        />
      </div>

      <div
        ref="ctaRevealRef"
        class="flex justify-center transition-all duration-500 ease-out"
        :class="ctaRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <div class="animate-section-cta delay-1220">
          <CtaButton to="/services" bgClass="bg-bg" @click="trackCtaClick('cta_advantages_services', { location: 'advantages_section' })">Узнать больше</CtaButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Плавные переходы для интерактивных элементов */
.adv-card:hover {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Убраны overscroll-behavior и touch-action из .internal-scroll-container */
/* События wheel теперь свободно всплывают до #stack для скролла */
</style>






