<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { defineAsyncComponent, ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
const Header = defineAsyncComponent(() => import('./pages/Header.vue'))
const ContactSection = defineAsyncComponent(
  () => import('./components/sections/ContactSection.vue')
)
const Footer = defineAsyncComponent(() => import('./pages/Footer.vue'))

const route = useRoute()
// ContactSection и Footer показываются только на других страницах (не на главной)
// На главной странице они внутри #stack
const isHomePage = computed(() => route.path === '/' || route.path === '/home')

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

// Загрузка ContactSection и Footer
const loadContactSection = () => {
  shouldLoadContactSection.value = true
}

const loadFooter = () => {
  shouldLoadFooter.value = true
}

// Observers (vueuse handles cleanup when target unmounts)
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
</script>

<template>
  <main id="app">
    <header
      ref="headerRef"
      class="fixed bg-border/80 backdrop-blur top-0 left-0 z-10 flex w-full min-w-0 px-3 md:px-12 "
      style="pointer-events: none"
    >
      <!-- На всю ширину контентной области: max-width убран — иначе фон <nav> обрывался справа на широких экранах -->
      <div
        class="flex w-full min-w-0 flex-1 items-center justify-center pointer-events-auto"
      >
        <Header />
      </div>
    </header>
    <RouterView />

    <!-- Lazy placeholders and sections -->
    <!-- ContactSection и Footer показываются только на других страницах (не на главной) -->
    <!-- На главной странице они внутри #stack -->
    <template v-if="!isHomePage">
      <div ref="contactSectionTrigger" style="height: 1px; width: 100%"></div>
      <ContactSection v-if="shouldLoadContactSection" />

      <div ref="footerTrigger" style="height: 1px; width: 100%"></div>
      <Footer v-if="shouldLoadFooter" />
    </template>

    <!-- Telegram Icon -->
    <a
      href="https://t.me/kodifyweb"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-12 md:h-12 bg-gradient-to-br from- [#0088cc] to-[#00a8ff] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 z-[1000] animate-pulse"
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
/* Дублируем палитру из src/style.css (@theme), чтобы не перебивать актуальные токены */
:root {
  --color-bg: #03122f;
  --color-border: #19305c;
  --color-accent: #ff8863;
  --color-purple: #ae70ac;
  --color-success: #54acbf;
  --color-warning: #ff8863;
  --color-error: #413b61;
  --color-info: #e8f5f7;
  --color-text: #e8f5f7;
  --color-text-muted: #b8a5c7;
}

* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
}

#app {
  position: relative;
  /* Скролл работает на уровне html/body для всех страниц */
  /* На главной странице скролл также работает внутри #stack */
  /* Для главной страницы #stack имеет height: 100vh и overflow-y: auto */
  /* Для других страниц контент скроллится через html/body */
}

/* На главной странице #stack должен занимать всю высоту viewport */
/* Используем :has() для определения главной страницы */
#app:has(#stack) {
  height: 100vh;
  overflow: hidden;
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

/* Smooth scrolling - управляется через style.css для scroll-snap */

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

/*
 * Не задавать здесь border/background у всех button — это в unlayered CSS
 * перебивает Tailwind (@layer utilities) и ломает bg-*, border-* на кнопках.
 * Сброс фона/бордера уже в tailwind preflight (* { border: 0 solid }, button { background-color: transparent }).
 */
button {
  cursor: pointer;
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
