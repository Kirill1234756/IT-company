<script setup lang="ts">
import {
  ref,
  computed,
  shallowReactive,
  markRaw,
  onMounted,
  onUnmounted,
  nextTick,
  watchEffect,
} from 'vue'

// Performance monitoring
const performanceMetrics = shallowReactive({
  renderStart: 0,
  renderEnd: 0,
  validationTime: 0,
  inputDebounceTime: 0,
})

import type { ContactFormData } from '../../types/contact-form'
import { ContactFormAPI } from '../../api/contact-form'

// Validation cache for performance
const validationCache = new Map<string, string | undefined>()

// Debounce utility
const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle utility
const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Reactive form data as Record<string, string | number>
const formData = ref<Record<string, string | number>>({
  name: '',
  phone: '',
  email: '',
  honeypot: '',
  formStartedAt: Date.now(),
})

// Form errors
const errors = ref<Record<string, string | undefined>>({})

// Form submission state
const isSubmitting = ref(false)

// Lazy loading state
const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// Memoized contact fields configuration with markRaw for static data
const contactFields = markRaw([
  { key: 'name' as keyof ContactFormData, placeholder: 'Ваше имя', type: 'text' },
  { key: 'phone' as keyof ContactFormData, placeholder: 'Телефон (+7 XXX XXX-XX-XX)', type: 'tel' },
  { key: 'email' as keyof ContactFormData, placeholder: 'Электронная почта', type: 'email' },
])

// Memoized computed classes with better caching
const inputClasses = computed(() => {
  return 'w-full max-w-xs px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base border border-bg rounded-[3rem] text-bg placeholder:text-bg/70 bg-transparent focus:outline-none focus:border-accent focus:ring-0 transition-colors duration-200'
})

const buttonClasses = computed(() => {
  return 'w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base border border-bg rounded-[3rem] text-bg bg-transparent hover:bg-bg hover:text-text transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed'
})

// Memoized validation functions with caching
const validateName = (name: string): string | undefined => {
  const cacheKey = `name-${name}`
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)
  }

  const start = performance.now()
  let result: string | undefined

  if (!name.trim()) {
    result = 'Имя обязательно для заполнения'
  } else if (name.trim().length < 2) {
    result = 'Имя должно содержать минимум 2 символа'
  } else {
    result = undefined
  }

  validationCache.set(cacheKey, result)
  performanceMetrics.validationTime += performance.now() - start
  return result
}

const validatePhone = (phone: string): string | undefined => {
  const cacheKey = `phone-${phone}`
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)
  }

  const start = performance.now()
  let result: string | undefined

  if (!phone.trim()) {
    result = 'Телефон обязателен для заполнения'
  } else {
    // Улучшенная валидация: проверяем только цифры после очистки
    const digits = phone.replace(/\D/g, '')
    // Проверяем, что есть минимум 10 цифр (российский номер)
    if (digits.length >= 10 && digits.length <= 15) {
      result = undefined
    } else {
      result = 'Введите корректный номер телефона'
    }
  }

  validationCache.set(cacheKey, result)
  performanceMetrics.validationTime += performance.now() - start
  return result
}

const validateEmail = (email: string): string | undefined => {
  const cacheKey = `email-${email}`
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)
  }

  const start = performance.now()
  let result: string | undefined

  if (!email.trim()) {
    result = 'Email обязателен для заполнения'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    result = emailRegex.test(email) ? undefined : 'Введите корректный email адрес'
  }

  validationCache.set(cacheKey, result)
  performanceMetrics.validationTime += performance.now() - start
  return result
}

type ContactKeys = 'name' | 'phone' | 'email'

// Debounced validation for real-time feedback
const debouncedValidateField = debounce(
  ((key: ContactKeys, value: string) => {
    const start = performance.now()

    let error: string | undefined
    switch (key) {
      case 'name':
        error = validateName(value)
        break
      case 'phone':
        error = validatePhone(value)
        break
      case 'email':
        error = validateEmail(value)
        break
    }

    if (error) {
      errors.value[key] = error
    } else {
      delete errors.value[key]
    }

    performanceMetrics.inputDebounceTime += performance.now() - start
  }) as unknown as (...args: unknown[]) => unknown,
  300
)

