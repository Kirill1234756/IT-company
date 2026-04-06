<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { BlogPost } from '../types/blog'

// MainSection - синхронный импорт для быстрого LCP на мобильных
import MainSection from '../components/sections/MainSection.vue'

// Ленивая загрузка секций - с задержками для снижения TBT на мобильных
// Задержки между секциями: 100ms каждая для разбиения нагрузки на main thread
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768
const baseDelay = isMobileDevice ? 100 : 0

const WhatWeDoSection = defineAsyncComponent({
  loader: () => import('../components/sections/WhatWeDoSection.vue'),
  delay: baseDelay,
  timeout: 5000,
})

const PortfolioSection = defineAsyncComponent({
  loader: () => import('../components/sections/PortfolioSection.vue'),
  delay: baseDelay + (isMobileDevice ? 100 : 0),
  timeout: 5000,
})

const AdvantagesSection = defineAsyncComponent({
  loader: () => import('../components/sections/AdvantagesSection.vue'),
  delay: baseDelay + (isMobileDevice ? 200 : 0),
  timeout: 5000,
})

const BlogWrapperSection = defineAsyncComponent({
  loader: () => import('../components/sections/BlogWrapperSection.vue'),
  delay: baseDelay + (isMobileDevice ? 300 : 0),
  timeout: 5000,
})

const WelcomePackageSection = defineAsyncComponent({
  loader: () => import('../components/sections/WelcomePackageSection.vue'),
  delay: baseDelay + (isMobileDevice ? 350 : 0),
  timeout: 5000,
})

const ContactSection = defineAsyncComponent({
  loader: () => import('../components/sections/ContactSection.vue'),
  delay: baseDelay + (isMobileDevice ? 400 : 0),
  timeout: 5000,
})

const Footer = defineAsyncComponent({
  loader: () => import('../pages/Footer.vue'),
  delay: baseDelay + (isMobileDevice ? 500 : 0),
  timeout: 5000,
})

const BlogModal = defineAsyncComponent({
  loader: () => import('../components/modals/BlogModal.vue'),
  delay: 0,
  timeout: 5000,
})

defineProps<{
  dataVInspector?: string
}>()

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
  const stackContainer = document.getElementById('stack')
  if (blogSection && stackContainer) {
    // Скроллим контейнер #stack к секции блога
    const stackRect = stackContainer.getBoundingClientRect()
    const sectionRect = blogSection.getBoundingClientRect()
    const scrollTop = stackContainer.scrollTop + (sectionRect.top - stackRect.top)
    stackContainer.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    })
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

// Initialize blog modal handling
onMounted(() => {
  handleRouteParams()

  // Главная всегда загружается с main section: прокручиваем #stack в начало
  nextTick(() => {
    const stack = document.getElementById('stack')
    if (stack && window.location.hash !== '#blog') {
      // Жёстко сбрасываем scrollTop несколько раз, чтобы scroll-snap не "прилип"
      // к другой секции на первом кадре.
      stack.scrollTop = 0
      stack.scrollTo(0, 0)
      requestAnimationFrame(() => {
        stack.scrollTop = 0
      })
      setTimeout(() => {
        stack.scrollTop = 0
      }, 0)
    }
  })

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

// Form data for contact section
// contact form lives in ContactSection

// contact form moved into ContactSection
</script>

<template>
  <div id="stack">
    <!-- Main Hero Section - синхронная загрузка для быстрого LCP -->
    <MainSection />

    <!-- what we do -->
    <WhatWeDoSection />

    <!-- portfolio -->
    <PortfolioSection />

    <!-- Our Advantages -->
    <AdvantagesSection />

    <!-- blog -->
    <BlogWrapperSection id="blog" @post-click="handleBlogPostClick" />

    <!-- welcome package -->
    <WelcomePackageSection />

    <!-- contact -->
    <ContactSection />

    <!-- footer -->
    <Footer />
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
