<script setup lang="ts">
import {
  ref,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  computed,
  watch,
  nextTick,
  watchEffect,
} from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
// import { useStackScroll } from '../composables/useStackScroll'
import { usePortfolioStore } from '../stores/portfolio'
import type { FilterType, PortfolioProject } from '../types/portfolio'
import { useHead } from '@unhead/vue'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'
// import { cn } from '@/utils/cn'

// Ленивая загрузка компонентов с оптимизацией
const PortfolioCard = defineAsyncComponent({
  loader: () => import('../components/PortfolioCard.vue'),
  loadingComponent: () => import('../components/ui/Loader.vue'),
  errorComponent: () => import('../pages/NotFound.vue'),
  delay: 200,
  timeout: 3000,
})

const PortfolioModal = defineAsyncComponent({
  loader: () => import('../components/modals/PortfolioModal.vue'),
  loadingComponent: () => import('../components/ui/Loader.vue'),
  errorComponent: () => import('../pages/NotFound.vue'),
  delay: 200,
  timeout: 3000,
})

// Use Pinia store
const portfolioStore = usePortfolioStore()

// GSAP refs for animations
const portfolioContainer = ref<HTMLElement | null>(null)

// Intersection-based lazy mounting for heavy sections
const portfolioEl = ref<HTMLElement | null>(null)
const portfolioVisible = ref(true) // Изменили на true для немедленного отображения

// Optimized intersection observer with debouncing
let lastIntersectionState = true
let debounceTimer: ReturnType<typeof setTimeout> | null = null

useIntersectionObserver(
  portfolioEl,
  ([entry]) => {
    const isIntersecting = entry?.isIntersecting ?? false

    // Debounce updates to prevent excessive re-renders
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      if (isIntersecting !== lastIntersectionState) {
        lastIntersectionState = isIntersecting
        portfolioVisible.value = isIntersecting
      }
    }, 100) // 100ms debounce
  },
  {
    rootMargin: '200px',
    threshold: 0.1, // Only trigger when 10% of element is visible
  }
)

// Router (not needed here)

// Мемоизированные константы
const filters = computed(() => [
  'Все',
  'Интернет-магазины',
  'Корпоративные сайты',
  'Лендинги',
  'Мобильные приложения',
  'Промо-сайты',
  'Техническая поддержка',
])

// Мемоизированное маппирование фильтров
const filterMap = computed(
  () =>
    ({
      Все: 'all',
      'Интернет-магазины': 'ecommerce',
      'Корпоративные сайты': 'corporate',
      Лендинги: 'landing',
      'Мобильные приложения': 'mobile',
      'Промо-сайты': 'promo',
      'Техническая поддержка': 'tech-support',
    } as const)
)

// Reactive refs from store (state + computed)
const {
  activeFilter,
  selectedProject,
  filteredProjects: filteredItems,
} = storeToRefs(portfolioStore)

// Router
const router = useRouter()
const route = useRoute()

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

// Actions (keep methods from store directly)
const { setActiveFilter, setSelectedProject, fetchProjects, getProjectSlug, findProjectBySlug } =
  portfolioStore

// (No local mirrors needed; storeToRefs keeps reactivity intact)

const showModal = ref(false)

// Общие стили для всех кнопок фильтров
const filterButtonStyles = {
  bg: '!bg-accent',
  border: 'border-rose-custom',
  hover: 'hover:bg-[#ae70ac] hover:border-[#ae70ac]',
  inner: 'bg-[#ae70ac]',
}

// Мемоизированные функции для работы с цветами
const getFilterColor = () => {
  // Все кнопки имеют одинаковые стили
  return `${filterButtonStyles.bg} ${filterButtonStyles.border} ${filterButtonStyles.hover}`
}

// Функция больше не нужна, так как все стили в CSS классах

// Мемоизированная функция для внутренних цветов
const getInnerColor = () => {
  return filterButtonStyles.inner
}

// Мемоизированная функция обработки фильтров
const handleFilterChange = (filter: string) => {
  const storeFilter = filterMap.value[filter as keyof typeof filterMap.value] ?? 'all'
  setActiveFilter(storeFilter as FilterType)
}

// Функции для работы с URL теперь импортируются из store

