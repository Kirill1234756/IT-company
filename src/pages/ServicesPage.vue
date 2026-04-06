<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent, computed, watchEffect, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ServiceCardProps } from '../components/ServiceCard.vue'
import { useServicesStore } from '../stores/services'
import type { ServiceCategory, ServiceItem, ServiceDetail } from '../types/services'
import { useYandexMetrika } from '../composables/useYandexMetrika'
import { useHead } from '@unhead/vue'
const SEOContent = defineAsyncComponent(() => import('../components/seo/SEOContent.vue'))
import { useServiceSchema } from '../composables/useServiceSchema'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'
import SectionHeading from '../components/ui/SectionHeading.vue'


const Breadcrumbs = defineAsyncComponent(() => import('../components/ui/Breadcrumbs.vue'))
const ServiceCard = defineAsyncComponent(() => import('../components/ServiceCard.vue'))
const ServiceListModal = defineAsyncComponent(
  () => import('../components/modals/ServiceListModal.vue')
)
const ServiceDetailModal = defineAsyncComponent(
  () => import('../components/modals/ServiceDetailModal.vue')
)

const router = useRouter()
const route = useRoute()
const servicesStore = useServicesStore()
const { trackServiceView, trackButtonClick } = useYandexMetrika()

// Check if we're on a detail page
const isDetailPage = computed(() => route.name === 'service-detail')

// Modal state
const activeModal = ref<'list' | 'detail' | null>(null)
const selectedCategory = ref<ServiceCategory | null>(null)
const selectedService = ref<ServiceItem | null>(null)
const selectedServiceDetail = shallowRef<ServiceDetail | null>(null)

// Local state + lazy data
type ServiceFilter =
  | 'AnalyticsResearch'
  | 'StrategyPositioning'
  | 'DevelopmentLaunch'
  | 'AutomationGrowth'
type Service = {
  id: number
  title: string
  description: string
  priceFrom: string
  iconPath: string
  iconUseFill?: boolean
  category?: ServiceFilter
  slug?: string
}

const analyticsResearchServices = shallowRef<Service[]>([])
const strategyPositioningServices = shallowRef<Service[]>([])
const developmentLaunchServices = shallowRef<Service[]>([])
const automationGrowthServices = shallowRef<Service[]>([])

// null = hub screen (no direction selected); otherwise filter by direction
const activeFilter = ref<ServiceFilter | null>(null)
const isLoading = ref(false)
const isLoaded = ref(false)

// Lazy computed to avoid recomputation when sections are off-screen
const allServices = computed(() => [
  ...analyticsResearchServices.value,
  ...strategyPositioningServices.value,
  ...developmentLaunchServices.value,
  ...automationGrowthServices.value,
])

const availableCategories = computed(() => [
  {
    key: 'AnalyticsResearch' as const,
    label: 'Аналитика и исследования',
    tagline: 'Понять, что происходит и где деньги',
  },
  {
    key: 'StrategyPositioning' as const,
    label: 'Стратегия и позиционирование',
    tagline: 'Понять, как расти',
  },
  {
    key: 'DevelopmentLaunch' as const,
    label: 'Разработка и запуск',
    tagline: 'Создать инструмент продаж',
  },
  {
    key: 'AutomationGrowth' as const,
    label: 'Автоматизация и рост',
    tagline: 'Увеличить заявки и масштабировать',
  },
])

const filteredServices = computed(() => {
  if (activeFilter.value === null) return []
  const list = allServices.value
  return list.filter((s) => s.category === activeFilter.value)
})

// JSON-LD for services list
const servicesJsonLd = computed(() => {
  const items = filteredServices.value.map((s, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: typeof window !== 'undefined' ? `${window.location.origin}/services` : '/services',
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      areaServed: 'RU',
      provider: { '@type': 'Organization', name: 'Kodify' },
    },
  }))
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items,
  }
})

watchEffect(() => {
  useHead({
    script: [{ type: 'application/ld+json', children: JSON.stringify(servicesJsonLd.value) }],
  })
})

const directionPaths: Record<ServiceFilter, string> = {
  AnalyticsResearch: '/services/analytics-research',
  StrategyPositioning: '/services/strategy-positioning',
  DevelopmentLaunch: '/services/development-launch',
  AutomationGrowth: '/services/automation-growth',
}

const filterServices = (category: ServiceFilter | null) => {
  activeFilter.value = category
}

const selectDirection = (filter: ServiceFilter) => {
  filterServices(filter)
  trackButtonClick(`service-direction-${filter.toLowerCase()}`, {
    filter_category: filter,
  })
  router.push(directionPaths[filter])
}

