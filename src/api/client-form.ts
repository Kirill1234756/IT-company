import type { ClientFormData, ClientFormSubmissionResponse } from '../types/client-form'

/**
 * API service for client form submission
 * This file contains the API logic that will be used when backend is implemented
 */

export class ClientFormAPI {
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
  
  private static baseURL: string = ClientFormAPI.getBaseURL()

  /**
   * Submit client form data to backend
   * @param formData - Client form data
   * @returns Promise with submission response
   */
  static async submitForm(formData: ClientFormData): Promise<ClientFormSubmissionResponse> {
    try {
      // Node.js бекенд принимает multipart/form-data для загрузки файлов
      const formDataToSend = new FormData()
      
      // Добавляем текстовые поля (ответы на вопросы)
      formDataToSend.append('companyDescription', formData.companyDescription || '')
      formDataToSend.append('task', formData.task || '')
      formDataToSend.append('solutionVision', formData.solutionVision || '')
      formDataToSend.append('expectations', formData.expectations || '')
      // Budget: selected range + optional comment (store together to not require DB changes)
      const budgetRange = (formData.budget || '').trim()
      const budgetComment = String((formData as unknown as { budgetComment?: string }).budgetComment || '').trim()
      const budgetToSend =
        budgetRange && budgetComment ? `${budgetRange}\nКомментарий: ${budgetComment}` : budgetRange || budgetComment || ''
      formDataToSend.append('budget', budgetToSend)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('company', formData.company)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('privacyAccepted', String((formData as unknown as { privacyAccepted?: boolean }).privacyAccepted ?? true))
      
      // Only send honeypot if it has content (should be empty for legitimate users)
      if (formData.honeypot && String(formData.honeypot).trim() !== '') {
        formDataToSend.append('honeypot', String(formData.honeypot).trim())
      }
      
      // Always send formStartedAt for timing validation
      if (formData.formStartedAt) {
        formDataToSend.append('formStartedAt', String(formData.formStartedAt))
      }

      // File upload removed - no longer needed

      // Не устанавливаем Content-Type - браузер установит его автоматически с boundary для multipart/form-data
      const baseURL = this.baseURL
      const response = await fetch(`${baseURL}/client-form`, {
        method: 'POST',
        body: formDataToSend
      })

      // Try to parse response body even if status is not OK
      let result: any
      try {
        result = await response.json()
      } catch (parseError) {
        // If response is not JSON, throw error with status
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.ok) {
        // If we have validation errors, include them in the error message
        if (result.errors && typeof result.errors === 'object') {
          const errorMessages = Object.values(result.errors).join(', ')
          throw new Error(errorMessages || result.message || `HTTP error! status: ${response.status}`)
        }
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

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
 * Backend API endpoints (Node.js):
 *
 * POST /api/client-form
 * - Accepts multipart/form-data
 * - Fields: companyDescription, task, solutionVision, expectations, budget, name, company, phone, email, privacyAccepted, attachedFile (optional), honeypot, formStartedAt
 * - Returns: { success: boolean, clientId: string, message: string }
 *
 * POST /api/client-form/validate (optional)
 * - Accepts application/json
 * - Returns: { valid: boolean, errors: Record<string, string> }
 *
 * Expected backend response format:
 * {
 *   "success": true,
 *   "clientId": "uuid-заявки",
 *   "message": "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время."
 * }
 */

