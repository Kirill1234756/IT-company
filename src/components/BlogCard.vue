<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { BlogPost } from '../types/blog'
import OptimizedImage from './OptimizedImage.vue'

const props = defineProps<{
  post: BlogPost
}>()

const emit = defineEmits<{
  (e: 'click', post: BlogPost): void
}>()

const handleClick = () => {
  emit('click', props.post)
}
</script>

<template>
  <div
    class="bg-blog-card rounded-3xl shadow-lg overflow-hidden flex flex-col group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    @click="handleClick"
  >
    <!-- Image with overlay avatar -->
    <div class="relative h-48 w-full overflow-hidden rounded-t-3xl" style="aspect-ratio: 16/9">
      <OptimizedImage
        :src="post.image"
        :alt="post.title"
        :width="400"
        :height="225"
        :widths="[400, 800, 1200]"
        format="webp"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        style="box-sizing: border-box; display: block; transform: translateZ(0)"
        :sizes="{ mobile: '100vw', tablet: '50vw', desktop: '33vw' }"
      />
      <!-- Blurred avatar overlay -->
      <div
        class="absolute bottom-4 right-4 w-12 h-12 rounded-full border-2 border-white blur-sm"
        style="background-color: var(--blog-gradient-middle)"
      ></div>
    </div>

    <!-- Content -->
    <div class="p-6 text-left flex flex-col flex-grow">
      <h3 class="text-xl font-bold text-blog-title mb-2 flex-grow line-clamp-2 font-display">
        {{ post.title }}
      </h3>
      <p class="text-blog-muted text-sm mb-4">{{ post.date }} | {{ post.readTime }}</p>
      <div class="flex justify-end">
        <div
          class="w-8 h-8 bg-blog-button rounded-full flex items-center justify-center hover:bg-blog-button-hover transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