// Optimized input handler - removed throttle to ensure data sync
const handleInput = (key: keyof ContactFormData, event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  if (key === 'phone') {
    // очистка и авто-нормализация 8 → +7
    const digits = value.replace(/\D/g, '')
    let norm = digits
    if (digits.startsWith('8') && digits.length >= 1) {
      norm = '7' + digits.slice(1)
    }
    // соберём человекочитаемый формат
    if (norm.length >= 1) {
      const n = norm.padEnd(11, '')
      const pretty = `+${n[0] || ''} ${n.slice(1, 4).trim()} ${n.slice(4, 7).trim()}-${n
        .slice(7, 9)
        .trim()}-${n.slice(9, 11).trim()}`.trim()
      value = pretty.replace(/\s+/g, ' ').trim()
    }
  }
  
  // Update form data immediately
  formData.value[key as keyof ContactFormData] = value

  // Clear error immediately for better UX
  if (errors.value[key]) {
    delete errors.value[key]
  }

  // Debounced validation
  debouncedValidateField(key as ContactKeys, value)
}

// Memoized form validation
const validateForm = (): boolean => {
  const start = performance.now()
  const newErrors: Record<string, string | undefined> = {}

  const nameError = validateName(formData.value.name as string)
  if (nameError) newErrors.name = nameError

  const phoneError = validatePhone(formData.value.phone as string)
  if (phoneError) newErrors.phone = phoneError

  const emailError = validateEmail(formData.value.email as string)
  if (emailError) newErrors.email = emailError

  errors.value = newErrors
  performanceMetrics.validationTime += performance.now() - start
  return Object.keys(newErrors).length === 0
}

// Optimized form submission with performance tracking
const submitForm = async () => {
  const submitStart = performance.now()

  // Validate form before submission
  if (!validateForm()) {
    errors.value.general = 'Пожалуйста, исправьте ошибки в форме'
    // Scroll to first error
    nextTick(() => {
      const firstErrorField = document.querySelector('[aria-invalid="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        ;(firstErrorField as HTMLElement).focus()
      }
    })
    return
  }

  isSubmitting.value = true
  errors.value.general = undefined

  try {
    // Call API with performance tracking
    const apiStart = performance.now()
    const result = await ContactFormAPI.submitForm({
      name: String(formData.value.name).trim(),
      phone: String(formData.value.phone).trim(),
      email: String(formData.value.email).trim(),
      honeypot: String(formData.value.honeypot),
      formStartedAt: Number(formData.value.formStartedAt),
    })
    const apiEnd = performance.now()

    if (result.success) {
      // Success - reset form
      formData.value.name = ''
      formData.value.phone = ''
      formData.value.email = ''
      formData.value.honeypot = ''
      errors.value = {}

      // Clear validation cache
      validationCache.clear()

      // Show success message
      alert(result.message || 'Заявка успешно отправлена!')
    } else {
      errors.value.general =
        result.message || 'Произошла ошибка при отправке заявки. Попробуйте еще раз.'
    }
  } catch (error) {
    console.error('Form submission error:', error)
    errors.value.general = 'Произошла ошибка при отправке заявки. Попробуйте еще раз.'
  } finally {
    isSubmitting.value = false
  }
}

// Performance monitoring setup
onMounted(() => {
  performanceMetrics.renderStart = performance.now()
  formData.value.formStartedAt = Date.now()

  // Monitor render performance
  nextTick(() => {
    performanceMetrics.renderEnd = performance.now()
    // Removed console.log for production performance
  })

  // IntersectionObserver setup
  if (sectionRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          isVisible.value = true
          // Disconnect observer after first intersection
          if (observer) {
            observer.disconnect()
            observer = null
          }
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    )
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }

  // Clear validation cache to prevent memory leaks
  validationCache.clear()

  // Removed console.log for production performance
})

// Watch for performance optimization opportunities
watchEffect(() => {
  // Clear cache if it gets too large
  if (validationCache.size > 100) {
    validationCache.clear()
    // Removed console.log for production performance
  }
})

