<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useBlogStore } from '../../stores/blog'
import type { BlogPost } from '../../types/blog'

const BlogCard = defineAsyncComponent(() => import('../BlogCard.vue'))

const blogStore = useBlogStore()

// Filter state
const activeTab = ref('all')

// Define emits
const emit = defineEmits<{
  (e: 'postClick', post: BlogPost): void
}>()

// Get filtered posts
const filteredPosts = computed(() => {
  return blogStore.getPostsByCategory(activeTab.value)
})

// Handle post click
const handlePostClick = (post: BlogPost) => {
  emit('postClick', post)
}

// Set tab
const setTab = (tabId: string) => {
  activeTab.value = tabId
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Main Title -->
    <h1 class="text-5xl md:text-6xl font-extrabold text-blog-title mb-10 text-center">Блог</h1>

    <!-- Tabs -->
    <div class="flex justify-center space-x-4 mb-12">
      <button
        v-for="tab in blogStore.tabs"
        :key="tab.id"
        @click="setTab(tab.id)"
        :class="[
          'px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300',
          activeTab === tab.id
            ? 'bg-blog-tab-active text-white shadow-lg'
            : 'bg-blog-tab-inactive text-blog-subtitle border hover:bg-white/90 hover:border-blog-tab-active',
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Blog Posts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        @click="handlePostClick"
      />
    </div>
  </div>
</template>

<style scoped>
/* Blog section specific styles */
</style>
