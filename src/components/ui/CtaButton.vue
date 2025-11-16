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
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'button',
  bgColor: '#ff8863',
  textColor: 'white',
  bgClass: '',
  textClass: '',
})

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
const router = useRouter()

const styleAttr = computed(() => {
  if (props.bgClass || props.textClass) return ''
  return `background-color: ${props.bgColor} !important; color: ${props.textColor} !important`
})

function handleClick(e: MouseEvent) {
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
      'min-h-[44px] min-w-[44px]', // Minimum touch target size for accessibility
    ]"
    :style="styleAttr"
    :aria-label="props.label || 'Кнопка действия'"
    @click="handleClick"
  >
    <slot>{{ props.label }}</slot>
  </button>
</template>


