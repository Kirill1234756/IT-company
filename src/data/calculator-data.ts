/**
 * Calculator data - extracted for better code splitting and tree-shaking
 */

export interface SiteType {
  id: string
  label: string
  description: string
  price: string
  iconPath: string
  iconUseFill?: boolean
  basePrice: number
}

export interface PageOption {
  id: string
  label: string
  price: string
  priceValue?: number
}

export interface DesignOption {
  id: string
  label: string
  price: string
  priceValue: number
}

export interface Feature {
  id: string
  label: string
  price: number
  included?: boolean
}

export interface ContentOption {
  id: string
  label: string
  price: string
  priceValue: number
}

export interface SEOOption {
  id: string
  label: string
  price?: string
  priceValue: number
  description?: string
}

export interface SupportOption {
  id: string
  label: string
  price: string
  priceValue: number
}

export interface UrgencyOption {
  id: string
  label: string
  multiplier: number
  price?: string
}

// Site types with base prices (привлекательные цены: ...997 вместо круглых тысяч)
export const siteTypes: SiteType[] = [
  {
    id: 'landing',
    label: 'Лендинг',
    description: '1 страница',
    price: 'от 24 997₽',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    iconUseFill: false,
    basePrice: 24997,
  },
  {
    id: 'business',
    label: 'Сайт-визитка',
    description: '5-10 страниц',
    price: 'от 39 997₽',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    iconUseFill: false,
    basePrice: 39997,
  },
  {
    id: 'shop',
    label: 'Интернет-магазин',
    description: 'Каталог товаров',
    price: 'от 79 997₽',
    iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    iconUseFill: false,
    basePrice: 79997,
  },
  {
    id: 'portfolio',
    label: 'Портфолио',
    description: 'Галерея работ',
    price: 'от 49 997₽',
    iconPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    iconUseFill: false,
    basePrice: 49997,
  },
  {
    id: 'blog',
    label: 'Блог/Медиа',
    description: 'Статьи и новости',
    price: 'от 59 997₽',
    iconPath: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    iconUseFill: false,
    basePrice: 59997,
  },
]

// Pages options
export const pagesOptionsMap: Record<string, { regular: number; shop: number }> = {
  '6-10': { regular: 14997, shop: 19997 },
  '11-15': { regular: 29997, shop: 39997 },
  '16-20': { regular: 44997, shop: 59997 },
}

// Design options
export const designOptions: DesignOption[] = [
  { id: 'ready', label: 'У меня есть готовый дизайн/макеты', price: 'Включено', priceValue: 0 },
  { id: 'template', label: 'Адаптация шаблона под бренд', price: '+7 997₽', priceValue: 7997 },
  { id: 'unique', label: 'Уникальный дизайн с нуля', price: '+24 997₽', priceValue: 24997 },
  { id: 'premium', label: 'Премиум-дизайн с анимациями', price: '+39 997₽', priceValue: 39997 },
]

// Base features (included)
export const baseFeatures: Feature[] = [
  { id: 'form', label: 'Форма обратной связи', price: 0, included: true },
  { id: 'responsive', label: 'Адаптивная верстка', price: 0, included: true },
  { id: 'basic-seo', label: 'Базовое SEO', price: 0, included: true },
]

// Additional features
export const additionalFeatures: Feature[] = [
  { id: 'chat', label: 'Онлайн-чат (Jivo/WhatsApp)', price: 4997 },
  { id: 'booking', label: 'Онлайн-запись/бронирование', price: 14997 },
  { id: 'cabinet', label: 'Личный кабинет', price: 24997 },
  { id: 'crm', label: 'Интеграция с CRM', price: 11997 },
  { id: 'multilang', label: 'Мультиязычность', price: 14997 },
  { id: 'calculator', label: 'Калькулятор стоимости', price: 9997 },
  { id: 'payment', label: 'Онлайн-оплата', price: 19997 },
]

// Shop-specific features
export const shopFeatures: Feature[] = [
  { id: 'products-51-200', label: '51-200 товаров', price: 14997 },
  { id: 'products-201-500', label: '201-500 товаров', price: 29997 },
  { id: 'products-500+', label: 'Больше 500 товаров', price: 49997 },
  { id: 'filters', label: 'Фильтры и сортировка', price: 9997 },
  { id: 'compare', label: 'Сравнение товаров', price: 7997 },
  { id: 'reviews', label: 'Отзывы и рейтинги', price: 6997 },
]

