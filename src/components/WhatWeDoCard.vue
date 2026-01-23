<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import IconContainer from './IconContainer.vue'

const props = defineProps<{
  title: string
  iconPath: string
  description: string
  wrapperClass?: string
  iconBgColor?: string
  iconHoverBgColor?: string
  iconColor?: string
}>()

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <div
    :class="[
      'wwd-card group rounded-[3rem] px-6 sm:px-10 py-3 sm:py-3 shadow-lg hover:shadow-xl transition-colors duration-300 cursor-pointer flex items-center bg-bg hover:bg-[var(--color-accent)] backdrop-blur border border-[color-mix(in_oklab,var(--color-border)_60%,transparent)] hover:border-[var(--color-accent)] hover:ring-2 hover:ring-[var(--color-accent)] hover:ring-offset-0',
      props.wrapperClass,
    ]"
    @click="emit('click')"
  >
    <IconContainer
      :icon-path="iconPath"
      :bg-color="iconBgColor || 'bg-accent'"
      :hover-bg-color="iconHoverBgColor || 'group-hover:bg-[var(--color-purple)]'"
      :icon-color="iconColor || 'text-white'"
    />
    <div class="pt-1 px-3 sm:px-5">
      <h3
        class="text-xl sm:text-2xl md:text-md font-bold text-white group-hover:text-white transition-colors mb-2 md:mb-3 font-display"
      >
        {{ title }}
      </h3>
      <p
        class="text-white/80 group-hover:text-white transition-colors text-[0.7rem] leading-relaxed font-sans"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
