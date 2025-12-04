import type { ContactFormData, ContactFormSubmissionResponse } from '../types/contact-form'

/**
 * API service for contact form submission
 * Handles simple contact form submissions
 */

export class ContactFormAPI {
  private static baseURL: string =
    (globalThis as unknown as { API_BASE?: string }).API_BASE
    || (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL
    || 'https://udevfchvbjgdalzyqbph.supabase.co/functions/v1'

  /**
   * Submit contact form data to backend
   * @param formData - Contact form data
   * @returns Promise with submission response
   */
  static async submitForm(formData: ContactFormData): Promise<ContactFormSubmissionResponse> {
    try {
      // Validate baseURL is a string
      if (typeof this.baseURL !== 'string') {
        throw new Error('Invalid API base URL configuration')
      }

      const payload = { ...formData }
      const anon = (globalThis as unknown as { SUPABASE_ANON?: string }).SUPABASE_ANON
        || (import.meta as unknown as { env?: { VITE_SUPABASE_ANON_KEY?: string } }).env?.VITE_SUPABASE_ANON_KEY

      const isSupabaseFn = typeof this.baseURL === 'string' && this.baseURL.includes('supabase.co/functions')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }

      if (isSupabaseFn && anon) {
        headers['Authorization'] = `Bearer ${anon}`
        headers['apikey'] = anon
      }

      const url = `${this.baseURL}/contact-form`

      // Log for debugging (only in development)
      if (import.meta.env.DEV) {
        console.log('Contact form API call:', { url, hasAnonKey: !!anon, baseURL: this.baseURL })
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Ошибка при отправке формы')
      }

      return {
        success: true,
        message: result.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        clientId: result.clientId
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      console.error('Base URL:', this.baseURL)

      // Handle network errors specifically
      if (error instanceof TypeError) {
        // Network error (CORS, connection refused, etc.)
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          const isSupabase = this.baseURL.includes('supabase.co')
          return {
            success: false,
            message: isSupabase
              ? 'Не удалось подключиться к Supabase Edge Functions. Убедитесь, что функции развернуты и доступны.'
              : 'Ошибка подключения к серверу. Проверьте интернет-соединение и попробуйте еще раз.'
          }
        }
      }

      // Handle different types of errors
      if (error instanceof Error) {
        // Don't expose technical error messages to users
        const userMessage = error.message.includes('HTTP error') || error.message.includes('fetch')
          ? 'Ошибка при отправке формы. Попробуйте еще раз позже.'
          : error.message

        return {
          success: false,
          message: userMessage
        }
      }

      return {
        success: false,
        message: 'Произошла ошибка при отправке формы. Попробуйте еще раз.'
      }
    }
  }

  /**
   * Validate form data on backend (optional)
   * @param formData - Contact form data
   * @returns Promise with validation response
   */
  static async validateForm(formData: Partial<ContactFormData>): Promise<{ valid: boolean; errors: Record<string, string> }> {
    try {
      const response = await fetch(`${this.baseURL}/contact-form/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Form validation error:', error)
      return { valid: false, errors: { general: 'Ошибка валидации' } }
    }
  }

  /**
   * Get contact form by ID (for admin purposes)
   * @param id - Form ID
   * @returns Promise with form data
   */
  static async getFormById(id: string): Promise<ContactFormSubmissionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/contact-form/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Ошибка при получении заявки')
      }

      return {
        success: true,
        message: 'Заявка получена',
        data: result.data
      }
    } catch (error) {
      console.error('Error getting contact form:', error)

      if (error instanceof Error) {
        return {
          success: false,
          message: error.message
        }
      }

      return {
        success: false,
        message: 'Ошибка при получении заявки'
      }
    }
  }
}

/**
 * Backend API endpoints that are implemented:
 *
 * POST /api/contact-form
 * - Accepts application/json
 * - Fields: name, phone, email
 * - Returns: { success: boolean, clientId: string, message: string }
 *
 * GET /api/contact-form/:id
 * - Returns: { success: boolean, data: ContactFormRecord }
 *
 * GET /api/contact-form
 * - Query params: page, limit, status
 * - Returns: { success: boolean, data: ContactFormRecord[], pagination: object }
 *
 * PUT /api/contact-form/:id/status
 * - Body: { status: string, bitrixLeadId?: number }
 * - Returns: { success: boolean, message: string }
 *
 * Expected backend response format:
 * {
 *   "success": true,
 *   "clientId": "abc-123-def",
 *   "message": "Заявка успешно отправлена"
 * }
 */

