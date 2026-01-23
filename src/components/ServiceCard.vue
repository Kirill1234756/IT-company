<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue'
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
  index?: number
}

const isVisible = ref(false)

onMounted(() => {
  // Задержка для stagger эффекта
  const delay = (props.index ?? 0) * 100
  setTimeout(() => {
    isVisible.value = true
  }, delay)
})

const props = withDefaults(defineProps<ServiceCardProps>(), {
  iconUseFill: true,
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
      'service-card group rounded-[3rem] services-card shadow-sm p-6 flex flex-col gap-4 transition-all duration-300',
      isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : '',
      wrapperClass,
      isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4',
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
          'text-lg md:text-xl font-bold services-card-title leading-snug transition-colors duration-300 text-center',
          isClickable ? 'group-hover:text-accent' : '',
        ]"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'services-card-description mt-3 text-[0.7rem] leading-relaxed transition-colors duration-300 text-center',
          isClickable ? 'group-hover:text-text' : '',
        ]"
      >
        {{ description }}
      </p>
      <div class="mt-auto pt-4">
        <span
          :class="[
            'text-lg md:text-xl font-semibold services-card-price transition-colors duration-300 block text-center',
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