// Content options
export const contentOptions: ContentOption[] = [
  { id: 'ready', label: 'У меня есть все тексты и фото', price: 'Включено', priceValue: 0 },
  { id: 'media', label: 'Тексты есть, нужны фото/иконки', price: '+4 997₽', priceValue: 4997 },
  { id: 'copywriting', label: 'Нужен копирайтинг (до 5000 знаков)', price: '+14 997₽', priceValue: 14997 },
  { id: 'full', label: 'Полный контент (тексты + медиа)', price: '+24 997₽', priceValue: 24997 },
]

// SEO options
export const seoOptions: SEOOption[] = [
  {
    id: 'basic',
    label: 'Базовое SEO (включено)',
    price: 'Включено',
    priceValue: 0,
    description: 'Title, Description, H1-H6, Schema',
  },
  {
    id: 'extended',
    label: 'Расширенное SEO',
    price: '+14 997₽',
    priceValue: 14997,
    description: '+ анализ конкурентов, семантика',
  },
  {
    id: 'complex',
    label: 'Комплексное SEO',
    price: '+34 997₽',
    priceValue: 34997,
    description: '+ стратегия продвижения на 3 мес',
  },
]

// Support options
export const supportOptions: SupportOption[] = [
  { id: 'none', label: 'Без поддержки', price: '0₽', priceValue: 0 },
  { id: '1month', label: '1 месяц бесплатно', price: 'Включено', priceValue: 0 },
  { id: '3months', label: '3 месяца поддержки', price: '+10,000₽', priceValue: 10000 },
  { id: '6months', label: '6 месяцев поддержки', price: '+18,000₽', priceValue: 18000 },
  { id: '12months', label: '12 месяцев поддержки', price: '+30,000₽', priceValue: 30000 },
]

// Urgency options
export const urgencyOptions: UrgencyOption[] = [
  { id: 'standard', label: 'Стандартные сроки (14-21 день)', multiplier: 1.0, price: 'Включено' },
  { id: 'fast', label: 'Ускоренная разработка (7-10 дней)', multiplier: 1.3, price: '+30% к стоимости' },
  { id: 'urgent', label: 'Срочно (3-5 дней)', multiplier: 1.5, price: '+50% к стоимости' },
]

// Price calculation helpers
export const getBasePrice = (siteTypeId: string): number => {
  const siteType = siteTypes.find((st) => st.id === siteTypeId)
  return siteType?.basePrice || 0
}

export const getPagesPrice = (siteTypeId: string, pagesId: string): number => {
  if (siteTypeId === 'landing' || !pagesId) return 0
  const isShop = siteTypeId === 'shop'
  const option = pagesOptionsMap[pagesId]
  return option ? (isShop ? option.shop : option.regular) : 0
}

export const getDesignPrice = (designId: string): number => {
  const design = designOptions.find((d) => d.id === designId)
  return design?.priceValue || 0
}

export const getFeaturePrice = (featureId: string): number => {
  const feature = [...additionalFeatures, ...shopFeatures].find((f) => f.id === featureId)
  return feature?.price || 0
}

export const getContentPrice = (contentId: string): number => {
  const content = contentOptions.find((c) => c.id === contentId)
  return content?.priceValue || 0
}

export const getSEOPrice = (seoId: string, hasAds: boolean): number => {
  const seo = seoOptions.find((s) => s.id === seoId)
  const basePrice = seo?.priceValue || 0
  return basePrice + (hasAds ? 19997 : 0)
}

export const getSupportPrice = (supportId: string): number => {
  const support = supportOptions.find((s) => s.id === supportId)
  return support?.priceValue || 0
}

export const getUrgencyMultiplier = (urgencyId: string): number => {
  const urgency = urgencyOptions.find((u) => u.id === urgencyId)
  return urgency?.multiplier || 1.0
}

export const getTimeline = (urgency: string, siteType: string): string => {
  let baseDays = 14
  if (siteType === 'landing') baseDays = 7
  if (siteType === 'shop') baseDays = 21

  if (urgency === 'fast') return `${Math.ceil(baseDays / 2)} дней`
  if (urgency === 'urgent') return `${Math.ceil(baseDays / 3)} дней`
  return `${baseDays} дней`
}

