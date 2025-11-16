/**
 * Calculator data - extracted for better code splitting and tree-shaking
 */

export interface SiteType {
    id: string
    label: string
    description: string
    price: string
    icon: string
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

// Site types with base prices
export const siteTypes: SiteType[] = [
    {
        id: 'landing',
        label: 'Лендинг',
        description: '1 страница',
        price: 'от 25,000₽',
        icon: '📄',
        basePrice: 25000,
    },
    {
        id: 'business',
        label: 'Сайт-визитка',
        description: '5-10 страниц',
        price: 'от 40,000₽',
        icon: '🏢',
        basePrice: 40000,
    },
    {
        id: 'shop',
        label: 'Интернет-магазин',
        description: 'Каталог товаров',
        price: 'от 80,000₽',
        icon: '🛒',
        basePrice: 80000,
    },
    {
        id: 'portfolio',
        label: 'Портфолио',
        description: 'Галерея работ',
        price: 'от 50,000₽',
        icon: '🎨',
        basePrice: 50000,
    },
    {
        id: 'blog',
        label: 'Блог/Медиа',
        description: 'Статьи и новости',
        price: 'от 60,000₽',
        icon: '📰',
        basePrice: 60000,
    },
]

// Pages options
export const pagesOptionsMap: Record<string, { regular: number; shop: number }> = {
    '6-10': { regular: 15000, shop: 20000 },
    '11-15': { regular: 30000, shop: 40000 },
    '16-20': { regular: 45000, shop: 60000 },
}

// Design options
export const designOptions: DesignOption[] = [
    { id: 'ready', label: 'У меня есть готовый дизайн/макеты', price: 'Включено', priceValue: 0 },
    { id: 'template', label: 'Адаптация шаблона под бренд', price: '+8,000₽', priceValue: 8000 },
    { id: 'unique', label: 'Уникальный дизайн с нуля', price: '+25,000₽', priceValue: 25000 },
    { id: 'premium', label: 'Премиум-дизайн с анимациями', price: '+40,000₽', priceValue: 40000 },
]

// Base features (included)
export const baseFeatures: Feature[] = [
    { id: 'form', label: 'Форма обратной связи', price: 0, included: true },
    { id: 'responsive', label: 'Адаптивная верстка', price: 0, included: true },
    { id: 'basic-seo', label: 'Базовое SEO', price: 0, included: true },
]

// Additional features
export const additionalFeatures: Feature[] = [
    { id: 'chat', label: 'Онлайн-чат (Jivo/WhatsApp)', price: 5000 },
    { id: 'booking', label: 'Онлайн-запись/бронирование', price: 15000 },
    { id: 'cabinet', label: 'Личный кабинет', price: 25000 },
    { id: 'crm', label: 'Интеграция с CRM', price: 12000 },
    { id: 'multilang', label: 'Мультиязычность', price: 15000 },
    { id: 'calculator', label: 'Калькулятор стоимости', price: 10000 },
    { id: 'payment', label: 'Онлайн-оплата', price: 20000 },
]

// Shop-specific features
export const shopFeatures: Feature[] = [
    { id: 'products-51-200', label: '51-200 товаров', price: 15000 },
    { id: 'products-201-500', label: '201-500 товаров', price: 30000 },
    { id: 'products-500+', label: 'Больше 500 товаров', price: 50000 },
    { id: 'filters', label: 'Фильтры и сортировка', price: 10000 },
    { id: 'compare', label: 'Сравнение товаров', price: 8000 },
    { id: 'reviews', label: 'Отзывы и рейтинги', price: 7000 },
]

// Content options
export const contentOptions: ContentOption[] = [
    { id: 'ready', label: 'У меня есть все тексты и фото', price: 'Включено', priceValue: 0 },
    { id: 'media', label: 'Тексты есть, нужны фото/иконки', price: '+5,000₽', priceValue: 5000 },
    { id: 'copywriting', label: 'Нужен копирайтинг (до 5000 знаков)', price: '+15,000₽', priceValue: 15000 },
    { id: 'full', label: 'Полный контент (тексты + медиа)', price: '+25,000₽', priceValue: 25000 },
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
        price: '+15,000₽',
        priceValue: 15000,
        description: '+ анализ конкурентов, семантика',
    },
    {
        id: 'complex',
        label: 'Комплексное SEO',
        price: '+35,000₽',
        priceValue: 35000,
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
    return basePrice + (hasAds ? 20000 : 0)
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

