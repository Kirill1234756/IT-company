<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRoute } from 'vue-router'
import type { BlogPost } from '../../types/blog'

// Removed console.log for production performance

const BlogSection = defineAsyncComponent(() => import('./BlogSection.vue'))

const route = useRoute()

// Определяем, находимся ли мы на главной странице
const isOnHomePage = computed(() => {
  if (typeof window === 'undefined') return false
  return route.path === '/' || route.path === '/home'
})

// Define props
const props = defineProps<{
  id?: string
}>()

// Define emits
const emit = defineEmits<{
  (e: 'postClick', post: BlogPost): void
}>()

const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
// На главной странице загружаем сразу для показа свайпера
const isVisible = ref(isOnHomePage.value)
const hasLoaded = ref(isOnHomePage.value)

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

// Настройка обработчика wheel событий для внутреннего скролла
onMounted(() => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash
    if (hash === '#blog') {
      isVisible.value = true
      hasLoaded.value = true
      stop()
    }
  }

  // Если на главной странице, загружаем сразу
  if (isOnHomePage.value) {
    isVisible.value = true
    hasLoaded.value = true
  }

  // Настраиваем обработчик wheel для внутреннего скролла
  // Обработчики wheel удалены - используем чистый CSS scroll-snap
  // .internal-scroll-container имеет overflow: hidden, поэтому скролл происходит только на уровне страницы
})

function handlePostClick(post: BlogPost) {
  emit('postClick', post)
}
</script>

<template>
  <section
    ref="rootEl"
    :id="props.id"
    class="stack-section no-scrollbar h-screen flex flex-col items-center justify-start rounded-t-3xl py-[2rem] px-10 bg-[linear-gradient(135deg,_var(--color-bg)_0%,_var(--color-border)_100%)]"
    style="min-height: 700px; box-sizing: border-box; contain: layout style paint"
  >
    <div class="internal-scroll-container w-full h-full flex flex-col items-center" ref="scrollContainerRef">
      <Suspense>
        <template #default>
          <BlogSection
            v-if="hasLoaded && isVisible"
            :use-swiper="isOnHomePage"
            @post-click="handlePostClick"
          />
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
    </div>
  </section>
</template>

<style scoped></style>
