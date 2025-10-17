<script setup lang="ts">
import { RouterView } from 'vue-router'
import { defineAsyncComponent, onMounted } from 'vue'
import Loader from './components/Loader.vue'
import { usePageLoader } from './composables/usePageLoader'
const Header = defineAsyncComponent(() => import('./pages/Header.vue'))

const { isLoading, progress, isRouteChange, initLoader, initRouterLoader } = usePageLoader()

onMounted(() => {
  initLoader()
  initRouterLoader()
})
</script>

<template>
  <main id="app">
    <Loader v-if="isLoading" :progress="progress" :is-route-change="isRouteChange" />
    <header
      ref="headerRef"
      class="fixed top-[0.7rem] left-0 w-full flex justify-center items-center z-10 px-3 md:px-12 lg:px-[8rem]"
    >
      <Header />
    </header>
    <RouterView />

    <!-- Telegram Icon -->
    <a
      href="https://t.me/your_telegram_username"
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
  --color-bg: #0a0a0a;
  --color-border: #1a1a1a;
  --color-accent: #00df82;
  --color-purple: #7d53ff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--color-bg);
  color: white;
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
*:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

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

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
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

/* Responsive utilities */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
}

/* Animation utilities */
.transition-all {
  transition: all 0.3s ease;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: ease-in-out;
}

/* Gradient utilities */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-\[var\(--color-accent\)\] {
  --tw-gradient-from: var(--color-accent);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 223, 130, 0));
}

.to-\[var\(--color-purple\)\] {
  --tw-gradient-to: var(--color-purple);
}

/* Border utilities */
.border {
  border-width: 1px;
}

.border-white\/10 {
  border-color: rgba(255, 255, 255, 0.1);
}

.border-\[var\(--color-accent\)\]\/20 {
  border-color: rgba(0, 223, 130, 0.2);
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-2xl {
  border-radius: 1rem;
}

.rounded-3xl {
  border-radius: 1.5rem;
}

/* Shadow utilities */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-\[var\(--color-accent\)\]\/30 {
  box-shadow: 0 10px 15px -3px rgba(0, 223, 130, 0.3);
}

/* Backdrop utilities */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Position utilities */
.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.top-0 {
  top: 0;
}

.left-0 {
  left: 0;
}

.right-0 {
  right: 0;
}

.z-50 {
  z-index: 50;
}

/* Display utilities */
.hidden {
  display: none;
}

.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

/* Width utilities */
.w-6 {
  width: 1.5rem;
}

.w-8 {
  width: 2rem;
}

.w-full {
  width: 100%;
}

/* Height utilities */
.h-6 {
  height: 1.5rem;
}

.h-8 {
  height: 2rem;
}

.h-full {
  height: 100%;
}

/* Padding utilities */
.p-2 {
  padding: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

/* Margin utilities */
.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

/* Text utilities */
.text-white {
  color: white;
}

.text-white\/80 {
  color: rgba(255, 255, 255, 0.8);
}

.text-white\/70 {
  color: rgba(255, 255, 255, 0.7);
}

.text-\[var\(--color-accent\)\] {
  color: var(--color-accent);
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

/* Hover utilities */
.hover\:text-white:hover {
  color: white;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-\[var\(--color-accent\)\]\/30:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 223, 130, 0.3);
}

/* Media queries */
@media (min-width: 768px) {
  .md\:flex {
    display: flex;
  }

  .md\:hidden {
    display: none;
  }

  .md\:block {
    display: block;
  }

  .md\:space-x-8 > * + * {
    margin-left: 2rem;
  }
}
</style>
