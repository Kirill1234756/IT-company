<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ServiceCard, { type ServiceCardProps } from './ServiceCard.vue'

type Service = ServiceCardProps

interface ServiceSectionProps {
  title: string
  badge: string
  services: Service[]
  isClickable?: boolean
  wrapperClass?: string
}

withDefaults(defineProps<ServiceSectionProps>(), {
  isClickable: true,
  wrapperClass: '',
})

const emit = defineEmits<{ (e: 'serviceClick', service: Service): void }>()

const handleServiceClick = (service: Service) => {
  emit('serviceClick', service)
}
</script>

<template>
  <div :class="['service-section', wrapperClass]">
    <!-- Badge -->
    <div class="mb-10">
      <span class="inline-block bg-[#2455ff] text-white text-sm px-5 py-2 rounded-full">
        {{ badge }}
      </span>
    </div>

    <!-- Cards -->
    <div class="space-y-10">
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :id="service.id"
        :title="service.title"
        :description="service.description"
        :priceFrom="service.priceFrom"
        :icon="service.icon"
        :iconBg="service.iconBg"
        :isClickable="isClickable"
        @click="handleServiceClick"
      />
    </div>
  </div>
</template>

<style scoped>
.service-section {
  max-width: 5xl;
  margin: 0 auto;
}
</style>
