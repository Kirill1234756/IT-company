<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Teleport } from 'vue'
import type { ServiceCategory, ServiceItem } from '../../types/services'

const props = defineProps<{
  category: ServiceCategory
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'serviceClick', service: ServiceItem): void
}>()

const handleClose = () => {
  emit('close')
}

const handleServiceClick = (service: ServiceItem) => {
  emit('serviceClick', service)
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="handleClose"
          class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="p-6 md:p-8">
          <!-- Title -->
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">
            {{ category.title }}
          </h2>

          <!-- Services List -->
          <div v-if="category.items && category.items.length > 0" class="space-y-4">
            <div
              v-for="service in category.items"
              :key="service.id"
              @click="handleServiceClick(service)"
              class="p-6 border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 mb-2 font-display">
                    {{ service.title }}
                  </h3>
                  <p class="text-gray-600 mb-4">{{ service.description }}</p>
                  <div class="text-lg font-semibold text-blue-600">{{ service.price }}</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-gray-400 ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12 text-gray-500">
            Услуги в этой категории пока не добавлены
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
