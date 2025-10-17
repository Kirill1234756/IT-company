<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ServiceCardProps } from '../components/ServiceCard.vue'
import { cn } from '../utils/cn'
import { useServicesStore } from '../stores/services'
import type { ServiceCategory, ServiceItem, ServiceDetail } from '../types/services'

const Breadcrumbs = defineAsyncComponent(() => import('../components/ui/Breadcrumbs.vue'))
const ServiceCard = defineAsyncComponent(() => import('../components/ServiceCard.vue'))
const ServiceListModal = defineAsyncComponent(
  () => import('../components/modals/ServiceListModal.vue')
)
const ServiceDetailModal = defineAsyncComponent(
  () => import('../components/modals/ServiceDetailModal.vue')
)

const router = useRouter()
const servicesStore = useServicesStore()

// Modal state
const activeModal = ref<'list' | 'detail' | null>(null)
const selectedCategory = ref<ServiceCategory | null>(null)
const selectedService = ref<ServiceItem | null>(null)
const selectedServiceDetail = shallowRef<ServiceDetail | null>(null)

// Local state + lazy data
type ServiceFilter = 'Growth' | 'Strategy' | 'Development' | 'All'
type Service = {
  id: number
  title: string
  description: string
  priceFrom: string
  icon: string
  iconBg: string
  category?: string
}

const growthServices = shallowRef<Service[]>([])
const strategyServices = shallowRef<Service[]>([])
const developmentServices = shallowRef<Service[]>([])

const activeFilter = ref<ServiceFilter>('All')
const isLoading = ref(false)
const isLoaded = ref(false)
const searchQuery = ref('')

// Lazy computed to avoid recomputation when sections are off-screen
const allServices = computed(() => [
  ...growthServices.value,
  ...strategyServices.value,
  ...developmentServices.value,
])

const availableCategories = computed(() => [
  { key: 'All', label: 'Все услуги', count: allServices.value.length },
  { key: 'Growth', label: 'Рост', count: growthServices.value.length },
  { key: 'Strategy', label: 'Стратегия', count: strategyServices.value.length },
  { key: 'Development', label: 'Разработка', count: developmentServices.value.length },
])

const priceStats = computed(() => {
  const prices = allServices.value.map((s) => {
    const n = parseInt(String(s.priceFrom).replace(/[^0-9]/g, ''))
    return Number.isFinite(n) ? n : 0
  })
  if (!prices.length) return { min: 0, max: 0, average: 0 }
  const sum = prices.reduce((a, b) => a + b, 0)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: Math.round(sum / prices.length),
  }
})

const filteredServices = computed(() => {
  let list = allServices.value
  if (activeFilter.value !== 'All') list = list.filter((s) => s.category === activeFilter.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  }
  return list
})

const filterServices = (category: string) => {
  activeFilter.value = category as ServiceFilter
}

const handleSearch = () => {
  // reactive via searchQuery; no-op
}

const clearSearch = () => {
  searchQuery.value = ''
}

// Handle service click
const handleServiceClick = (service: ServiceCardProps & { category?: ServiceCategory }) => {
  if (service.category) {
    // Если есть категория, открываем модальное окно со списком услуг
    selectedCategory.value = service.category
    activeModal.value = 'list'
    // Обновляем URL с slug
    router.push(`/services/${service.category.slug || service.category.id}`)
  } else {
    // Иначе открываем детальную информацию
    const serviceDetail = servicesStore.getServiceDetail(service.id)
    if (serviceDetail) {
      selectedServiceDetail.value = serviceDetail
      activeModal.value = 'detail'
      // Обновляем URL для детальной информации
      router.push(`/services/${service.id}`)
    }
  }
}

// Handle service item click from list modal
const handleServiceItemClick = (service: ServiceItem) => {
  const serviceDetail = servicesStore.getServiceDetail(service.id)
  if (serviceDetail) {
    selectedServiceDetail.value = serviceDetail
    activeModal.value = 'detail'
    // Обновляем URL для детальной информации с slug-ами
    const categorySlug = selectedCategory.value?.slug || selectedCategory.value?.id
    const serviceSlug = service.slug || service.id
    if (categorySlug) {
      router.push(`/services/${categorySlug}/${serviceSlug}`)
    }
  }
}

// Close modals
const closeModal = () => {
  activeModal.value = null
  selectedCategory.value = null
  selectedService.value = null
  selectedServiceDetail.value = null
  // Возвращаемся к основному списку услуг
  router.push('/services')
}

// Handle back to home
const goHome = () => {
  router.push('/')
}

