<template>
  <div :class="sectionClasses">
    <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
      <h2 :class="['text-xl font-bold font-display mb-2 md:mb-0', titleColor]">{{ title }}</h2>
      <p :class="textColor" class="text-sm md:max-w-xs md:ml-8">{{ helperText }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        @click="emit('update:modelValue', opt.value)"
        :class="[
          'text-left px-5 py-4 rounded-[2rem] border transition-colors',
          isSelected(opt.value)
            ? 'border-accent bg-accent'
            : 'border-border hover:border-accent/60',
          textColor,
        ]"
      >
        <div class="text-base font-semibold">{{ opt.label }}</div>
      </button>
    </div>

    <div class="mt-5">
      <textarea
        :value="commentValue"
        @input="onCommentInput"
        :placeholder="commentPlaceholder"
        :class="[
          textColor,
          'w-full min-h-[6.5rem] max-h-48 px-6 py-4 border-2 border-accent rounded-[3rem] text-lg resize-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 placeholder:text-sm placeholder:text-accent/80 overflow-y-auto',
        ]"
      />
      <p v-if="commentError" class="text-[var(--color-error)] text-sm mt-2">{{ commentError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'white' | 'blue'

interface Option {
  label: string
  value: string
}

interface Props {
  title: string
  helperText: string
  modelValue: string
  commentValue?: string
  commentPlaceholder?: string
  commentError?: string
  variant?: Variant
}

const props = withDefaults(defineProps<Props>(), {
  commentValue: '',
  commentPlaceholder: 'Если хотите, поясните почему такой бюджет (необязательно)',
  variant: 'white',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:commentValue': [value: string]
}>()

const options: Option[] = [
  { label: 'до 150 000 ₽', value: 'до 150 000 ₽' },
  { label: '150 000–300 000 ₽', value: '150 000–300 000 ₽' },
  { label: '300 000–500 000 ₽', value: '300 000–500 000 ₽' },
  { label: '500 000–1 000 000 ₽', value: '500 000–1 000 000 ₽' },
  { label: 'Больше 1 000 000 ₽', value: 'Больше 1 000 000 ₽' },
]

const isSelected = (v: string) => props.modelValue === v

const onCommentInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:commentValue', target.value)
}

const sectionClasses = computed(() => [
  'rounded-[3rem] p-8 shadow-sm',
  props.variant === 'blue' ? 'bg-text' : 'bg-bg border border-accent',
])
const textColor = computed(() => [props.variant === 'blue' ? 'text-bg' : 'text-text'])
const titleColor = computed(() => (props.variant === 'white' ? 'text-accent' : 'text-bg'))
</script>

<style scoped>
textarea:focus {
  border-color: var(--color-accent) !important;
  box-shadow: none !important;
  outline: none !important;
}

textarea:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
</style>





