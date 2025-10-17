import type { ClientFormData, ClientFormSubmissionResponse } from '../types/client-form'

/**
 * API service for client form submission
 * This file contains the API logic that will be used when backend is implemented
 */

export class ClientFormAPI {
  private static baseURL = '/api'

  /**
   * Submit client form data to backend
   * @param formData - Client form data
   * @returns Promise with submission response
   */
  static async submitForm(formData: ClientFormData): Promise<ClientFormSubmissionResponse> {
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()

      // Add text fields
      formDataToSend.append('companyDescription', formData.companyDescription)
      formDataToSend.append('task', formData.task)
      formDataToSend.append('solutionVision', formData.solutionVision)
      formDataToSend.append('expectations', formData.expectations)
      formDataToSend.append('budget', formData.budget)
      formDataToSend.append('name', formData.name)
      formDataToSend.append('company', formData.company)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('email', formData.email)

      // Add file if present
      if (formData.attachedFile) {
        formDataToSend.append('attachedFile', formData.attachedFile)
      }

      const response = await fetch(`${this.baseURL}/client-form`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          // Don't set Content-Type header when using FormData
          // The browser will set it automatically with the correct boundary
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        clientId: result.clientId
      }
    } catch (error) {
      console.error('Client form submission error:', error)
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

