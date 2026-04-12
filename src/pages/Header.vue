<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useYandexMetrika } from '../composables/useYandexMetrika'

defineOptions({ name: 'AppHeader' })

defineProps<{
  dataVInspector?: string
}>()

const { trackNavigationClick } = useYandexMetrika()

// menu state
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// navigation model
const leftNav = [
  { to: '/services', label: 'Сервисы', type: 'route' as const, href: undefined },
  { to: '/packages', label: 'Пакеты', type: 'route' as const, href: undefined },
  { to: '/cases', label: 'Кейсы', type: 'route' as const, href: undefined },
  { to: '/calculator', label: 'Калькулятор', type: 'route' as const, href: undefined },
]
const rightNav = [
  { to: '/blog', label: 'Блог', type: 'route' as const, href: undefined },
  { to: '/contacts', label: 'Контакты', type: 'route' as const, href: undefined },
  { to: '/client-form', label: 'Стать клиентом', type: 'route' as const, href: undefined },
]

// active-route helper
const route = useRoute()
const isActive = (to?: string) => computed(() => (to ? route.path.startsWith(to) : false))
const getRouteTo = (item: { to?: string }) => (item.to ? item.to : '/')

// Close menu on route change
watch(
  () => route.path,
  () => {
    if (isMobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
)

// Close menu on outside click
const handleClickOutside = (event: MouseEvent) => {
  if (!isMobileMenuOpen.value) return

  const target = event.target as HTMLElement
  const clickedElement = target.closest('button') || target

  // Check if click is on the burger menu button
  const isMenuButton =
    clickedElement.getAttribute('aria-expanded') !== null ||
    clickedElement.closest('button[aria-expanded]') !== null

  // Check if click is inside the mobile menu
  const mobileMenuRef = document.getElementById('mobile-menu')
  const isInsideMenu = mobileMenuRef?.contains(target) || false

  // Close menu only if clicking outside menu and not on menu button
  if (!isMenuButton && !isInsideMenu && mobileMenuRef) {
    closeMobileMenu()
  }
}

// Store handlers for cleanup
let onKeyHandler: ((e: KeyboardEvent) => void) | null = null
let clickHandler: ((event: MouseEvent) => void) | null = null

onMounted(() => {
  // Add click outside listener - only when menu is open
  const handleDocumentClick = (event: MouseEvent) => {
    if (isMobileMenuOpen.value) {
      handleClickOutside(event)
    }
  }
  document.addEventListener('click', handleDocumentClick, true)

  // Store handler for cleanup
  clickHandler = handleDocumentClick

  // accessibility: close on Escape
  onKeyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMobileMenu()
  }
  window.addEventListener('keydown', onKeyHandler)
})

// Cleanup event listeners
onBeforeUnmount(() => {
  if (onKeyHandler) {
    window.removeEventListener('keydown', onKeyHandler)
  }
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, true)
  }
})
</script>

