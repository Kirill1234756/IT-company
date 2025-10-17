<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'AppHeader' })

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
  { to: '/services', label: 'Services', type: 'route' as const },
  { href: '#projects', label: 'Контакты', type: 'anchor' as const },
  { href: '#about', label: 'About', type: 'anchor' as const },
]
const rightNav = [
  { to: '/blog', label: 'Blog', type: 'route' as const },
  { to: '/cases', label: 'Cases', type: 'route' as const },
  { to: '/client-form', label: 'Стать клиентом', type: 'route' as const },
]

// Refs for animations
// removed unused headerRef
const navLeftRef = ref<HTMLElement>()
const navRightRef = ref<HTMLElement>()
const brandLogoRef = ref<HTMLElement>()
const brandFirstRef = ref<HTMLElement>()
const brandCharsRef = ref<HTMLElement>()
const brandCodeRef = ref<HTMLElement>()
const brandUnderlineRef = ref<HTMLElement>()
const mobileMenuRef = ref<HTMLElement>()

// gsap references (loaded dynamically)
let gsapRef: any = null
let codeTimeline: any = null

const initCodeAnimation = () => {
  if (!gsapRef) return
  const codeElements = Array.from(brandCodeRef.value?.querySelectorAll('[data-code]') ?? [])
  if (!codeElements.length) return

  gsapRef.set(codeElements, {
    transformPerspective: 800,
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    willChange: 'transform, color',
    force3D: true,
  })

  codeTimeline = gsapRef.timeline({ paused: true })
  codeTimeline
    .to(codeElements, {
      rotateY: 360,
      color: '#7D53FF',
      duration: 1.1,
      ease: 'power2.out',
      stagger: { each: 0.06, from: 'center' },
    })
    .to(
      codeElements,
      {
        rotateY: 0,
        color: 'currentColor',
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: { each: 0.04, from: 'end' },
      },
      '>-0.05'
    )
}

const playCodeAnimation = () => {
  if (!codeTimeline) initCodeAnimation()
  codeTimeline?.restart()
}
const reverseCodeAnimation = () => codeTimeline?.reverse()

// active-route helper
const route = useRoute()
const isActive = (to?: string) => computed(() => (to ? route.path.startsWith(to) : false))
const getRouteTo = (item: { to?: string }) => (item.to ? item.to : '/')

