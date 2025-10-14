<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useClientForm } from '../composables/useClientForm'

const router = useRouter()
const {
  formData,
  errors,
  isSubmitting,
  handleFileUpload,
  submitForm: submitFormComposable,
  resetForm,
} = useClientForm()

// Form submission with router navigation
const submitForm = async () => {
  const result = await submitFormComposable()

  if (result.success) {
    alert(result.message)
    router.push('/')
  } else {
    alert(result.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-8">Стать клиентом</h1>

        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <h2 class="text-2xl font-bold text-gray-900 lg:w-1/3">Ответьте на пару вопросов</h2>

          <div class="lg:w-2/3 bg-white rounded-2xl p-6 shadow-sm">
            <p class="text-gray-600 leading-relaxed">
              На их основе мы поймём, чем можем быть полезны: соберём информацию и подготовимся к
              встрече. Поэтому наш первый разговор будет содержательным. А если мы поймём, что не
              можем помочь, мы порекомендуем подходящих партнёров. Daccel ежедневно получает
              множество запросов по всем каналам связи. Мы отдаём приоритет электронным письмам для
              ответов. Ваши ответы — лучшая заявка для нас.
            </p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Question 1 -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Что вы делаете?</h3>
              <textarea
                v-model="formData.companyDescription"
                placeholder="Напиши что-нибудь"
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.companyDescription }"
              ></textarea>
              <p v-if="errors.companyDescription" class="text-red-500 text-sm mt-2">
                {{ errors.companyDescription }}
              </p>
            </div>
            <div class="lg:w-1/3">
              <div class="bg-gray-50 rounded-xl p-6">
                <p class="text-gray-600 text-sm leading-relaxed">
                  Расскажите о вашей компании. Как вы работаете, сколько зарабатываете? Кто ваши
                  конкуренты? Чем вы от них отличаетесь?
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 2 -->
        <div class="bg-blue-50 rounded-2xl p-8 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Какова ваша задача?</h3>
              <textarea
                v-model="formData.task"
                placeholder="Напиши что-нибудь"
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.task }"
              ></textarea>
              <p v-if="errors.task" class="text-red-500 text-sm mt-2">
                {{ errors.task }}
              </p>
            </div>
            <div class="lg:w-1/3">
              <div class="bg-white rounded-xl p-6">
                <p class="text-gray-600 text-sm leading-relaxed">
                  Чего вы хотите достичь в ближайшем будущем? Что вам мешает?
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 3 -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Как вы видите решение проблемы?</h3>
              <textarea
                v-model="formData.solutionVision"
                placeholder="Напиши что-нибудь"
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.solutionVision }"
              ></textarea>
              <p v-if="errors.solutionVision" class="text-red-500 text-sm mt-2">
                {{ errors.solutionVision }}
              </p>
            </div>
            <div class="lg:w-1/3">
              <div class="bg-gray-50 rounded-xl p-6">
                <p class="text-gray-600 text-sm leading-relaxed">
                  В какой форме вы хотите увидеть решение своей проблемы? Когда? Почему это важно?
                  Как это должно выглядеть?
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 4 -->
        <div class="bg-blue-50 rounded-2xl p-8 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">
                Каковы ваши ожидания от результата?
              </h3>
              <textarea
                v-model="formData.expectations"
                placeholder="Напиши что-нибудь"
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.expectations }"
              ></textarea>
              <p v-if="errors.expectations" class="text-red-500 text-sm mt-2">
                {{ errors.expectations }}
              </p>
            </div>
            <div class="lg:w-1/3">
              <div class="bg-white rounded-xl p-6">
                <p class="text-gray-600 text-sm leading-relaxed">
                  Чего вы хотите достичь в ближайшем будущем? Что вам мешает?
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 5 -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-2/3">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">
                Сколько денег вы планируете потратить?
              </h3>
              <textarea
                v-model="formData.budget"
                placeholder="Напиши что-нибудь"
                class="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.budget }"
              ></textarea>
              <p v-if="errors.budget" class="text-red-500 text-sm mt-2">
                {{ errors.budget }}
              </p>
            </div>
            <div class="lg:w-1/3">
              <div class="bg-gray-50 rounded-xl p-6">
                <p class="text-gray-600 text-sm leading-relaxed">
                  Какой у вас бюджет? Почему вы готовы потратить такую сумму?
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <h3 class="text-3xl font-bold text-gray-900 text-center mb-8">И последняя информация</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Имя </label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.name }"
                />
                <p v-if="errors.name" class="text-red-500 text-sm mt-2">
                  {{ errors.name }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Компания </label>
                <input
                  v-model="formData.company"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.company }"
                />
                <p v-if="errors.company" class="text-red-500 text-sm mt-2">
                  {{ errors.company }}
                </p>
              </div>

              <!-- File Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Прикрепить файл
                </label>
                <div class="flex items-center gap-4">
                  <input
                    type="file"
                    @change="handleFileUpload"
                    class="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    for="file-upload"
                    class="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      class="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    + Attach file
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">Максимум 20 МБ</p>
                <p v-if="errors.file" class="text-red-500 text-sm mt-2">
                  {{ errors.file }}
                </p>
                <p v-if="formData.attachedFile" class="text-green-600 text-sm mt-2">
                  Файл выбран: {{ formData.attachedFile.name }}
                </p>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Телефон </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.phone }"
                />
                <p v-if="errors.phone" class="text-red-500 text-sm mt-2">
                  {{ errors.phone }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Электронная почта
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="text-red-500 text-sm mt-2">
                  {{ errors.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Privacy Policy -->
          <div class="mt-8 flex items-start gap-3">
            <input
              v-model="formData.privacyAccepted"
              type="checkbox"
              id="privacy"
              class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="privacy" class="text-sm text-gray-600">
              Нажимая кнопку «Отправить», вы принимаете
              <a href="/privacy-policy" class="text-blue-600 hover:text-blue-800 underline">
                Политику конфиденциальности </a
              >.
            </label>
          </div>
          <p v-if="errors.privacy" class="text-red-500 text-sm mt-2">
            {{ errors.privacy }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-12 rounded-xl text-lg transition-colors duration-200"
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
/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus states */
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* File upload hover effect */
label[for='file-upload']:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}
</style>
