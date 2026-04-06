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
import { runInBackground } from '../utils/performance'
import FilterButtons from '../components/FilterButtons.vue'
import TapeSwiper from '../components/TapeSwiper.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
// import { cn } from '@/utils/cn'

// Ленивая загрузка компонентов с оптимизацией
const PortfolioCard = defineAsyncComponent({
  loader: () => import('../components/PortfolioCard.vue'),
  errorComponent: () => import('../pages/NotFound.vue'),
  delay: 200,
  timeout: 3000,
})

const PortfolioModal = defineAsyncComponent({
  loader: () => import('../components/modals/PortfolioModal.vue'),
  errorComponent: () => import('../pages/NotFound.vue'),
  delay: 200,
  timeout: 3000,
})

const Breadcrumbs = defineAsyncComponent(() => import('../components/ui/Breadcrumbs.vue'))

// Use Pinia store
const portfolioStore = usePortfolioStore()

// Define props
const props = defineProps<{
  useSwiper?: boolean
}>()

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
  'Корпоративные сайты',
  'Лендинги',
  'Промо-сайты',
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

// Реактивное отслеживание размера экрана для определения количества карточек
const isMobile = ref(false)

// Функция для обновления состояния мобильного устройства
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

// Ограничение для главной страницы - показываем разное количество в зависимости от устройства
// На десктопе: 6 карточек
// На мобильных: 4 карточки
const maxItemsOnHomePage = computed(() => {
  return isMobile.value ? 4 : 6
})

// Определяем, находимся ли мы на главной странице
// На главной странице route.path === '/', на отдельной странице '/cases'
const isOnHomePage = computed(() => {
  if (typeof window === 'undefined') return false
  // На главной странице путь '/', на отдельной странице кейсов '/cases'
  return route.path === '/' || route.path === '/home'
})

// Используем Swiper если передан пропс useSwiper
const shouldUseSwiper = computed(() => {
  return props.useSwiper === true
})

const showAllItems = ref(false)

// Вычисляем, какие карточки показывать
const displayedItems = computed(() => {
  // Если не на главной странице или уже показаны все - показываем все
  if (!isOnHomePage.value || showAllItems.value) {
    return filteredItems.value
  }
  // На главной странице показываем ограниченное количество карточек (4 на мобильных, 6 на десктопе)
  return filteredItems.value.slice(0, maxItemsOnHomePage.value)
})

// Проверяем, есть ли скрытые карточки
const hasMoreItems = computed(() => {
  return (
    isOnHomePage.value &&
    filteredItems.value.length > maxItemsOnHomePage.value &&
    !showAllItems.value
  )
})

