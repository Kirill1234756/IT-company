<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useServicesStore } from '../stores/services'
import type { ServiceCategory } from '../types/services'
import IconContainer from './IconContainer.vue'

export interface ServiceCardProps {
  id: number
  title: string
  description: string
  priceFrom: string
  iconPath: string
  iconUseFill?: boolean
  isClickable?: boolean
  wrapperClass?: string
  slug?: string
  /** Показывать абзац описания под заголовком (на странице услуг — обычно выкл.) */
  showDescription?: boolean
}

const props = withDefaults(defineProps<ServiceCardProps>(), {
  iconUseFill: true,
  isClickable: true,
  wrapperClass: '',
  showDescription: true,
})

const emit = defineEmits<{
  (e: 'click', service: ServiceCardProps & { category?: ServiceCategory }): void
}>()

const servicesStore = useServicesStore()

const handleClick = () => {
  if (props.isClickable) {
    // Находим категорию, которая содержит эту услугу
    const category = servicesStore.categories.find((cat) =>
      cat.items?.some((item) => item.id === props.id)
    )
    if (category) {
      emit('click', { ...props, category })
    } else {
      emit('click', props)
    }
  }
}
</script>

<template>
  <div
    :class="[
      'service-card group rounded-[3rem] shadow-sm p-6 flex flex-col gap-4 transition-all duration-300 bg-[var(--color-border)] border border-[var(--color-border)] backdrop-blur-[10px]',
      isClickable
        ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] hover:border-[var(--color-accent)] hover:shadow-[0_20px_40px_-10px_rgba(255,136,99,0.2)]'
        : '',
      wrapperClass,
    ]"
    @click="handleClick"
  >
    <div class="flex justify-center">
      <IconContainer
        :icon-path="iconPath"
        bg-color="bg-accent"
        hover-bg-color="group-hover:bg-[var(--color-purple)]"
        icon-color="text-white"
        :hover-scale="isClickable"
        :use-fill="iconUseFill"
        container-class="w-16 h-16 md:w-20 md:h-20 rounded-xl"
      />
    </div>
    <div class="flex-1 flex flex-col">
      <h3
        :class="[
          'text-lg md:text-xl font-bold leading-snug transition-colors duration-300 text-center text-[var(--color-text)] font-display',
          isClickable ? 'group-hover:text-accent' : '',
        ]"
      >
        {{ title }}
      </h3>
      <p
        v-if="showDescription"
        :class="[
          'mt-3 text-[0.7rem] leading-relaxed transition-colors duration-300 text-center text-white',
          isClickable ? 'group-hover:text-text' : '',
        ]"
      >
        {{ description }}
      </p>
      <div :class="showDescription ? 'mt-auto pt-4' : 'mt-auto pt-2'">
        <span
          :class="[
            'text-lg md:text-xl font-semibold transition-colors duration-300 block text-center text-[var(--color-accent)]',
            isClickable ? 'group-hover:text-purple' : '',
          ]"
        >
          {{ priceFrom }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  backdrop-filter: blur(10px);
}

.service-card:hover {
  transform: translateY(-2px);
}
</style>
