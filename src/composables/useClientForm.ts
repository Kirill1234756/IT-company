import { ref, reactive } from 'vue'
import type { ClientFormData, ClientFormErrors, ClientFormSubmissionResponse } from '../types/client-form'
import { ClientFormAPI } from '../api/client-form'
import { useYandexMetrika } from './useYandexMetrika'

function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let id: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), delay)
  }
}

export function useClientForm() {
  const isSubmitting = ref(false)
  const errors = ref<ClientFormErrors>({})
  const { trackFormSubmit } = useYandexMetrika()

  const formData = reactive<ClientFormData>({
    companyDescription: '',
    task: '',
    solutionVision: '',
    expectations: '',
    budget: '',
    budgetComment: '',
    name: '',
    company: '',
    phone: '',
    email: '',
    attachedFile: null,
    privacyAccepted: false,
    honeypot: '',
    formStartedAt: Date.now()
  })

  // Helpers
  const normalizePhone = (value: string): string => {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    let norm = digits
    if (digits.startsWith('8') && digits.length === 11) norm = '7' + digits.slice(1)
    else if (digits.length === 10) norm = '7' + digits
    else if (digits.startsWith('7') && digits.length === 11) norm = digits
    return norm.length === 11 ? `+${norm}` : value
  }

  /** Формат телефона/email, если поля не пустые (без мутации телефона — только подсветка). */
  const applyContactFormatErrors = () => {
    const next: ClientFormErrors = { ...errors.value }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      next.email = 'Некорректный email'
    } else {
      delete next.email
    }
    if (formData.phone) {
      const normalized = normalizePhone(formData.phone)
      const phoneDigits = normalized.replace(/\D/g, '')
      const phoneRegex = /^\d{11,15}$/
      if (!phoneRegex.test(phoneDigits)) {
        next.phone = 'Некорректный номер телефона'
      } else {
        delete next.phone
      }
    } else {
      delete next.phone
    }
    errors.value = next
  }

  const scheduleContactFieldValidation = debounce(() => {
    applyContactFormatErrors()
  }, 300)

  // Form validation
  const validateForm = (): boolean => {
    // Убираем обязательность полей: не блокируем отправку, если поля пустые
    errors.value = {}

    // Проверяем только формат email, если он введён
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.value.email = 'Некорректный email'
    }

    // Нормализуем телефон и проверяем формат, если введён
    if (formData.phone) {
      formData.phone = normalizePhone(formData.phone)
      const phoneDigits = formData.phone.replace(/\D/g, '')
      const phoneRegex = /^\d{11,15}$/
      if (!phoneRegex.test(phoneDigits)) {
        errors.value.phone = 'Некорректный номер телефона'
      }
    }

    return Object.keys(errors.value).length === 0
  }

  // Form submission
  const submitForm = async (): Promise<ClientFormSubmissionResponse> => {
    if (!validateForm()) {
      return { success: false, message: 'Пожалуйста, исправьте ошибки в форме' }
    }

    isSubmitting.value = true

    try {
      const result = await ClientFormAPI.submitForm(formData)

      // Отслеживаем успешную отправку формы
      if (result.success) {
        trackFormSubmit('client-form', {
          budget: formData.budget,
          company: formData.company
        })
      }

      return result
    } catch (error) {
      console.error('Form submission error:', error)
      return {
        success: false,
        message: 'Произошла ошибка при отправке формы. Попробуйте еще раз.'
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // Reset form
  const resetForm = () => {
    Object.assign(formData, {
      companyDescription: '',
      task: '',
      solutionVision: '',
      expectations: '',
      budget: '',
      budgetComment: '',
      name: '',
      company: '',
      phone: '',
      email: '',
      attachedFile: null,
      privacyAccepted: false
    })
    errors.value = {}
  }

  return {
    formData,
    errors,
    isSubmitting,
    validateForm,
    submitForm,
    resetForm,
    scheduleContactFieldValidation,
  }
}
