<script setup lang="ts">
import { computed } from 'vue'

interface PriceBreakdown {
  basePrice: number
  pagesPrice: number
  designPrice: number
  featuresPrice: number
  contentPrice: number
  seoPrice: number
  supportPrice: number
  urgencyMultiplier: number
  subtotal: number
  total: number
  minPrice: number
  maxPrice: number
  timeline: string
}

const props = defineProps<{
  priceBreakdown: PriceBreakdown
  answers: { urgency?: string }
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const showUrgency = computed(
  () => props.answers?.urgency !== 'standard' && props.priceBreakdown.subtotal > 0
)
</script>

<template>
  <div class="space-y-4 mb-6">
    <div v-if="priceBreakdown.basePrice > 0">
      <div class="text-sm text-text-muted mb-1">Базовая стоимость:</div>
      <div class="text-lg font-semibold text-text">
        {{ formatPrice(priceBreakdown.basePrice) }}
      </div>
    </div>

    <div v-if="priceBreakdown.pagesPrice > 0" class="text-sm text-text-muted">
      + Страницы: {{ formatPrice(priceBreakdown.pagesPrice) }}
    </div>
    <div v-if="priceBreakdown.designPrice > 0" class="text-sm text-text-muted">
      + Дизайн: {{ formatPrice(priceBreakdown.designPrice) }}
    </div>
    <div v-if="priceBreakdown.featuresPrice > 0" class="text-sm text-text-muted">
      + Функционал: {{ formatPrice(priceBreakdown.featuresPrice) }}
    </div>
    <div v-if="priceBreakdown.contentPrice > 0" class="text-sm text-text-muted">
      + Контент: {{ formatPrice(priceBreakdown.contentPrice) }}
    </div>
    <div v-if="priceBreakdown.seoPrice > 0" class="text-sm text-text-muted">
      + SEO: {{ formatPrice(priceBreakdown.seoPrice) }}
    </div>

    <div v-if="showUrgency" class="pt-2 border-t border-border">
      <div class="text-sm text-text-muted mb-1">
        Срочность ({{ answers.urgency === 'fast' ? 'ускоренно' : 'срочно' }}):
      </div>
      <div class="text-sm text-accent">
        +{{ Math.round((priceBreakdown.urgencyMultiplier - 1) * 100) }}% ({{
          formatPrice(
            priceBreakdown.subtotal - priceBreakdown.subtotal / priceBreakdown.urgencyMultiplier
          )
        }})
      </div>
    </div>

    <div v-if="priceBreakdown.supportPrice > 0" class="text-sm text-text-muted">
      + Поддержка: {{ formatPrice(priceBreakdown.supportPrice) }}
    </div>

    <div class="pt-4 border-t-2 border-accent mt-4">
      <div class="text-sm text-text-muted mb-2">ИТОГО К ОПЛАТЕ:</div>
      <div class="text-3xl font-black text-accent mb-2">
        {{ formatPrice(priceBreakdown.total) }}
      </div>
      <div class="text-xs text-text-muted">
        Диапазон: {{ formatPrice(priceBreakdown.minPrice) }} -
        {{ formatPrice(priceBreakdown.maxPrice) }}
      </div>
      <div v-if="priceBreakdown.timeline" class="text-sm text-text-muted mt-2">
        ⏱️ Срок: {{ priceBreakdown.timeline }}
      </div>
    </div>
  </div>
</template>