// Мемоизированные функции модального окна
const openModal = (project: PortfolioProject) => {
  setSelectedProject(project)
  showModal.value = true

  // Обновляем URL для прямых ссылок
  const slug = getProjectSlug(project.title)
  router.push(`/cases/${slug}`)
}

const closeModal = () => {
  showModal.value = false
  setSelectedProject(null)
  // Убеждаемся, что мы остаемся на странице Cases
  nextTick(() => {
    router.push('/cases')
  })
}

// Watcher для отслеживания изменений маршрута
watch(
  () => route.params.projectTitle,
  (newProjectTitle) => {
    if (newProjectTitle) {
      const project = findProjectBySlug(newProjectTitle as string)
      if (project) {
        setSelectedProject(project)
        showModal.value = true
      }
    } else {
      // Если убрали projectTitle из URL, закрываем модальное окно
      if (showModal.value) {
        showModal.value = false
        setSelectedProject(null)
      }
    }
  }
)

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

// Флаг для предотвращения повторного запуска анимаций
const isAnimationInitialized = ref(false)
// Счетчик попыток инициализации для предотвращения бесконечных рекурсий
let initAttempts = 0
const MAX_INIT_ATTEMPTS = 5

// Load projects and initialize GSAP animations on mount
onMounted(async () => {
  fetchProjects()

  // Обработка URL параметров для прямых ссылок на проекты
  const projectTitle = route.params.projectTitle as string
  if (projectTitle) {
    const project = findProjectBySlug(projectTitle)
    if (project) {
      openModal(project)
    } else {
      router.replace('/cases')
    }
  }

  // Проверяем prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return
  }

  // Defer GSAP loading until after LCP для оптимизации производительности
  const initGSAP = async () => {
    try {
      // Этап 1: Дождаться idle времени или LCP
      const isMobile = window.innerWidth < 768
      const delay = isMobile ? 2000 : 1500

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => {}, { priority: 'background', delay })
      } else if ('requestIdleCallback' in window) {
        await new Promise<void>((resolve) =>
          (
            window as Window & { requestIdleCallback: (callback: () => void) => void }
          ).requestIdleCallback(() => resolve(), { timeout: delay })
        )
      } else {
        await new Promise((r) => setTimeout(r, delay))
      }

      // Этап 2: Загрузить GSAP
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Yield для разбиения длинной задачи
      await new Promise((r) => setTimeout(r, 0))

      // Этап 3: Поиск элементов в секции
      const container = portfolioContainer.value
      if (!container) return

      // Ждем загрузки асинхронных компонентов
      await new Promise((r) => setTimeout(r, 200))
      await nextTick()

      const portfolioCards = Array.from(
        container.querySelectorAll('.portfolio-card')
      ) as HTMLElement[]
      const filterButtons = Array.from(container.querySelectorAll('button')) as HTMLElement[]
      const title = container.querySelector('.title') as HTMLElement
      const subtitle = container.querySelector('p') as HTMLElement

      // Проверяем наличие элементов - если их нет, ждем еще
      if (portfolioCards.length === 0 && filterButtons.length === 0) {
        initAttempts++
        if (initAttempts < MAX_INIT_ATTEMPTS) {
          setTimeout(() => initGSAP(), 500)
        }
        return
      }

      // Сбрасываем счетчик при успешной инициализации
      initAttempts = 0

      // Initial state for elements
      if (portfolioCards.length > 0) {
        gsap.set(portfolioCards, { y: 60, opacity: 0, scale: 0.85, rotationY: 20 })
      }
      if (filterButtons.length > 0) {
        gsap.set(filterButtons, { y: 30, opacity: 0, scale: 0.9 })
      }
      if (title) {
        gsap.set(title, { opacity: 0, y: 40, scale: 0.95 })
      }
      if (subtitle) {
        gsap.set(subtitle, { y: 20, opacity: 0 })
      }

      // Этап 4: Создание timeline и анимаций через ScrollTrigger
      ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          if (isAnimationInitialized.value) return
          isAnimationInitialized.value = true

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

          // Анимация заголовка - плавное появление сверху
          if (title && !title.dataset.portfolioAnimated) {
            tl.to(
              title,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
              },
              0
            )
            title.dataset.portfolioAnimated = 'true'
          }

          // Анимация подзаголовка
          if (subtitle) {
            tl.to(
              subtitle,
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
              },
              '-=0.5'
            )
          }

          // Анимация кнопок фильтров - каскадное появление
          if (filterButtons.length > 0) {
            tl.to(
              filterButtons,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                stagger: {
                  each: 0.08,
                  from: 'start',
                },
              },
              '-=0.4'
            )
          }

          // Анимация карточек портфолио - каскадное появление с 3D эффектом
          if (portfolioCards.length > 0) {
            tl.to(
              portfolioCards,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 0.8,
                ease: 'back.out(1.2)',
                stagger: {
                  each: 0.12,
                  from: 'start',
                },
              },
              '-=0.3'
            )
          }
        },
      })

      // Enhanced hover animations for portfolio cards
      if (portfolioCards.length > 0) {
        portfolioCards.forEach((card) => {
          if (!card) return

          const cardTitle = card.querySelector('h3')
          const description = card.querySelector('p')

          card.addEventListener('mouseenter', () => {
            if (!card) return
            gsap.to(card, {
              scale: 1.02,
              y: -5,
              duration: 0.3,
              ease: 'power2.out',
            })

            // Animate title color change
            if (cardTitle) {
              gsap.to(cardTitle, {
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
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            })

            // Reset title
            if (cardTitle) {
              gsap.to(cardTitle, {
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
          })
        })
      }

      // Add click animation for filter buttons
      if (filterButtons.length > 0) {
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
    } catch {
      // Fallback: если GSAP не загрузился, просто показываем элементы
      isAnimationInitialized.value = true
    }
  }

  // Запускаем инициализацию GSAP
  const isMobile = window.innerWidth < 768
  const delay = isMobile ? 2000 : 1500

  if (window.scheduler?.postTask) {
    window.scheduler.postTask(
      () => {
        initGSAP()
      },
      { priority: 'background', delay }
    )
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        initGSAP()
      },
      { timeout: delay }
    )
  } else {
    setTimeout(() => {
      initGSAP()
    }, delay)
  }
})

