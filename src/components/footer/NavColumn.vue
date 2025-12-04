<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface NavItem {
  to: string
  label: string
  breakWords?: boolean
}

interface Props {
  column: {
    title: string
    items: NavItem[]
    id: string
  }
  variant?: 'default' | 'mobile-centered'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const containerClasses = computed(() => {
  const base = 'flex flex-col min-w-0'
  if (props.variant === 'mobile-centered') {
    return `${base} items-center`
  }
  return base
})

const titleClasses = computed(() => {
  const base =
    'text-accent font-bold text-md sm:text-sm md:text-lg mb-1 sm:mb-2 md:mb-4 leading-tight'
  if (props.variant === 'mobile-centered') {
    return `${base} text-center`
  }
  return base
})

const navClasses = computed(() => {
  if (props.variant === 'mobile-centered') {
    return 'flex flex-col space-y-0.5'
  }
  return 'flex flex-col space-y-0.5 sm:space-y-1 md:space-y-2'
})

const linkClasses = computed(() => {
  const base = '!text-text hover:!text-purple transition-colors'
  if (props.variant === 'mobile-centered') {
    return `${base} text-sm sm:text-xs`
  }
  return `${base} text-sm`
})
</script>

<template>
  <div :class="containerClasses">
    <h3 :class="titleClasses">{{ column.title }}</h3>
    <nav :class="navClasses">
      <RouterLink
        v-for="item in column.items"
        :key="item.to"
        :to="item.to"
        :class="[linkClasses, item.breakWords ? 'break-words' : 'whitespace-nowrap']"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </div>
</template>































