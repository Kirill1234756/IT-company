import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Types
export interface StatItem {
    value: number
    label: string
    sublabel?: string
}

export interface Advantage {
    title: string
    description: string
}

export interface WhatWeDoCard {
    title: string
    description: string
    icon: string
    wrapperClass: string
}

export interface Service {
    id: number
    title: string
    description: string
    priceFrom: string
    icon: string
    iconBg: string
}

export const useContentStore = defineStore('content', () => {
    // Stats data
    const stats = ref<StatItem[]>([
        { value: 13, label: 'лет', sublabel: 'на рынке' },
        { value: 400, label: 'проектов', sublabel: 'реализованных' },
        { value: 25, label: 'человек', sublabel: 'в команде' },
        { value: 10, label: 'ТОП', sublabel: 'по Tagline' },
    ])

    // Advantages data
    const advantages = ref<Advantage[]>([
        {
            title: 'Комплексный подход',
            description:
                'Мы можем взяться как за отдельные задачи, так и за весь проект целиком: от анализа рынка до разработки решений и продвижения «под ключ».',
        },
        {
            title: 'Бизнес‑задачи',
            description:
                'Все решения предлагаем исходя из целей вашего бизнеса — рост продаж, автоматизация, выстраивание коммуникаций с клиентами.',
        },
        {
            title: 'Каждый клиент важен',
            description:
                'Строим долгосрочные отношения: после разработки продолжаем работу над продвижением и аналитикой.',
        },
        {
            title: 'Высокая рабочая скорость',
            description:
                'Процессы внутри команды отлажены и гибко организованы — быстро включаемся в работу над проектом.',
        },
        {
            title: 'Выгодное предложение',
            description:
                'Вы не переплачиваете за бренд — получаете проект высокого уровня с оптимальным бюджетом.',
        },
        {
            title: 'Гибкая команда',
            description:
                'Небольшая команда адаптируется под процессы заказчика и оперативно принимает решения.',
        },
    ])

    // What We Do cards data
    const whatWeDoCards = ref<WhatWeDoCard[]>([
        {
            title: 'Стратегия',
            description:
                'Мы поможем создать бизнес‑план, разработать стратегию развития продукта и воплотить цели в реальность.',
            icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23L11 13V7z',
            wrapperClass: 'md:col-span-6 ',
        },
        {
            title: 'Рост',
            description:
                'Мы проведём исследование и анализ вашего цифрового продукта, обновим веб‑ресурсы и скорректируем маркетинговую стратегию для повышения эффективности вашего бизнеса.',
            icon: 'M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z',
            wrapperClass: 'md:col-span-6 ',
        },
        {
            title: 'Разработка',
            description:
                'Мы создадим привлекательные веб‑сайты или эффективные веб‑приложения, поможем автоматизировать бизнес‑процессы и интегрируемся с другими информационными системами для улучшения общей функциональности.',
            icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
            wrapperClass: 'md:col-span-8 md:py-[2rem]',
        },
    ])

    // Services data (commented out in original, but useful to have)
    const servicesData = ref<{
        strategy: Service[]
        growth: Service[]
        development: Service[]
    }>({
        strategy: [
            {
                id: 1,
                title: 'Business Strategy Development',
                description: 'Comprehensive business strategy development including market analysis, competitive positioning, and growth planning.',
                priceFrom: '€800',
                icon: '🎯',
                iconBg: 'from-red-50 to-rose-100'
            },
            {
                id: 2,
                title: 'Digital Transformation',
                description: 'Complete digital transformation strategy including technology assessment and process optimization.',
                priceFrom: '€1200',
                icon: '🚀',
                iconBg: 'from-cyan-50 to-sky-100'
            }
        ],
        growth: [
            {
                id: 3,
                title: 'Promoting',
                description: "Essential element of any company's development in digital, allowing to attract customers for any product or service.",
                priceFrom: '€400',
                icon: '✅',
                iconBg: 'from-green-50 to-emerald-100'
            },
            {
                id: 4,
                title: 'Marketing Strategy',
                description: 'Developing a business development path in the market and increasing its competitiveness.',
                priceFrom: '€500',
                icon: '📣',
                iconBg: 'from-blue-50 to-indigo-100'
            }
        ],
        development: [
            {
                id: 5,
                title: 'Web Development',
                description: 'Custom web application development using modern technologies for scalable and performant solutions.',
                priceFrom: '€600',
                icon: '💻',
                iconBg: 'from-indigo-50 to-blue-100'
            },
            {
                id: 6,
                title: 'Mobile App Development',
                description: 'Native and cross-platform mobile application development for iOS and Android.',
                priceFrom: '€800',
                icon: '📱',
                iconBg: 'from-pink-50 to-rose-100'
            }
        ]
    })

    // Computed
    const totalStats = computed(() =>
        stats.value.reduce((sum, stat) => sum + stat.value, 0)
    )

    const advantagesCount = computed(() => advantages.value.length)
    const servicesCount = computed(() =>
        Object.values(servicesData.value).flat().length
    )

    // Actions for dynamic content updates
    const updateStats = (newStats: StatItem[]) => {
        stats.value = newStats
    }

    const updateAdvantages = (newAdvantages: Advantage[]) => {
        advantages.value = newAdvantages
    }

    const updateWhatWeDoCards = (newCards: WhatWeDoCard[]) => {
        whatWeDoCards.value = newCards
    }

    const getServiceById = (id: number) => {
        const allServices = Object.values(servicesData.value).flat()
        return allServices.find(service => service.id === id)
    }

    const getServicesByCategory = (category: 'strategy' | 'growth' | 'development') => {
        return servicesData.value[category] || []
    }

    return {
        // State
        stats,
        advantages,
        whatWeDoCards,
        servicesData,

        // Computed
        totalStats,
        advantagesCount,
        servicesCount,

        // Actions
        updateStats,
        updateAdvantages,
        updateWhatWeDoCards,
        getServiceById,
        getServicesByCategory
    }
})
