<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { BlogPost } from '../types/blog'

// Extend window interface for global functions
declare global {
  interface Window {
    stackSections?: HTMLElement[]
    scrollToSection?: (sectionIndex: number) => void
  }
}

import { useStackScroll } from '../composables/useStackScroll'

// MainSection - async без задержки для баланса FCP и размера бандла
// Pre-rendered контент в index.html обеспечивает мгновенный LCP
// Async для уменьшения начального бандла, но без задержки для быстрого FCP
const MainSection = defineAsyncComponent({
  loader: () => import('../components/sections/MainSection.vue'),
  delay: 0,
  timeout: 2000,
})

// Ленивая загрузка секций - без задержки для быстрого FCP
const sectionDelay = 0

const WhatWeDoSection = defineAsyncComponent({
  loader: () => import('../components/sections/WhatWeDoSection.vue'),
  delay: sectionDelay,
  timeout: 5000,
  loadingComponent: () => import('../components/LoadingFallback.vue'),
})

const PortfolioSection = defineAsyncComponent({
  loader: () => import('../components/sections/PortfolioSection.vue'),
  delay: sectionDelay,
  timeout: 5000,
  loadingComponent: () => import('../components/LoadingFallback.vue'),
})

const AdvantagesSection = defineAsyncComponent({
  loader: () => import('../components/sections/AdvantagesSection.vue'),
  delay: sectionDelay,
  timeout: 5000,
  loadingComponent: () => import('../components/LoadingFallback.vue'),
})

const BlogWrapperSection = defineAsyncComponent({
  loader: () => import('../components/sections/BlogWrapperSection.vue'),
  delay: sectionDelay,
  timeout: 5000,
  loadingComponent: () => import('../components/LoadingFallback.vue'),
})

const BlogModal = defineAsyncComponent({
  loader: () => import('../components/modals/BlogModal.vue'),
  delay: 0,
  timeout: 5000,
  loadingComponent: () => import('../components/LoadingFallback.vue'),
})

// ContactSection and Footer are now global in App.vue

const stackRoot = ref<HTMLElement | null>(null)
const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

// Blog modal state
const showBlogModal = ref(false)
const selectedBlogPost = ref<BlogPost | null>(null)

// No DOM queries here; each section encapsulates its own logic and effects

// Navigation helpers moved into WhatWeDoSection

// blog navigation handled here now

// Handle blog post click
const handleBlogPostClick = (post: BlogPost) => {
  selectedBlogPost.value = post
  showBlogModal.value = true
  router.push(`/blog-post/${post.category}/${post.slug}`)
}

// Function to scroll to blog section
const scrollToBlogSection = () => {
  const blogSection = document.getElementById('blog')
  // Removed console.log for production performance
  if (blogSection) {
    // Find the blog section index in the stack
    const stackContainer = document.getElementById('stack')
    if (stackContainer) {
      const sections = stackContainer.querySelectorAll('.stack-section')
      // Removed console.log for production performance

      // Removed debug logging for production performance

      const blogSectionIndex = Array.from(sections).findIndex((section) => {
        // Check if this section has id="blog"
        return section.id === 'blog'
      })

      if (blogSectionIndex !== -1) {
        // Removed console.log for production performance

        // Try to use global scrollToSection function if available
        if (window.scrollToSection) {
          // Removed console.log for production performance
          window.scrollToSection(blogSectionIndex)
        } else {
          // Fallback to native scrollTo
          const scrollPosition = blogSectionIndex * window.innerHeight
          // Removed console.log for production performance
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          })
        }
      } else {
        // Removed console.log for production performance
        // Alternative: try to scroll to the blog section directly
        import('gsap')
          .then(({ gsap }) => {
            try {
              gsap.to(window, {
                duration: 1,
                scrollTo: blogSection,
                ease: 'power2.inOut',
              })
            } catch {
              // Removed console.log for production performance
            }
          })
          .catch(() => {
            // Removed console.log for production performance
          })
      }
    }
  }
}

