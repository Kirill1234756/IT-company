import { beforeEach, describe, expect, it, vi } from 'vitest'

const { submitFormMock, trackFormSubmitMock } = vi.hoisted(() => ({
  submitFormMock: vi.fn(),
  trackFormSubmitMock: vi.fn(),
}))

vi.mock('@/api/client-form', () => ({
  ClientFormAPI: {
    submitForm: submitFormMock,
  },
}))

vi.mock('@/composables/useYandexMetrika', () => ({
  useYandexMetrika: () => ({
    trackFormSubmit: trackFormSubmitMock,
  }),
}))

import { useClientForm } from '@/composables/useClientForm'

describe('useClientForm', () => {
  beforeEach(() => {
    submitFormMock.mockReset()
    trackFormSubmitMock.mockReset()
  })

  it('does not block empty optional fields', () => {
    const { validateForm, errors } = useClientForm()
    expect(validateForm()).toBe(true)
    expect(errors.value).toEqual({})
  })

  it('validates invalid email', () => {
    const { formData, validateForm, errors } = useClientForm()
    formData.email = 'invalid-email'

    expect(validateForm()).toBe(false)
    expect(errors.value.email).toContain('Некорректный email')
  })

  it('normalizes russian phone and validates it', () => {
    const { formData, validateForm, errors } = useClientForm()
    formData.phone = '8 (999) 111-22-33'

    expect(validateForm()).toBe(true)
    expect(formData.phone).toBe('+79991112233')
    expect(errors.value.phone).toBeUndefined()
  })

  it('returns validation error for malformed phone', () => {
    const { formData, validateForm, errors } = useClientForm()
    formData.phone = '123'

    expect(validateForm()).toBe(false)
    expect(errors.value.phone).toContain('Некорректный номер телефона')
  })

  it('submits form and tracks successful submit', async () => {
    const { formData, submitForm, isSubmitting } = useClientForm()
    formData.company = 'Kodify'
    formData.budget = '100 000'

    submitFormMock.mockResolvedValue({
      success: true,
      message: 'ok',
      clientId: 'id-1',
    })

    expect(isSubmitting.value).toBe(false)
    const result = await submitForm()

    expect(result.success).toBe(true)
    expect(result.clientId).toBe('id-1')
    expect(trackFormSubmitMock).toHaveBeenCalledWith('client-form', {
      budget: '100 000',
      company: 'Kodify',
    })
    expect(isSubmitting.value).toBe(false)
  })

  it('returns fallback message on submit exception', async () => {
    const { submitForm, isSubmitting } = useClientForm()
    submitFormMock.mockRejectedValue(new Error('network failed'))

    const result = await submitForm()

    expect(result.success).toBe(false)
    expect(result.message).toContain('Произошла ошибка при отправке формы')
    expect(isSubmitting.value).toBe(false)
    expect(trackFormSubmitMock).not.toHaveBeenCalled()
  })

  it('resets form and errors', () => {
    const { formData, errors, resetForm } = useClientForm()
    formData.name = 'Иван'
    formData.phone = '123'
    errors.value.phone = 'Некорректный номер телефона'

    resetForm()

    expect(formData.name).toBe('')
    expect(formData.phone).toBe('')
    expect(formData.privacyAccepted).toBe(false)
    expect(errors.value).toEqual({})
  })
})
