<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    /** When true, banner is visible */
    show: boolean
    message: string
    /** on-dark: light text (contact section). on-light: dark text (client form). */
    variant?: 'on-dark' | 'on-light'
    autoDismissMs?: number
  }>(),
  {
    variant: 'on-dark',
    autoDismissMs: 5000,
  }
)

const emit = defineEmits<{ dismiss: [] }>()

let timer: ReturnType<typeof setTimeout> | null = null

function dismiss() {
  emit('dismiss')
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

watch(
  () => props.show,
  (v) => {
    clearTimer()
    if (v && props.autoDismissMs > 0) {
      timer = setTimeout(() => dismiss(), props.autoDismissMs)
    }
  }
)

onUnmounted(clearTimer)

const boxClass =
  'rounded-[1.5rem] border px-4 py-3 flex items-start gap-3 shadow-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out'
const variantClass = {
  'on-dark':
    'bg-[color-mix(in_oklab,var(--color-success)_18%,transparent)] border-[var(--color-success)] text-bg',
  'on-light':
    'bg-[color-mix(in_oklab,var(--color-success)_12%,white)] border-[var(--color-success)] text-[var(--color-bg)]',
}
</script>

<template>
  <Transition name="form-banner">
    <div
      v-if="show && message"
      :class="[boxClass, variantClass[variant]]"
      role="status"
      aria-live="polite"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-[var(--color-bg)]"
        aria-hidden="true"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <div class="min-w-0 flex-1 pt-0.5 text-sm font-medium leading-snug">
        {{ message }}
      </div>
      <button
        type="button"
        class="shrink-0 rounded-full p-1.5 opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)]"
        aria-label="Закрыть"
        @click="dismiss"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.form-banner-enter-active,
.form-banner-leave-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.22s ease-out;
}

.form-banner-enter-from,
.form-banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
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
