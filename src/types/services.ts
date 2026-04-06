export interface ServiceItem {
    id: number
    title: string
    price: string
    description: string
    type: 'list' | 'detail' // 'list' - открывает список услуг, 'detail' - детальную информацию
    slug?: string // URL slug для навигации
}

export interface ServiceDetail {
    id: number
    title: string
    breadcrumbs: string[]
    about: {
        title: string
        description: string[]
    }
    metrics: {
        cost: string
        workingDays: number
        /** Подпись вместо числа (например «10–14») */
        workingDaysLabel?: string
        /** Подпись над ценой (по умолчанию «Стоимость работ от») */
        costMetricCaption?: string
        /** Подпись над второй метрикой (по умолчанию «рабочих дней на сдачу») */
        workingDaysCaption?: string
    }
    features: Array<{
        id: number
        title: string
        description: string
    }>
    stages?: Array<{
        id: number
        number: string
        title: string
        description: string
    }>
    faq?: Array<{
        id: number
        question: string
        answer: string
    }>
    /** Когда услуга нужна — маркеры списка */
    whenNeeded?: string[]
    /** Короткий акцент под списком (например про бюджет вслепую) */
    whenNeededNote?: string
    /** Итоги: отчёт, выводы, стратегия */
    deliverables?: {
        report: string[]
        conclusions: string[]
        strategy: string
    }
    /** Блок «почему важно» */
    whyImportant?: Array<{
        id: number
        title: string
        description: string
    }>
    /** Главная ценность / УТП услуги */
    mainValue?: string
    /** Что влияет на стоимость */
    pricingFactors?: string[]
    /** Текст про сроки (если не только число в metrics) */
    timelineNote?: string
    /** Пример инсайта для доверия */
    insightExample?: string
    /** Риски без анализа */
    withoutAnalysis?: string[]
    withoutAnalysisTitle?: string
    /** Мини-кейс */
    miniCase?: {
        title: string
        description: string[]
    }
    /** Цепляющий вопрос/заголовок под H1 */
    tagline?: string
    /** Подзаголовок под tagline */
    subtitle?: string
    /** Короткий блок боли над основным текстом */
    painHighlight?: string
    /** Основная кнопка под хиро */
    primaryCta?: {
        label: string
        href?: string
    }
    /** Блок «проблема» (отдельно от whenNeeded) */
    problemBlock?: {
        title: string
        intro?: string
        items: string[]
        footnote?: string
    }
    /** Короткий список выгод («после внедрения») */
    receiveAfter?: {
        title: string
        intro?: string
        items: string[]
    }
    /** Заголовок секции со списком features */
    featuresSectionTitle?: string
    /** Заголовок секции outputPackage */
    outputPackageSectionTitle?: string
    /** Несколько карточек «что на выходе» */
    outputPackage?: Array<{ title: string; items: string[] }>
    /** Заголовок секции whyImportant */
    whyImportantSectionTitle?: string
    /** Кастомный заголовок/вводный текст для whenNeeded */
    whenNeededTitle?: string
    whenNeededIntro?: string
    /** До и после внедрения */
    beforeAfter?: {
        title?: string
        beforeTitle?: string
        afterTitle?: string
        before: string[]
        after: string[]
    }
    /** Акцентный блок (например влияние на конверсию/деньги) */
    impactBlock?: {
        title: string
        description: string
    }
    /** Доп. маркированный блок (например виды калькуляторов) */
    additionalList?: {
        title: string
        items: string[]
    }
    /** Акцентный блок после «что получите» (например основа подхода) */
    foundationBlock?: {
        title: string
        description: string
    }
}

export interface ServiceCategory {
    id: number
    title: string
    type: 'list' | 'detail'
    slug?: string // URL slug для навигации
    items?: ServiceItem[] // Для категорий типа 'list'
    detail?: ServiceDetail // Для категорий типа 'detail'
}
