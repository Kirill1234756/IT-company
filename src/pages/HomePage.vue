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
// router not needed in this page after section extraction
// intersection observers moved into section components
// keep only defineAsyncComponent
import { useStackScroll } from '../composables/useStackScroll'
// moved into dedicated section component
const MainSection = defineAsyncComponent(() => import('../components/sections/MainSection.vue'))
const WhatWeDoSection = defineAsyncComponent(
  () => import('../components/sections/WhatWeDoSection.vue')
)
const PortfolioSection = defineAsyncComponent(
  () => import('../components/sections/PortfolioSection.vue')
)
const AdvantagesSection = defineAsyncComponent(
  () => import('../components/sections/AdvantagesSection.vue')
)
const AboutSection = defineAsyncComponent(() => import('../components/sections/AboutSection.vue'))
const BlogWrapperSection = defineAsyncComponent(
  () => import('../components/sections/BlogWrapperSection.vue')
)
const BlogModal = defineAsyncComponent(() => import('../modal/BlogModal.vue'))
const ContactSection = defineAsyncComponent(
  () => import('../components/sections/ContactSection.vue')
)

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
  console.log('Blog section found:', blogSection)
  if (blogSection) {
    // Find the blog section index in the stack
    const stackContainer = document.getElementById('stack')
    if (stackContainer) {
      const sections = stackContainer.querySelectorAll('.stack-section')
      console.log('Stack sections found:', sections.length)
      console.log('Blog section parent:', blogSection.parentElement)

      // Debug: log each section and check for blog div
      sections.forEach((section, index) => {
        console.log(`Section ${index}:`, section.className, 'id:', section.id, 'element:', section)
      })

      const blogSectionIndex = Array.from(sections).findIndex((section) => {
        // Check if this section has id="blog"
        return section.id === 'blog'
      })

      if (blogSectionIndex !== -1) {
        console.log('Blog section index:', blogSectionIndex)

        // Try to use global scrollToSection function if available
        if (window.scrollToSection) {
          console.log('Using global scrollToSection function')
          window.scrollToSection(blogSectionIndex)
        } else {
          // Fallback to native scrollTo
          const scrollPosition = blogSectionIndex * window.innerHeight
          console.log('Using native scrollTo to position:', scrollPosition)
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          })
        }
      } else {
        console.log('Blog section not found in stack, trying alternative approach')
        // Alternative: try to scroll to the blog section directly
        try {
          gsap.to(window, {
            duration: 1,
            scrollTo: blogSection,
            ease: 'power2.inOut',
          })
        } catch (error) {
          console.log('Alternative scroll failed:', error)
        }
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
  snap: true,
  onAfterGsapReady: ({ sections }) => {
    console.log('StackScroll ready with sections:', sections.length)

    // Store reference to sections for later use
    window.stackSections = sections

    // Create a global function to scroll to specific section
    window.scrollToSection = (sectionIndex: number) => {
      console.log('Scrolling to section index:', sectionIndex)
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

    <!-- about us -->
    <AboutSection />

    <!-- blog -->
    <BlogWrapperSection id="blog" @post-click="handleBlogPostClick" />

    <!-- contact -->
    <ContactSection />
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