// Cleanup ScrollTrigger on unmount
onUnmounted(() => {
  // Сбрасываем флаг и счетчик
  isAnimationInitialized.value = false
  initAttempts = 0

  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })
})

// JSON-LD for portfolio list or selected project
const listJsonLd = computed(() => {
  const items = filteredItems.value.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url:
      typeof window !== 'undefined'
        ? `${window.location.origin}/cases/${getProjectSlug(p.title)}`
        : `/cases/${getProjectSlug(p.title)}`,
    item: {
      '@type': 'CreativeWork',
      name: p.title,
      about: p.description,
    },
  }))
  return { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items }
})

const projectJsonLd = computed(() => {
  const p = selectedProject.value
  if (!p) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: p.title,
    description: p.description,
    url:
      typeof window !== 'undefined'
        ? `${window.location.origin}/cases/${getProjectSlug(p.title)}`
        : `/cases/${getProjectSlug(p.title)}`,
  }
})

watchEffect(() => {
  const scripts: Array<{
    type: string
    children: string
    key: string
  }> = []

  // Breadcrumb schema (всегда добавляем)
  if (breadcrumbSchema.value) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema.value),
      key: 'breadcrumb-schema',
    })
  }

  // Portfolio schema
  const payload = projectJsonLd.value || listJsonLd.value
  if (payload) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(payload),
      key: 'portfolio-schema',
    })
  }

  if (scripts.length > 0) {
    useHead({ script: scripts })
  }
})
</script>

