<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef } from 'vue'
import { useBlogStore } from '../../stores/blog'
import { debounce } from '../../utils/performance'
import type { BlogPost } from '../../types/blog'

const BlogCard = defineAsyncComponent(() => import('../BlogCard.vue'))

const blogStore = useBlogStore()

// Filter state with shallowRef for better performance
const activeTab = shallowRef('all')

// Define emits
const emit = defineEmits<{
  (e: 'postClick', post: BlogPost): void
}>()

// Memoized filtered posts with better caching
const filteredPosts = computed(() => {
  return blogStore.getPostsByCategory(activeTab.value)
})

// Debounced tab switching for better performance
const debouncedSetTab = debounce(
  ((tabId: string) => {
    activeTab.value = tabId
  }) as unknown as (...args: unknown[]) => unknown,
  100
)

// Handle post click
const handlePostClick = (post: BlogPost) => {
  emit('postClick', post)
}

// Set tab with debouncing
const setTab = (tabId: string) => {
  debouncedSetTab(tabId)
}
</script>

<template>
  <div class="max-w-7xl">
    <!-- Main Title -->
    <h1
      class="title no-title-effects text-center text-3xl md:text-4xl font-black tracking-tight mb-8 text-accent opacity-100"
    >
      Блог
    </h1>

    <!-- Category Tabs -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <button
        v-for="tab in blogStore.tabs"
        :key="tab.id"
        @click="setTab(tab.id)"
        :class="[
          'px-6 py-3 rounded-full font-medium transition-all duration-200',
          activeTab === tab.id
            ? 'bg-blog-title text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Blog Posts Grid with v-memo optimization -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogCard
        v-for="post in filteredPosts"
        :key="post.id"
        v-memo="[post.id, activeTab]"
        :post="post"
        @click="handlePostClick"
      />
    </div>
  </div>
</template>

<style scoped>
/* Blog section specific styles */
.text-blog-title {
  color: #6366f1;
}

.bg-blog-title {
  background-color: #6366f1;
}

/* Performance optimizations */
.grid {
  contain: layout;
}

/* will-change удален - не нужен для статических элементов */
</style>
