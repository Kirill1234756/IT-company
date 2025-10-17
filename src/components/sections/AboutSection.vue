<script setup lang="ts">
import { computed } from 'vue'

type StatItem = { value: number; label: string; sublabel?: string }
const stats = computed<StatItem[]>(() => [
  { value: 13, label: 'лет', sublabel: 'на рынке' },
  { value: 400, label: 'проектов', sublabel: 'реализованных' },
  { value: 25, label: 'человек', sublabel: 'в команде' },
  { value: 10, label: 'ТОП', sublabel: 'по Tagline' },
])
</script>

<template>
  <section
    id="stats-section"
    class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[12rem] md:px-[6rem] px-[1rem] overflow-y-auto"
  >
    <h2
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100"
    >
      О нас
    </h2>

    <div class="max-w-6xl w-full">
      <div class="text-center mb-12">
        <h3 class="text-sm tracking-widest font-semibold text-[var(--color-accent)] mb-8">
          КЛЮЧЕВЫЕ ЦИФРЫ
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        <div
          v-for="(s, i) in stats"
          :key="i"
          class="stats-card group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-[var(--color-accent)]/10"
        >
          <div class="text-center">
            <div
              class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-white mb-3"
            >
              <span data-counter data-plus :data-target="s.value">0</span>
            </div>
            <div class="text-lg md:text-xl font-semibold text-white mb-1">{{ s.label }}</div>
            <div v-if="s.sublabel" class="text-white/70 text-sm">{{ s.sublabel }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>


