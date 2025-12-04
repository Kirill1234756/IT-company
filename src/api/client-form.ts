import type { ClientFormData, ClientFormSubmissionResponse } from '../types/client-form'

/**
 * API service for client form submission
 * This file contains the API logic that will be used when backend is implemented
 */

export class ClientFormAPI {
  private static baseURL: string = 
    (globalThis as unknown as { API_BASE?: string }).API_BASE
    || (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL
    || 'https://udevfchvbjgdalzyqbph.supabase.co/functions/v1'

  /**
   * Submit client form data to backend
   * @param formData - Client form data
   * @returns Promise with submission response
   */
  static async submitForm(formData: ClientFormData): Promise<ClientFormSubmissionResponse> {
    try {
      // Edge Functions принимают JSON. Файл (если нужен) должен быть загружен в Storage заранее.
      const payload: Record<string, unknown> = {
        companyDescription: formData.companyDescription,
        task: formData.task,
        solutionVision: formData.solutionVision,
        expectations: formData.expectations,
        budget: formData.budget,
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        privacyAccepted: (formData as unknown as { privacyAccepted?: boolean }).privacyAccepted ?? true,
        honeypot: formData.honeypot,
        formStartedAt: formData.formStartedAt
      }

      // Если файл присутствует, передаем только метаданные (URL должен формироваться на фронте после загрузки в Storage)
      const meta = formData as unknown as {
        attachedFileUrl?: string
        attachedFileName?: string
        attachedFileSize?: number
        privacyAccepted?: boolean
      }
      if (meta.attachedFileUrl) {
        payload.attachedFileUrl = meta.attachedFileUrl
        payload.attachedFileName = meta.attachedFileName
        payload.attachedFileSize = meta.attachedFileSize
      }

      const anon = (globalThis as unknown as { SUPABASE_ANON?: string }).SUPABASE_ANON || (import.meta as unknown as { env?: { VITE_SUPABASE_ANON_KEY?: string } }).env?.VITE_SUPABASE_ANON_KEY
      const isSupabaseFn = this.baseURL.includes('supabase.co/functions')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (isSupabaseFn && anon) {
        headers['Authorization'] = `Bearer ${anon}`
        headers['apikey'] = anon
      }
      const response = await fetch(`${this.baseURL}/client-form`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
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
        message: result.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        clientId: result.clientId
      }
    } catch (error) {
      console.error('Client form submission error:', error)

      // Handle different types of errors
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message
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
   * @param formData - Client form data
   * @returns Promise with validation response
   */
  static async validateForm(formData: Partial<ClientFormData>): Promise<{ valid: boolean; errors: Record<string, string> }> {
    try {
      const response = await fetch(`${this.baseURL}/client-form/validate`, {
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
}

/**
 * Backend API endpoints that need to be implemented:
 *
 * POST /api/client-form
 * - Accepts multipart/form-data
 * - Fields: companyDescription, task, solutionVision, expectations, budget, name, company, phone, email, attachedFile
 * - Returns: { success: boolean, clientId: string, message: string }
 *
 * POST /api/client-form/validate (optional)
 * - Accepts application/json
 * - Returns: { valid: boolean, errors: Record<string, string> }
 *
 * Expected backend response format:
 * {
 *   "success": true,
 *   "clientId": "CLIENT_12345",
 *   "message": "Заявка успешно отправлена"
 * }
 */