// Initialize filter based on route and lazy-load data
onMounted(async () => {
  if (!isLoaded.value && !isLoading.value) {
    try {
      isLoading.value = true
      await servicesStore.loadDataIfNeeded()
      // consume cached data from store
      growthServices.value = servicesStore.growthServices
      strategyServices.value = servicesStore.strategyServices
      developmentServices.value = servicesStore.developmentServices
      isLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  // Handle URL parameters for modals
  handleRouteParams()
})

// Handle route parameters for modals
const handleRouteParams = () => {
  const route = router.currentRoute.value
  const { category, service } = route.params

  if (category && service) {
    // URL: /services/:category/:service - открыть детальную информацию
    const categoryData = servicesStore.getCategoryBySlug(category as string)
    if (categoryData) {
      const serviceDetail = servicesStore.getServiceDetailBySlug(service as string)
      if (serviceDetail) {
        selectedServiceDetail.value = serviceDetail
        activeModal.value = 'detail'
        return
      }
    }
  } else if (category) {
    // URL: /services/:category - открыть список услуг
    const categoryData = servicesStore.getCategoryBySlug(category as string)
    if (categoryData) {
      selectedCategory.value = categoryData
      activeModal.value = 'list'
      return
    }
  }

  // Set filter based on route
  const path = route.path
  if (path.includes('/growth')) {
    filterServices('Growth')
  } else if (path.includes('/strategy')) {
    filterServices('Strategy')
  } else if (path.includes('/development')) {
    filterServices('Development')
  } else {
    filterServices('All')
  }
}

// Watch for route changes
import { watch } from 'vue'
watch(
  () => router.currentRoute.value,
  () => {
    handleRouteParams()
  },
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button
              @click="goHome"
              class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 class="ml-4 text-2xl font-bold text-gray-900">Наши услуги</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumbs -->
      <Breadcrumbs />

      <!-- Search and Filters -->
      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <!-- Search -->
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск услуг..."
            class="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              class="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap gap-4 mb-12">
        <button
          v-for="category in availableCategories"
          :key="category.key"
          @click="filterServices(category.key)"
          :class="
            cn(
              'px-6 py-3 rounded-full font-semibold transition-all duration-300',
              activeFilter === category.key
                ? 'bg-[#2455ff] text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#2455ff] hover:shadow-md'
            )
          "
        >
          {{ category.label }} ({{ category.count }})
        </button>
      </div>

      <!-- Price Stats -->
      <div class="mb-8 bg-blue-50 rounded-lg p-4">
        <div class="flex items-center justify-between text-sm text-blue-700">
          <span>Диапазон цен:</span>
          <span>€{{ priceStats.min }} - €{{ priceStats.max }}</span>
          <span>Средняя цена: €{{ priceStats.average }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600">Загрузка услуг...</p>
      </div>

      <!-- Services List -->
      <div v-else-if="filteredServices.length > 0" class="space-y-10">
        <ServiceCard
          v-for="service in filteredServices"
          :key="service.id"
          :id="service.id"
          :title="service.title"
          :description="service.description"
          :priceFrom="service.priceFrom"
          :icon="service.icon"
          :iconBg="service.iconBg"
          :isClickable="true"
          @click="handleServiceClick"
        />
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Услуги не найдены</h3>
        <p class="mt-2 text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
        <button
          @click="
            () => {
              activeFilter = 'All'
              searchQuery = ''
            }
          "
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>

      <!-- CTA Section -->
      <section
        class="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] rounded-3xl p-12 text-center text-white"
      >
        <h3 class="text-4xl font-bold mb-4">Готовы начать работу?</h3>
        <p class="text-xl mb-8 opacity-90">
          Выберите услуги, которые лучше всего подходят для вашего бизнеса, и давайте создадим
          что-то удивительное вместе.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="$router.push('/become-client')"
            class="bg-white text-[var(--color-accent)] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Стать клиентом
          </button>
          <button
            @click="$router.push('/cases')"
            class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            Посмотреть кейсы
          </button>
        </div>
      </section>
    </main>

    <!-- Service List Modal -->
    <ServiceListModal
      v-if="activeModal === 'list' && selectedCategory"
      :category="selectedCategory"
      @close="closeModal"
      @serviceClick="handleServiceItemClick"
    />

    <!-- Service Detail Modal -->
    <ServiceDetailModal
      v-if="activeModal === 'detail' && selectedServiceDetail"
      :service="selectedServiceDetail"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
/* Custom styles for the services page */
.service-section {
  max-width: 5xl;
  margin: 0 auto;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}

/* Hover effects for cards */
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}
</style>
