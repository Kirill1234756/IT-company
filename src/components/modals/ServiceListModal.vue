<script setup lang="ts">
import { defineProps, defineEmits, onMounted, defineAsyncComponent, computed } from 'vue'
import type { ServiceCategory, ServiceItem } from '../../types/services'
import { useYandexMetrika } from '../../composables/useYandexMetrika'

const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
const ContactSection = defineAsyncComponent(() => import('../sections/ContactSection.vue'))
const Footer = defineAsyncComponent(() => import('../../pages/Footer.vue'))

const props = defineProps<{
  category: ServiceCategory
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'serviceClick', service: ServiceItem): void
}>()

const { trackModalOpen } = useYandexMetrika()

onMounted(() => {
  trackModalOpen('service-list', { category: props.category?.title ?? props.category?.slug ?? '' })
})

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

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Услуги', to: '/services' },
  { label: props.category?.title ?? '' },
])
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click="handleBackdropClick"
    >
      <div
        class="w-full h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]"
        @click.stop
      >
        <div
          class="service-list-modal flex-1 min-h-0 overflow-y-auto"
          style="-webkit-overflow-scrolling: touch;"
        >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 bg-[rgba(3,18,47,0.95)] border-b border-[var(--color-border)] backdrop-blur-[10px] rounded-t-3xl"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              @click="handleClose"
              class="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
              aria-label="Закрыть"
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

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <Breadcrumbs :items="breadcrumbItems" class="mb-8" />

          <SectionHeading
            :level="1"
            size="lg"
            color="bg"
            align="center"
            weight="black"
            animation-class="animate-cases-title"
            class="mb-4 md:mb-6 lg:mb-8"
          >
            {{ category.title }}
          </SectionHeading>

          <!-- Services List -->
          <div v-if="category.items && category.items.length > 0" class="space-y-4">
            <button
              v-for="service in category.items"
              :key="service.id"
              type="button"
              @click="handleServiceClick(service)"
              class="w-full text-left p-6 rounded-[3rem] border border-[var(--color-border)] bg-[var(--color-border)]/50 backdrop-blur-[10px] hover:border-[var(--color-accent)] hover:shadow-[0_20px_40px_-10px_rgba(255,136,99,0.2)] cursor-pointer transition-all duration-300 group"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-bold font-display text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {{ service.title }}
                  </h3>
                  <p class="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4 line-clamp-2">
                    {{ service.description }}
                  </p>
                  <span class="text-lg font-semibold text-[var(--color-accent)]">{{ service.price }}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-text-muted flex-shrink-0 group-hover:text-[var(--color-accent)] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <div v-else class="text-center py-12 text-text-muted">
            Услуги в этой категории пока не добавлены
          </div>
        </div>

        <ContactSection />
        <Footer />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.service-list-modal::-webkit-scrollbar {
  width: 8px;
}

.service-list-modal::-webkit-scrollbar-track {
  background: var(--color-border);
  border-radius: 4px;
}

.service-list-modal::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 4px;
}

.service-list-modal::-webkit-scrollbar-thumb:hover {
  background: var(--color-purple);
}
</style>
