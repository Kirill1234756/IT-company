import { defineStore } from 'pinia'
import type { ServiceCategory, ServiceDetail, ServiceItem } from '../types/services'
import {
  analyticsResearchServices as analyticsResearchSeed,
  strategyPositioningServices as strategyPositioningSeed,
  developmentLaunchServices as developmentLaunchSeed,
  automationGrowthServices as automationGrowthSeed,
} from './services.data'
import type { ServiceStageCategory } from './services.data'
type ServiceDetailOverridesModule = typeof import('./service-detail-overrides')

let serviceDetailOverridesPromise: Promise<ServiceDetailOverridesModule> | null = null

function loadServiceDetailOverrides(): Promise<ServiceDetailOverridesModule> {
  if (!serviceDetailOverridesPromise) {
    serviceDetailOverridesPromise = import('./service-detail-overrides')
  }
  return serviceDetailOverridesPromise
}

type SeedService =
  | (typeof analyticsResearchSeed)[number]
  | (typeof strategyPositioningSeed)[number]
  | (typeof developmentLaunchSeed)[number]
  | (typeof automationGrowthSeed)[number]

const CATEGORY_META: Record<
  ServiceStageCategory,
  { title: string; slug: string; id: number }
> = {
  AnalyticsResearch: {
    id: 1,
    title: 'Аналитика и исследования',
    slug: 'analytics-research',
  },
  StrategyPositioning: {
    id: 2,
    title: 'Стратегия и позиционирование',
    slug: 'strategy-positioning',
  },
  DevelopmentLaunch: {
    id: 3,
    title: 'Разработка и запуск',
    slug: 'development-launch',
  },
  AutomationGrowth: {
    id: 4,
    title: 'Автоматизация и рост',
    slug: 'automation-growth',
  },
}

function buildServiceDetailWithModule(
  m: ServiceDetailOverridesModule,
  item: SeedService,
  categoryTitle: string
): ServiceDetail {
  const base: ServiceDetail = {
    id: item.id,
    title: item.title,
    breadcrumbs: ['Услуги', categoryTitle, item.title],
    about: {
      title: item.title,
      /** Тексты для деталки задаются merge* в service-detail-overrides по slug */
      description: [''],
    },
    metrics: {
      cost: item.priceFrom,
      workingDays: 14,
    },
    features: [],
  }

  const slug = (item.slug ?? '').toLowerCase()
  if (slug === 'market-analysis') {
    return m.mergeMarketAnalysisDetail(base)
  }
  if (slug === 'competitor-analysis') {
    return m.mergeCompetitorAnalysisDetail(base)
  }
  if (slug === 'marketing-strategy') {
    return m.mergeMarketingStrategyDetail(base)
  }
  if (slug === 'crm-integration') {
    return m.mergeCrmIntegrationDetail(base)
  }
  if (slug === 'site-integration') {
    return m.mergeSiteIntegrationDetail(base)
  }
  if (slug === 'design-development') {
    return m.mergeDesignDevelopmentDetail(base)
  }
  if (slug === 'cost-calculator-development') {
    return m.mergeCostCalculatorDetail(base)
  }
  if (slug === 'website-copywriting') {
    return m.mergeWebsiteCopywritingDetail(base)
  }
  if (slug === 'context-ads-setup') {
    return m.mergeContextAdsSetupDetail(base)
  }
  if (slug === 'seo-promotion') {
    return m.mergeSeoPromotionDetail(base)
  }
  if (slug === 'branding') {
    return m.mergeBrandingDetail(base)
  }
  if (slug === 'site-development') {
    return m.mergeSiteDevelopmentDetail(base)
  }
  if (slug === 'online-booking') {
    return m.mergeOnlineBookingDetail(base)
  }
  if (slug === 'personal-cabinet') {
    return m.mergePersonalCabinetDetail(base)
  }

  return base
}

function mapSeedToServiceItem(seed: SeedService): ServiceItem {
  return {
    id: seed.id,
    title: seed.title,
    price: seed.priceFrom,
    description: '',
    type: 'list',
    slug: seed.slug,
  }
}