const isServiceFilter = (key: string): key is ServiceFilter =>
  key === 'AnalyticsResearch' ||
  key === 'StrategyPositioning' ||
  key === 'DevelopmentLaunch' ||
  key === 'AutomationGrowth'

const onDirectionClick = (key: string) => {
  if (isServiceFilter(key)) selectDirection(key)
}

// Обработчик изменения фильтра (если в будущем вернём FilterButtons)

// Handle service click
const handleServiceClick = async (service: ServiceCardProps & { category?: ServiceCategory }) => {
  // Пытаемся получить детальную информацию по slug или ID (чанк overrides подгружается при первом запросе)
  const serviceDetail = service.slug
    ? await servicesStore.getServiceDetailBySlug(service.slug)
    : await servicesStore.getServiceDetail(service.id)

  if (serviceDetail) {
    // Отслеживаем просмотр услуги
    trackServiceView(
      service.title,
      typeof service.category === 'string' ? service.category : 'Unknown',
      {
        service_id: service.id,
        service_slug: service.slug ?? '',
        price_from: service.priceFrom,
        has_icon: service.iconPath ? 'yes' : 'no',
      }
    )
    // Открываем детальную информацию услуги
    selectedServiceDetail.value = serviceDetail
    activeModal.value = 'detail'

    // Находим категорию для правильного URL
    const category = servicesStore.categories.find((cat) =>
      cat.items?.some((item) => item.id === service.id || item.slug === service.slug)
    )

    if (category && service.slug) {
      // Обновляем URL с категорией и сервисом
      router.push(`/services/${category.slug}/${service.slug}`)
    } else {
      // Fallback для старых ссылок
      router.push(`/services/${service.id}`)
    }
  } else {
    // Если детальной информации нет, открываем список категории
    const category = servicesStore.categories.find((cat) =>
      cat.items?.some((item) => item.id === service.id || item.slug === service.slug)
    )

    if (category) {
      // Отслеживаем открытие списка услуг категории
      trackServiceView(service.title, category.title || category.slug || 'Unknown', {
        service_id: service.id,
        service_slug: service.slug ?? '',
        category_id: category.id ?? 0,
        category_slug: category.slug ?? '',
        action: 'open_category_list',
      })

      selectedCategory.value = category
      activeModal.value = 'list'
      router.push(`/services/${category.slug || category.id}`)
    }
  }
}

