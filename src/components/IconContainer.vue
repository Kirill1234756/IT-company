<template>
  <div
    :class="[
      'w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300',
      containerClass,
      hoverScale ? 'group-hover:scale-110' : '',
      bgColorClass,
      hoverBgColorClass,
    ]"
  >
    <svg
      :class="[
        'w-6 h-6 md:w-8 md:h-8 transition-colors duration-300',
        iconColorClass,
      ]"
      :fill="useFill ? 'currentColor' : 'none'"
      :stroke="useFill ? 'none' : 'currentColor'"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 24 24"
    >
      <path :d="iconPath" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  iconPath: string
  bgColor?: string
  hoverBgColor?: string
  iconColor?: string
  hoverScale?: boolean
  containerClass?: string
  useFill?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: 'bg-accent',
  hoverBgColor: 'group-hover:bg-[var(--color-purple)]',
  iconColor: 'text-white',
  hoverScale: true,
  containerClass: '',
  useFill: true,
})

const bgColorClass = computed(() => props.bgColor)
const hoverBgColorClass = computed(() => props.hoverBgColor)
const iconColorClass = computed(() => props.iconColor)
</script>
