export interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    honeypot: string;
    formStartedAt: number;
    [key: string]: string | number;
}

export interface ContactFormErrors {
    name?: string
    phone?: string
    email?: string
    general?: string
    honeypot?: string
    formStartedAt?: string
}

export interface ContactFormSubmissionResponse {
    success: boolean
    message: string
    clientId?: string
    data?: ContactFormRecord
}

export interface ContactFormRecord {
    id: string
    name: string
    phone: string
    email: string
    status: string
    source: string
    bitrix_lead_id?: number
    created_at: string
    updated_at: string
}

