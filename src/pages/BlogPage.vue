<script setup lang="ts">
import { onMounted, defineAsyncComponent, ref, watch, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { BlogPost } from '../types/blog'
import { useHead } from '@unhead/vue'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'

const BlogSection = defineAsyncComponent(() => import('../components/sections/BlogSection.vue'))
const BlogModal = defineAsyncComponent(() => import('../components/modals/BlogModal.vue'))

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

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

// JSON-LD for BlogPosting when modal open + Breadcrumb schema
watchEffect(() => {
  const post = selectedPost.value
  const scripts: Array<{
    type: string
    children: string
    key: string
  }> = []

  // Breadcrumb schema (всегда добавляем)
  if (breadcrumbSchema.value) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema.value),
      key: 'breadcrumb-schema',
    })
  }

  if (!post) {
    // Blog listing page schema
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Blog' }),
      key: 'blog-schema',
    })
  } else {
    // BlogPosting schema
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date || undefined,
        articleSection: post.category,
        url:
          typeof window !== 'undefined'
            ? `${window.location.origin}/blog/${post.category}/${post.slug}`
            : `/blog/${post.category}/${post.slug}`,
      }),
      key: 'blogposting-schema',
    })
  }

  if (scripts.length > 0) {
    useHead({ script: scripts })
  }
})
</script>

<template>
  <div class="min-h-screen blog-fonts blog-section-bg">
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
