<script setup lang="ts">
import { onMounted, defineAsyncComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { BlogPost } from '../types/blog'

const BlogSection = defineAsyncComponent(() => import('../components/sections/BlogSection.vue'))
const BlogModal = defineAsyncComponent(() => import('../modal/BlogModal.vue'))

const router = useRouter()
const blogStore = useBlogStore()

// Modal state
const activeModal = ref<'detail' | null>(null)
const selectedPost = ref<BlogPost | null>(null)

// Handle route parameters for modals
const handleRouteParams = () => {
  const route = router.currentRoute.value
  const { category, post } = route.params

  if (category && post) {
    // URL: /blog/:category/:post - открыть детальную информацию
    const blogPost = blogStore.getPostBySlug(post as string)
    if (blogPost) {
      selectedPost.value = blogPost
      activeModal.value = 'detail'
      return
    }
  }
}

// Handle post click
const handlePostClick = (post: BlogPost) => {
  selectedPost.value = post
  activeModal.value = 'detail'
  // Update URL
  router.push(`/blog/${post.category}/${post.slug}`)
}

// Handle related post click
const handleRelatedClick = (post: BlogPost) => {
  selectedPost.value = post
  activeModal.value = 'detail'
  // Update URL
  router.push(`/blog/${post.category}/${post.slug}`)
}

// Close modal
const closeModal = () => {
  activeModal.value = null
  selectedPost.value = null
  // Return to blog list
  router.push('/blog')
}

onMounted(() => {
  handleRouteParams()
})

// Watch for route changes
watch(
  () => router.currentRoute.value,
  () => {
    handleRouteParams()
  },
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen blog-fonts" style="background-color: var(--color-border)">
    <!-- Blog Section -->
    <BlogSection @post-click="handlePostClick" />

    <!-- Blog Detail Modal -->
    <BlogModal
      v-if="activeModal === 'detail' && selectedPost"
      :post="selectedPost"
      :relatedPosts="blogStore.getRelatedPosts(selectedPost.id)"
      @close="closeModal"
      @relatedClick="handleRelatedClick"
    />
  </div>
</template>

<style scoped>
/* Page specific styles */
</style>
