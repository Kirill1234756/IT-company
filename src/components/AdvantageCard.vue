<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  title: string
  description: string
  index?: number
  isCentral?: boolean
}>()
</script>

<template>
  <article
    class="relative overflow-hidden"
    :class="[
      'p-6 md:p-8 ',
      // alternate big padding sides
      (props.index ?? 0) % 2 === 0
        ? 'ps-4 md:ps-8 lg:ps-12 pe-6 rounded-e-[3rem]'
        : 'pe-4 md:pe-8 lg:pe-12 ps-6 rounded-s-[3rem]',
      // background color: invert ONLY for central cards
      props.isCentral
        ? (props.index ?? 0) % 2 === 0
          ? 'bg-[var(--color-purple)] border-transparent'
          : 'bg-[var(--color-accent)] border-gray-200'
        : (props.index ?? 0) % 2 === 0
        ? 'bg-[var(--color-accent)] border-gray-200'
        : 'bg-[var(--color-purple)]  border-transparent',
    ]"
  >
    <div class="flex items-center md:items-start gap-5">
      <h3 class="text-lg font-extrabold w-full text-white group-[.bg-white]:text-neutral-900">
        {{ props.title }}
      </h3>
      <p
        class="text-white/70 w-full group-[.bg-white]:text-neutral-600 leading-relaxed text-[0.7rem]"
      >
        {{ props.description }}
      </p>
    </div>
  </article>
</template>

<style scoped>
</style>


