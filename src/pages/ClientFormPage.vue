<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ClientFormData, ClientFormErrors } from '../types/client-form'
import { useClientForm } from '../composables/useClientForm'
import FormSection from '../components/ClientFromCard.vue'

const router = useRouter()

// Use the composable for form logic
const {
  formData,
  errors,
  isSubmitting,
  handleFileUpload,
  submitForm: submitFormComposable,
} = useClientForm()

// File input ref for contact section
const fileInput = ref<HTMLInputElement>()

// Contact fields configuration
const contactFields: Array<{ key: keyof ClientFormData; placeholder: string }> = [
  { key: 'name', placeholder: 'Имя' },
  { key: 'company', placeholder: 'Компания' },
  { key: 'phone', placeholder: 'Телефон' },
  { key: 'email', placeholder: 'Электронная почта' },
]

// Handle contact field input
const handleContactInput = (key: keyof ClientFormData, event: Event) => {
  const target = event.target as HTMLInputElement
  ;(formData as any)[key] = target.value
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
  ;(formData as any)[field] = value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Стать клиентом</h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Ответьте на пару вопросов. На основе ответов мы поймем, как можем быть полезны, соберем
          информацию и подготовимся к встрече. Если не сможем помочь — порекомендуем подходящих
          партнеров. Приоритетно отвечаем на email, считаем ответы лучшей заявкой.
        </p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Dynamic Form Sections -->
        <FormSection
          v-for="section in formSections"
          :key="section.field"
          :title="section.title"
          :helper-text="section.helperText"
          :variant="section.variant"
          :model-value="String(formData[section.field] || '')"
          :error="errors[section.field as keyof ClientFormErrors]"
          @update:model-value="(value) => updateFormField(section.field, value)"
        />

        <!-- Contact Information Section -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">И последняя информация</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div v-for="field in contactFields" :key="field.key">
              <input
                :value="formData[field.key]"
                @input="handleContactInput(field.key, $event)"
                :placeholder="field.placeholder"
                class="w-full px-6 py-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p
                v-if="errors[field.key as keyof ClientFormErrors]"
                class="text-red-500 text-sm mt-2"
              >
                {{ errors[field.key as keyof ClientFormErrors] }}
              </p>
            </div>
          </div>

          <!-- File Upload -->
          <div class="mb-6">
            <button
              type="button"
              @click="handleFileClick"
              class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span class="text-lg mr-2">+</span>
              Attach file
            </button>
            <input ref="fileInput" type="file" @change="handleFileUpload" class="hidden" />
            <p class="text-sm text-gray-500 mt-2">Максимум 20 МБ</p>
            <p v-if="errors.file" class="text-red-500 text-sm mt-2">
              {{ errors.file }}
            </p>
          </div>
        </div>

        <!-- Privacy Policy and Submit -->
        <div class="text-center">
          <div class="mb-8">
            <label class="flex items-center justify-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                v-model="formData.privacyAccepted"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>
                Нажимая кнопку «Отправить», вы принимаете
                <a href="#" class="text-blue-600 hover:underline">Политику конфиденциальности</a>.
              </span>
            </label>
            <p v-if="errors.privacy" class="text-red-500 text-sm mt-2">
              {{ errors.privacy }}
            </p>
          </div>

          <button
            type="submit"
            class="bg-gray-800 hover:bg-gray-900 text-white px-12 py-4 rounded-xl text-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!!isSubmitting"
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
</style>
