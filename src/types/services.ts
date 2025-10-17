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
}

export interface ServiceCategory {
    id: number
    title: string
    type: 'list' | 'detail'
    slug?: string // URL slug для навигации
    items?: ServiceItem[] // Для категорий типа 'list'
    detail?: ServiceDetail // Для категорий типа 'detail'
}
