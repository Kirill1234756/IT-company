<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ClientFormData } from '../types/client-form'
import { useClientForm } from '../composables/useClientForm'
import FormSection from '../components/sections/FormSection.vue'
import BudgetRangeSection from '../components/sections/BudgetRangeSection.vue'
import { useHead } from '@unhead/vue'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'
import SectionHeading from '../components/ui/SectionHeading.vue'
import Breadcrumbs from '../components/ui/Breadcrumbs.vue'
import FormSuccessBanner from '../components/ui/FormSuccessBanner.vue'
import FormErrorBanner from '../components/ui/FormErrorBanner.vue'
import CtaButton from '../components/ui/CtaButton.vue'

const router = useRouter()
const route = useRoute()

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

// Inject breadcrumb schema
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

// Use the composable for form logic
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

let redirectTimer: ReturnType<typeof setTimeout> | null = null

function dismissSuccess() {
  submitSuccess.value = false
  successMessage.value = ''
}

function goHome() {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
    redirectTimer = null
  }
  router.push('/')
}

// Contact fields configuration
const contactFields: Array<{ key: keyof ClientFormData; placeholder: string }> = [
  { key: 'name', placeholder: 'Имя (как к вам обращаться)' },
  { key: 'company', placeholder: 'Компания (если есть)' },
  { key: 'phone', placeholder: 'Телефон (+7 XXX XXX-XX-XX, можно начать с 8)' },
  { key: 'email', placeholder: 'Электронная почта' },
]

// Handle contact field input
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

// Submit form with navigation
const submitForm = async () => {
  submitError.value = ''
  const result = await submitFormComposable()
  if (result.success) {
    successMessage.value = result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.'
    submitSuccess.value = true
    resetForm()
    redirectTimer = setTimeout(() => {
      redirectTimer = null
      router.push('/')
    }, 4500)
  } else {
    submitError.value = result.message || 'Не удалось отправить форму.'
    submitErrorKey.value += 1
  }
}

// Form sections configuration
const formSections = computed(() => [
  {
    title: 'Что вы делаете?',
    helperText:
      'Расскажите о вашей компании. Как вы работаете, сколько зарабатываете? Кто ваши конкуренты? Чем вы от них отличаетесь?',
    field: 'companyDescription' as keyof ClientFormData,
    variant: 'white' as const,
  },
  {
    title: 'Какова ваша задача?',
    helperText: 'Чего вы хотите достичь в ближайшем будущем? Что вам мешает?',
    field: 'task' as keyof ClientFormData,
    variant: 'blue' as const,
  },
  {
    title: 'Как вы видите решение проблемы?',
    helperText:
      'В какой форме вы хотите увидеть решение своей проблемы? Когда? Почему это важно? Как это должно выглядеть?',
    field: 'solutionVision' as keyof ClientFormData,
    variant: 'white' as const,
  },
  {
    title: 'Каковы ваши ожидания от результата?',
    helperText: 'Чего вы хотите достичь в ближайшем будущем? Что вам мешает?',
    field: 'expectations' as keyof ClientFormData,
    variant: 'blue' as const,
  },
  {
    title: 'Сколько денег вы планируете потратить?',
    helperText: 'Какой у вас бюджет? Почему вы готовы потратить такую сумму?',
    field: 'budget' as keyof ClientFormData,
    variant: 'white' as const,
  },
])

const updateFormField = (field: keyof ClientFormData, value: string) => {
  formData[field] = value
}

onBeforeUnmount(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
    redirectTimer = null
  }
})
</script>

<template>
  <div class="min-h-screen bg-text">
    <div class="max-w-7xl mx-auto px-5 md:px-[5rem]">
      <Breadcrumbs
        :items="[
          { label: 'Главная', to: '/' },
          { label: 'Стать клиентом' },
        ]"
        class="mb-6"
      />
      <!-- Header Section -->
      <div class="text-center mb-16">
         <SectionHeading
        :level="2"
        size="lg"
        color="bg"
        align="center"
        weight="black"
        animation-class="animate-section-title"
        class="mb-8"
      >
       Стать клиентом
      </SectionHeading>
        <p class="text-sm md: text-md text-accent max-w-3xl mx-auto leading-relaxed">
          Ответьте на пару вопросов. На основе ответов мы поймем, как можем быть полезны, соберем
          информацию и подготовимся к встрече. Если не сможем помочь — порекомендуем подходящих
          партнеров.
        </p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <FormSuccessBanner
          :show="submitSuccess"
          :message="successMessage"
          variant="on-light"
          :auto-dismiss-ms="0"
          @dismiss="dismissSuccess"
        />
        <div v-if="submitSuccess" class="flex justify-center">
          <button
            type="button"
            class="rounded-[3rem] border border-[var(--color-success)] bg-[var(--color-success)]/15 px-6 py-2 text-sm font-medium text-bg transition-colors hover:bg-[var(--color-success)]/25"
            @click="goHome"
          >
            На главную
          </button>
        </div>
        <FormErrorBanner
          v-if="submitError"
          :key="submitErrorKey"
          :message="submitError"
          shake
        />
        <!-- Honeypot anti-bot field (hidden) -->
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
        <!-- Dynamic Form Sections -->
        <template v-for="section in formSections" :key="section.field">
          <BudgetRangeSection
            v-if="section.field === 'budget'"
            :title="section.title"
            :helper-text="section.helperText"
            :variant="section.variant"
            :model-value="String(formData.budget || '')"
            :comment-value="String(formData.budgetComment || '')"
            :comment-error="errors.budgetComment"
            @update:model-value="(value) => updateFormField('budget', value)"
            @update:comment-value="(value) => updateFormField('budgetComment', value)"
          />
          <FormSection
            v-else
            :title="section.title"
            :helper-text="section.helperText"
            :variant="section.variant"
            :model-value="String(formData[section.field] || '')"
            :error="errors[section.field]"
            @update:model-value="(value) => updateFormField(section.field, value)"
          />
        </template>

        <!-- Contact Information Section -->
        <div class="bg-text border border-bg rounded-[3rem] p-6 shadow-sm mt-8">
          <h2 class="text-3xl font-bold text-accent text-center mb-8 font-display">
            И последняя информация
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div v-for="field in contactFields" :key="field.key">
              <input
                :id="`client-form-${field.key}`"
                :name="String(field.key)"
                :value="formData[field.key]"
                @input="handleContactInput(field.key, $event)"
                :placeholder="field.placeholder"
                :aria-invalid="field.key === 'phone' || field.key === 'email' ? !!errors[field.key] : undefined"
                :class="[
                  'w-full px-4 !text-black placeholder:text-bg py-3 rounded-[3rem] text-sm focus:outline-none border backdrop-blur-[5px] transition-colors duration-200',
                  errors[field.key]
                    ? 'border-red-500/90'
                    : 'border-[var(--color-border)]',
                ]"
              />
              <Transition name="field-error">
                <p
                  v-if="errors[field.key]"
                  class="text-[var(--color-error)] text-sm mt-2"
                >
                  {{ errors[field.key] }}
                </p>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <CtaButton
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
  </div>
</template>

<style scoped>
button,
input:focus {
  border-color: var(--color-accent) !important;
  box-shadow: none !important;
  outline: none !important;
}

button,
input:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.field-error-enter-active,
.field-error-leave-active {
  transition:
    opacity 0.18s ease-out,
    transform 0.18s ease-out;
}

.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .field-error-enter-active,
  .field-error-leave-active {
    transition-duration: 0.01ms;
  }

  .field-error-enter-from,
  .field-error-leave-to {
    transform: none;
  }
}
</style>
