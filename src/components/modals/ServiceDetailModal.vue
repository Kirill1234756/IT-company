<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ServiceDetail } from '../../types/services'

defineProps<{
  service: ServiceDetail
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleBackClick = () => {
  emit('close')
}

const handleBreadcrumbClick = (index: number) => {
  if (index === 0) {
    // Home - закрыть все модальные окна
    emit('close')
  } else if (index === 1) {
    // Services - закрыть все модальные окна
    emit('close')
  } else if (index === 2) {
    // Development - вернуться к списку услуг
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            @click="handleBackClick"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад
          </button>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumbs -->
        <div class="text-sm text-gray-500 mb-4">
          <span
            v-for="(breadcrumb, index) in service.breadcrumbs"
            :key="index"
            class="cursor-pointer hover:text-gray-700"
            @click="handleBreadcrumbClick(index)"
          >
            {{ breadcrumb }}
            <span v-if="index < service.breadcrumbs.length - 1" class="mx-1">/</span>
          </span>
        </div>

        <!-- Main Title -->
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8">
          {{ service.title }}
        </h1>

        <!-- About Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ service.about.title }}</h2>
          <div class="space-y-4">
            <p
              v-for="(paragraph, index) in service.about.description"
              :key="index"
              class="text-lg text-gray-700 leading-relaxed"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <!-- Metrics -->
        <div class="flex gap-6 mb-12">
          <div class="bg-blue-600 text-white px-8 py-4 rounded-2xl flex-1">
            <div class="text-3xl font-bold">{{ service.metrics.cost }}</div>
            <div class="text-blue-100">The cost of the work</div>
          </div>
          <div class="bg-blue-600 text-white px-8 py-4 rounded-2xl flex-1">
            <div class="text-3xl font-bold">{{ service.metrics.workingDays }}</div>
            <div class="text-blue-100">working days for submission</div>
          </div>
        </div>

        <!-- Features -->
        <div class="mb-12">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(feature, index) in service.features"
              :key="feature.id"
              class="bg-white rounded-2xl p-8 relative overflow-hidden"
            >
              <div class="absolute top-4 right-4 text-6xl font-bold text-blue-100 opacity-50">
                {{ index + 1 }}
              </div>
              <p class="text-gray-700 leading-relaxed relative z-10">
                {{ feature.title }}
              </p>
            </div>
          </div>
        </div>

        <!-- Development Stages -->
        <div v-if="service.stages" class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Development stages</h2>
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

            <div class="space-y-8">
              <div
                v-for="stage in service.stages"
                :key="stage.id"
                class="relative flex items-start gap-8"
              >
                <!-- Stage number -->
                <div
                  class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10"
                >
                  {{ stage.number }}
                </div>

                <!-- Stage content -->
                <div class="flex-1 bg-white rounded-2xl p-6 shadow-sm">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">{{ stage.title }}</h3>
                  <p class="text-gray-700 leading-relaxed">{{ stage.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div v-if="service.faq" class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in service.faq"
              :key="item.id"
              class="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 class="text-lg font-bold text-gray-900 mb-3">{{ item.question }}</h3>
              <p class="text-gray-700 leading-relaxed">{{ item.answer }}</p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center bg-white rounded-3xl p-12 shadow-sm">
          <button
            class="bg-blue-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Get a consultation
          </button>
          <p class="text-gray-600">Or leave a request for a free calculation</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
