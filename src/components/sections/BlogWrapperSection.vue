<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { BlogPost } from '../../types/blog'

// Removed console.log for production performance

const BlogSection = defineAsyncComponent(() => import('./BlogSection.vue'))

// Define props
const props = defineProps<{
  id?: string
}>()

// Define emits
const emit = defineEmits<{
  (e: 'postClick', post: BlogPost): void
}>()

const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const hasLoaded = ref(false)

const { stop } = useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry && entry.isIntersecting) {
      isVisible.value = true
      hasLoaded.value = true
      stop()
    }
  },
  { rootMargin: '200px' }
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash
    if (hash === '#blog') {
      isVisible.value = true
      hasLoaded.value = true
      stop()
    }
  }
})

function handlePostClick(post: BlogPost) {
  emit('postClick', post)
}
</script>

<template>
  <section
    ref="rootEl"
    :id="props.id"
    class="stack-section no-scrollbar blog-section-bg h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-10 md:[5rem] lg:px-[12rem]"
    style="min-height: 700px; box-sizing: border-box; contain: layout style paint"
  >
    <Suspense>
      <template #default>
        <BlogSection v-if="hasLoaded && isVisible" @post-click="handlePostClick" />
      </template>
      <template #fallback>
        <div
          class="flex flex-col items-center justify-center w-full h-full text-center text-white/60"
        >
          <p class="text-xl font-semibold mb-4">Загружаем раздел блога…</p>
          <p class="text-sm max-w-md">
            Раздел появится, как только вы прокрутите страницу, что помогает ускорить начальную
            загрузку.
          </p>
        </div>
      </template>
    </Suspense>
  </section>
</template>

<style scoped></style>
