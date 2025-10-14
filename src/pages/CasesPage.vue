<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { useStackScroll } from '../composables/useStackScroll'
// import { cn } from '@/utils/cn'

const PortfolioCard = defineAsyncComponent(() => import('../components/PortfolioCard.vue'))
const PortfolioModal = defineAsyncComponent(() => import('../modal/PortfolioModal.vue'))

// kept for potential future use within animations
// gsap/scrollTrigger placeholders for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gsapRef: { utils: unknown } | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scrollTriggerRef: { getAll: () => Array<{ kill: () => void }> } | null = null
const stackRoot = ref<HTMLElement | null>(null)

// Router (not needed here)

// Portfolio data
const filters = [
  'Все',
  'Интернет-магазины',
  'Корпоративные сайты',
  'Лендинги',
  'Мобильные приложения',
  'Промо-сайты',
  'Техническая поддержка',
]
const activeFilter = ref('Все')

const portfolioItems = [
  {
    id: 1,
    title: 'Интернет-магазин RB Home',
    category: 'Интернет-магазины',
    description:
      'Полнофункциональный интернет-магазин мебели и товаров для дома с системой управления заказами, интеграцией с 1С и мобильной версией.',
    bgColor: 'from-amber-50 to-amber-100',
    logoColor: 'bg-gradient-to-br from-amber-600 to-amber-800',
    logoText: 'RB-HOME',
    technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    link: '#',
    image: '/api/placeholder/400/300',
    year: '2024',
    status: 'Завершен',
  },
  {
    id: 2,
    title: 'Корпоративный сайт БЫТПЛаст',
    category: 'Корпоративные сайты',
    description:
      'Современный корпоративный сайт для производителя пластиковых изделий с каталогом продукции, системой заказов и админ-панелью.',
    bgColor: 'from-slate-50 to-slate-100',
    logoColor: 'bg-gradient-to-br from-orange-500 to-red-600',
    logoText: 'БЫТПЛаст',
    technologies: ['React', 'Next.js', 'MongoDB', 'AWS'],
    link: '#',
    image: '/api/placeholder/400/300',
    year: '2024',
    status: 'Завершен',
  },
  {
    id: 3,
    title: 'Платформа бронирования отелей',
    category: 'Мобильные приложения',
    description:
      'Мобильное приложение для бронирования отелей с геолокацией, системой отзывов, интеграцией с платежными системами и push-уведомлениями.',
    bgColor: 'from-blue-50 to-blue-100',
    logoColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
    logoText: 'BOOKING',
    technologies: ['React Native', 'Node.js', 'Redis', 'Stripe'],
    link: '#',
    image: '/api/placeholder/400/300',
    year: '2023',
    status: 'Завершен',
  },
  {
    id: 4,
    title: 'Лендинг для IT-компании',
    category: 'Лендинги',
    description:
      'Высококонверсионный лендинг для IT-компании с анимациями, формой обратной связи, интеграцией с CRM и системой аналитики.',
    bgColor: 'from-green-50 to-green-100',
    logoColor: 'bg-gradient-to-br from-green-600 to-emerald-700',
    logoText: 'IT-LAND',
    technologies: ['Vue.js', 'GSAP', 'Tailwind CSS', 'HubSpot'],
    link: '#',
    image: '/api/placeholder/400/300',
    year: '2024',
    status: 'Завершен',
  },
  {
    id: 5,
    title: 'Промо-сайт для стартапа',
    category: 'Промо-сайты',
    description:
      'Креативный промо-сайт для финтех-стартапа с интерактивными элементами, презентацией продукта и системой регистрации.',
    bgColor: 'from-purple-50 to-purple-100',
    logoColor: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    logoText: 'FINTECH',
    technologies: ['Next.js', 'Framer Motion', 'TypeScript', 'Vercel'],
    link: '#',
    image: '/api/placeholder/400/300',
    year: '2023',
    status: 'Завершен',
  },
  {
    id: 6,
    title: 'Система технической поддержки',
    category: 'Техническая поддержка',
    description:
      'Веб-приложение для управления технической поддержкой с тикет-системой, чатом, базой знаний и аналитикой.',
    bgColor: 'from-gray-50 to-gray-100',
    logoColor: 'bg-gradient-to-br from-gray-700 to-gray-900',
    logoText: 'SUPPORT',
    technologies: ['Vue.js', 'Express.js', 'Socket.io', 'MySQL'],
    link: '#',
    image: '/api/placeholder/400/300',
    year: '2024',
    status: 'В разработке',
  },
]

const filteredItems = ref(portfolioItems)
const selectedProject = ref<(typeof portfolioItems)[0] | null>(null)
const showModal = ref(false)

// Filter function
const filterItems = (filter: string) => {
  if (filter === 'Все') {
    filteredItems.value = portfolioItems
  } else {
    filteredItems.value = portfolioItems.filter((item) => item.category === filter)
  }
}

// Watch for filter changes
const handleFilterChange = (filter: string) => {
  activeFilter.value = filter
  filterItems(filter)
}

