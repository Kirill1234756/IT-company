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
        ? 'ps-[1rem] md:ps-[5rem] lg:ps-[10rem] pe-6 rounded-e-[3rem]'
        : 'pe-[1rem] md:pe-[5rem] lg:pe-[10rem] ps-6 rounded-s-[3rem]',
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


