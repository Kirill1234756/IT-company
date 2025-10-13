<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

export interface ServiceCardProps {
  id: number
  title: string
  description: string
  priceFrom: string
  icon: string
  iconBg?: string
  isClickable?: boolean
  wrapperClass?: string
}

const props = withDefaults(defineProps<ServiceCardProps>(), {
  iconBg: 'from-blue-50 to-indigo-100',
  isClickable: true,
  wrapperClass: '',
})

const emit = defineEmits<{ (e: 'click', service: ServiceCardProps): void }>()

const handleClick = () => {
  if (props.isClickable) {
    emit('click', props)
  }
}
</script>

<template>
  <div
    :class="[
      'service-card group rounded-[2rem] bg-white border border-gray-200 shadow-sm p-8 md:p-10 flex items-start gap-6 transition-all duration-300',
      isClickable
        ? 'cursor-pointer hover:shadow-lg hover:border-[var(--color-accent)] hover:scale-[1.02]'
        : '',
      wrapperClass,
    ]"
    @click="handleClick"
  >
    <div
      :class="[
        'w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center text-4xl transition-all duration-300',
        iconBg,
        isClickable ? 'group-hover:scale-110 group-hover:rotate-3' : '',
      ]"
    >
      <span>{{ icon }}</span>
    </div>
    <div class="flex-1">
      <h3
        :class="[
          'text-3xl font-bold text-gray-900 leading-snug transition-colors duration-300',
          isClickable ? 'group-hover:text-[var(--color-accent)]' : '',
        ]"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'text-gray-700 mt-4 leading-relaxed max-w-3xl transition-colors duration-300',
          isClickable ? 'group-hover:text-gray-800' : '',
        ]"
      >
        {{ description }}
      </p>
      <div class="mt-6">
        <span
          :class="[
            'text-2xl font-semibold transition-colors duration-300',
            isClickable
              ? 'text-[#2455ff] group-hover:text-[var(--color-accent)]'
              : 'text-[#2455ff]',
          ]"
        >
          from {{ priceFrom }}
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
