import { ref, reactive } from 'vue'
import type { ClientFormData, ClientFormErrors, ClientFormSubmissionResponse } from '../types/client-form'
import { ClientFormAPI } from '../api/client-form'
import { useYandexMetrika } from './useYandexMetrika'

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
        name: '',
        company: '',
        phone: '',
        email: '',
        attachedFile: null,
        privacyAccepted: false,
        honeypot: '',
        formStartedAt: Date.now()
    })

    // File upload handler
    const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (target.files && target.files[0]) {
            const file = target.files[0]
            // Check file size (20MB max)
            if (file.size > 20 * 1024 * 1024) {
                errors.value.file = 'Максимум 20 МБ'
                return
            }
            formData.attachedFile = file
            errors.value.file = ''
        }
    }

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

    // Form validation
    const validateForm = (): boolean => {
        errors.value = {}

        // Required fields validation
        const requiredFields = [
            'companyDescription',
            'task',
            'solutionVision',
            'expectations',
            'budget',
            'name',
            'company',
            'phone',
            'email'
        ] as const

        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                errors.value[field] = 'Обязательное поле'
            }
        })

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            errors.value.email = 'Некорректный email'
        }

        // Phone validation (basic)
        // Normalize and validate phone (E.164 +7)
        if (formData.phone) {
            formData.phone = normalizePhone(formData.phone)
        }
        const phoneRegex = /^\+?[0-9]{11,15}$/
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, '').length === 11 ? formData.phone : formData.phone)) {
            errors.value.phone = 'Некорректный номер телефона'
        }

        // Privacy policy validation
        if (!formData.privacyAccepted) {
            errors.value.privacy = 'Необходимо принять политику конфиденциальности'
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
                    company: formData.company,
                    has_file: formData.attachedFile ? 'yes' : 'no'
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
        handleFileUpload,
        validateForm,
        submitForm,
        resetForm
    }
}
