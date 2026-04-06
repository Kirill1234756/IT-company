<script setup lang="ts">
import { defineAsyncComponent, computed, ref, onMounted, onUnmounted, shallowRef } from 'vue'
import { throttle } from '../utils/performance'

defineOptions({ name: 'AppFooter' })

// Lazy load NavColumn component
const NavColumn = defineAsyncComponent(() => import('../components/footer/NavColumn.vue'))

// Navigation menu data - memoized with shallowRef for performance
interface NavItem {
  to: string
  label: string
  breakWords?: boolean
}

interface NavColumn {
  title: string
  items: NavItem[]
  id: string
}

const navColumnsData: NavColumn[] = [
  {
    id: 'sections',
    title: 'Разделы',
    items: [
      { to: '/', label: 'Главная' },
      { to: '/services', label: 'Услуги' },
      { to: '/packages', label: 'Пакеты' },
      { to: '/cases', label: 'Кейсы' },
      { to: '/blog', label: 'Блог' },
    ],
  },
  {
    id: 'popular-services',
    title: 'Популярные услуги',
    items: [
      {
        to: '/services/development-launch/site-development',
        label: 'Корпоративный сайт',
        breakWords: true,
      },
      {
        to: '/services/development-launch/site-development',
        label: 'Интернет-магазин',
        breakWords: true,
      },
      { to: '/services/development-launch/site-development', label: 'Лендинг' },
    ],
  },
  {
    id: 'additional',
    title: 'Дополнительно',
    items: [
      { to: '/calculator', label: 'Калькулятор' },
      { to: '/contacts', label: 'Контакты' },
      { to: '/client-form', label: 'Стать клиентом', breakWords: true },
    ],
  },
]

// Memoized navigation columns
const navColumns = shallowRef(navColumnsData)

// Computed properties for better performance
const firstTwoColumns = computed(() => navColumns.value.slice(0, 2))
const additionalColumn = computed(() => {
  const column = navColumns.value[2]
  if (!column) {
    throw new Error('Additional column not found in navigation data')
  }
  return column
})

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

// Throttled scroll handler to prevent spam
const handleScroll = throttle(() => {
  const scrollY = window.scrollY
  const shouldShow = scrollY > 300

  // Only update if state actually changed
  if (showScrollButton.value !== shouldShow) {
    showScrollButton.value = shouldShow
  }
}, 100) // Throttle to max 10 times per second

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <footer
    class="stack-section bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-border)] border-t border-[var(--color-accent)]/20"
    style="min-height: auto; height: auto;"
  >
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Navigation Menu -->
      <!-- Mobile: 2 columns in a row, Desktop: flex justify-between with 3 columns -->
      <div
        class="grid grid-cols-2 gap-2 sm:gap-4 mb-6 md:mb-8 md:grid-cols-none md:flex md:justify-between md:gap-8"
      >
        <!-- First two columns: Разделы and Популярные услуги -->
        <NavColumn v-for="column in firstTwoColumns" :key="column.id" :column="column" />

        <!-- Column 3: Дополнительно - Hidden on mobile, shown on desktop -->
        <div class="hidden md:flex">
          <NavColumn :column="additionalColumn" />
        </div>
      </div>

      <!-- Column 3: Дополнительно - Shown on mobile only, centered at bottom -->
      <div class="w-full flex md:hidden flex-col items-center justify-center mb-6">
        <NavColumn :column="additionalColumn" variant="mobile-centered" />
      </div>

      <!-- Logo, Privacy and Contacts - All centered on mobile -->
      <div class="w-full border-t border-white/10 pt-6 md:pt-8 text-center md:text-left">
        <!-- Logo and Privacy - Centered on mobile -->
        <div
          class="w-full flex flex-col items-center justify-center md:flex-row md:items-center md:justify-center mb-4 md:mb-6"
        >
          <div class="flex flex-col items-center md:items-start space-y-2">
            <div class="flex items-center justify-center space-x-2">
              <div class="w-10 h-10 bg-bg rounded-[3rem] flex items-center justify-center">
                <img class="w-[60%]" src="/logo3.webp" alt="KODIFY Logo" width="24" height="24" />
              </div>
              <span class="text-accent font-bold text-lg md:text-xl">KODIFY</span>
            </div>
            <a
              href="/privacy"
              class="text-text hover:text-[var(--color-accent)]/80 text-xs md:text-sm transition-colors"
            >
              Privacy and Cookies Policy
            </a>
          </div>
        </div>

        <!-- Contact methods - Centered on mobile, row on desktop -->
        <div
          class="w-full flex flex-col p-2 md:flex-row items-center justify-center md:gap-20 text-white/80 gap-3"
        >
          <a
            href="tel:+79042964072"
            class="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            aria-label="Позвонить по телефону"
          >
            <span class="text-[var(--color-accent)] text-xl">📱</span>
            <span class="text-sm sm:text-base">+7 904 296 40 72</span>
          </a>

          <a
            href="mailto:kodify@gmail.com"
            class="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            aria-label="Написать на email"
          >
            <span class="text-[var(--color-accent)] text-xl">📧</span>
            <span class="text-sm sm:text-base">kodify@gmail.com</span>
          </a>

          <a
            href="https://t.me/kodify_tg"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            aria-label="Написать в Telegram"
          >
            <span class="text-[var(--color-accent)] text-xl">💬</span>
            <span class="text-sm sm:text-base">@kodify_tg</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Debug: Always visible button for testing -->
    <button
      @click="scrollToTop"
      class="fixed bottom-20 right-6 md:bottom-24 md:right-8 w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg z-[1000] transition-all duration-300 hover:scale-110 bg-[var(--color-accent)] hover:bg-[var(--color-purple)]"
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
