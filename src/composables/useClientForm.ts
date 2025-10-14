import { ref, reactive } from 'vue'
import type { ClientFormData, ClientFormErrors, ClientFormSubmissionResponse } from '../types/client-form'
import { ClientFormAPI } from '../api/client-form'

export function useClientForm() {
    const isSubmitting = ref(false)
    const errors = ref<ClientFormErrors>({})

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
        privacyAccepted: false
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
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
        if (formData.phone && !phoneRegex.test(formData.phone)) {
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
