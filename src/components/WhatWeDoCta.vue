<script setup lang="ts">
defineProps<{ text: string }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <div
    class="wwd-cta group rounded-[3rem] p-6 sm:p-8 flex flex-col justify-center items-center text-center cursor-pointer text-white w-full md:col-span-4 bg-[var(--color-purple)]/90 hover:bg-[var(--color-accent)] transition-colors border border-[color-mix(in_oklab,var(--color-border)_60%,transparent)] hover:border-[var(--color-accent)] hover:ring-2 hover:ring-[var(--color-accent)]"
    @click="$emit('click')"
  >
    <h3
      class="text-base text-[0.8rem] md:text-sm px-2 sm:px-4 font-bold transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:text-white"
    >
      {{ text }}
    </h3>
  </div>
</template>

<style scoped></style>