// Modal functions
const openModal = (project: (typeof portfolioItems)[0]) => {
  selectedProject.value = project
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
}

// Intersection-based lazy mounting for heavy sections
const portfolioEl = ref<HTMLElement | null>(null)
const portfolioVisible = ref(false)
useIntersectionObserver(
  portfolioEl,
  ([entry]) => {
    if (entry.isIntersecting) portfolioVisible.value = true
  },
  { rootMargin: '200px' }
)

useStackScroll(stackRoot, {
  snap: true,
  onAfterGsapReady: ({ gsap, ScrollTrigger, sections }) => {
    // Portfolio animations
    const portfolioSection = sections[0] // First section (Portfolio)
    if (portfolioSection) {
      const portfolioCards = portfolioSection.querySelectorAll('.portfolio-card')
      const filterButtons = portfolioSection.querySelectorAll('button')
      const title = portfolioSection.querySelector('.title')
      const subtitle = portfolioSection.querySelector('p')

      // Initial state for elements
      gsap.set(portfolioCards, { y: 60, opacity: 0, scale: 0.95, rotationX: 15 })
      gsap.set(filterButtons, { y: 30, opacity: 0, scale: 0.9 })
      gsap.set(subtitle, { y: 20, opacity: 0 })

      // Animate when section becomes active
      ScrollTrigger.create({
        trigger: portfolioSection,
        start: 'top center',
        onEnter: () => {
          // Animate title (if not already animated)
          if (title && !(title as HTMLElement).dataset.portfolioAnimated) {
            gsap.fromTo(
              title,
              { y: 30, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
            )
            ;(title as HTMLElement).dataset.portfolioAnimated = 'true'
          }

          // Animate subtitle
          gsap.to(subtitle, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.2,
          })

          // Animate filter buttons
          gsap.to(filterButtons, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.1,
            delay: 0.4,
          })

          // Animate portfolio cards
          gsap.to(portfolioCards, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: {
              each: 0.15,
              from: 'start',
            },
            delay: 0.6,
          })
        },
        onLeaveBack: () => {
          gsap.set(portfolioCards, { y: 60, opacity: 0, scale: 0.95, rotationX: 15 })
          gsap.set(filterButtons, { y: 30, opacity: 0, scale: 0.9 })
          gsap.set(subtitle, { y: 20, opacity: 0 })
        },
      })

      // Enhanced hover animations for portfolio cards (matching what we do style)
      portfolioCards.forEach((card) => {
        const icon = card.querySelector('.icon-container')
        const title = card.querySelector('h3')
        const description = card.querySelector('p')
        const techTags = card.querySelectorAll('.tech-tag')
        const viewButton = card.querySelector('.flex.items-center.justify-between')

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.02,
            y: -5,
            duration: 0.3,
            ease: 'power2.out',
          })

          // Animate icon (matching what we do style)
          if (icon) {
            gsap.to(icon, {
              scale: 1.1,
              rotation: 360,
              duration: 0.6,
              ease: 'back.out(1.7)',
            })
          }

          // Animate title color change
          if (title) {
            gsap.to(title, {
              color: 'var(--color-accent)',
              duration: 0.3,
              ease: 'power2.out',
            })
          }

          // Animate description
          if (description) {
            gsap.to(description, {
              color: '#ffffff',
              duration: 0.3,
              ease: 'power2.out',
            })
          }

          // Stagger animate tech tags
          gsap.to(techTags, {
            scale: 1.05,
            y: -2,
            duration: 0.2,
            ease: 'power2.out',
            stagger: 0.05,
          })

          // Animate view button
          if (viewButton) {
            gsap.to(viewButton, {
              x: 5,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          })

          // Reset icon
          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              duration: 0.4,
              ease: 'power2.out',
            })
          }

          // Reset title
          if (title) {
            gsap.to(title, {
              color: '#ffffff',
              duration: 0.3,
              ease: 'power2.out',
            })
          }

          // Reset description
          if (description) {
            gsap.to(description, {
              color: 'rgba(255, 255, 255, 0.7)',
              duration: 0.3,
              ease: 'power2.out',
            })
          }

          // Reset tech tags
          gsap.to(techTags, {
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          })

          // Reset view button
          if (viewButton) {
            gsap.to(viewButton, {
              x: 0,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
        })
      })

      // Add click animation for filter buttons
      filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          })
        })
      })
    }

    // Creative title animation: wave-in + shimmer (robust to pinning)
    const titles = gsap.utils.toArray('.title:not(.no-title-effects)') as unknown[] as HTMLElement[]
    titles.forEach((title) => {
      // Skip if already processed
      if (title.dataset.animated === 'true') return
      const originalText = title.textContent || ''
      title.innerHTML = ''
      const wrapper = document.createElement('span')
      wrapper.className = 'inline-block relative'
      // Build gradient shimmer underline
      const shimmer = document.createElement('span')
      shimmer.className = 'absolute left-0 -bottom-1 h-[2px] w-full'
      shimmer.setAttribute(
        'style',
        'background: linear-gradient(90deg, color-mix(in oklab, var(--color-purple, #7D53FF) 20%, transparent) 0%, var(--color-purple, #7D53FF) 50%, color-mix(in oklab, var(--color-purple, #7D53FF) 20%, transparent) 100%); background-size: 200% 100%;'
      )

      // Wrap each character
      const letterNodes: HTMLElement[] = []
      for (const ch of originalText) {
        const span = document.createElement('span')
        span.textContent = ch
        span.className = 'inline-block will-change-transform'
        wrapper.appendChild(span)
        letterNodes.push(span)
      }
      title.appendChild(wrapper)
      title.appendChild(shimmer)
      title.dataset.animated = 'true'

      // Initial state
      gsap.set(letterNodes, { yPercent: 30, opacity: 0, rotateX: -60, transformPerspective: 600 })
      gsap.set(shimmer, { backgroundPositionX: '0%' })

      // Trigger when title approaches viewport (works with pinned sections)
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(letterNodes, {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: { each: 0.035, from: 'start' },
          })
          gsap.to(shimmer, {
            backgroundPositionX: '200%',
            duration: 2.4,
            ease: 'none',
            repeat: 1,
            yoyo: true,
          })
        },
      })

      // If already in view on load, animate immediately
      const rect = (title as HTMLElement).getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.8) {
        gsap.to(letterNodes, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.035, from: 'start' },
        })
        gsap.to(shimmer, {
          backgroundPositionX: '200%',
          duration: 2.4,
          ease: 'none',
          repeat: 1,
          yoyo: true,
        })
      }
    })

    // Forcefully ensure titles opted-out from effects are fully opaque and clean
    const fixedTitles = gsap.utils.toArray('.title.no-title-effects') as unknown[] as HTMLElement[]
    fixedTitles.forEach((t: HTMLElement) => {
      gsap.set(t, { opacity: 1, clearProps: 'opacity,transform' })
    })

    // ensure ScrollTrigger positions are recalculated after stack TL is built
    ScrollTrigger.refresh()
  },
})

