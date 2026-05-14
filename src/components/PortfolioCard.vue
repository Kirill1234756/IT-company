<template>
  <div
    @click="handleClick"
    class="group cursor-pointer overflow-hidden h-[19rem]  flex flex-col transition-all duration-300 rounded-[2.5rem] hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] relative"
  >
    <!-- Прямая ссылка на проект -->
    <a
      :href="projectUrl"
      @click.stop
      class="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
      :title="`Прямая ссылка на ${title}`"
    >
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        ></path>
      </svg>
    </a>
    <!-- Project Image/Preview -->
    <div class="flex rounded-[3rem] flex-1 m-1.5 duration-300" style="aspect-ratio: 16/9">
      <OptimizedImage
        :src="image || '/img/placeholder.webp'"
        :alt="title"
        :width="400"
        :height="300"
        :widths="[300, 600, 900, 1200]"
        format="webp"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-[2.5rem]"
        style="box-sizing: border-box; display: block; transform: translateZ(0)"
        :sizes="{ mobile: '100vw', tablet: '50vw', desktop: '33vw' }"
      />
    </div>

    <!-- Project Info -->
    <div
      class="px-3 py-2.5 flex flex-col items-center flex-shrink-0 transition-colors duration-300 rounded-b-[2.5rem]"
    >
      <h3
        class="text-base sm:text-lg font-semibold text-white mb-0.5 line-clamp-1 transition-transform duration-300 group-hover:scale-105 font-display"
      >
        {{ title }}
      </h3>
      <p
        class="text-white/70 group-hover:text-white/90 text-sm line-clamp-2 transition-transform duration-300 group-hover:scale-105 font-sans"
      >
        {{ category }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'
// @ts-expect-error Vue SFC default export typing
import OptimizedImage from './OptimizedImage.vue'

const props = defineProps<{
  id: number
  title: string
  category: string
  description?: string
  bgColor?: string
  logoColor?: string
  logoText?: string
  technologies?: string[]
  link?: string
  image?: string
  year?: string
  status?: string
}>()

const emit = defineEmits<{
  click: [project: typeof props]
}>()

// Используем функцию из store для создания slug
const portfolioStore = usePortfolioStore()
const { getProjectSlug } = portfolioStore

const projectUrl = computed(() => {
  const slug = getProjectSlug(props.title)
  return `/cases/${slug}`
})

const handleClick = () => {
  emit('click', props)
}
</script>
