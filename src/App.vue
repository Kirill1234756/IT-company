<script setup lang="ts">
import { RouterView } from 'vue-router'
import { defineAsyncComponent, onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
const LoaderC = defineAsyncComponent(() => import('./components/ui/Loader.vue'))
import { usePageLoader } from './composables/usePageLoader'
const Header = defineAsyncComponent(() => import('./pages/Header.vue'))
const ContactSection = defineAsyncComponent(
  () => import('./components/sections/ContactSection.vue')
)
const Footer = defineAsyncComponent(() => import('./pages/Footer.vue'))

const { isLoading, progress, isRouteChange, initLoader, initRouterLoader, addLoadingPromise } =
  usePageLoader()

// Track if this is initial load (use pre-rendered loader) or route change (use Vue loader)
const isInitialLoad = ref(true)

// Update pre-rendered loader progress
const updatePreRenderedLoader = () => {
  const progressFill = document.getElementById('loader-progress-fill')
  const progressText = document.getElementById('loader-progress-text')
  const loaderText = document.getElementById('loader-text')
  
  if (progressFill && progressText && loaderText) {
    progressFill.style.width = progress.value + '%'
    progressText.textContent = Math.round(progress.value) + '%'
    loaderText.textContent = isRouteChange.value ? 'Переход...' : 'Загрузка...'
  }
}

// Hide pre-rendered loader
const hidePreRenderedLoader = () => {
  const loader = document.getElementById('pre-rendered-loader')
  if (loader) {
    loader.style.opacity = '0'
    loader.style.transition = 'opacity 0.3s ease-out'
    setTimeout(() => {
      loader.style.display = 'none'
    }, 300)
  }
}

// Watch progress and update pre-rendered loader
watch([progress, isLoading, isRouteChange], () => {
  if (isInitialLoad.value && !isRouteChange.value) {
    updatePreRenderedLoader()
    if (!isLoading.value) {
      hidePreRenderedLoader()
    }
  }
}, { immediate: true })

// Lazy load triggers and flags
const contactSectionTrigger = ref<HTMLElement | null>(null)
const footerTrigger = ref<HTMLElement | null>(null)
const shouldLoadContactSection = ref(false)
const shouldLoadFooter = ref(false)

// Типы для scheduler API
interface SchedulerPostTaskOptions {
  priority?: 'user-blocking' | 'user-visible' | 'background'
  delay?: number
  signal?: AbortSignal
}

interface Scheduler {
  postTask(callback: () => void, options?: SchedulerPostTaskOptions): Promise<void>
}

declare global {
  interface Window {
    scheduler?: Scheduler
  }
}

// Загрузка ContactSection и Footer без задержки - лоадер ждет реальной загрузки
const loadContactSection = () => {
  shouldLoadContactSection.value = true
}

const loadFooter = () => {
  shouldLoadFooter.value = true
}

// Observers (vueuse handles cleanup when target unmounts)
// Загрузка без задержки - лоадер ждет реальной загрузки
useIntersectionObserver(
  contactSectionTrigger,
  ([entry]) => {
    if (entry?.isIntersecting && !shouldLoadContactSection.value) {
      loadContactSection()
    }
  },
  { rootMargin: '300px', threshold: 0 }
)

useIntersectionObserver(
  footerTrigger,
  ([entry]) => {
    if (entry?.isIntersecting && !shouldLoadFooter.value) {
      loadFooter()
    }
  },
  { rootMargin: '300px', threshold: 0 }
)

onMounted(async () => {
  // Notify that Vue is mounted (stops pre-rendered loader's own progress simulation)
  window.dispatchEvent(new Event('vue-mounted'))
  
  // Initial update of pre-rendered loader
  updatePreRenderedLoader()
  
  initLoader()
  initRouterLoader()

  // Ждем загрузки критических компонентов перед скрытием лоадера
  // Pre-rendered контент в HTML обеспечивает мгновенный LCP, поэтому уменьшаем время ожидания
  const waitForMainSection = new Promise<void>((resolve) => {
    const isMobile = window.innerWidth < 768
    const MAX_WAIT_TIME = isMobile ? 1500 : 2000 // Уменьшено для быстрого FCP
    const startTime = Date.now()

    // Проверяем наличие MainSection (LCP элемент) - pre-rendered в HTML
    const checkMainSection = () => {
      const mainSection = document.querySelector('.main-section')
      const h1 = mainSection?.querySelector('h1')
      const elapsed = Date.now() - startTime

      // Проверяем что h1 загружен и имеет контент (pre-rendered или Vue)
      if (mainSection && h1 && h1.textContent && h1.textContent.trim().length > 0) {
        // Минимальная задержка для рендеринга контента
        setTimeout(() => resolve(), isMobile ? 50 : 100)
      } else if (elapsed >= MAX_WAIT_TIME) {
        // Таймаут - принудительно завершаем, чтобы лоадер не зависал
        resolve()
      } else {
        setTimeout(checkMainSection, isMobile ? 20 : 30)
      }
    }
    // Начинаем проверку сразу
    checkMainSection()
  })

  addLoadingPromise(waitForMainSection)
  
  // Mark initial load as complete after first load
  watch(isLoading, (newVal) => {
    if (!newVal && isInitialLoad.value) {
      isInitialLoad.value = false
    }
  }, { once: true })
})

onBeforeUnmount(() => {
  // Cleanup: hide pre-rendered loader if still visible
  hidePreRenderedLoader()
})
</script>

<template>
  <main id="app">
    <!-- Show Vue loader only for route changes, not initial load (pre-rendered loader handles that) -->
    <LoaderC v-if="isLoading && !isInitialLoad" :progress="progress" :is-route-change="isRouteChange" />
    <header
      ref="headerRef"
      class="fixed top-[0.7rem] left-0 w-full flex justify-center items-center z-10 px-3 md:px-12 lg:px-[8rem]"
    >
      <!-- Reserve space to avoid CLS when header fonts load -->
      <div
        style="
          height: 48px;
          width: 100%;
          max-width: 1280px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <Header />
      </div>
    </header>
    <RouterView />

    <!-- Lazy placeholders and sections -->
    <div ref="contactSectionTrigger" style="height: 1px; width: 100%"></div>
    <ContactSection v-if="shouldLoadContactSection" />

    <div ref="footerTrigger" style="height: 1px; width: 100%"></div>
    <Footer v-if="shouldLoadFooter" />

    <!-- Telegram Icon -->
    <a
      href="https://t.me/ITcompany_tg"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-[#0088cc] to-[#00a8ff] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 z-[1000] animate-pulse"
      aria-label="Написать в Telegram"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-.14.05-.22.08-.35.15-1.19.76-3.36 2.23-.32.22-.61.33-.87.32-.29-.01-.85-.16-1.26-.3-.51-.17-.92-.28-.88-.59.02-.16.23-.32.63-.49 2.4-1.05 4.01-1.74 4.84-2.08 2.1-.87 2.54-1.02 2.83-1.02.06 0 .2.01.29.09.08.06.1.14.11.2-.01.06.01.24 0 .38z"
          fill="currentColor"
        />
      </svg>
    </a>
  </main>
</template>

<style>
/* Global styles */
:root {
  --color-bg: #0f0f23;
  --color-border: #1e293b;
  --color-accent: #00e5a0;
  --color-purple: #6366f1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  --color-text: #f8fafc;
  --color-text-muted: #cbd5e1; /* Improved contrast from #94a3b8 */
}

* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Scrollbar styling */
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
  background: var(--color-purple);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles */

/* Selection styles */
::selection {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* Typography */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
  line-height: 1.2;
}

p {
  line-height: 1.6;
}

/* Button styles */
button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

/* Link styles */
a {
  color: inherit;
  text-decoration: none;
}

/* Image styles */
img {
  max-width: 100%;
  height: auto;
}

/* Aspect ratio helpers to reduce CLS on media containers */
.aspect-16\/9 {
  aspect-ratio: 16 / 9;
}
.aspect-4\/3 {
  aspect-ratio: 4 / 3;
}
.aspect-1 {
  aspect-ratio: 1 / 1;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-x-8 > * + * {
  margin-left: 2rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-8 > * + * {
  margin-top: 2rem;
}
</style>