export const useServicesStore = defineStore('services', {
  state: () => ({
    initialized: false as boolean,
    categories: [] as ServiceCategory[],
    analyticsResearchServices: [] as SeedService[],
    strategyPositioningServices: [] as SeedService[],
    developmentLaunchServices: [] as SeedService[],
    automationGrowthServices: [] as SeedService[],
  }),

  actions: {
    loadDataIfNeeded() {
      if (this.initialized) return

      this.analyticsResearchServices = analyticsResearchSeed
      this.strategyPositioningServices = strategyPositioningSeed
      this.developmentLaunchServices = developmentLaunchSeed
      this.automationGrowthServices = automationGrowthSeed

      const mk = (key: ServiceStageCategory): ServiceCategory => ({
        id: CATEGORY_META[key].id,
        title: CATEGORY_META[key].title,
        type: 'list',
        slug: CATEGORY_META[key].slug,
        items: this.getSeedsByStage(key).map(mapSeedToServiceItem),
      })

      this.categories = [
        mk('AnalyticsResearch'),
        mk('StrategyPositioning'),
        mk('DevelopmentLaunch'),
        mk('AutomationGrowth'),
      ]
      this.initialized = true
    },

    getSeedsByStage(key: ServiceStageCategory): SeedService[] {
      switch (key) {
        case 'AnalyticsResearch':
          return this.analyticsResearchServices as SeedService[]
        case 'StrategyPositioning':
          return this.strategyPositioningServices as SeedService[]
        case 'DevelopmentLaunch':
          return this.developmentLaunchServices as SeedService[]
        case 'AutomationGrowth':
          return this.automationGrowthServices as SeedService[]
        default:
          return []
      }
    },

    getCategorySlugForServiceSlug(serviceSlug: string): string | null {
      this.loadDataIfNeeded()
      const n = serviceSlug.toLowerCase()
      for (const c of this.categories) {
        if (c.items?.some((i) => (i.slug ?? '').toLowerCase() === n)) {
          return c.slug ?? null
        }
      }
      return null
    },

    getCategoryById(id: number): ServiceCategory | null {
      this.loadDataIfNeeded()
      return this.categories.find((c) => c.id === id) ?? null
    },

    getCategoryBySlug(slug: string): ServiceCategory | null {
      this.loadDataIfNeeded()
      const normalized = slug.toLowerCase()
      return this.categories.find((c) => c.slug?.toLowerCase() === normalized) ?? null
    },

    /** Название из каталога без загрузки service-detail-overrides (роутер, крошки). */
    getCatalogItemBySlug(slug: string): ServiceItem | null {
      this.loadDataIfNeeded()
      const n = slug.toLowerCase()
      for (const c of this.categories) {
        const it = c.items?.find((i) => (i.slug ?? '').toLowerCase() === n)
        if (it) return it
      }
      return null
    },

    getCatalogItemById(id: number): ServiceItem | null {
      this.loadDataIfNeeded()
      for (const c of this.categories) {
        const it = c.items?.find((i) => i.id === id)
        if (it) return it
      }
      return null
    },

    async getServiceDetail(id: number): Promise<ServiceDetail | null> {
      this.loadDataIfNeeded()
      const found = this.findSeedService((s) => s.id === id)
      if (!found) return null
      const m = await loadServiceDetailOverrides()
      return buildServiceDetailWithModule(m, found.item, found.categoryTitle)
    },

    async getServiceDetailBySlug(slug: string): Promise<ServiceDetail | null> {
      this.loadDataIfNeeded()
      const normalized = slug.toLowerCase()
      const found = this.findSeedService((s) => (s.slug ?? '').toLowerCase() === normalized)
      if (!found) return null
      const m = await loadServiceDetailOverrides()
      return buildServiceDetailWithModule(m, found.item, found.categoryTitle)
    },

    findSeedService(
      predicate: (s: SeedService) => boolean
    ): { item: SeedService; categoryTitle: string } | null {
      this.loadDataIfNeeded()

      for (const item of this.analyticsResearchServices) {
        if (predicate(item)) return { item, categoryTitle: CATEGORY_META.AnalyticsResearch.title }
      }
      for (const item of this.strategyPositioningServices) {
        if (predicate(item)) return { item, categoryTitle: CATEGORY_META.StrategyPositioning.title }
      }
      for (const item of this.developmentLaunchServices) {
        if (predicate(item)) return { item, categoryTitle: CATEGORY_META.DevelopmentLaunch.title }
      }
      for (const item of this.automationGrowthServices) {
        if (predicate(item)) return { item, categoryTitle: CATEGORY_META.AutomationGrowth.title }
      }
      return null
    },
  },
})