// Handle blog modal close
const handleBlogModalClose = () => {
  showBlogModal.value = false
  selectedBlogPost.value = null
  router.push('/#blog')

  // Scroll to blog section
  setTimeout(() => {
    scrollToBlogSection()
  }, 300)
}

// Handle related post click
const handleRelatedPostClick = (post: BlogPost) => {
  selectedBlogPost.value = post
  showBlogModal.value = true
  router.push(`/blog-post/${post.category}/${post.slug}`)
}

// Handle URL parameters for opening blog modal
const handleRouteParams = () => {
  const { category, post } = route.params

  // Only handle blog-post routes
  if (route.name === 'home-blog-post' && category && post) {
    const blogPost = blogStore.getPostBySlug(post as string)
    if (blogPost) {
      selectedBlogPost.value = blogPost
      showBlogModal.value = true
    }
  } else {
    showBlogModal.value = false
    selectedBlogPost.value = null
  }
}

// Related posts computed
const relatedPosts = computed(() => {
  if (!selectedBlogPost.value) return []
  return blogStore.getRelatedPosts(selectedBlogPost.value.id)
})

// Handle service card click (kept for potential future use)
// const handleServiceClick = (service: any) => {
//   router.push(`/services/${service.id}`)
// }

// Stats data for about us section (memoized)
// stats moved into AboutSection

// What We Do cards data moved into WhatWeDoSection

// (portfolio moved to CasesPage via PortfolioSection)

// intersection/lazy logic moved into corresponding section components

useStackScroll(stackRoot, {
  snap: false,
  onAfterGsapReady: ({ sections }) => {
    // Removed console.log for production performance

    // Store reference to sections for later use
    window.stackSections = sections

    // Create a global function to scroll to specific section
    window.scrollToSection = (sectionIndex: number) => {
      // Removed console.log for production performance
      const scrollPosition = sectionIndex * window.innerHeight
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    }
  },
})

// Initialize blog modal handling
onMounted(() => {
  // Removed console.log for production performance

  handleRouteParams()

  // Handle hash navigation on page load
  if (window.location.hash === '#blog') {
    setTimeout(() => {
      scrollToBlogSection()
    }, 1000) // Increased delay to allow sections to load
  }

  // Handle hash changes via browser navigation
  const handleHashChange = () => {
    if (window.location.hash === '#blog') {
      setTimeout(() => {
        scrollToBlogSection()
      }, 500) // Increased delay to allow sections to load
    }
  }

  window.addEventListener('hashchange', handleHashChange)

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('hashchange', handleHashChange)
  })
})

// Watch for route changes
watch(
  () => route.params,
  () => {
    handleRouteParams()
  },
  { deep: true }
)

// Watch for hash changes
watch(
  () => route.hash,
  (newHash) => {
    if (newHash === '#blog') {
      setTimeout(() => {
        scrollToBlogSection()
      }, 100)
    }
  }
)

// cleanup handled in useStackScroll

// Form data for contact section
// contact form lives in ContactSection

// contact form moved into ContactSection
</script>

<template>
  <div id="stack" class="relative" ref="stackRoot">
    <!-- Main Hero Section -->
    <MainSection />

    <!-- what we do -->
    <WhatWeDoSection />

    <!-- portfolio -->
    <PortfolioSection />

    <!-- Our Advantages -->
    <AdvantagesSection />

    <!-- blog -->
    <BlogWrapperSection id="blog" @post-click="handleBlogPostClick" />
  </div>
  <!-- Blog Modal with Teleport -->
  <Teleport to="body">
    <BlogModal
      v-if="showBlogModal && selectedBlogPost"
      :post="selectedBlogPost"
      :relatedPosts="relatedPosts"
      @close="handleBlogModalClose"
      @relatedClick="handleRelatedPostClick"
    />
  </Teleport>
</template>
