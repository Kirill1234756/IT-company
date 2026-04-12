<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'

interface Props {
  label?: string
  to?: string
  type?: 'button' | 'submit' | 'reset'
  bgColor?: string
  textColor?: string
  bgClass?: string
  textClass?: string
  loading?: boolean
  success?: boolean
  loadingLabel?: string
  successLabel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'button',
  bgColor: '#ff8863',
  textColor: 'white',
  bgClass: '',
  textClass: '',
  loading: false,
  success: false,
  loadingLabel: 'Отправка...',
  successLabel: 'Готово',
  disabled: false,
})

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
const router = useRouter()

const styleAttr = computed(() => {
  if (props.bgClass || props.textClass) return ''
  return `background-color: ${props.bgColor} !important; color: ${props.textColor} !important`
})

const isDisabled = computed(() => props.disabled || props.loading || props.success)

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading || props.success) return
  emit('click', e)
  if (props.to) {
    router.push(props.to)
  }
}
</script>

<template>
  <button
    :type="props.type"
    :class="[
      'mt-6 text-sm py-3 px-8 rounded-[3rem] font-semibold font-display transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 active:translate-y-0 focus:outline-none focus:ring-2',
      props.bgClass || 'bg-[var(--color-accent)]',
      props.textClass || 'text-white',
      'hover:bg-[var(--color-purple)] hover:text-white hover:ring-[var(--color-accent)] focus:ring-[var(--color-accent)]',
      'min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2',
      success ? '!bg-[var(--color-success)] hover:!bg-[var(--color-success)]' : '',
      loading ? 'opacity-90' : '',
    ]"
    :style="styleAttr"
    :aria-label="props.label || 'Кнопка действия'"
    :aria-busy="loading"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <template v-if="success">
      <svg
        class="cta-success-icon h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ successLabel }}</span>
    </template>
    <template v-else-if="loading">
      <span
        class="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />
      <span>{{ loadingLabel }}</span>
    </template>
    <slot v-else>{{ props.label }}</slot>
  </button>
</template>

<style scoped>
@keyframes cta-check {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.cta-success-icon {
  animation: cta-check 0.45s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .cta-success-icon {
    animation: none;
  }
}
</style>
