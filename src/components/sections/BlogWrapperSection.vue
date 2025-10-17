<script setup lang="ts">
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRouter } from 'vue-router'
import type { BlogPost } from '../../types/blog'

const BlogSection = defineAsyncComponent(() => import('./BlogSection.vue'))

const router = useRouter()

const rootEl = ref<HTMLElement | null>(null)
const visible = ref(false)
useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry?.isIntersecting) visible.value = true
  },
  { rootMargin: '200px' }
)

function handlePostClick(post: BlogPost) {
  router.push(`/blog/${post.category}/${post.slug}`)
}
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar bg-gradient-to-br from-gray-50 to-gray-100 h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
  >
    <BlogSection v-if="visible" @post-click="handlePostClick" />
  </section>
</template>

<style scoped></style>


