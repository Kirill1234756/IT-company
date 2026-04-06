<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, defineAsyncComponent } from 'vue'
import type { ServiceDetail } from '../../types/services'
import { useYandexMetrika } from '../../composables/useYandexMetrika'

const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
const ContactSection = defineAsyncComponent(() => import('../sections/ContactSection.vue'))
const Footer = defineAsyncComponent(() => import('../../pages/Footer.vue'))

const props = defineProps<{
  service: ServiceDetail
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { trackModalOpen } = useYandexMetrika()

onMounted(() => {
  trackModalOpen('service-detail', { service: props.service?.title ?? '' })
})

// FAQ accordion state
const openFaqIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const handleBackClick = () => {
  emit('close')
}

// Пока модалка открыта поверх страницы, клик по хлебным крошкам
// просто закрывает модальное окно и возвращает к предыдущему состоянию.
const handleBreadcrumbClick = (_index?: number) => {
  handleBackClick()
}
</script>

<template>
  <div class="fixed inset-0 bg-opacity-50 z-50 overflow-y-auto ios-modal-fix">
    <div class="min-h-screen  bg-[var(--color-bg)] text-[var(--color-text)]">
      <!-- Header -->
      <div
        class="sticky top-0 z-10 bg-[rgba(3,18,47,0.95)] border-b border-[var(--color-border)] backdrop-blur-[10px]"
      >
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

      <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem]">
        <!-- Breadcrumbs -->
        <div class="text-sm mb-4 text-[var(--color-text-muted)]">
          <span
            v-for="(breadcrumb, index) in service.breadcrumbs"
            :key="index"
            class="cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            @click="handleBreadcrumbClick(index)"
          >
            {{ breadcrumb }}
            <span v-if="index < service.breadcrumbs.length - 1" class="mx-1">/</span>
          </span>
        </div>

        <!-- Main Title -->
        <SectionHeading
          :level="1"
          size="lg"
          color="accent"
          align="left"
          weight="black"
          class="font-display text-condense"
          :class="service.tagline || service.subtitle || service.primaryCta ? 'mb-4' : 'mb-8'"
        >
          {{ service.title }}
        </SectionHeading>

        <div
          v-if="service.tagline || service.subtitle || service.primaryCta"
          class="mb-10 space-y-4"
        >
          <p
            v-if="service.tagline"
            class="text-lg md:text-xl font-bold text-[var(--color-accent)] leading-snug"
          >
            {{ service.tagline }}
          </p>
          <p
            v-if="service.subtitle"
            class="text-sm md:text-base text-[var(--color-text)] leading-relaxed max-w-3xl"
          >
            {{ service.subtitle }}
          </p>
          <a
            v-if="service.primaryCta"
            :href="service.primaryCta.href || '/client-form'"
            class="inline-flex items-center justify-center px-6 py-3 rounded-[3rem] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-95 transition-opacity"
          >
            {{ service.primaryCta.label }}
          </a>
        </div>

        <div
          v-if="service.painHighlight"
          class="mb-12 rounded-[3rem] p-6 md:p-8 border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10"
        >
          <p class="text-sm md:text-base leading-relaxed text-[var(--color-text)] font-medium">
            {{ service.painHighlight }}
          </p>
        </div>

        <!-- About Section -->
        <div class="mb-12 flex flex-col gap-6">
          <h2 class="text-xl font-bold font-display text-[var(--color-accent)]">
            {{ service.about.title }}
          </h2>
          <div class="space-y-4">
            <p
              v-for="(paragraph, index) in service.about.description"
              :key="index"
              class="text-sm leading-relaxed text-[var(--color-text)]"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div v-if="service.problemBlock" class="mb-12">
          <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
            {{ service.problemBlock.title }}
          </h2>
          <p
            v-if="service.problemBlock.intro"
            class="text-sm text-[var(--color-text-muted)] mb-3"
          >
            {{ service.problemBlock.intro }}
          </p>
          <ul class="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--color-text)]">
            <li v-for="(line, i) in service.problemBlock.items" :key="i">{{ line }}</li>
          </ul>
          <p
            v-if="service.problemBlock.footnote"
            class="mt-4 text-sm font-medium text-[var(--color-accent)]"
          >
            {{ service.problemBlock.footnote }}
          </p>
        </div>

        <div v-if="service.receiveAfter" class="mb-12">
          <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
            {{ service.receiveAfter.title }}
          </h2>
          <p
            v-if="service.receiveAfter.intro"
            class="text-sm text-[var(--color-text-muted)] mb-3"
          >
            {{ service.receiveAfter.intro }}
          </p>
          <ul class="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--color-text)]">
            <li v-for="(line, i) in service.receiveAfter.items" :key="i">{{ line }}</li>
          </ul>
        </div>

        <div
          v-if="service.foundationBlock"
          class="mb-12 rounded-[3rem] p-8 border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10"
        >
          <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
            {{ service.foundationBlock.title }}
          </h2>
          <p
            class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line"
          >
            {{ service.foundationBlock.description }}
          </p>
        </div>

        <!-- Когда нужна услуга -->
        <div v-if="service.whenNeeded?.length" class="mb-12">
          <h2 class="text-xl font-bold mb-6 font-display text-[var(--color-accent)]">
            {{ service.whenNeededTitle || 'Когда нужна эта услуга' }}
          </h2>
          <p v-if="service.whenNeededIntro" class="text-sm text-[var(--color-text-muted)] mb-4">
            {{ service.whenNeededIntro }}
          </p>
          <ul class="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--color-text)]">
            <li v-for="(line, i) in service.whenNeeded" :key="i">{{ line }}</li>
          </ul>
          <p
            v-if="service.whenNeededNote"
            class="mt-4 text-sm font-medium text-[var(--color-accent)]"
          >
            {{ service.whenNeededNote }}
          </p>
        </div>

        <!-- Metrics -->
        <div class="flex flex-col sm:flex-row gap-6 mb-12">
          <div
            class="px-6 py-3 rounded-[3rem] flex-1 text-center bg-[var(--color-accent)] text-[var(--color-bg)]"
          >
            <div class="opacity-80">
              {{ service.metrics.costMetricCaption || 'Стоимость работ от' }}
            </div>
            <div class="text-3xl font-bold">{{ service.metrics.cost }}</div>
          </div>
          <div
            class="px-6 py-3 rounded-[3rem] flex-1 text-center bg-[var(--color-accent)] text-[var(--color-bg)]"
          >
            <div class="opacity-80">
              {{ service.metrics.workingDaysCaption || 'рабочих дней на сдачу' }}
            </div>
            <div class="text-3xl font-bold">
              {{ service.metrics.workingDaysLabel ?? service.metrics.workingDays }}
            </div>
          </div>
        </div>

        <!-- Features: что делаем / что анализируем -->
        <div v-if="service.features.length" class="mb-12">
          <h2 class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]">
            {{ service.featuresSectionTitle || 'Что именно мы анализируем' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(feature, index) in service.features"
              :key="feature.id"
              class="rounded-[3rem] p-8 relative overflow-hidden bg-[rgba(3,18,47,0.8)] border border-[var(--color-border)]"
            >
              <div
                class="absolute top-4 right-4 text-7xl font-bold text-[var(--color-accent)] opacity-30 select-none"
              >
                {{ index + 1 }}
              </div>
              <h3 class="text-base font-bold relative z-10 text-[var(--color-accent)] mb-3 pr-12">
                {{ feature.title }}
              </h3>
              <p
                class="text-sm leading-relaxed relative z-10 text-[var(--color-text)] whitespace-pre-line"
              >
                {{ feature.description || '' }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="service.additionalList" class="mb-12">
          <h2 class="text-xl font-bold mb-6 font-display text-[var(--color-accent)]">
            {{ service.additionalList.title }}
          </h2>
          <ul class="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--color-text)]">
            <li v-for="(line, i) in service.additionalList.items" :key="i">{{ line }}</li>
          </ul>
        </div>

        <div v-if="service.outputPackage?.length" class="mb-12">
          <h2 class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]">
            {{ service.outputPackageSectionTitle || 'Что вы получаете на выходе' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="(block, i) in service.outputPackage"
              :key="i"
              class="rounded-[3rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
            >
              <h3 class="text-sm font-bold text-[var(--color-accent)] mb-3">{{ block.title }}</h3>
              <ul class="list-disc pl-5 space-y-1 text-sm text-[var(--color-text)]">
                <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Что получаете -->
        <div v-if="service.deliverables" class="mb-12 space-y-8">
          <h2 class="text-xl font-bold font-display text-[var(--color-accent)]">
            Что вы получаете в итоге
          </h2>
          <div
            class="rounded-[3rem] p-8 bg-[rgba(3,18,47,0.8)] border border-[var(--color-border)]"
          >
            <h3 class="text-base font-bold text-[var(--color-accent)] mb-3">Структурированный отчёт</h3>
            <ul class="list-disc pl-5 space-y-1 text-sm text-[var(--color-text)]">
              <li v-for="(x, i) in service.deliverables.report" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div
            class="rounded-[3rem] p-8 bg-[rgba(3,18,47,0.8)] border border-[var(--color-border)]"
          >
            <h3 class="text-base font-bold text-[var(--color-accent)] mb-3">Практические выводы</h3>
            <ul class="list-disc pl-5 space-y-1 text-sm text-[var(--color-text)]">
              <li v-for="(x, i) in service.deliverables.conclusions" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div
            class="rounded-[3rem] p-8 border-2 border-[var(--color-accent)]/50 bg-[rgba(3,18,47,0.6)]"
          >
            <h3 class="text-base font-bold text-[var(--color-accent)] mb-3">
              Готовая основа стратегии
            </h3>
            <p class="text-sm leading-relaxed text-[var(--color-text)]">
              {{ service.deliverables.strategy }}
            </p>
          </div>
        </div>

        <!-- Почему важно -->
        <div v-if="service.whyImportant?.length" class="mb-12">
          <h2 class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]">
            {{ service.whyImportantSectionTitle || 'Почему это критически важно' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="block in service.whyImportant"
              :key="block.id"
              class="rounded-[3rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
            >
              <h3 class="text-sm font-bold text-[var(--color-accent)] mb-3">{{ block.title }}</h3>
              <p
                class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line"
              >
                {{ block.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Главная ценность -->
        <div
          v-if="service.mainValue"
          class="mb-12 rounded-[3rem] p-8 bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40"
        >
          <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
            Главная ценность услуги
          </h2>
          <p class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line">
            {{ service.mainValue }}
          </p>
        </div>

        <div
          v-if="service.impactBlock"
          class="mb-12 rounded-[3rem] p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.85)]"
        >
          <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
            {{ service.impactBlock.title }}
          </h2>
          <p
            class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line"
          >
            {{ service.impactBlock.description }}
          </p>
        </div>

        <!-- Стоимость и сроки (текст) -->
        <div
          v-if="service.pricingFactors?.length || service.timelineNote"
          class="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            v-if="service.pricingFactors?.length"
            class="rounded-[3rem] p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
          >
            <h2 class="text-lg font-bold mb-4 font-display text-[var(--color-accent)]">
              Что влияет на стоимость
            </h2>
            <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
              <li v-for="(x, i) in service.pricingFactors" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div
            v-if="service.timelineNote"
            class="rounded-[3rem] p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
          >
            <h2 class="text-lg font-bold mb-4 font-display text-[var(--color-accent)]">Сроки</h2>
            <p class="text-sm leading-relaxed text-[var(--color-text)]">{{ service.timelineNote }}</p>
          </div>
        </div>

        <!-- Пример инсайта -->
        <div
          v-if="service.insightExample"
          class="mb-12 rounded-[3rem] p-8 border-l-4 border-[var(--color-accent)] bg-[rgba(3,18,47,0.9)]"
        >
          <h2 class="text-lg font-bold mb-3 font-display text-[var(--color-accent)]">
            Пример инсайта
          </h2>
          <p class="text-sm leading-relaxed text-[var(--color-text)] italic">
            {{ service.insightExample }}
          </p>
        </div>

        <!-- Без анализа -->
        <div
          v-if="service.withoutAnalysis?.length"
          class="mb-12 rounded-[3rem] p-8 border border-rose-500/40 bg-rose-950/20"
        >
          <h2 class="text-xl font-bold mb-4 font-display text-rose-300">
            {{ service.withoutAnalysisTitle || 'Риски без анализа' }}
          </h2>
          <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
            <li v-for="(x, i) in service.withoutAnalysis" :key="i">{{ x }}</li>
          </ul>
        </div>

        <div v-if="service.beforeAfter" class="mb-12">
          <h2 class="text-xl font-bold mb-6 font-display text-[var(--color-accent)]">
            {{ service.beforeAfter.title || 'До и после' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="rounded-[3rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.6)]"
            >
              <h3 class="text-sm font-bold text-rose-300/90 mb-3">
                {{ service.beforeAfter.beforeTitle || 'До' }}
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
                <li v-for="(x, i) in service.beforeAfter.before" :key="i">{{ x }}</li>
              </ul>
            </div>
            <div
              class="rounded-[3rem] p-6 border border-[var(--color-accent)]/40 bg-[rgba(3,18,47,0.85)]"
            >
              <h3 class="text-sm font-bold text-[var(--color-accent)] mb-3">
                {{ service.beforeAfter.afterTitle || 'После' }}
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
                <li v-for="(x, i) in service.beforeAfter.after" :key="i">{{ x }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Мини-кейс -->
        <div
          v-if="service.miniCase"
          class="mb-12 rounded-[3rem] p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
        >
          <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
            {{ service.miniCase.title }}
          </h2>
          <div class="space-y-3">
            <p
              v-for="(para, i) in service.miniCase.description"
              :key="i"
              class="text-sm leading-relaxed text-[var(--color-text)]"
            >
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Development Stages -->
        <div v-if="service.stages" class="mb-12">
          <h2
            class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]"
          >
            Этапы разработки
          </h2>
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-[var(--color-border)]"></div>

            <div class="space-y-8">
              <div
                v-for="stage in service.stages"
                :key="stage.id"
                class="relative flex items-center gap-8"
              >
                <!-- Stage number -->
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg relative z-1 bg-[var(--color-accent)] text-[var(--color-bg)]"
                >
                  {{ stage.number }}
                </div>

                <!-- Stage content -->
                <div class="flex-1 border border-accent/40 rounded-[3rem] p-6 shadow-sm">
                  <h3
                    class="text-xl font-bold mb-3 font-display text-[var(--color-accent)]"
                  >
                    {{ stage.title }}
                  </h3>
                  <p class="text-sm leading-relaxed text-[var(--color-text)]">
                    {{ stage.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div v-if="service.faq" class="mb-12">
          <h2
            class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]"
          >
            Часто задаваемые вопросы
          </h2>
          <div class="space-y-2">
            <div
              v-for="(faq, index) in service.faq"
              :key="faq.id"
              class="rounded-[3rem] overflow-hidden bg-[rgba(3,18,47,0.8)] border border-[var(--color-border)]"
            >
              <button
                @click="toggleFaq(index)"
                class="w-full p-6 text-left flex items-center justify-between hover:bg-accent/5 transition-colors duration-200"
                >
                <h3
                  class="text-lg font-bold font-display pr-4 text-[var(--color-text)]"
                >
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
                  <p class="text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- Contact Section -->
      <ContactSection />

      <!-- Footer Section -->
      <Footer />
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>

<style>
/* iOS fix для модальных окон */
.ios-modal-fix {
  /* Исправляем проблему с fixed positioning на iOS */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Используем динамический viewport height для iOS */
  min-height: -webkit-fill-available; /* Fallback for older iOS */
  height: 100vh;
  height: 100dvh;
  /* Улучшаем прокрутку на iOS (устаревшее, но все еще работает) */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Исправление для iOS Safari - предотвращаем "прыжки" при открытии модального окна */
@supports (-webkit-touch-callout: none) {
  body:has(.ios-modal-fix) {
    position: fixed;
    width: 100%;
    overflow: hidden;
  }
}
</style>
