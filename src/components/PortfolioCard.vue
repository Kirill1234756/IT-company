<template>
  <div
    @click="handleClick"
    class="group cursor-pointer overflow-hidden h-[24rem] flex flex-col transition-all duration-300 rounded-[3rem] hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
  >
    <!-- Project Image/Preview -->
    <div class="flex rounded-[3rem] flex-1 m-2 duration-300">
      <img
        :src="image || '/api/placeholder/400/300'"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[3rem]"
        loading="lazy"
      />
    </div>

    <!-- Project Info -->
    <div
      class="p-4 flex flex-col items-center flex-shrink-0 transition-colors duration-300 rounded-b-[3rem]"
    >
      <h3
        class="text-lg font-semibold text-white mb-1 line-clamp-1 transition-all duration-300 group-hover:scale-105 font-display"
      >
        {{ title }}
      </h3>
      <p
        class="text-white/70 group-hover:text-white/90 text-sm line-clamp-2 transition-all duration-300 group-hover:scale-105 font-sans"
      >
        {{ category }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

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

const handleClick = () => {
  emit('click', props)
}
</script>
