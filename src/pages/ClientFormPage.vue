<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ClientFormData } from '../types/client-form'
import { useClientForm } from '../composables/useClientForm'
import FormSection from '../components/sections/FormSection.vue'
import { useHead } from '@unhead/vue'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'

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
const { formData, errors, isSubmitting, submitForm: submitFormComposable } = useClientForm()

// File input ref for contact section
const fileInput = ref<HTMLInputElement>()

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
}

// Handle file upload click
const handleFileClick = () => {
  fileInput.value?.click()
}

// Submit form with navigation
const submitForm = async () => {
  const result = await submitFormComposable()
  alert(result.message)
  if (result.success) router.push('/')
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
</script>

<template>
  <div class="min-h-screen bg-text">
    <div class="mx-auto px-5 md:px-[5rem] py-[5rem]">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-3xl md:text-5xl font-bold text-accent mb-6 font-display">Стать клиентом</h1>
        <p class="text-lg client-form-text max-w-3xl mx-auto leading-relaxed">
          Ответьте на пару вопросов. На основе ответов мы поймем, как можем быть полезны, соберем
          информацию и подготовимся к встрече. Если не сможем помочь — порекомендуем подходящих
          партнеров. Приоритетно отвечаем на email, считаем ответы лучшей заявкой.
        </p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Honeypot anti-bot field (hidden) -->
        <input
          type="text"
          autocomplete="off"
          aria-hidden="true"
          style="position: absolute; left: -9999px; opacity: 0"
          v-model="formData.honeypot"
        />
        <input type="hidden" :value="formData.formStartedAt" />
        <!-- Dynamic Form Sections -->
        <FormSection
          v-for="section in formSections"
          :key="section.field"
          :title="section.title"
          :helper-text="section.helperText"
          :variant="section.variant"
          :model-value="String(formData[section.field] || '')"
          :error="errors[section.field]"
          @update:model-value="(value) => updateFormField(section.field, value)"
        />

        <!-- Contact Information Section -->
        <div class="bg-text border border-bg rounded-[3rem] p-6 shadow-sm mt-8">
          <h2 class="text-3xl font-bold text-accent text-center mb-8 font-display">
            И последняя информация
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div v-for="field in contactFields" :key="field.key">
              <input
                :id="`client-form-${field.key}`"
                :name="field.key"
                :value="formData[field.key]"
                @input="handleContactInput(field.key, $event)"
                :placeholder="field.placeholder"
                class="w-full px-4 placeholder:text-bg py-3 client-form-input rounded-[3rem] text-sm focus:outline-none"
              />
              <p v-if="errors[field.key]" class="client-form-error text-sm mt-2">
                {{ errors[field.key] }}
              </p>
            </div>
          </div>

          <!-- File Upload -->
          <div class="mb-6">
            <button
              type="button"
              @click="handleFileClick"
              class="inline-flex items-center px-6 py-3 !bg-accent rounded-[3rem] focus:outline-none"
            >
              <span class="text-lg mr-2">+</span>
              Attach file
            </button>
            <p class="client-form-helper mt-2">Максимум 20 МБ</p>
            <p v-if="errors.file" class="client-form-error text-sm mt-2">
              {{ errors.file }}
            </p>
          </div>
        </div>

        <!-- Privacy Policy and Submit -->
        <div class="text-center">
          <div class="mb-8">
            <label class="flex items-center justify-center gap-3 text-sm client-form-text">
              <input
                id="client-form-privacy"
                name="privacyAccepted"
                type="checkbox"
                v-model="formData.privacyAccepted"
                class="w-4 h-4 client-form-checkbox border-border rounded focus:ring-accent"
              />
              <span>
                Нажимая кнопку «Отправить», вы принимаете
                <a href="#" class="client-form-link hover:underline">Политику конфиденциальности</a
                >.
              </span>
            </label>
            <p v-if="errors.privacy" class="client-form-error text-sm mt-2">
              {{ errors.privacy }}
            </p>
          </div>

          <button
            type="submit"
            class="!bg-accent hover:bg-purple px-8 py-3 rounded-[3rem] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            aria-label="Отправить форму"
          >
            <span v-if="isSubmitting">Отправка...</span>
            <span v-else>Отправить ответы</span>
          </button>
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
</style>
