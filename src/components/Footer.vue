<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Scroll to top functionality with custom smooth animation
const scrollToTop = () => {
  const startPosition = window.pageYOffset
  const startTime = performance.now()
  const duration = 1000 // 1 second for ultra smooth scroll

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  const animateScroll = (currentTime: number) => {
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const ease = easeInOutCubic(progress)

    window.scrollTo(0, startPosition * (1 - ease))

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

// Show/hide scroll to top button based on scroll position
const showScrollButton = ref(false)

const handleScroll = () => {
  const scrollY = window.scrollY
  showScrollButton.value = scrollY > 300
  console.log('Scroll position:', scrollY, 'Show button:', showScrollButton.value)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <footer
    class="bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-border)] border-t border-[var(--color-accent)]/20"
  >
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <!-- Left: Copyright -->
        <div class="text-white/70 text-sm">NextCode, 2025</div>

        <!-- Center: Logo and Links -->
        <div class="flex flex-col items-center space-y-2">
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center"
            >
              <span class="text-[var(--color-bg)] font-bold text-lg">N</span>
            </div>
            <span class="text-white font-bold text-xl">EXTCODE</span>
          </div>
          <a
            href="/privacy"
            class="text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 text-sm transition-colors"
          >
            Privacy and Cookies Policy
          </a>
        </div>

        <!-- Right: All Rights Reserved -->
        <div class="text-white/70 text-sm">© All Rights Reserved</div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-75 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-75 translate-y-4"
    >
      <button
        v-if="showScrollButton"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-bg)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 z-[1000] group"
        aria-label="Scroll to top"
      >
        <svg
          class="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </Transition>

    <!-- Debug: Always visible button for testing -->
    <button
      @click="scrollToTop"
      class="fixed bottom-20 right-6 md:bottom-24 md:right-8 w-12 h-12 bg-blog-button hover:bg-blog-button-hover text-white rounded-full flex items-center justify-center shadow-lg z-[1000] transition-all duration-300 hover:scale-110"
      aria-label="Debug scroll to top"
    >
      <span class="text-xs font-bold">UP</span>
    </button>
  </footer>
</template>

<style scoped>
/* Enhanced smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom smooth scroll for better performance */
* {
  scroll-behavior: smooth;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent) / 80;
}

/* Button hover effects */
.group:hover svg {
  transform: translateY(-2px);
}

/* Focus styles for accessibility */
button:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Animation for scroll button */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.group:hover {
  animation: bounce 1s ease-in-out;
}
</style>