// Handle service item click from list modal
const handleServiceItemClick = async (service: ServiceItem) => {
  const serviceDetail = await servicesStore.getServiceDetail(service.id)
  if (serviceDetail) {
    // Отслеживаем просмотр услуги из списка
    trackServiceView(
      service.title,
      selectedCategory.value?.title || selectedCategory.value?.slug || 'Unknown',
      {
        service_id: service.id,
        service_slug: service.slug ?? '',
        category_id: selectedCategory.value?.id ?? 0,
        category_slug: selectedCategory.value?.slug ?? '',
        action: 'open_from_list',
      }
    )

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

/** Хаб направления без slug услуги, чтобы handleRouteParams снова выставил фильтр по path */
function servicesHubPathFromCurrentRoute(): string {
  const path = router.currentRoute.value.path.replace(/\/$/, '') || '/services'
  const segs = path.split('/').filter(Boolean)
  if (segs.length <= 1 || segs[0] !== 'services') return '/services'
  if (segs.length === 2) return path
  // /services/:category/:service → остаёмся на /services/:category
  return `/services/${segs[1]}`
}

// Close modals
const closeModal = () => {
  const target = servicesHubPathFromCurrentRoute()
  activeModal.value = null
  selectedCategory.value = null
  selectedService.value = null
  selectedServiceDetail.value = null
  router.push(target)
}

// Initialize filter based on route and lazy-load data
onMounted(async () => {
  if (!isLoaded.value && !isLoading.value) {
    try {
      isLoading.value = true
      await servicesStore.loadDataIfNeeded()
      // consume cached data from store (description для карточек/JSON-LD из локального типа Service)
      const withDesc = (rows: typeof servicesStore.analyticsResearchServices): Service[] =>
        rows.map((s) => ({ ...s, description: '' })) as Service[]
      analyticsResearchServices.value = withDesc(servicesStore.analyticsResearchServices)
      strategyPositioningServices.value = withDesc(servicesStore.strategyPositioningServices)
      developmentLaunchServices.value = withDesc(servicesStore.developmentLaunchServices)
      automationGrowthServices.value = withDesc(servicesStore.automationGrowthServices)
      isLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  // Handle URL parameters for modals
  void handleRouteParams()
})

// Handle route parameters for modals
const handleRouteParams = async () => {
  const route = router.currentRoute.value
  const { category, service } = route.params

  if (category && service) {
    // URL: /services/:category/:service - открыть детальную информацию
    const categoryData = servicesStore.getCategoryBySlug(category as string)
    if (categoryData) {
      const seg = String(service)
      const serviceDetail = /^\d+$/.test(seg)
        ? await servicesStore.getServiceDetail(Number(seg))
        : await servicesStore.getServiceDetailBySlug(seg)
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
  if (path.includes('/analytics-research')) {
    filterServices('AnalyticsResearch')
  } else if (path.includes('/strategy-positioning')) {
    filterServices('StrategyPositioning')
  } else if (path.includes('/development-launch')) {
    filterServices('DevelopmentLaunch')
  } else if (path.includes('/automation-growth')) {
    filterServices('AutomationGrowth')
  } else {
    filterServices(null)
  }
}

// Watch for route changes
watch(
  () => router.currentRoute.value,
  () => {
    void handleRouteParams()
  },
  { deep: true }
)

// Service schema for detail pages
const serviceSchema = computed(() => {
  if (!isDetailPage.value || !selectedServiceDetail.value) return null

  const serviceUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${route.path}` : route.path

  const { schema } = useServiceSchema({
    serviceName: selectedServiceDetail.value.title,
    description: selectedServiceDetail.value.about.description.join(' '),
    url: serviceUrl,
    priceFrom: selectedServiceDetail.value.metrics.cost,
    areaServed: 'RU',
    providerName: 'Kodify',
  })

  return schema.value
})

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

// FAQ items for detail pages
const faqItems = computed(() => {
  const faq = (route.meta.faq as string[]) || []
  return faq.map((question, idx) => ({
    question,
    answer: selectedServiceDetail.value?.faq?.[idx]?.answer || 'Ответ будет добавлен позже.',
    slotName: `faq-${idx}`,
  }))
})

// Inject schemas into head
watchEffect(() => {
  const scripts: Array<{
    type: string
    children: string
    key: string
  }> = []

  if (serviceSchema.value) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(serviceSchema.value),
      key: 'service-schema',
    })
  }

  if (breadcrumbSchema.value) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(breadcrumbSchema.value),
      key: 'breadcrumb-schema',
    })
  }

  if (scripts.length > 0) {
    useHead({ script: scripts })
  }
})
</script>

<template>
  <div class="min-h-screen px-[1rem] md:px-[3rem] bg-text">
    <!-- Detail Page with SEO Content -->
    <main v-if="isDetailPage && selectedServiceDetail" class="max-w-7xl mx-auto">
      <Breadcrumbs
        :items="[
          { label: 'Главная', to: '/' },
          { label: 'Услуги', to: '/services' },
          { label: selectedServiceDetail.title },
        ]"
        class="mb-8"
      />

      <SEOContent>
        <!-- Преимущества section -->
        <template #section-преимущества>
          <div class="mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="feature in selectedServiceDetail.features"
                :key="feature.id"
                class="p-6 rounded-[3rem] border border-border"
              >
                <p class="text-sm leading-relaxed">{{ feature.title }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Что включено section -->
        <template #section-что-включено>
          <div class="mb-8">
            <div class="space-y-4">
              <p
                v-for="(paragraph, index) in selectedServiceDetail.about.description"
                :key="index"
                class="text-sm leading-relaxed"
              >
                {{ paragraph }}
              </p>
              <!-- Дополнительный контент для корпоративного сайта -->
              <div v-if="route.params.service === 'corporate-website'" class="space-y-4 mt-6">
                <p class="text-sm leading-relaxed">
                  Разработка корпоративного сайта под ключ включает полный цикл работ: от анализа
                  целевой аудитории до запуска и поддержки. Создание корпоративного сайта начинается
                  с изучения вашего бизнеса и конкурентов, что позволяет разработать уникальное
                  решение.
                </p>
                <p class="text-sm leading-relaxed">
                  При разработке корпоративного сайта мы учитываем все аспекты: от технической
                  реализации до контент-стратегии. Разработка сайта включает адаптивный дизайн,
                  оптимизацию для поисковых систем и интеграцию с необходимыми сервисами.
                </p>
                <p class="text-sm leading-relaxed">
                  Создание корпоративного сайта под ключ — это не просто разработка сайта, это
                  комплексное решение для вашего бизнеса. Мы обеспечиваем полный цикл: разработка
                  корпоративного сайта, его наполнение контентом, настройка аналитики и обучение
                  вашей команды работе с системой.
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Сроки и стоимость section -->
        <template #section-сроки-и-стоимость>
          <div class="mb-8">
            <div class="flex gap-6">
              <div class="px-6 py-3 rounded-[3rem] border border-border flex-1 text-center">
                <div class="opacity-80">
                  {{
                    selectedServiceDetail.metrics.costMetricCaption || 'Стоимость работ'
                  }}
                </div>
                <div class="text-3xl font-bold">{{ selectedServiceDetail.metrics.cost }}</div>
              </div>
              <div class="px-6 py-3 rounded-[3rem] border border-border flex-1 text-center">
                <div class="opacity-80">
                  {{
                    selectedServiceDetail.metrics.workingDaysCaption ||
                    'Рабочих дней на сдачу'
                  }}
                </div>
                <div class="text-3xl font-bold">
                  {{
                    selectedServiceDetail.metrics.workingDaysLabel ??
                    selectedServiceDetail.metrics.workingDays
                  }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- SaaS specific sections -->
        <template #section-архитектура>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Архитектура SaaS-решения проектируется с учетом масштабируемости и производительности.
            </p>
          </div>
        </template>
        <template #section-функциональные-модули>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Функциональные модули включают пользовательский интерфейс, API, базу данных и
              интеграции.
            </p>
          </div>
        </template>
        <template #section-безопасность>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Безопасность данных обеспечивается через шифрование, аутентификацию и авторизацию.
            </p>
          </div>
        </template>
        <template #section-биллинг>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Система биллинга поддерживает различные модели подписки и платежные методы.
            </p>
          </div>
        </template>
        <template #section-devops>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              DevOps процессы включают CI/CD, мониторинг, логирование и автоматическое
              масштабирование.
            </p>
          </div>
        </template>

        <!-- Business Automation specific sections -->
        <template #section-какие-процессы>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Автоматизируем процессы обработки заявок, документооборота, уведомлений и отчетности.
            </p>
          </div>
        </template>
        <template #section-инструменты>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Используем современные инструменты для автоматизации бизнес-процессов.
            </p>
          </div>
        </template>
        <template #section-результаты>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Результаты автоматизации: сокращение времени обработки, снижение ошибок, повышение
              эффективности.
            </p>
          </div>
        </template>

        <!-- Business Card Site specific sections -->
        <template #section-когда-нужен>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Сайт-визитка подходит для старта бизнеса, презентации услуг или личного бренда.
            </p>
          </div>
        </template>
        <template #section-структура>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Стандартная структура включает главную страницу, о компании, услуги и контакты.
            </p>
          </div>
        </template>
        <template #section-примеры>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Примеры сайтов-визиток можно посмотреть в нашем портфолио.
            </p>
          </div>
        </template>

        <!-- Site Catalog specific sections -->
        <template #section-структура-каталога>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Структура каталога включает категории, подкатегории, карточки товаров и фильтры.
            </p>
          </div>
        </template>
        <template #section-фильтры-и-поиск>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Фильтры и поиск позволяют пользователям быстро находить нужные товары или услуги.
            </p>
          </div>
        </template>

        <!-- Promotion specific sections -->
        <template #section-аудит>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Проводим комплексный аудит сайта для выявления проблем и возможностей улучшения.
            </p>
          </div>
        </template>
        <template #section-семантика>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Разрабатываем семантическое ядро на основе анализа поисковых запросов целевой
              аудитории.
            </p>
          </div>
        </template>
        <template #section-контент>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Создаем качественный контент, оптимизированный под поисковые системы и пользователей.
            </p>
          </div>
        </template>
        <template #section-линки>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Строим качественную ссылочную массу для повышения авторитета сайта.
            </p>
          </div>
        </template>
        <template #section-отчёты>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Предоставляем регулярные отчеты о результатах продвижения и рекомендации по улучшению.
            </p>
          </div>
        </template>

        <!-- Branding specific sections -->
        <template #section-платформа-бренда>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Разрабатываем платформу бренда, определяющую его позиционирование и ценности.
            </p>
          </div>
        </template>
        <template #section-нейминг>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Создаем запоминающееся название бренда, отражающее его суть и преимущества.
            </p>
          </div>
        </template>
        <template #section-дизайн>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Разрабатываем визуальный дизайн бренда: логотип, цветовая палитра, типографика.
            </p>
          </div>
        </template>
        <template #section-гайдлайн>
          <div class="mb-8">
            <p class="text-sm leading-relaxed">
              Создаем гайдлайн по использованию бренда для обеспечения единообразия во всех каналах.
            </p>
          </div>
        </template>

        <!-- FAQ answers -->
        <template v-for="(item, idx) in faqItems" :key="idx" #[item.slotName]>
          <p class="text-sm leading-relaxed">{{ item.answer }}</p>
        </template>
      </SEOContent>

      <!-- CTA Section for detail pages -->
      <div class="mt-12 text-center p-12 rounded-3xl border border-border">
        <h3 class="text-2xl font-bold mb-4">Готовы начать работу?</h3>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="/calculator"
            class="px-8 py-4 rounded-full font-semibold bg-accent text-bg hover:bg-accent/90 transition-colors"
          >
            Рассчитать стоимость
          </a>
          <a
            href="/client-form"
            class="px-8 py-4 rounded-full font-semibold border-2 border-accent text-accent hover:bg-accent/10 transition-colors"
          >
            Оставить заявку
          </a>
          <a
            href="/cases"
            class="px-8 py-4 rounded-full font-semibold border-2 border-border text-text hover:border-accent transition-colors"
          >
            Посмотреть кейсы
          </a>
        </div>
      </div>
    </main>

    <!-- Hub Page or Services List -->
    <main v-else class="max-w-7xl mx-auto">
      <!-- Breadcrumbs -->
      <Breadcrumbs
        :items="[
          { label: 'Главная', to: '/' },
          { label: 'Услуги' },
        ]"
        class="mb-8"
      />

      <SectionHeading
        :level="1"
        size="lg"
        color="bg"
        align="center"
        weight="black"
        animation-class="animate-cases-title"
        class="mb-4 md:mb-6 lg:mb-8"
      >
       Почему нет роста? Потому что нет системы
      </SectionHeading>

      <p
        class="mb-8 text-accent max-w-3xl mx-auto text-center text-base md:text-lg leading-relaxed px-2"
      >
       Объединяем стратегию, сайт и продвижение в одну работающую систему привлечения клиентов
      </p>

      <div
        class="grid grid-cols-1  md:grid-cols-2 gap-2 md:gap-4 mb-12 max-w-7xl mx-auto"
      >
        <button
          v-for="dir in availableCategories"
          :key="dir.key"
          type="button"
          @click="onDirectionClick(dir.key)"
          :class="[
            'w-full px-5 py-5 md:px-6 md:py-6 rounded-[3rem] text-center sm:text-center transition-all duration-300 hover:-translate-y-0.5  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ',
            activeFilter === dir.key
              ? ' bg-accent text-bg shadow-lg shadow-accent/20 scale-[1.02]'
              : ' bg-bg text-text hover:bg-accent hover:shadow-md',
          ]"
        >
          <span
            class="block font-semibold text-sm md:text-base leading-snug"
            :class="activeFilter === dir.key ? 'text-white' : 'text-accent'"
            >{{ dir.label }}</span
          >
          <span
            class="block mt-2 text-xs md:text-sm font-normal leading-snug"
            :class="activeFilter === dir.key ? 'text-bg' : 'text-white'"
            >{{ dir.tagline }}</span
          >
        </button>
      </div>



      <!-- Filter + services section -->
      <div class="scroll-mt-8">




        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <p class="mt-4 text-text-muted">Загрузка услуг...</p>
        </div>

        <!-- Services List (only when direction selected) -->
        <div
          v-else-if="activeFilter !== null && filteredServices.length > 0"
          class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :id="service.id"
            :title="service.title"
            :description="service.description"
            :priceFrom="service.priceFrom"
            :icon-path="service.iconPath"
            :icon-use-fill="service.iconUseFill"
            :slug="service.slug"
            :isClickable="true"
            :show-description="false"
            @click="handleServiceClick"
          />
        </div>

        <!-- No Results (direction selected but no services) -->
        <div v-else-if="activeFilter !== null" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-text-muted"
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
          <h3 class="mt-4 text-lg font-medium services-modal-title">Услуги не найдены</h3>
          <p class="mt-2 text-text-muted">Попробуйте изменить направление</p>
          <button
            @click="() => { filterServices(null); router.push('/services') }"
            class="mt-4 px-4 py-2 services-detail-cta-button rounded-lg transition-colors"
          >
            Выбрать направление
          </button>
        </div>

        <!-- No direction selected: gentle prompt (no list shown) -->
        <p v-else class="text-center text-bg py-8">
          Выберите этап, на котором сейчас ваш бизнес — и получите решение под задачу.
        </p>
      </div>
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
