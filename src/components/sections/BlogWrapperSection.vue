<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { BlogPost } from '../../types/blog'

const BlogSection = defineAsyncComponent(() => import('./BlogSection.vue'))

const rootEl = ref<HTMLElement | null>(null)
const visible = ref(false)

// Define props
const props = defineProps<{
  id?: string
}>()

useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry?.isIntersecting) visible.value = true
  },
  { rootMargin: '200px' }
)

// Define emits
const emit = defineEmits<{
  (e: 'postClick', post: BlogPost): void
}>()

function handlePostClick(post: BlogPost) {
  emit('postClick', post)
}
</script>

<template>
  <section
    :id="props.id"
    ref="rootEl"
    class="stack-section no-scrollbar blog-gradient h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
  >
    <BlogSection v-if="visible" @post-click="handlePostClick" />
  </section>
</template>

<style scoped></style>