onMounted(async () => {
  // Defer GSAP to next frame/idle to avoid early layout shifts impacting CLS
  await new Promise((r) => requestAnimationFrame(() => r(null)))
  if ('requestIdleCallback' in window) {
    await new Promise<void>((resolve) => (window as any).requestIdleCallback(() => resolve()))
  }

  const { gsap } = await import('gsap')
  gsapRef = gsap

  nextTick(() => {
    if (brandLogoRef.value) {
      brandLogoRef.value.addEventListener('pointerenter', playCodeAnimation, { passive: true })
      brandLogoRef.value.addEventListener('pointerleave', reverseCodeAnimation, { passive: true })
    }

    if (!codeTimeline) initCodeAnimation()

    const navLeftLinks = Array.from(navLeftRef.value?.querySelectorAll('a') ?? [])
    const navRightLinks = Array.from(navRightRef.value?.querySelectorAll('a') ?? [])
    const allNavLinks = [...navLeftLinks, ...navRightLinks]

    const brandChars = Array.from(brandCharsRef.value?.querySelectorAll('[data-ch]') ?? [])

    const timeline = gsapRef.timeline({ defaults: { ease: 'power3.out' } })

    if (brandFirstRef.value) {
      timeline.from(brandFirstRef.value, {
        y: -30,
        opacity: 0,
        rotate: -18,
        scale: 0.5,
        duration: 0.8,
        transformOrigin: '50% 80%',
      })
    }

    timeline.add(() => {
      brandChars.forEach((char, index) => {
        const duration = 0.5 + (index % 3) * 0.12
        const delay = index * 0.1
        const animationType = index % 4

        switch (animationType) {
          case 0:
            gsapRef.from(char, {
              opacity: 0,
              y: 22,
              rotateX: -70,
              transformPerspective: 500,
              duration,
              delay,
            })
            break
          case 1:
            gsapRef.from(char, { opacity: 0, x: -18, rotate: -12, skewY: 8, duration, delay })
            break
          case 2:
            gsapRef.from(char, { opacity: 0, y: -20, scale: 0.6, rotate: 10, duration, delay })
            break
          default:
            gsapRef.from(char, {
              opacity: 0,
              x: 20,
              rotateY: -90,
              transformPerspective: 500,
              duration,
              delay,
            })
        }
      })
    }, '-=0.15')

    if (brandUnderlineRef.value) {
      timeline.from(
        brandUnderlineRef.value,
        { scaleX: 0, opacity: 0, transformOrigin: '0% 50%', duration: 0.6 },
        '-=0.15'
      )
      gsapRef.fromTo(
        brandUnderlineRef.value,
        { backgroundPositionX: '0%' },
        { backgroundPositionX: '200%', duration: 4, repeat: -1, ease: 'none' }
      )
    }

    timeline.from(allNavLinks, { y: 14, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.2')

    if (mobileMenuRef.value) {
      timeline.from(mobileMenuRef.value, { opacity: 0, scale: 0.9, duration: 0.4 }, '-=0.3')
    }
  })

  // accessibility: close on Escape
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMobileMenu()
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <nav
    class="bg-bg/90 backdrop-blur py-2 px-2 md:px-5 flex items-center rounded-3xl justify-between w-full border border-border/30"
    aria-label="Main"
  >
    <!-- Left Navigation -->
    <div ref="navLeftRef" class="hidden md:flex gap-3">
      <template v-for="item in leftNav" :key="item.label">
        <router-link
          v-if="item.type === 'route'"
          :to="getRouteTo(item)"
          class="rounded-2xl py-1 px-3 text-accent border border-border hover:bg-border hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
          :aria-current="isActive(item.to).value ? 'page' : undefined"
        >
          {{ item.label }}
        </router-link>
        <a
          v-else
          :href="item.href"
          class="rounded-2xl py-1 px-3 text-accent border border-border hover:bg-border hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {{ item.label }}
        </a>
      </template>
    </div>

    <!-- Center Logo -->
    <div class="flex px-2 md:px-3 flex-1 md:flex-none justify-start md:justify-center">
      <router-link to="/" class="inline-flex items-center" @click="closeMobileMenu">
        <h1
          ref="brandLogoRef"
          class="font-extrabold text-2xl text-center relative"
          style="cursor: pointer"
        >
          <span ref="brandFirstRef" class="inline-block text-accent"> N </span>
          <span ref="brandCharsRef" class="inline-block">
            <span data-ch class="inline-block">e</span>
            <span data-ch class="inline-block">x</span>
            <span data-ch class="inline-block">t</span>
            <span ref="brandCodeRef" class="inline-block will-change-transform">
              <span data-ch data-code class="inline-block">C</span>
              <span data-ch data-code class="inline-block">o</span>
              <span data-ch data-code class="inline-block">d</span>
              <span data-ch data-code class="inline-block">e</span>
            </span>
          </span>
          <span
            ref="brandUnderlineRef"
            class="absolute left-0 -bottom-1 h-[2px] w-full"
            style="
              background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
            "
          ></span>
        </h1>
      </router-link>
    </div>

    <!-- Right Navigation -->
    <div ref="navRightRef" class="hidden md:flex gap-3" v-route-prefetch>
      <template v-for="item in rightNav" :key="item.label">
        <router-link
          v-if="item.type === 'route'"
          :to="getRouteTo(item)"
          class="rounded-2xl py-1 px-3 text-accent border border-border hover:bg-border hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
          :aria-current="isActive(item.to).value ? 'page' : undefined"
        >
          {{ item.label }}
        </router-link>
        <a
          v-else
          :href="item.href"
          class="rounded-2xl py-1 px-3 text-accent border border-border hover:bg-border hover:text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {{ item.label }}
        </a>
      </template>
    </div>

    <!-- Mobile Menu Button -->
    <button
      @click="toggleMobileMenu"
      class="md:hidden p-2 text-accent"
      :aria-expanded="isMobileMenuOpen"
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
        class="md:hidden absolute top-[64px] left-0 w-full px-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-bg/95 backdrop-blur rounded-2xl border border-border/30 p-4">
          <nav class="flex flex-col space-y-3">
            <template v-for="item in [...leftNav, ...rightNav]" :key="item.label">
              <router-link
                v-if="item.type === 'route'"
                :to="getRouteTo(item)"
                @click="closeMobileMenu"
                class="rounded-2xl py-2 px-4 text-accent border border-border hover:bg-border hover:text-white transition-colors duration-300"
                active-class="bg-border text-white"
              >
                {{ item.label }}
              </router-link>
              <a
                v-else
                :href="item.href"
                @click="closeMobileMenu"
                class="rounded-2xl py-2 px-4 text-accent border border-border hover:bg-border hover:text-white transition-colors duration-300"
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
  --tw-ring-color: rgba(0, 223, 130, 0.5);
}

/* Mobile menu animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Logo hover effects */
.font-extrabold:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
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
