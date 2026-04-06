// Local type for service items (kept self-contained to avoid external deps)
export type ServiceStageCategory =
  | 'AnalyticsResearch'
  | 'StrategyPositioning'
  | 'DevelopmentLaunch'
  | 'AutomationGrowth'

/** Карточка каталога: тексты для списка/модалки задаются в service-detail-overrides по slug. */
interface Service {
  id: number
  title: string
  priceFrom: string
  iconPath: string
  iconUseFill?: boolean
  category: ServiceStageCategory
  slug?: string
}

/** 1. Аналитика и исследования — id по порядку: 1–2 */
export const analyticsResearchServices: Service[] = [
  {
    id: 1,
    title: 'Анализ рынка',
    priceFrom: 'от 14 997 ₽',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    iconUseFill: false,
    category: 'AnalyticsResearch',
    slug: 'market-analysis',
  },
  {
    id: 2,
    title: 'Анализ конкурентов',
    priceFrom: 'от 9 997 ₽',
    iconPath:
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    iconUseFill: false,
    category: 'AnalyticsResearch',
    slug: 'competitor-analysis',
  },
]

/** 2. Стратегия и позиционирование — id: 3–4 */
export const strategyPositioningServices: Service[] = [
  {
    id: 3,
    title: 'Разработка маркетинговой стратегии',
    priceFrom: 'от 9 997 ₽',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconUseFill: false,
    category: 'StrategyPositioning',
    slug: 'marketing-strategy',
  },
  {
    id: 4,
    title: 'Брендинг',
    priceFrom: 'от 24 997 ₽',
    iconPath:
      'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    iconUseFill: false,
    category: 'StrategyPositioning',
    slug: 'branding',
  },
]

/** 3. Разработка и запуск — id: 5–10 */
export const developmentLaunchServices: Service[] = [
  {
    id: 5,
    title: 'Разработка сайта',
    priceFrom: 'от 24 997 ₽',
    iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    iconUseFill: false,
    category: 'DevelopmentLaunch',
    slug: 'site-development',
  },
  {
    id: 6,
    title: 'Разработка дизайна',
    priceFrom: 'от 14 997 ₽',
    iconPath:
      'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    iconUseFill: false,
    category: 'DevelopmentLaunch',
    slug: 'design-development',
  },
  {
    id: 7,
    title: 'Создание текста для сайта',
    priceFrom: 'от 7 997 ₽',
    iconPath:
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    iconUseFill: false,
    category: 'DevelopmentLaunch',
    slug: 'website-copywriting',
  },
  {
    id: 8,
    title: 'Разработка калькулятора стоимости',
    priceFrom: 'от 9 997 ₽',
    iconPath:
      'M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm4 4H7v2h2V8zm0 4H7v2h2v-2zm4-4h-2v2h2V8zm0 4h-2v2h2v-2zm-4 4H7v2h6v-2z',
    iconUseFill: false,
    category: 'DevelopmentLaunch',
    slug: 'cost-calculator-development',
  },
  {
    id: 9,
    title: 'Онлайн-запись и бронирование',
    priceFrom: 'от 9 997 ₽',
    iconPath:
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    iconUseFill: false,
    category: 'DevelopmentLaunch',
    slug: 'online-booking',
  },
  {
    id: 10,
    title: 'Личный кабинет',
    priceFrom: 'от 14 997 ₽',
    iconPath:
      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    iconUseFill: false,
    category: 'DevelopmentLaunch',
    slug: 'personal-cabinet',
  },
]

/** 4. Автоматизация и рост — id: 11–14 */
export const automationGrowthServices: Service[] = [
  {
    id: 11,
    title: 'Настройка рекламы (Яндекс / Google)',
    priceFrom: 'от 9 997 ₽',
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    iconUseFill: false,
    category: 'AutomationGrowth',
    slug: 'context-ads-setup',
  },
  {
    id: 12,
    title: 'SEO-продвижение',
    priceFrom: 'от 9 997 ₽ / мес',
    iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    iconUseFill: false,
    category: 'AutomationGrowth',
    slug: 'seo-promotion',
  },
  {
    id: 13,
    title: 'Интеграция сайта с внешними сервисами',
    priceFrom: 'от 9 997 ₽',
    iconPath:
      'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    iconUseFill: false,
    category: 'AutomationGrowth',
    slug: 'site-integration',
  },
  {
    id: 14,
    title: 'Интеграция с CRM',
    priceFrom: 'от 14 997 ₽',
    iconPath:
      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    iconUseFill: false,
    category: 'AutomationGrowth',
    slug: 'crm-integration',
  },
]
