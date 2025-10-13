<template>
  <div @click="handleClick" class="group cursor-pointer overflow-hidden">
    <!-- Project Image/Preview -->
    <div class="flex bg-gray-500 rounded-[3rem]">
      <img
        :src="image"
        :alt="title"
        class="w-full h-[20rem] object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    <!-- Project Info -->
    <div class="p-4 flex flex-col items-center">
      <h3 class="text-lg font-semibold text-white hover:bg-[var(--color-accent)] mb-1 line-clamp-1">
        {{ title }}
      </h3>
      <p class="text-gray-600 text-sm line-clamp-2">
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
  description: string
  bgColor: string
  logoColor: string
  logoText: string
  technologies: string[]
  link: string
  image: string
  year: string
  status: string
}>()

const emit = defineEmits<{
  click: [project: typeof props]
}>()

const handleClick = () => {
  emit('click', props)
}
</script>
