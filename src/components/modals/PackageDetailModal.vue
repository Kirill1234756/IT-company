<script setup lang="ts">
import { onMounted, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PackageDetail } from '../../types/packages'
import { useYandexMetrika } from '../../composables/useYandexMetrika'

const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))

const props = defineProps<{
  packageDetail: PackageDetail
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const { trackModalOpen, trackButtonClick } = useYandexMetrika()

onMounted(() => {
  trackModalOpen('package-detail', { package: props.packageDetail.slug })
})

const close = () => emit('close')

const packageBreadcrumbItems = computed(() => {
  const labels = props.packageDetail.breadcrumbs ?? []
  return labels.map((label, index) => {
    const isLast = index === labels.length - 1
    if (isLast) return { label }
    if (index === 0 && label === 'Главная') return { label, to: '/' }
    if (index === 1 && label === 'Пакеты') return { label, to: '/packages' }
    return { label }
  })
})

const goOrder = () => {
  trackButtonClick('package-detail-order', {
    package: props.packageDetail.slug,
    title: props.packageDetail.title,
  })
  router.push({
    path: '/client-form',
    query: {
      package: props.packageDetail.slug,
      packageTitle: props.packageDetail.title,
    },
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto ios-modal-fix bg-[var(--color-bg)] text-[var(--color-text)]">
    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-[rgba(3,18,47,0.95)] border-b border-[var(--color-border)] backdrop-blur-[10px]"
    >
      <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem] py-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          class="flex items-center gap-2 text-accent hover:text-text transition-colors"
          @click="close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад к пакетам
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-[3rem] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-95 transition-opacity"
          @click="goOrder"
        >
          Оставить заявку
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem] pb-16">
      <Breadcrumbs :items="packageBreadcrumbItems" class="mb-8" />

      <SectionHeading
        :level="1"
        size="lg"
        color="accent"
        align="center"
        weight="black"
        animation-class="animate-cases-title"
        class="mb-4 md:mb-6 lg:mb-8"
      >
        {{ packageDetail.title }}
      </SectionHeading>

      <div v-if="packageDetail.tagline || packageDetail.subtitle" class="mb-10 space-y-4">
        <p
          v-if="packageDetail.tagline"
          class="text-lg md:text-xl font-bold text-[var(--color-accent)] leading-snug"
        >
          {{ packageDetail.tagline }}
        </p>
        <p
          v-if="packageDetail.subtitle"
          class="text-sm md:text-base text-[var(--color-text)] leading-relaxed max-w-3xl"
        >
          {{ packageDetail.subtitle }}
        </p>
      </div>

      <div
        v-if="packageDetail.offerHighlight"
        :class="[
          'rounded-[3rem] px-6 py-4 border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15',
          packageDetail.leadsDuringBuild ? 'mb-4' : 'mb-10',
        ]"
      >
        <p class="text-sm md:text-base font-bold text-[var(--color-accent)] text-center md:text-left">
          {{ packageDetail.offerHighlight }}
        </p>
      </div>
      <p
        v-if="packageDetail.leadsDuringBuild"
        class="mb-10 text-sm md:text-base font-semibold text-[var(--color-text)]"
      >
        {{ packageDetail.leadsDuringBuild }}
      </p>

      <div
        v-if="packageDetail.essenceBullets?.length"
        class="mb-12 rounded-[3rem] p-6 md:p-8 border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10"
      >
        <h2 class="text-xl font-bold font-display text-[var(--color-accent)] mb-4">
          {{ packageDetail.essenceTitle || 'Суть пакета' }}
        </h2>
        <p class="text-sm text-[var(--color-text-muted)] mb-3">
          {{ packageDetail.essenceIntro || 'Идеально, если вы:' }}
        </p>
        <ul class="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--color-text)]">
          <li v-for="(line, i) in packageDetail.essenceBullets" :key="i">{{ line }}</li>
        </ul>
        <p
          v-if="packageDetail.essenceFootnote"
          class="mt-4 text-sm font-medium text-[var(--color-accent)] leading-relaxed"
        >
          {{ packageDetail.essenceFootnote }}
        </p>
      </div>

      <!-- Что вы получите -->
      <div v-if="packageDetail.highlights.length" class="mb-12">
        <h2 class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]">
          Что вы получите
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(h, i) in packageDetail.highlights"
            :key="i"
            class="rounded-[3rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
          >
            <div class="text-2xl mb-2" aria-hidden="true">{{ h.icon || '✓' }}</div>
            <h3 class="text-sm font-bold text-[var(--color-accent)] mb-2">{{ h.title }}</h3>
            <p class="text-sm leading-relaxed text-[var(--color-text)]">{{ h.text }}</p>
          </div>
        </div>
      </div>

      <!-- Что входит -->
      <div v-if="packageDetail.includes.length" class="mb-12">
        <h2 class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]">
          {{ packageDetail.includesSectionTitle || 'Что входит в пакет' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(block, i) in packageDetail.includes"
            :key="i"
            class="rounded-[3rem] p-6 md:p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
          >
            <h3 class="text-base font-bold text-[var(--color-accent)] mb-3">{{ block.title }}</h3>
            <p v-if="block.intro" class="text-xs text-[var(--color-text-muted)] mb-2">{{ block.intro }}</p>
            <ul
              v-if="block.items?.length"
              class="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text)]"
            >
              <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
            </ul>
            <p
              v-if="block.result"
              class="mt-4 text-sm font-medium text-[var(--color-accent)] leading-relaxed"
            >
              Результат: {{ block.result }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="packageDetail.importantBullets?.length"
        class="mb-12 rounded-[3rem] p-6 md:p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.85)]"
      >
        <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
          {{ packageDetail.importantTitle || 'Что важно понимать' }}
        </h2>
        <p
          v-if="packageDetail.importantIntro"
          class="text-sm text-[var(--color-text-muted)] mb-3"
        >
          {{ packageDetail.importantIntro }}
        </p>
        <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
          <li v-for="(line, i) in packageDetail.importantBullets" :key="i">{{ line }}</li>
        </ul>
        <p
          v-if="packageDetail.importantNote"
          class="mt-4 text-sm text-[var(--color-text-muted)]"
        >
          {{ packageDetail.importantNote }}
        </p>
      </div>

      <div
        v-if="packageDetail.mainValue"
        class="mb-12 rounded-[3rem] p-8 bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40"
      >
        <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
          Главная ценность пакета
        </h2>
        <p class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line">
          {{ packageDetail.mainValue }}
        </p>
      </div>

      <div
        v-if="packageDetail.whyBestValueItems?.length"
        class="mb-12 rounded-[3rem] p-6 md:p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.85)]"
      >
        <h2 class="text-xl font-bold mb-4 font-display text-[var(--color-accent)]">
          {{ packageDetail.whyBestValueTitle || 'Почему пакет выгоднее по отдельности' }}
        </h2>
        <p class="text-sm text-[var(--color-text-muted)] mb-3">
          {{ packageDetail.whyBestValueIntro || 'Если делать по отдельности:' }}
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-sm text-[var(--color-text)]">
          <li v-for="(line, i) in packageDetail.whyBestValueItems" :key="i">{{ line }}</li>
        </ul>
        <template v-if="packageDetail.whyBestValueConsequences?.length">
          <p class="mt-4 text-sm text-[var(--color-text-muted)] mb-2">
            {{ packageDetail.whyBestValueConsequencesLabel || 'В итоге это:' }}
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-sm font-medium text-[var(--color-text)]">
            <li v-for="(line, i) in packageDetail.whyBestValueConsequences" :key="i">{{ line }}</li>
          </ul>
        </template>
        <p
          v-if="packageDetail.whyBestValueFootnote"
          class="mt-4 text-sm font-medium text-[var(--color-accent)]"
        >
          {{ packageDetail.whyBestValueFootnote }}
        </p>
      </div>

      <div v-if="packageDetail.beforeAfter" class="mb-12">
        <h2 class="text-xl font-bold mb-6 font-display text-[var(--color-accent)]">
          Что меняется после
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="rounded-[3rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.6)]"
          >
            <h3 class="text-sm font-bold text-rose-300/90 mb-3">
              {{ packageDetail.beforeAfter.beforeTitle || 'До' }}
            </h3>
            <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
              <li v-for="(x, i) in packageDetail.beforeAfter.before" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div
            class="rounded-[3rem] p-6 border border-[var(--color-accent)]/40 bg-[rgba(3,18,47,0.85)]"
          >
            <h3 class="text-sm font-bold text-[var(--color-accent)] mb-3">
              {{ packageDetail.beforeAfter.afterTitle || 'После' }}
            </h3>
            <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
              <li v-for="(x, i) in packageDetail.beforeAfter.after" :key="i">{{ x }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        v-if="packageDetail.suitForItems?.length"
        class="mb-12 rounded-[3rem] p-6 md:p-8 border border-emerald-500/30 bg-emerald-950/15"
      >
        <h2 class="text-xl font-bold mb-4 font-display text-emerald-300/95">
          {{ packageDetail.suitForTitle || 'Кому подходит' }}
        </h2>
        <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
          <li v-for="(line, i) in packageDetail.suitForItems" :key="i">{{ line }}</li>
        </ul>
      </div>

      <div
        v-if="packageDetail.notForItems?.length"
        class="mb-12 rounded-[3rem] p-8 border border-rose-500/35 bg-rose-950/15"
      >
        <h2 class="text-xl font-bold mb-4 font-display text-rose-300">
          {{ packageDetail.notForTitle || 'Кому может не подойти' }}
        </h2>
        <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--color-text)]">
          <li v-for="(line, i) in packageDetail.notForItems" :key="i">{{ line }}</li>
        </ul>
        <p v-if="packageDetail.notForCta" class="mt-4 text-sm font-medium text-[var(--color-accent)]">
          {{ packageDetail.notForCta }}
        </p>
      </div>

      <div
        v-if="packageDetail.insightText"
        class="mb-12 rounded-[3rem] p-6 md:p-8 border-l-4 border-[var(--color-accent)] bg-[rgba(3,18,47,0.9)]"
      >
        <h2 class="text-lg font-bold mb-3 font-display text-[var(--color-accent)]">
          {{ packageDetail.insightTitle || 'Инсайт' }}
        </h2>
        <p class="text-sm leading-relaxed text-[var(--color-text)]">
          {{ packageDetail.insightText }}
        </p>
      </div>

      <div
        v-if="packageDetail.strategicMomentText"
        class="mb-12 rounded-[3rem] p-6 md:p-8 border border-violet-500/35 bg-violet-950/20"
      >
        <h2 class="text-lg font-bold mb-3 font-display text-violet-200">
          {{ packageDetail.strategicMomentTitle || 'Стратегический момент' }}
        </h2>
        <p class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line">
          {{ packageDetail.strategicMomentText }}
        </p>
      </div>

      <!-- Стоимость -->
      <div class="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          class="px-6 py-5 rounded-[3rem] text-center bg-[var(--color-accent)] text-[var(--color-bg)]"
        >
          <div class="opacity-90 text-sm">
            {{ packageDetail.metrics.priceLabel || 'Стоимость от' }}
          </div>
          <div class="text-3xl font-bold mt-1">{{ packageDetail.metrics.price }}</div>
        </div>
        <div
          class="px-6 py-5 rounded-[3rem] text-center bg-[rgba(3,18,47,0.9)] border border-[var(--color-border)]"
        >
          <div class="opacity-80 text-sm text-[var(--color-text-muted)]">
            {{ packageDetail.metrics.secondaryLabel || 'Дополнительно' }}
          </div>
          <div class="text-xl md:text-2xl font-bold mt-1 text-[var(--color-text)]">
            {{ packageDetail.metrics.secondaryValue || '—' }}
          </div>
        </div>
      </div>

      <div
        v-if="packageDetail.originalPrice || packageDetail.savingsNote"
        class="mb-12 rounded-[3rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.75)]"
      >
        <p v-if="packageDetail.originalPrice" class="text-sm text-[var(--color-text-muted)] mb-2">
          Если заказывать по отдельности:
          <span class="line-through text-[var(--color-text)]/80 ml-1">{{ packageDetail.originalPrice }}</span>
        </p>
        <p v-if="packageDetail.savingsNote" class="text-sm font-medium text-[var(--color-accent)]">
          {{ packageDetail.savingsNote }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
        <button
          type="button"
          class="inline-flex items-center justify-center px-8 py-3.5 rounded-[3rem] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-95 transition-opacity"
          @click="goOrder"
        >
          Оставить заявку на этот пакет
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center px-8 py-3.5 rounded-[3rem] border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-sm hover:border-[var(--color-accent)]/50 transition-colors"
          @click="close"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* scoped empty — глобальные ios fixes ниже */
</style>

<style>
.ios-modal-fix {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: -webkit-fill-available;
  height: 100vh;
  height: 100dvh;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

@supports (-webkit-touch-callout: none) {
  body:has(.ios-modal-fix) {
    position: fixed;
    width: 100%;
    overflow: hidden;
  }
}
</style>
