<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'
import type { ClientFormData } from '../types/client-form'
import { useClientForm } from '../composables/useClientForm'
import Breadcrumbs from '../components/ui/Breadcrumbs.vue'
import FormSection from '../components/sections/FormSection.vue'
import BudgetRangeSection from '../components/sections/BudgetRangeSection.vue'
import FormSuccessBanner from '../components/ui/FormSuccessBanner.vue'
import FormErrorBanner from '../components/ui/FormErrorBanner.vue'
import CtaButton from '../components/ui/CtaButton.vue'

const route = useRoute()
const router = useRouter()
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

watchEffect(() => {
  if (breadcrumbSchema.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema.value),
          key: 'breadcrumb-schema',
        },
      ],
    })
  }
})

const phoneNumber = '+7 904 296 40 72'
const copied = ref(false)
const projectSectionRef = ref<HTMLElement | null>(null)

const copyPhoneNumber = async () => {
  try {
    await navigator.clipboard.writeText(phoneNumber)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const scrollToProjectDiscussion = () => {
  projectSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const {
  formData,
  errors,
  isSubmitting,
  submitForm: submitFormComposable,
  resetForm,
  scheduleContactFieldValidation,
} = useClientForm()

const submitSuccess = ref(false)
const successMessage = ref('')
const submitError = ref('')
const submitErrorKey = ref(0)

const currentStep = ref(0)

const formSteps = computed(() => [
  {
    title: 'Что вы делаете?',
    helperText:
      'Коротко о вашей компании: чем занимаетесь, в чем отличие от конкурентов, какой у вас контекст бизнеса.',
    field: 'companyDescription' as keyof ClientFormData,
    variant: 'white' as const,
  },
  {
    title: 'Какая задача стоит сейчас?',
    helperText: 'Чего хотите добиться в ближайшее время и какие ограничения мешают этому.',
    field: 'task' as keyof ClientFormData,
    variant: 'blue' as const,
  },
  {
    title: 'Как вы видите решение?',
    helperText: 'Опишите желаемый формат результата: сайт, лендинг, магазин, интеграции, сроки.',
    field: 'solutionVision' as keyof ClientFormData,
    variant: 'white' as const,
  },
  {
    title: 'Какой результат будет успешным?',
    helperText: 'Какие метрики или бизнес-эффекты покажут, что проект сработал.',
    field: 'expectations' as keyof ClientFormData,
    variant: 'blue' as const,
  },
  {
    title: 'Планируемый бюджет',
    helperText: 'Выберите вилку бюджета — это поможет предложить реалистичный формат запуска.',
    field: 'budget' as keyof ClientFormData,
    variant: 'white' as const,
  },
  {
    title: 'Контакты для связи',
    helperText: 'Оставьте удобный канал: телефон или email. Мы ответим в рабочее время.',
    field: 'contact' as const,
    variant: 'blue' as const,
  },
])

const totalSteps = computed(() => formSteps.value.length)
const isLastStep = computed(() => currentStep.value === totalSteps.value - 1)
const currentStepData = computed(() => formSteps.value[currentStep.value])

const contactFields: Array<{ key: keyof ClientFormData; placeholder: string }> = [
  { key: 'name', placeholder: 'Имя (как к вам обращаться)' },
  { key: 'company', placeholder: 'Компания (если есть)' },
  { key: 'phone', placeholder: 'Телефон (+7 XXX XXX-XX-XX, можно начать с 8)' },
  { key: 'email', placeholder: 'Электронная почта' },
]

const updateFormField = (field: keyof ClientFormData, value: string) => {
  formData[field] = value
}

const updateCurrentTextStep = (value: string) => {
  const step = formSteps.value[currentStep.value]
  if (!step || step.field === 'contact' || step.field === 'budget') return
  updateFormField(step.field, value)
}

const validateCurrentStep = () => {
  const step = currentStepData.value
  if (!step) return true

  const nextErrors = { ...errors.value }
  if (step.field !== 'contact') {
    const val = String(formData[step.field] || '').trim()
    if (!val) {
      nextErrors[step.field] = 'Пожалуйста, заполните поле, чтобы перейти дальше'
      errors.value = nextErrors
      return false
    }
    delete nextErrors[step.field]
    errors.value = nextErrors
    return true
  }

  const hasPhone = String(formData.phone || '').trim().length > 0
  const hasEmail = String(formData.email || '').trim().length > 0
  if (!hasPhone && !hasEmail) {
    nextErrors.phone = 'Укажите телефон или email для обратной связи'
    errors.value = nextErrors
    return false
  }
  return true
}

const nextStep = () => {
  if (!validateCurrentStep()) return
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value += 1
  }
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value -= 1
}

const handleContactInput = (key: keyof ClientFormData, event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  if (key === 'phone') {
    const digits = value.replace(/\D/g, '')
    let norm = digits
    if (digits.startsWith('8') && digits.length >= 1) {
      norm = '7' + digits.slice(1)
    }
    if (norm.length >= 1) {
      const n = norm
      const pretty =
        n.length >= 11
          ? `+${n[0]} ${n.slice(1, 4)} ${n.slice(4, 7)}-${n.slice(7, 9)}-${n.slice(9, 11)}`
          : `+${n}`
      value = pretty.replace(/\s+/g, ' ').trim()
    }
  }

  formData[key] = value

  if (key === 'phone' || key === 'email') {
    if (errors.value[key]) {
      const next = { ...errors.value }
      delete next[key]
      errors.value = next
    }
    scheduleContactFieldValidation()
  }
}

const submitForm = async () => {
  submitError.value = ''
  if (!validateCurrentStep()) return

  const result = await submitFormComposable()
  if (result.success) {
    successMessage.value = result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.'
    submitSuccess.value = true
    resetForm()
    currentStep.value = 0
  } else {
    submitError.value = result.message || 'Не удалось отправить форму.'
    submitErrorKey.value += 1
  }
}

const goToCases = () => {
  router.push('/cases')
}

/** Контекст из модалок кейса/пакета (query сохраняем при переходе на бриф). */
const applyEntryContextFromRoute = () => {
  if (String(formData.task || '').trim()) return
  const q = route.query
  const parts: string[] = []
  const caseTitle = typeof q.caseTitle === 'string' ? q.caseTitle.trim() : ''
  const caseSlug = typeof q.case === 'string' ? q.case.trim() : ''
  if (caseTitle || caseSlug) {
    parts.push(
      caseTitle
        ? `Запрос по кейсу: ${caseTitle}${caseSlug ? ` (${caseSlug})` : ''}`
        : `Запрос по кейсу: ${caseSlug}`
    )
  }
  const packageTitle = typeof q.packageTitle === 'string' ? q.packageTitle.trim() : ''
  const packageSlug = typeof q.package === 'string' ? q.package.trim() : ''
  if (packageTitle || packageSlug) {
    parts.push(
      packageTitle
        ? `Интерес к пакету: ${packageTitle}${packageSlug ? ` (${packageSlug})` : ''}`
        : `Интерес к пакету: ${packageSlug}`
    )
  }
  if (parts.length) {
    formData.task = parts.join('. ')
  }
}

onMounted(() => {
  applyEntryContextFromRoute()
  if (route.hash === '#project-discussion') {
    nextTick(() => scrollToProjectDiscussion())
  }
})
</script>

<template>
  <div class="bg-text">
    <div class="max-w-7xl mx-auto px-4 md:px-[3rem] pb-16">
      <Breadcrumbs :items="[{ label: 'Главная', to: '/' }, { label: 'Контакты' }]" class="mb-6" />

      <section class="grid gap-6 md:grid-cols-[1fr_1.2fr] mb-10">
        <div class="flex flex-col p-6 sm:p-8 border border-accent rounded-[3rem] bg-bg">
          <h1 class="text-2xl sm:text-3xl text-accent font-black mb-6">Контакты и бриф проекта</h1>
          <p class="text-sm sm:text-base text-text/80 mb-6">
            Можно просто написать или сразу пройти короткий пошаговый бриф, чтобы мы быстрее
            подготовили решение именно под вашу задачу.
          </p>

          <div class="space-y-3 mb-6">
            <button
              @click="copyPhoneNumber"
              class="flex items-center space-x-3 w-full text-left hover:opacity-80 transition-opacity cursor-pointer relative"
            >
              <span class="text-accent text-xl sm:text-2xl">📱</span>
              <p class="text-text text-sm sm:text-base md:text-lg">{{ phoneNumber }}</p>
              <span v-if="copied" class="ml-auto text-xs text-accent font-medium animate-pulse">
                Скопировано!
              </span>
            </button>
            <a
              href="mailto:kodify@gmail.com"
              class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <span class="text-accent text-xl sm:text-2xl">📧</span>
              <p class="text-text text-sm sm:text-base md:text-lg">kodify@gmail.com</p>
            </a>
            <a
              href="https://t.me/kodify_tg"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <span class="text-accent text-xl sm:text-2xl">💬</span>
              <p class="text-text text-sm sm:text-base md:text-lg">@kodify_tg</p>
            </a>
          </div>

          <button
            type="button"
            class="w-full rounded-[2rem] bg-accent text-bg font-semibold py-3 px-5 hover:bg-accent/90 transition-colors"
            @click="scrollToProjectDiscussion"
          >
            Подробнее обсудить проект
          </button>
        </div>

        <div
          class="rounded-[3rem] border border-accent/30 bg-gradient-to-br from-bg to-text p-6 sm:p-8"
        >
          <h2 class="text-2xl sm:text-3xl text-accent font-black mb-3">Как мы работаем</h2>
          <ol class="space-y-3 text-sm sm:text-base text-white/85">
            <li>
              <span class="text-accent font-bold">1.</span> Вы отвечаете на вопросы по задаче.
            </li>
            <li>
              <span class="text-accent font-bold">2.</span> Мы анализируем вводные и приоритеты.
            </li>
            <li>
              <span class="text-accent font-bold">3.</span> Возвращаемся с форматом, сроками и
              бюджетом.
            </li>
          </ol>
          <button
            type="button"
            class="mt-6 rounded-full border border-accent/50 px-4 py-2 text-accent text-sm hover:bg-accent/10 transition-colors"
            @click="goToCases"
          >
            Посмотреть кейсы перед брифом
          </button>
        </div>
      </section>

      <section id="project-discussion" ref="projectSectionRef" class="scroll-mt-28">
        <div class="rounded-[3rem] border border-accent/25 bg-bg p-5 sm:p-8">
          <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-xl sm:text-2xl font-black text-accent">Бриф проекта</h2>
            <div class="text-xs sm:text-sm text-text/70">
              Шаг {{ currentStep + 1 }} из {{ totalSteps }}
            </div>
          </div>

          <div class="mb-6 h-2 w-full rounded-full bg-text/15">
            <div
              class="h-2 rounded-full bg-accent transition-all duration-300"
              :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
            />
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <FormSuccessBanner
              :show="submitSuccess"
              :message="successMessage"
              variant="on-light"
              :auto-dismiss-ms="0"
              @dismiss="submitSuccess = false"
            />

            <FormErrorBanner
              v-if="submitError"
              :key="submitErrorKey"
              :message="submitError"
              shake
            />

            <input
              type="text"
              name="website"
              autocomplete="off"
              tabindex="-1"
              aria-hidden="true"
              style="
                position: absolute;
                left: -9999px;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
              "
              v-model="formData.honeypot"
            />
            <input type="hidden" name="formStartedAt" :value="formData.formStartedAt" />

            <template v-if="currentStepData">
              <BudgetRangeSection
                v-if="currentStepData.field === 'budget'"
                :title="currentStepData.title"
                :helper-text="currentStepData.helperText"
                :variant="currentStepData.variant"
                :model-value="String(formData.budget || '')"
                :comment-value="String(formData.budgetComment || '')"
                :comment-error="errors.budgetComment"
                @update:model-value="(value) => updateFormField('budget', value)"
                @update:comment-value="(value) => updateFormField('budgetComment', value)"
              />
              <FormSection
                v-else-if="currentStepData.field !== 'contact'"
                :title="currentStepData.title"
                :helper-text="currentStepData.helperText"
                :variant="currentStepData.variant"
                :model-value="String(formData[currentStepData.field] || '')"
                :error="errors[currentStepData.field]"
                @update:model-value="updateCurrentTextStep"
              />
              <div v-else class="bg-text rounded-[3rem] p-6 shadow-sm">
                <h3 class="text-2xl font-bold text-accent text-center mb-6 font-display">
                  И последние детали
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-for="field in contactFields" :key="field.key">
                    <input
                      :id="`contact-${field.key}`"
                      :name="String(field.key)"
                      :value="formData[field.key]"
                      @input="handleContactInput(field.key, $event)"
                      :placeholder="field.placeholder"
                      :aria-invalid="
                        field.key === 'phone' || field.key === 'email'
                          ? !!errors[field.key]
                          : undefined
                      "
                      :class="[
                        'w-full px-4 !text-black placeholder:text-bg py-3 rounded-[3rem] text-sm focus:outline-none border backdrop-blur-[5px] transition-colors duration-200',
                        errors[field.key] ? 'border-red-500/90' : 'border-[var(--color-border)]',
                      ]"
                    />
                    <Transition name="field-error">
                      <p v-if="errors[field.key]" class="text-[var(--color-error)] text-sm mt-2">
                        {{ errors[field.key] }}
                      </p>
                    </Transition>
                  </div>
                </div>
              </div>
            </template>

            <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                v-if="currentStep > 0"
                type="button"
                class="rounded-[2rem] border border-accent/40 px-5 py-2.5 text-accent text-sm font-semibold hover:bg-accent/10 transition-colors"
                @click="prevStep"
              >
                Назад
              </button>
              <span v-else />

              <button
                v-if="!isLastStep"
                type="button"
                class="rounded-[2rem] bg-accent px-5 py-2.5 text-bg text-sm font-semibold hover:bg-accent/90 transition-colors"
                @click="nextStep"
              >
                Далее
              </button>
              <CtaButton
                v-else
                type="submit"
                label="Отправить ответы"
                class="!mt-0"
                :loading="isSubmitting"
                :success="submitSuccess"
                :disabled="submitSuccess"
                loading-label="Отправка..."
                success-label="Принято"
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
input:focus,
button:focus,
textarea:focus {
  border-color: var(--color-accent) !important;
  box-shadow: none !important;
  outline: none !important;
}

input:focus-visible,
button:focus-visible,
textarea:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.field-error-enter-active,
.field-error-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}

.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
