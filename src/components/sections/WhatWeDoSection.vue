<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'

const WhatWeDoCard = defineAsyncComponent(() => import('../WhatWeDoCard.vue'))
const WhatWeDoCta = defineAsyncComponent(() => import('../WhatWeDoCta.vue'))

const router = useRouter()

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
      router.push('/services/strategy')
      break
    case 'Рост':
      router.push('/services/growth')
      break
    case 'Разработка':
      router.push('/services/development')
      break
    default:
      router.push('/services')
  }
}

// Lazy mount internal content when in view
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
    class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[12rem] md:px-[6rem] px-[1rem] overflow-y-auto"
  >
    <h2
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100"
    >
      Что мы делаем
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl w-full mb-8">
      <template v-if="visible">
        <WhatWeDoCard
          v-for="card in whatWeDoCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :iconPath="card.icon"
          :wrapperClass="card.wrapperClass"
          @click="handleCardClick(card.title)"
        />
        <WhatWeDoCta
          text="Мы предлагаем полный спектр готовых цифровых решений для вашего бизнеса"
          @click="router.push('/services')"
        />
      </template>
    </div>

    <button
      class="mt-6 text-[0.8rem] md:text-sm bg-gray-800 text-white py-3 px-[5rem] rounded-[3rem] font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 hover:ring-[var(--color-accent)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      @click="router.push('/services')"
    >
      Узнать больше
    </button>
  </section>
</template>

<style scoped></style>


