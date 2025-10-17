<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
// router not needed in this page after section extraction
// intersection observers moved into section components
// keep only defineAsyncComponent
import { useStackScroll } from '../composables/useStackScroll'
// moved into dedicated section component
const WhatWeDoSection = defineAsyncComponent(
  () => import('../components/sections/WhatWeDoSection.vue')
)
const PortfolioSection = defineAsyncComponent(
  () => import('../components/sections/PortfolioSection.vue')
)
const AdvantagesSection = defineAsyncComponent(
  () => import('../components/sections/AdvantagesSection.vue')
)
const AboutSection = defineAsyncComponent(() => import('../components/sections/AboutSection.vue'))
const BlogWrapperSection = defineAsyncComponent(
  () => import('../components/sections/BlogWrapperSection.vue')
)
const ContactSection = defineAsyncComponent(
  () => import('../components/sections/ContactSection.vue')
)

const stackRoot = ref<HTMLElement | null>(null)

// No DOM queries here; each section encapsulates its own logic and effects

// Router
// const router = useRouter()

// Navigation helpers moved into WhatWeDoSection

// blog navigation handled inside BlogWrapperSection

// Handle service card click (kept for potential future use)
// const handleServiceClick = (service: any) => {
//   router.push(`/services/${service.id}`)
// }

// Stats data for about us section (memoized)
// stats moved into AboutSection

// Our Advantages data (memoized)
type Advantage = { title: string; description: string }
const advantages = computed<Advantage[]>(() => [
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
])

// What We Do cards data moved into WhatWeDoSection

// (portfolio moved to CasesPage via PortfolioSection)

// intersection/lazy logic moved into corresponding section components

useStackScroll(stackRoot, { snap: true })

// cleanup handled in useStackScroll

// Form data for contact section
// contact form lives in ContactSection

// contact form moved into ContactSection
</script>

<template>
  <div id="stack" class="relative" ref="stackRoot">
    <section
      class="stack-section no-scrollbar h-screen flex items-center justify-center rounded-t-3xl py-[5rem]"
    >
      <h1 class="title text-5xl md:text-7xl font-black tracking-tight">Main</h1>
    </section>

    <!-- what we do -->
    <WhatWeDoSection />

    <!-- portfolio -->
    <PortfolioSection />

    <!-- Our Advantages -->
    <AdvantagesSection :advantages="advantages" />

    <!-- about us -->
    <AboutSection />

    <!-- blog -->
    <BlogWrapperSection />

    <!-- contact -->
    <ContactSection />
  </div>

  <!-- Project Modal -->
  <PortfolioModal :showModal="showModal" :selectedProject="selectedProject" @close="closeModal" />
</template>