// cleanup handled in useStackScroll
</script>

<template>
  <div id="stack" class="relative" ref="stackRoot">
    <div class="w-full max-w-7xl">
      <h2
        class="title no-title-effects text-3xl sm:text-4xl md:text-4xl font-black text-[var(--color-accent)] tracking-tight mb-4 md:mb-6 lg:mb-8 text-center"
      >
        Портфолио
      </h2>

      <!-- Filter Buttons -->
      <div
        class="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 mb-8 md:mb-10 lg:mb-12 w-full"
      >
        <button
          v-for="filter in filters"
          :key="filter"
          @click="handleFilterChange(filter)"
          :class="
            'px-4 py-2 rounded-full transition-all duration-300 text-[0.7rem] relative overflow-hidden group' +
            (activeFilter === filter
              ? ' bg-blue-500 text-white shadow-lg'
              : ' bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10')
          "
        >
          <span class="relative z-10">{{ filter }}</span>
          <div
            v-if="activeFilter === filter"
            class="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </button>
      </div>

      <!-- Portfolio Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 w-full">
        <template v-if="portfolioVisible">
          <PortfolioCard
            v-for="item in filteredItems"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :category="item.category"
            :description="item.description"
            :bgColor="item.bgColor"
            :logoColor="item.logoColor"
            :logoText="item.logoText"
            :technologies="item.technologies"
            :link="item.link"
            :image="item.image"
            :year="item.year"
            :status="item.status"
            @click="openModal"
          />
        </template>
      </div>

      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="text-center py-16">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Проекты не найдены</h3>
        <p class="text-gray-600">Попробуйте выбрать другую категорию</p>
      </div>
    </div>
  </div>

  <!-- Project Modal -->
  <PortfolioModal :showModal="showModal" :selectedProject="selectedProject" @close="closeModal" />
</template>

<style scoped>
/* Portfolio specific styles - matching what we do style */
.portfolio-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.portfolio-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px -12px rgba(0, 223, 130, 0.3);
}

/* Filter button animations - matching what we do style */
.filter-button {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.filter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 223, 130, 0.2), transparent);
  transition: left 0.5s;
}

.filter-button:hover::before {
  left: 100%;
}

/* Tech tag animations - matching what we do style */
.tech-tag {
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 223, 130, 0.2);
  background-color: rgba(255, 255, 255, 0.2);
}

/* Status badge animations */
.status-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Loading state for cards */
.portfolio-card.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .portfolio-card {
    margin-bottom: 1rem;
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Dark mode support - matching what we do style */
@media (prefers-color-scheme: dark) {
  .portfolio-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(3, 98, 76, 0.6);
  }

  .portfolio-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: var(--color-accent);
  }

  .portfolio-card h3 {
    color: #ffffff;
  }

  .portfolio-card p {
    color: rgba(255, 255, 255, 0.7);
  }

  .filter-button {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(3, 98, 76, 0.6);
  }

  .tech-tag {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>

