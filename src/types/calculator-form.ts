export interface CalculatorFormData {
    name: string
    phone: string
    email?: string
    // Данные калькулятора
    siteType: string
    pages?: string
    design: string
    features: string[]
    content: string
    seo: string
    ads: boolean
    urgency: string
    support: string
    // Расчет
    calculatedPrice: number
    minPrice: number
    maxPrice: number
    timeline: string
    // Технические поля
    honeypot?: string
    formStartedAt?: number
}

export interface CalculatorFormErrors {
    name?: string
    phone?: string
    email?: string
    general?: string
}

export interface CalculatorFormSubmissionResponse {
    success: boolean
    message: string
    clientId?: string
    data?: CalculatorFormRecord
}

export interface CalculatorFormRecord {
    id: string
    name: string
    phone: string
    email?: string
    site_type: string
    pages?: string
    design: string
    features: string[]
    content: string
    seo: string
    ads: boolean
    urgency: string
    support: string
    calculated_price: number
    min_price: number
    max_price: number
    timeline: string
    status: string
    source: string
    bitrix_lead_id?: number
    created_at: string
    updated_at: string
}


