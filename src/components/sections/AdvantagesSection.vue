<script setup lang="ts">
import { defineProps } from 'vue'
import { defineAsyncComponent } from 'vue'

const AdvantageCard = defineAsyncComponent(() => import('../AdvantageCard.vue'))

const props = defineProps<{
  advantages: { title: string; description: string }[]
}>()
</script>

<template>
  <section
    id="advantages"
    class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] overflow-y-auto"
  >
    <h2
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100 text-center"
    >
      Наши преимущества
    </h2>

    <div class="w-full grid grid-cols-1 md:grid-cols-2 items-stretch">
      <AdvantageCard
        v-for="(a, i) in props.advantages"
        :key="a.title + i"
        :title="a.title"
        :description="a.description"
        :index="i"
        :isCentral="i === 2 || i === 3"
        class="adv-card"
      />
    </div>

    <div class="mt-8 flex justify-center">
      <button
        class="mt-6 text-[0.8rem] md:text-sm bg-gray-800 text-white py-3 px-[5rem] rounded-[3rem] font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 hover:ring-[var(--color-accent)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        Связаться с нам
      </button>
    </div>
  </section>
</template>

<style scoped></style>