<template>
  <nav
    class="bg-border/90 backdrop-blur py-2 px-2 md:px-5 flex items-center rounded-3xl justify-between w-full"
    aria-label="Main"
  >
    <!-- Left Navigation -->
    <div class="hidden md:flex gap-3">
      <template v-for="(item, index) in leftNav" :key="item.label">
        <router-link
          v-if="item.type === 'route'"
          :to="getRouteTo(item)"
          :class="['animate-nav-link', 'delay-' + index]"
          class="rounded-[3rem] py-1 px-3 text-accent hover:bg-bg hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[44px] min-w-[44px] flex items-center"
          :aria-current="isActive(item.to).value ? 'page' : undefined"
          @click="trackNavigationClick(item.label)"
        >
          {{ item.label }}
        </router-link>
        <a
          v-else
          :href="item.href"
          :class="['animate-nav-link', 'delay-' + index]"
          class="rounded-[3rem] py-1 px-3 text-accent hover:bg-border hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[44px] min-w-[44px] flex items-center"
          @click="trackNavigationClick(item.label)"
        >
          {{ item.label }}
        </a>
      </template>
    </div>

    <!-- Center Logo -->
    <div class="flex px-2 md:px-3 flex-1 md:flex-none justify-start md:justify-center">
      <router-link
        to="/"
        class="inline-flex items-center"
        @click="closeMobileMenu"
        aria-label="Главная страница"
      >
        <div
          ref="brandLogoRef"
          class="font-extrabold text-2xl text-center relative"
          style="cursor: pointer"
          role="img"
          aria-label="Kodify"
        >
          <span ref="brandFirstRef" class="inline-block text-accent"> K </span>
          <span ref="brandCharsRef" class="inline-block">
            <span data-ch class="inline-block">o</span>
            <span data-ch class="inline-block">d</span>
            <span data-ch class="inline-block">i</span>
            <span ref="brandCodeRef" class="inline-block">
              <span data-ch data-code class="inline-block">f</span>
              <span data-ch data-code class="inline-block">y</span>
            </span>
          </span>
          <span
            ref="brandUnderlineRef"
            class="absolute left-0 -bottom-1 h-[2px] w-full"
            style="
              background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
            "
          ></span>
        </div>
      </router-link>
    </div>

    <!-- Right Navigation -->
    <div class="hidden md:flex gap-3">
      <template v-for="(item, index) in rightNav" :key="item.label">
        <router-link
          v-if="item.type === 'route'"
          :to="getRouteTo(item)"
          :class="['animate-nav-link', 'delay-' + (leftNav.length + index)]"
          class="rounded-[3rem] py-1 px-3 text-accent hover:bg-bg hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[44px] min-w-[44px] flex items-center"
          :aria-current="isActive(item.to).value ? 'page' : undefined"
          @click="trackNavigationClick(item.label)"
        >
          {{ item.label }}
        </router-link>
        <a
          v-else
          :href="item.href"
          :class="['animate-nav-link', 'delay-' + (leftNav.length + index)]"
          class="rounded-[3rem] py-1 px-3 text-accent hover:bg-border hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[44px] min-w-[44px] flex items-center"
          @click="trackNavigationClick(item.label)"
        >
          {{ item.label }}
        </a>
      </template>
    </div>

    <!-- Mobile Menu Button -->
    <button
      @click.stop="toggleMobileMenu"
      class="md:hidden p-3 text-accent relative z-[10000] min-h-[44px] min-w-[44px] flex items-center justify-center"
      :aria-expanded="isMobileMenuOpen"
      :aria-label="isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
      type="button"
    >
      <svg
        v-if="!isMobileMenuOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </nav>

  <!-- Mobile Menu -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="isMobileMenuOpen"
        ref="mobileMenuRef"
        id="mobile-menu"
        class="md:hidden fixed top-[70px] left-0 right-0 w-full px-4 z-[9999]"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-bg/95 backdrop-blur rounded-2xl p-4">
          <nav class="flex flex-col space-y-3">
            <template v-for="item in [...leftNav, ...rightNav]" :key="item.label">
              <router-link
                v-if="item.type === 'route'"
                :to="getRouteTo(item)"
                @click="trackNavigationClick(item.label); closeMobileMenu()"
                class="rounded-2xl py-2 px-4 text-accent hover:bg-border hover:text-white transition-colors duration-300"
                active-class="text-white"
              >
                {{ item.label }}
              </router-link>
              <a
                v-else
                :href="item.href"
                @click="trackNavigationClick(item.label); closeMobileMenu()"
                class="rounded-2xl py-2 px-4 text-accent hover:bg-border hover:text-white transition-colors duration-300"
              >
                {{ item.label }}
              </a>
            </template>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Custom styles for the header */
.text-accent {
  color: var(--color-accent);
}

.bg-bg {
  background-color: var(--color-bg);
}

.border-border {
  border-color: var(--color-border);
}

.hover\:bg-border:hover {
  background-color: var(--color-border);
}

.focus\:ring-accent\/50:focus {
  --tw-ring-color: var(--text-accent);
}

/* Mobile menu animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition-duration: 0.01ms;
  }

  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    transform: none;
  }
}

/* Logo hover effects */
.font-extrabold:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Underline shimmer animation */
@keyframes underline-shimmer {
  0% {
    background-position-x: 0%;
  }
  100% {
    background-position-x: 200%;
  }
}

/* Code character hover animation */
.logo-container:hover .code-char {
  animation: code-rotate 1.1s ease-out forwards;
}

.logo-container:hover .code-char:nth-child(2) {
  animation-delay: 0.06s;
}

.logo-container:not(:hover) .code-char {
  animation: code-rotate-back 0.6s ease-in-out forwards;
}

.logo-container:not(:hover) .code-char:nth-child(2) {
  animation-delay: 0.04s;
}

@keyframes code-rotate {
  0% {
    transform: rotateY(0);
    color: currentColor;
  }
  100% {
    transform: rotateY(360deg);
    color: #7d53ff;
  }
}

@keyframes code-rotate-back {
  0% {
    transform: rotateY(360deg);
    color: #7d53ff;
  }
  100% {
    transform: rotateY(0);
    color: currentColor;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hidden.md\:flex {
    display: none;
  }
}

@media (min-width: 769px) {
  .md\:flex {
    display: flex;
  }

  .md\:hidden {
    display: none;
  }
}
</style>
