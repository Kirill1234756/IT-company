<script setup lang="ts">
import { defineProps, defineEmits, defineAsyncComponent } from 'vue'
import type { ServiceCategory, ServiceItem } from '../../types/services'

const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))

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
    <div class="min-h-screen services-modal">
      <!-- Header -->
      <div class="sticky top-0 services-modal-header z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            @click="handleBackClick"
            class="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
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

      <div class="max-w-6xl mx-auto px-5 md:px-[17rem] py-[5rem]">
        <!-- Breadcrumbs -->
        <Breadcrumbs
          :items="[
            { label: 'Главная', to: '/' },
            { label: 'Услуги', to: '/services' },
            { label: category.title },
          ]"
          class="mb-8"
        />

        <!-- Main Title -->
        <h1 class="text-5xl md:text-6xl font-extrabold services-modal-title mb-8 font-display">
          {{ category.title }}
        </h1>

        <!-- Description -->
        <p class="text-lg services-modal-description mb-12 max-w-4xl">
          <span v-if="category.title === 'Рост'">
            Комплексные решения для роста вашего бизнеса в цифровой среде. Мы помогаем привлекать
            клиентов, разрабатывать эффективные маркетинговые стратегии и анализировать рынок для
            достижения ваших целей.
          </span>
          <span v-else-if="category.title === 'Стратегия'">
            Стратегическое планирование и развитие вашего бизнеса. Мы создаем индивидуальные
            стратегии, разрабатываем бизнес-планы и помогаем сформировать сильный бренд для
            долгосрочного успеха.
          </span>
          <span v-else-if="category.title === 'Разработка сайта'">
            Предлагаем полный цикл разработки сайтов любой сложности. Наша команда профессионалов
            создаст уникальный дизайн и функциональность, подходящие для вашего бизнеса.
          </span>
          <span v-else-if="category.title === 'Разработка'">
            Технические решения для автоматизации и оптимизации бизнес-процессов. Мы интегрируем
            различные системы, автоматизируем процессы и повышаем эффективность работы вашей
            компании.
          </span>
          <span v-else>
            Предлагаем полный цикл разработки сайтов любой сложности. Наша команда профессионалов
            создаст уникальный дизайн и функциональность, подходящие для вашего бизнеса.
          </span>
        </p>

        <!-- Services List -->
        <div class="space-y-6">
          <div
            v-for="service in category.items"
            :key="service.id"
            @click="handleServiceClick(service)"
            class="services-modal-item rounded-[3rem] p-8 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-4">
                  <h3
                    class="text-2xl font-bold services-modal-item-title group-hover:text-accent transition-colors"
                  >
                    {{ service.title }}
                  </h3>
                  <span class="text-2xl font-bold services-modal-item-price">
                    {{ service.price }}
                  </span>
                </div>
                <p class="services-modal-item-description leading-relaxed">
                  {{ service.description }}
                </p>
              </div>
              <div class="ml-6">
                <div
                  class="w-8 h-8 bg-border rounded-full flex items-center justify-center group-hover:bg-accent transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-text-muted group-hover:text-bg"
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