<template>
  <div class="relative w-full" ref="portfolioContainer">
    <div class="w-full max-w-7xl px-10 py-[5rem] md:[5rem] lg:px-[15rem]">
      <h1
        class="title no-title-effects text-3xl sm:text-4xl md:text-4xl font-black text-[var(--color-accent)] tracking-tight mb-4 md:mb-6 lg:mb-8 text-center"
      >
        Портфолио — кейсы
      </h1>

      <!-- Filter Buttons -->
      <div
        class="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 mb-8 md:mb-10 lg:mb-12 w-full"
      >
        <button
          v-for="filter in filters"
          :key="filter"
          @click="handleFilterChange(filter)"
          :class="
            'px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-semibold font-display relative overflow-hidden group shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-white border-2 ' +
            getFilterColor()
          "
        >
          <span class="relative z-10">{{ filter }}</span>
          <div
            v-if="
              (activeFilter === 'all' && filter === 'Все') ||
              (activeFilter === 'ecommerce' && filter === 'Интернет-магазины') ||
              (activeFilter === 'corporate' && filter === 'Корпоративные сайты') ||
              (activeFilter === 'landing' && filter === 'Лендинги') ||
              (activeFilter === 'promo' && filter === 'Промо-сайты') ||
              (activeFilter === 'mobile' && filter === 'Мобильные приложения') ||
              (activeFilter === 'tech-support' && filter === 'Техническая поддержка')
            "
            :class="
              'absolute inset-0 ' +
              getInnerColor() +
              ' opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full'
            "
          ></div>
        </button>
      </div>

      <!-- Portfolio Grid -->
      <div ref="portfolioEl" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
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

      <!-- Popular Services Block -->
      <div class="mt-12 mb-12 p-8 rounded-3xl border border-border">
        <h2 class="text-2xl font-bold mb-6 text-center">Популярные услуги</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/services/development/corporate-website"
            class="p-4 rounded-[3rem] text-center border border-border hover:border-accent transition-colors"
          >
            <h3 class="font-semibold mb-2">Корпоративный сайт</h3>
            <p class="text-sm text-text-muted">Создание корпоративных сайтов под ключ</p>
          </a>
          <a
            href="/services/development/online-store"
            class="p-4 rounded-[3rem] text-center border border-border hover:border-accent transition-colors"
          >
            <h3 class="font-semibold mb-2">Интернет-магазин</h3>
            <p class="text-sm text-text-muted">Полнофункциональные интернет-магазины</p>
          </a>
          <a
            href="/services/development/landing-page"
            class="p-4 rounded-[3rem] text-center border border-border hover:border-accent transition-colors"
          >
            <h3 class="font-semibold mb-2">Лендинг</h3>
            <p class="text-sm text-text-muted">Конверсионные одностраничные сайты</p>
          </a>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-12 text-center p-12 rounded-3xl border border-border bg-bg">
        <h3 class="text-2xl text-accent font-bold mb-4">Готовы начать свой проект?</h3>
        <p class="text-text-muted mb-6">
          Посмотрите похожие проекты и свяжитесь с нами для обсуждения вашей задачи
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/calculator"
            class="px-8 py-4 rounded-full text-sm bg-accent text-bg hover:bg-accent/90 transition-colors"
          >
            Рассчитать стоимость
          </a>
          <a
            href="/services"
            class="px-8 py-4 rounded-full text-sm border-2 border-accent text-accent hover:bg-accent/10 transition-colors"
          >
            Наши услуги
          </a>
          <a
            href="/blog"
            class="px-8 py-4 rounded-full text-sm border-2 border-border text-text hover:border-accent transition-colors"
          >
            Читать блог
          </a>
          <a
            href="/client-form"
            class="px-8 py-4 rounded-full text-sm border-2 border-border text-text hover:border-accent transition-colors"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Project Modal -->
  <PortfolioModal :showModal="showModal" :projectId="selectedProject?.id" @close="closeModal" />
</template>

<style scoped>
/* Начальное состояние для анимации - предотвращает FOUC */
.title {
  will-change: transform, opacity;
  transform: translateZ(0); /* Создаем композиционный слой */
}

button {
  will-change: transform, opacity;
  transform: translateZ(0);
}

.portfolio-card {
  will-change: transform, opacity;
  transform: translateZ(0);
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

/* Custom rose color for filter buttons */

/* Custom rose color for filter buttons */
.bg-rose-custom {
  background-color: #e0bbb9 !important;
}

.border-rose-custom {
  border-color: #e0bbb9 !important;
}

/* Force rose color for all filter buttons */
button.bg-rose-custom {
  background-color: #e0bbb9 !important;
}

button.border-rose-custom {
  border-color: #e0bbb9 !important;
}

/* Hover effects for filter buttons */
button.bg-rose-custom:hover {
  background-color: #ae70ac !important;
  border-color: #ae70ac !important;
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

