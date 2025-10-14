<template>
  <div :class="sectionClasses">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-3xl font-bold text-gray-900">{{ title }}</h2>
      <p class="text-sm text-gray-500 max-w-xs ml-8">{{ helperText }}</p>
    </div>
    <textarea
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      class="w-full h-32 px-6 py-4 border border-gray-200 rounded-xl text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  helperText: string
  placeholder?: string
  modelValue: string
  error?: string
  variant?: 'white' | 'blue'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Напиши что-нибудь',
  variant: 'white',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const sectionClasses = computed(() => [
  'rounded-2xl p-8 shadow-sm',
  props.variant === 'blue' ? 'bg-blue-50' : 'bg-white',
])
</script>
