<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { useYandexMetrika } from '../../composables/useYandexMetrika'

const WhatWeDoCard = defineAsyncComponent(() => import('../WhatWeDoCard.vue'))

const router = useRouter()
const { trackCtaClick } = useYandexMetrika()

const whatWeDoCards = [
  {
    title: 'Стратегия',
    description:
      'Мы поможем создать бизнес‑план, разработать стратегию развития продукта и воплотить цели в реальность.',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23L11 13V7z',
    wrapperClass: 'md:col-span-6 ',
  },
  {
    title: 'Рост',
    description:
      'Мы проведём исследование и анализ вашего цифрового продукта, обновим веб‑ресурсы и скорректируем маркетинговую стратегию для повышения эффективности вашего бизнеса.',
    icon: 'M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z',
    wrapperClass: 'md:col-span-6 ',
  },
  {
    title: 'Разработка',
    description:
      'Мы создадим привлекательные веб‑сайты или эффективные веб‑приложения, поможем автоматизировать бизнес‑процессы и интегрируемся с другими информационными системами для улучшения общей функциональности.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    wrapperClass: 'md:col-span-8 md:py-[2rem]',
  },
]

const handleCardClick = (cardTitle: string) => {
  switch (cardTitle) {
    case 'Стратегия':
      router.push('/services/strategy-positioning')
      break
    case 'Рост':
      router.push('/services/analytics-research')
      break
    case 'Разработка':
      router.push('/services/development-launch')
      break
    default:
      router.push('/services')
  }
}

// Lazy mount internal content when in view
const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const visible = ref(true) // Changed to true for immediate display

// Removed console.log for production performance

useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry && entry.isIntersecting) visible.value = true
  },
  { rootMargin: '200px' }
)

// Обработчики wheel удалены - используем чистый CSS scroll-snap
// .internal-scroll-container имеет overflow: hidden, поэтому скролл происходит только на уровне страницы
onMounted(() => {
  // Инициализация компонента
})
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar bg-text h-screen flex flex-col items-center justify-start rounded-t-3xl lg:px-[15rem] md:px-[6rem] px-[1rem] py-[1rem]"
    style="box-sizing: border-box; contain: layout style paint"
  >
    <div
      class="internal-scroll-container w-full h-full"
      ref="scrollContainerRef"
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
        Что мы делаем
      </SectionHeading>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 max-w-6xl w-full mx-auto mb-8">
        <template v-if="visible">
          <WhatWeDoCard
            v-for="(card, index) in whatWeDoCards"
            :key="card.title"
            :style="{ animationDelay: (500 + index * 150) + 'ms' }"
            class="animate-section-card-inline-delay"
            :title="card.title"
            :description="card.description"
            :iconPath="card.icon"
            :wrapperClass="card.wrapperClass"
            @click="handleCardClick(card.title)"
          />

          <div
            class="animate-section-cta delay-950 wwd-cta group rounded-[3rem] p-6 sm:p-4 flex flex-col justify-center items-center text-center cursor-pointer text-white w-full md:col-span-4 bg-[var(--color-purple)] hover:bg-[var(--color-accent)] transition-colors border border-[color-mix(in_oklab,var(--color-border)_40%,transparent)] hover:border-[var(--color-accent)] hover:ring-2 hover:ring-[var(--color-accent)]"
            @click="router.push('/services')"
            role="button"
            tabindex="0"
            aria-label="Перейти к услугам"
            @keydown.enter="router.push('/services')"
            @keydown.space.prevent="router.push('/services')"
          >
            <h3
              class="text-base text-[0.8rem] md:text-sm px-2 sm:px-2 font-bold transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:text-white"
            >
              Мы предлагаем полный спектр готовых цифровых решений для вашего бизнеса
            </h3>
          </div>
        </template>
        <div v-else class="text-center text-white col-span-12">
          Loading WhatWeDo cards... visible={{ visible }}
        </div>
      </div>

      <div class="flex justify-center">
        <div class="animate-section-cta delay-1250">
          <CtaButton to="/services" @click="trackCtaClick('cta_whatwedo_services', { location: 'what_we_do_section' })">Узнать больше</CtaButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Плавные переходы для интерактивных элементов */
.wwd-card:hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wwd-cta:hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>