// Функция для показа всех карточек
const showMore = async () => {
  showAllItems.value = true
  // Плавная прокрутка к новым карточкам после небольшой задержки
  await nextTick()
  setTimeout(() => {
    const grid = portfolioEl.value
    if (grid) {
      const firstNewCard = grid.querySelector(
        `.portfolio-card:nth-child(${maxItemsOnHomePage.value + 1})`
      )
      if (firstNewCard) {
        firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, 100)
}

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

// Breadcrumbs items
const breadcrumbItems = computed(() => {
  const items: { label: string; to?: string }[] = [
    { label: 'Главная', to: '/' },
    { label: 'Кейсы', to: '/cases' },
  ]
  if (selectedProject.value) {
    // Последний элемент цепочки крошек отображаем без ссылки
    items.push({ label: selectedProject.value.title })
  }
  return items
})

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
  text: 'text-white',
}

// Обработчик для нового компонента FilterButtons
const handleFilterValueChange = (value: string) => {
  setActiveFilter(value as FilterType)
  // Сбрасываем показ всех элементов при смене фильтра
  showAllItems.value = false
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

// Load projects on mount
onMounted(() => {
  // Инициализируем определение мобильного устройства
  updateIsMobile()

  // Отслеживаем изменения размера окна
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile)
  }

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
})

// Cleanup on unmount
onUnmounted(() => {
  // Удаляем обработчик изменения размера окна
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }
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

// Отложенная вставка JSON-LD для мобильных
let jsonLdInserted = false

watchEffect(async () => {
  const scripts: Array<{
    type: string
    children: string
    key: string
  }> = []

  // Breadcrumb schema (всегда добавляем, но отложено для мобильных)
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
    // На мобильных откладываем вставку JSON-LD до после первого рендера
    if (isMobile.value && !jsonLdInserted) {
      void runInBackground(() => {
        setTimeout(() => {
          useHead({ script: scripts })
          jsonLdInserted = true
        }, 2000)
      })
    } else {
      useHead({ script: scripts })
      if (!isMobile.value) jsonLdInserted = true
    }
  }
})
</script>

<template>
  <div class="relative w-full" ref="portfolioContainer">
    <div class="w-full max-w-7xl mx-auto px-[1rem] lg:px-[12rem]">
      <Breadcrumbs v-if="!isOnHomePage" :items="breadcrumbItems" class="mb-4 md:mb-6 lg:mb-8" />
      <SectionHeading
        :level="1"
        size="md"
        color="accent"
        align="center"
        weight="black"
        animation-class="animate-cases-title"
        class="mb-4 md:mb-6 lg:mb-8"
      >
        Портфолио — кейсы
      </SectionHeading>

      <!-- Filter Buttons -->
      <div class="animate-cases-filter">
        <FilterButtons
          :items="filters"
          :model-value="activeFilter"
          :filter-map="filterMap"
          :colors="filterButtonStyles"
          container-class="mb-8 md:mb-10 lg:mb-12"
          @update:model-value="handleFilterValueChange"
        />
      </div>

      <!-- Portfolio Grid -->
      <!-- Swiper для главной страницы с эффектом ленты -->
      <TapeSwiper
        v-if="shouldUseSwiper"
        :items="displayedItems"
        unique-key="id"
        button-class-prefix="portfolio"
        @item-click="openModal"
      >
        <template #default="{ item, index }">
          <div
            v-motion
            :initial="{ y: 60, opacity: 0, scale: 0.85, rotateY: 20 }"
            :visible-once="{
              y: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
              transition: {
                duration: 800,
                delay: 600 + index * 120,
                ease: [0.34, 1.56, 0.64, 1],
              },
            }"
            :hovered="{
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3, ease: 'easeOut' },
            }"
          >
            <PortfolioCard
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
          </div>
        </template>
      </TapeSwiper>

      <!-- Обычная сетка для отдельной страницы -->
      <div v-else ref="portfolioEl" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
        <div
          v-for="(item, index) in displayedItems"
          :key="item.id"
          class="animate-section-card-inline-delay cases-portfolio-card"
          :style="{ animationDelay: 600 + index * 120 + 'ms' }"
        >
          <PortfolioCard
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
        </div>
      </div>

      <!-- Show More Button (только на главной странице, но не при использовании Swiper) -->
      <div v-if="hasMoreItems && !shouldUseSwiper" class="flex justify-center mt-8 md:mt-12">
        <button
          @click="showMore"
          class="group flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-accent text-bg font-semibold text-sm md:text-base hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>Показать больше</span>
          <svg
            class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
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

      <!-- CTA Section -->
      <!-- <div
        class="mt-6 md:mt-12 text-center p-6 md:p-12 rounded-2xl md:rounded-3xl border border-border bg-bg"
      >
        <h3 class="text-xl md:text-2xl text-accent font-bold mb-3 md:mb-4">
          Готовы начать свой проект?
        </h3>
        <p class="text-text-muted text-sm md:text-base mb-4 md:mb-6">
          Посмотрите похожие проекты и свяжитесь с нами для обсуждения вашей задачи
        </p>
        <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <a
            href="/calculator"
            class="px-4 py-3 md:px-8 md:py-4 rounded-full text-xs md:text-sm bg-accent text-bg hover:bg-accent/90 transition-colors"
          >
            Рассчитать стоимость
          </a>
          <a
            href="/services"
            class="px-4 py-3 md:px-8 md:py-4 rounded-full text-xs md:text-sm border-2 border-accent text-accent hover:bg-accent/10 transition-colors"
          >
            Наши услуги
          </a>
          <a
            href="/blog"
            class="px-4 py-3 md:px-8 md:py-4 rounded-full text-xs md:text-sm border-2 border-border text-text hover:border-accent transition-colors"
          >
            Читать блог
          </a>
          <a
            href="/client-form"
            class="px-4 py-3 md:px-8 md:py-4 rounded-full text-xs md:text-sm border-2 border-border text-text hover:border-accent transition-colors"
          >
            Оставить заявку
          </a>
        </div>
      </div> -->
    </div>
  </div>

  <!-- Project Modal -->
  <PortfolioModal :showModal="showModal" :projectId="selectedProject?.id" @close="closeModal" />
</template>

<style scoped>
/* Portfolio card hover effects - applied to wrapper div with v-motion */
div:hover [class*='group'] h3 {
  color: var(--color-accent);
  transition: color 0.3s ease;
}

div:hover [class*='group'] p {
  color: #ffffff;
  transition: color 0.3s ease;
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

/* Portfolio card hover effects - CSS replacement for v-motion :hovered */
.cases-portfolio-card {
  transition: transform 0.3s ease-out;
}
.cases-portfolio-card:hover {
  transform: scale(1.02) translateY(-5px);
}

/* Стили для свайпера теперь в компоненте TapeSwiper.vue */
</style>

