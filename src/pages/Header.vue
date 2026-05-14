<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useYandexMetrika } from '../composables/useYandexMetrika'

type NavRouteItem = {
  to: string
  label: string
  type: 'route'
  href?: undefined
  /** Основной призыв к действию (отличается от обычных пунктов меню) */
  variant?: 'cta'
}

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
const leftNav: NavRouteItem[] = [
  { to: '/services', label: 'Услуги', type: 'route', href: undefined },
  { to: '/packages', label: 'Пакеты', type: 'route', href: undefined },
  { to: '/cases', label: 'Кейсы', type: 'route', href: undefined },
  { to: '/calculator', label: 'Калькулятор', type: 'route', href: undefined },
  { to: '/blog', label: 'Блог', type: 'route', href: undefined },
]
const rightNav: NavRouteItem[] = [
  { to: '/contacts', label: 'Контакты', type: 'route', href: undefined, variant: 'cta' },
]

// active-route helper
const route = useRoute()
const isActive = (to?: string) => computed(() => (to ? route.path.startsWith(to) : false))
const getRouteTo = (item: { to?: string }) => (item.to ? item.to : '/')

const desktopNavLinkClass = (item: NavRouteItem, staggerIndex: number) => {
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200'
  if (item.variant === 'cta') {
    return [
      focusRing,
      'nav-header-cta rounded-[3rem] px-5 py-2 min-h-[44px] font-semibold shadow-sm shrink-0 flex items-center justify-center',
      'focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[color-mix(in_srgb,var(--color-border)_90%,transparent)]',
    ]
  }
  return [
    'animate-nav-link',
    `delay-${staggerIndex}`,
    focusRing,
    'rounded-[3rem] py-1 px-3 text-accent hover:bg-bg hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center',
    'focus-visible:ring-accent/50 focus-visible:ring-offset-[color-mix(in_srgb,var(--color-border)_90%,transparent)]',
  ]
}

const mobileNavLinkClass = (item: NavRouteItem) => {
  if (item.variant === 'cta') {
    return 'nav-header-cta-mobile rounded-3xl py-3 px-4 font-semibold text-center shadow-sm transition-opacity duration-200'
  }
  return 'rounded-3xl py-2 px-4 text-accent hover:bg-border hover:text-white transition-colors duration-300'
}

// Close menu on route change
watch(
  () => route.path,
  () => {
    if (isMobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
)

const MOBILE_NAV_SCROLL_LOCK = 'mobile-nav-open'

/** Блокируем #stack (главная со scroll-snap), иначе жесты + backdrop-filter дают битый композитинг слоёв (артефакты / «переворот»). */
watch(isMobileMenuOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.classList.toggle(MOBILE_NAV_SCROLL_LOCK, open)
})

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
  document.body.classList.remove(MOBILE_NAV_SCROLL_LOCK)
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
    class="py-2 px-2 md:px-5 flex items-center justify-between w-full max-w-7xl mx-auto"
    aria-label="Main"
  >

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

    <!-- Left Navigation -->
    <div class="hidden md:flex gap-3">
      <template v-for="(item, index) in leftNav" :key="item.label">
        <router-link
          v-if="item.type === 'route'"
          :to="getRouteTo(item)"
          :class="desktopNavLinkClass(item, index)"
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


    <!-- Right Navigation -->
    <div class="hidden md:flex gap-3">
      <template v-for="(item, index) in rightNav" :key="item.label">
        <router-link
          v-if="item.type === 'route'"
          :to="getRouteTo(item)"
          :class="desktopNavLinkClass(item, leftNav.length + index)"
          :aria-current="isActive(item.to).value ? 'page' : undefined"
          @click="trackNavigationClick(item.label)"
        >
          {{ item.label }}
        </router-link>
        <a
          v-else
          :href="item.href"
          :class="['animate-nav-link', 'delay-' + (leftNav.length + index)]"
          class="rounded-[3rem] py-1 px-3 text-accent hover:bg-accent hover:text-accent hover:bg-none focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] min-w-[44px] flex items-center"
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

  <!-- Mobile Menu: полноэкранный backdrop + панель с top = отступ под фикс. шапку (см. body padding-top в index.html) -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-nav-overlay md:hidden fixed inset-0 z-[9999] isolate pointer-events-auto"
        role="presentation"
      >
        <div
          class="absolute inset-0 bg-black/55"
          aria-hidden="true"
          @click="closeMobileMenu"
        />
        <div
          id="mobile-menu"
          class="absolute left-0 right-0 top-16 max-h-[calc(100dvh_-_3.5rem_-_env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain rounded-b-[1.75rem] border-b border-white/10 bg-bg px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          role="dialog"
          aria-modal="true"
          aria-label="Меню навигации"
          @click.stop
        >
          <nav class="flex flex-col gap-3">
            <template v-for="item in [...leftNav, ...rightNav]" :key="item.label">
              <router-link
                v-if="item.type === 'route'"
                :to="getRouteTo(item)"
                @click="trackNavigationClick(item.label); closeMobileMenu()"
                :class="mobileNavLinkClass(item)"
                :active-class="item.variant === 'cta' ? 'nav-header-cta-mobile-active' : 'text-white'"
              >
                {{ item.label }}
              </router-link>
              <a
                v-else
                :href="item.href"
                @click="trackNavigationClick(item.label); closeMobileMenu()"
                class="rounded-3xl py-2 px-4 text-accent hover:bg-border hover:text-white transition-colors duration-300"
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
/* CTA: «Контакты» — заливка по умолчанию; при наведении фон уходит, рамка и текст accent */
.nav-header-cta {
  background-color: var(--color-accent);
  color: var(--color-bg);
  border: 1px solid transparent;
  box-sizing: border-box;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}
.nav-header-cta:hover,
.nav-header-cta.router-link-active:hover {
  background-color: transparent;
  border-color: var(--color-accent);
  color: var(--color-accent);
  filter: none;
  box-shadow: none;
}
.nav-header-cta.router-link-active {
  filter: brightness(1.12);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--color-bg) 45%, transparent),
    0 4px 14px color-mix(in srgb, var(--color-accent) 35%, transparent);
}

.nav-header-cta-mobile {
  background-color: var(--color-accent);
  color: var(--color-bg);
  border: 2px solid transparent;
  box-sizing: border-box;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}
.nav-header-cta-mobile:hover {
  background-color: transparent;
  border-color: var(--color-accent);
  color: var(--color-accent);
  filter: none;
}
.nav-header-cta-mobile-active {
  filter: brightness(1.1);
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-bg) 40%, transparent);
}

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
