<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Removed console.log for production performance

const AdvantageCard = defineAsyncComponent(() => import('../AdvantageCard.vue'))
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))

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
</script>

<template>
  <section
    id="advantages"
    class="stack-section no-scrollbar bg-text h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] overflow-y-auto"
    style="min-height: 800px; box-sizing: border-box; contain: layout style paint"
  >
    <h2
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-bg opacity-100 text-center"
    >
      Наши преимущества
    </h2>

    <div class="w-full grid grid-cols-1 md:grid-cols-2 items-stretch">
      <AdvantageCard
        v-for="(a, i) in advantages"
        :key="a.title + i"
        :title="a.title"
        :description="a.description"
        :index="i"
        :isCentral="i === 2 || i === 3"
        class="adv-card"
      />
    </div>

    <div class="flex justify-center">
      <CtaButton to="/services" bgClass="bg-bg">Узнать больше</CtaButton>
    </div>
  </section>
</template>

<style scoped></style>






