<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ServiceCategory, ServiceItem } from '../../types/services'

const props = defineProps<{
  category: ServiceCategory
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'serviceClick', service: ServiceItem): void
}>()

const handleServiceClick = (service: ServiceItem) => {
  emit('serviceClick', service)
}

const handleBackClick = () => {
  emit('close')
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
          <span class="cursor-pointer hover:text-gray-700" @click="$emit('close')">Home</span>
          <span class="mx-1">/</span>
          <span class="cursor-pointer hover:text-gray-700" @click="$emit('close')">Services</span>
          <span class="mx-1">/</span>
          <span class="cursor-pointer hover:text-gray-700" @click="$emit('close')"
            >Development</span
          >
          <span class="mx-1">/</span>
        </div>

        <!-- Main Title -->
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8">
          {{ category.title }}
        </h1>

        <!-- Description -->
        <p class="text-lg text-gray-700 mb-12 max-w-4xl">
          We offer a full cycle of developing websites of any complexity. Our team of professionals
          will create a unique design and functionality suitable for your business.
        </p>

        <!-- Services List -->
        <div class="space-y-6">
          <div
            v-for="service in category.items"
            :key="service.id"
            @click="handleServiceClick(service)"
            class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-4">
                  <h3
                    class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                  >
                    {{ service.title }}
                  </h3>
                  <span class="text-2xl font-bold text-blue-600">
                    {{ service.price }}
                  </span>
                </div>
                <p class="text-gray-700 leading-relaxed">
                  {{ service.description }}
                </p>
              </div>
              <div class="ml-6">
                <div
                  class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
