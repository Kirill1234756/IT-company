import type { CalculatorFormData, CalculatorFormSubmissionResponse } from '../types/calculator-form'

/**
 * API service for calculator form submission
 * Handles calculator form submissions with pricing data
 */

export class CalculatorFormAPI {
    private static baseURL = (globalThis as unknown as { API_BASE?: string }).API_BASE
        || (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL
        || 'https://udevfchvbjgdalzyqbph.supabase.co/functions/v1'

    /**
     * Submit calculator form data to backend
     * @param formData - Calculator form data
     * @returns Promise with submission response
     */
    static async submitForm(
        formData: CalculatorFormData
    ): Promise<CalculatorFormSubmissionResponse> {
        try {
            const payload = { ...formData }
            const anon =
                (globalThis as unknown as { SUPABASE_ANON?: string }).SUPABASE_ANON ||
                (import.meta as unknown as { env?: { VITE_SUPABASE_ANON_KEY?: string } })
                    .env?.VITE_SUPABASE_ANON_KEY
            const isSupabaseFn = this.baseURL.includes('supabase.co/functions')
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (isSupabaseFn && anon) {
                headers['Authorization'] = `Bearer ${anon}`
                headers['apikey'] = anon
            }
            const response = await fetch(`${this.baseURL}/calculator-form`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.message || 'Ошибка при отправке формы')
            }

            return {
                success: true,
                message:
                    result.message ||
                    'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
                clientId: result.clientId,
            }
        } catch (error) {
            console.error('Calculator form submission error:', error)

            // Handle different types of errors
            if (error instanceof Error) {
                return {
                    success: false,
                    message: error.message,
                }
            }

            return {
                success: false,
                message: 'Произошла ошибка при отправке формы. Попробуйте еще раз.',
            }
        }
    }
}


