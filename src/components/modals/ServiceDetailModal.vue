<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import type { ServiceDetail } from '../../types/services'

defineProps<{
  service: ServiceDetail
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// FAQ accordion state
const openFaqIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

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
  <div class="fixed inset-0 bg-opacity-50 z-50 overflow-y-auto">
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

      <div class="max-w-6xl mx-auto px-5 md:px-[15rem] py-[5rem]">
        <!-- Breadcrumbs -->
        <div class="text-sm services-modal-breadcrumb mb-4">
          <span
            v-for="(breadcrumb, index) in service.breadcrumbs"
            :key="index"
            class="cursor-pointer services-modal-breadcrumb"
            @click="handleBreadcrumbClick(index)"
          >
            {{ breadcrumb }}
            <span v-if="index < service.breadcrumbs.length - 1" class="mx-1">/</span>
          </span>
        </div>

        <!-- Main Title -->
        <h1 class="text-4xl font-mono services-modal-title mb-8 font-display">
          {{ service.title }}
        </h1>

        <!-- About Section -->
        <div class="mb-12 flex gap-10">
          <h2 class="text-xl font-bold services-modal-title mb-6 font-display">
            {{ service.about.title }}
          </h2>
          <div class="space-y-4">
            <p
              v-for="(paragraph, index) in service.about.description"
              :key="index"
              class="text-sm services-modal-description leading-relaxed"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <!-- Metrics -->
        <div class="flex gap-6 mb-12">
          <div
            v-for="(metric, index) in [
              { label: 'Стоимость работ от', value: service.metrics.cost },
              { label: 'рабочих дней на сдачу', value: service.metrics.workingDays },
            ]"
            :key="index"
            class="services-detail-metric px-6 py-3 rounded-[3rem] flex-1 text-center"
          >
            <div class="opacity-80">{{ metric.label }}</div>
            <div class="text-3xl font-bold">{{ metric.value }}</div>
          </div>
        </div>

        <!-- Features -->
        <div class="mb-12">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(feature, index) in service.features"
              :key="feature.id"
              class="services-detail-feature rounded-[3rem] p-8 relative overflow-hidden"
            >
              <div class="absolute top-4 right-4 text-7xl font-bold services-detail-feature-number">
                {{ index + 1 }}
              </div>
              <p class="services-modal-description text-sm leading-relaxed relative z-10">
                {{ feature.title }}
              </p>
            </div>
          </div>
        </div>

        <!-- Development Stages -->
        <div v-if="service.stages" class="mb-12">
          <h2 class="text-xl font-bold services-modal-title mb-8 font-display">Этапы разработки</h2>
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 services-detail-stage-line"></div>

            <div class="space-y-8">
              <div
                v-for="stage in service.stages"
                :key="stage.id"
                class="relative flex items-center gap-8"
              >
                <!-- Stage number -->
                <div
                  class="w-16 h-16 services-detail-stage rounded-full flex items-center justify-center font-bold text-lg relative z-1"
                >
                  {{ stage.number }}
                </div>

                <!-- Stage content -->
                <div class="flex-1 border border-accent/40 rounded-[3rem] p-6 shadow-sm">
                  <h3 class="text-xl font-bold services-modal-title mb-3 font-display">
                    {{ stage.title }}
                  </h3>
                  <p class="services-modal-description text-sm leading-relaxed">
                    {{ stage.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div v-if="service.faq" class="mb-12">
          <h2 class="text-xl font-bold services-modal-title mb-8 font-display">
            Часто задаваемые вопросы
          </h2>
          <div class="space-y-2">
            <div
              v-for="(faq, index) in service.faq"
              :key="faq.id"
              class="services-detail-faq-item rounded-[3rem] overflow-hidden"
            >
              <button
                @click="toggleFaq(index)"
                class="w-full p-6 text-left flex items-center justify-between hover:bg-accent/5 transition-colors duration-200"
              >
                <h3 class="text-lg font-bold services-detail-faq-question font-display pr-4">
                  {{ faq.question }}
                </h3>
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-200"
                  :class="{ 'rotate-45': openFaqIndex === index }"
                >
                  <svg
                    class="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </button>
              <div
                class="overflow-hidden transition-all duration-300 ease-in-out"
                :class="openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
              >
                <div class="px-6 pb-6">
                  <p class="services-detail-faq-answer text-sm leading-relaxed">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center services-detail-cta rounded-3xl p-12 shadow-sm">
          <button
            class="services-detail-cta-button px-12 py-4 rounded-full text-lg font-semibold transition-colors mb-4"
          >
            Получить консультацию
          </button>
          <p class="services-modal-description">Или оставьте заявку на бесплатный расчет</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
