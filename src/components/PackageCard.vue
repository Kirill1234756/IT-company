<script setup lang="ts">
import IconContainer from './IconContainer.vue'

export interface PackageCardProps {
  id: number
  title: string
  description: string
  price: string
  originalPrice?: string
  features: string[]
  iconPath: string
  iconUseFill?: boolean
  isPopular?: boolean
  /** Текст на бейдже вместо «Популярный» */
  popularBadgeText?: string
  /** Короткий оффер под описанием (якорный пакет) */
  offerLine?: string
  /** Доп. результат / обещание */
  resultHook?: string
  /** Бейдж «якоря» (премиум): фиолетовый, не путать с «Популярный» */
  anchorBadgeText?: string
  /** Оформить offerLine в фирменном фиолетовом (премиум-якорь) */
  offerLineViolet?: boolean
  isClickable?: boolean
  slug?: string
}

const props = withDefaults(defineProps<PackageCardProps>(), {
  isClickable: true,
  isPopular: false,
})

const emit = defineEmits<{
  (e: 'click', packageData: PackageCardProps): void
}>()

const handleClick = () => {
  if (props.isClickable) {
    emit('click', props)
  }
}
</script>

<template>
  <div
    :class="[
      'package-card group rounded-[3rem] shadow-sm p-6 md:p-8 flex flex-col transition-all duration-300 relative bg-[var(--color-border)] border border-[var(--color-border)] backdrop-blur-[10px]',
      isClickable
        ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-[var(--color-accent)] hover:shadow-[0_20px_40px_-10px_rgba(255,136,99,0.2)]'
        : '',
      isPopular ? 'ring-2 ring-accent shadow-[0_0_0_1px_rgba(255,136,99,0.15)]' : '',
      anchorBadgeText && !isPopular
        ? 'ring-2 ring-violet-400/50 shadow-[0_0_24px_-8px_rgba(139,92,246,0.35)]'
        : '',
    ]"
    @click="handleClick"
  >
    <!-- Popular Badge -->
    <div
      v-if="isPopular"
      class="absolute -top-4.5 md:-top-5.5 left-1/2 -translate-x-1/2 px-3 py-2 md:px-5 md:py-3 bg-accent text-bg rounded-full text-xs sm:text-sm md:text-base font-bold text-center max-w-[calc(100%-1.5rem)] leading-tight z-[1]"
    >
      {{ popularBadgeText || 'Популярный' }}
    </div>
    <div
      v-if="anchorBadgeText"
      class="absolute -top-4.5 md:-top-5.5 left-1/2 -translate-x-1/2 px-3 py-2 md:px-5 md:py-3 bg-[var(--color-purple)] text-white rounded-full text-xs sm:text-sm md:text-base font-bold text-center max-w-[calc(100%-1.5rem)] leading-tight z-[1]"
    >
      {{ anchorBadgeText }}
    </div>

    <!-- Icon -->
    <div class="mb-4">
      <IconContainer
        :icon-path="iconPath"
        bg-color="bg-accent"
        hover-bg-color="group-hover:bg-[var(--color-purple)]"
        icon-color="text-white"
        :hover-scale="isClickable"
        :use-fill="iconUseFill !== false"
        container-class="w-12 h-12 md:w-16 md:h-16 rounded-xl"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <h3
        :class="[
          'text-xl md:text-2xl font-bold leading-snug transition-colors duration-300 mb-2 text-accent font-display',
          isClickable ? 'group-hover:text-accent' : '',
        ]"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'text-sm md:text-base leading-relaxed transition-colors duration-300 text-white',
          offerLine || resultHook ? 'mb-4' : 'mb-6',
          isClickable ? 'group-hover:text-text' : '',
        ]"
      >
        {{ description }}
      </p>

      <div
        v-if="offerLine"
        :class="[
          'mb-3 rounded-2xl px-4 py-2.5 border',
          offerLineViolet
            ? 'border-violet-400/45 bg-violet-500/10'
            : 'border-[var(--color-accent)]/45 bg-[var(--color-accent)]/12',
        ]"
      >
        <p
          :class="[
            'text-xs md:text-sm font-bold leading-snug',
            offerLineViolet ? 'text-violet-200' : 'text-[var(--color-accent)]',
          ]"
        >
          {{ offerLine }}
        </p>
      </div>
      <p v-if="resultHook" class="text-xs md:text-sm font-semibold text-[var(--color-text)] mb-4">
        {{ resultHook }}
      </p>

      <!-- Features List -->
      <ul class="space-y-3 mb-6 flex-1">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-2 text-sm text-white"
        >
          <svg
            class="w-5 h-5 text-accent shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{{ feature }}</span>
        </li>
      </ul>

      <!-- Price -->
      <div class="mt-auto pt-4 border-t border-border">
        <div v-if="originalPrice" class="flex items-baseline gap-2 mb-2">
          <span class="text-sm text-text-muted line-through">{{ originalPrice }}</span>
          <span class="text-xs text-accent font-semibold">Экономия</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl md:text-3xl font-bold transition-colors duration-300 text-[var(--color-accent)]"
          >
            {{ price }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.package-card {
  backdrop-filter: blur(10px);
}

.package-card:hover {
  transform: translateY(-2px);
}
</style>

