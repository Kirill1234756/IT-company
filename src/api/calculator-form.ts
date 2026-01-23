import type { CalculatorFormData, CalculatorFormSubmissionResponse } from '../types/calculator-form'

/**
 * API service for calculator form submission
 * Handles calculator form submissions with pricing data
 */

export class CalculatorFormAPI {
    private static getBaseURL(): string {
        const apiBase = (globalThis as unknown as { API_BASE?: string | (() => string) }).API_BASE
        const envUrl = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL
        
        // Handle if API_BASE is a function (shouldn't happen, but just in case)
        if (typeof apiBase === 'function') {
            console.warn('API_BASE is a function, this should be a string')
            return 'http://localhost:3000/api'
        }
        
        if (typeof apiBase === 'string' && apiBase) {
            return apiBase
        }
        
        if (typeof envUrl === 'string' && envUrl) {
            return envUrl
        }
        
        return 'http://localhost:3000/api'
    }
    
    private static baseURL: string = CalculatorFormAPI.getBaseURL()

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
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            
            const baseURL = this.baseURL
            const response = await fetch(`${baseURL}/calculator-form`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                // Try to get error details from response
                let errorMessage = `HTTP error! status: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData.errors) {
                        const errorDetails = Object.entries(errorData.errors)
                            .map(([field, message]) => `${field}: ${message}`)
                            .join(', ')
                        errorMessage = `Ошибка валидации: ${errorDetails}`
                    } else if (errorData.message) {
                        errorMessage = errorData.message
                    }
                } catch {
                    // If JSON parsing fails, use default message
                }
                throw new Error(errorMessage)
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