const getFieldError = (key: keyof ContactFormData): string | undefined =>
  errors.value?.[String(key)]
</script>

<template>
  <section
    ref="sectionRef"
    class="no-scrollbar bg-text px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[12rem] py-4 sm:py-6 md:py-8 lg:py-[2rem] overflow-y-auto"
    style="box-sizing: border-box; contain: layout style paint"
  >
    <!-- Loading placeholder with optimized animation -->
    <div v-if="!isVisible" class="flex items-center justify-center py-20">
      <div
        class="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- Actual content with v-memo optimization -->
    <div
      v-else
      v-memo="[isVisible, isSubmitting]"
      class="flex flex-col border border-accent rounded-[3rem] p-4 sm:p-5 md:p-6"
    >
      <h3 class="text-bg text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4">
        Станьте нашим новым партнером
      </h3>
      <p class="text-bg text-xs sm:text-sm text-center mb-6 sm:mb-8 px-2">
        Оставьте заявку на сотрудничество прямо сейчас и получите стоимость проекта уже сегодня
      </p>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Honeypot anti-bot field (hidden) -->
        <input
          type="text"
          autocomplete="off"
          aria-hidden="true"
          style="position: absolute; left: -9999px; opacity: 0"
          v-model="formData.honeypot"
        />
        <input type="hidden" :value="formData.formStartedAt" />
        <!-- Contact Fields with optimized rendering -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-start">
          <div
            v-for="field in contactFields"
            :key="field.key"
            v-memo="[formData[field.key], getFieldError(field.key) ?? '']"
            class="flex flex-col w-full sm:w-auto"
          >
            <input
              :id="`contact-${field.key}`"
              :name="field.key"
              :type="field.type"
              :value="formData[field.key]"
              @input="handleInput(field.key, $event)"
              :placeholder="field.placeholder"
              :class="inputClasses"
              :aria-invalid="!!getFieldError(field.key)"
              :aria-describedby="getFieldError(field.key) ? `${field.key}-error` : undefined"
            />
            <p
              v-if="getFieldError(field.key)"
              :id="`${field.key}-error`"
              class="text-red-500 text-xs mt-1 text-center"
              role="alert"
            >
              {{ getFieldError(field.key) }}
            </p>
          </div>
          <!-- Submit Button with optimized state -->
          <div
            class="flex justify-center bg-accent rounded-[3rem] hover:bg-purple transition-colors duration-200 w-full sm:w-auto"
          >
            <button
              type="submit"
              :class="buttonClasses"
              :disabled="isSubmitting"
              :aria-busy="isSubmitting"
            >
              <span v-if="isSubmitting">Отправка...</span>
              <span v-else>Отправить</span>
            </button>
          </div>
        </div>

        <!-- General Error with accessibility -->
        <p
          v-if="errors.general"
          class="text-red-500 text-sm text-center"
          role="alert"
          aria-live="polite"
        >
          {{ errors.general }}
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
/* Performance optimizations */

/* GPU acceleration for animations - только для активно анимируемых элементов */
.animate-spin {
  transform: translateZ(0);
  /* will-change добавляется только во время анимации через класс */
}

.animate-spin.animating {
  will-change: transform;
}

/* Optimized focus states - без will-change, так как не вызывают layout shifts */
input:focus {
  border-color: var(--color-accent) !important;
  box-shadow: none !important;
  outline: none !important;
}

input:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

button:focus {
  border-color: var(--color-accent) !important;
  box-shadow: none !important;
  outline: none !important;
}

button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* Optimized transitions - без will-change для статических элементов */
input,
button {
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

/* Reduce repaints */
.flex {
  contain: layout;
}

/* Optimize form rendering */
form {
  contain: layout style;
}

/* Performance hints for browser */
section {
  contain: layout style paint;
}

/* Optimize text rendering */
h3,
p {
  text-rendering: optimizeSpeed;
}

/* Reduce layout thrashing */
input[type='text'],
input[type='tel'],
input[type='email'] {
  contain: layout style;
}
</style>



