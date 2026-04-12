<script setup lang="ts">
defineProps<{
  message: string
  /** Add shake keyframe once when message appears (parent toggles) */
  shake?: boolean
}>()
</script>

<template>
  <Transition name="form-banner">
    <p
      v-if="message"
      :class="[
        'rounded-[1rem] border border-[var(--color-error)] bg-[color-mix(in_oklab,var(--color-error)_15%,transparent)] px-3 py-2 text-center text-sm text-[var(--color-text)]',
        shake ? 'form-error-shake' : '',
      ]"
      role="alert"
      aria-live="assertive"
    >
      {{ message }}
    </p>
  </Transition>
</template>

<style scoped>
.form-banner-enter-active,
.form-banner-leave-active {
  transition:
    opacity 0.18s ease-out,
    transform 0.18s ease-out;
}

.form-banner-enter-from,
.form-banner-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .form-banner-enter-active,
  .form-banner-leave-active {
    transition-duration: 0.01ms;
  }

  .form-banner-enter-from,
  .form-banner-leave-to {
    transform: none;
  }
}
</style>
