<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useServicesStore } from '../stores/services'
import type { ServiceCategory } from '../types/services'

export interface ServiceCardProps {
  id: number
  title: string
  description: string
  priceFrom: string
  icon: string
  iconBg?: string
  isClickable?: boolean
  wrapperClass?: string
  slug?: string
}

const props = withDefaults(defineProps<ServiceCardProps>(), {
  iconBg: 'from-blue-50 to-indigo-100',
  isClickable: true,
  wrapperClass: '',
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
      'service-card group rounded-[3rem] services-card shadow-sm p-4 flex gap-4 transition-all duration-300',
      isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : '',
      wrapperClass,
    ]"
    @click="handleClick"
  >
    <div
      :class="[
        'w-20 h-20 shrink-0 rounded-[3rem] bg-gradient-to-br flex items-center justify-center text-4xl transition-all duration-300',
        iconBg,
        isClickable ? 'group-hover:scale-110 group-hover:rotate-3' : '',
      ]"
    >
      <span>{{ icon }}</span>
    </div>
    <div class="flex-1">
      <h3
        :class="[
          'text-xl font-bold services-card-title leading-snug transition-colors duration-300',
          isClickable ? 'group-hover:text-accent' : '',
        ]"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'services-card-description mt-4 text-[0.7rem] leading-relaxed max-w-3xl transition-colors duration-300',
          isClickable ? 'group-hover:text-text' : '',
        ]"
      >
        {{ description }}
      </p>
      <div class="mt-6">
        <span
          :class="[
            'text-xl font-semibold services-card-price transition-colors duration-300',
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
