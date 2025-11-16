<template>
  <div :class="sectionClasses">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold text-accent font-display">{{ title }}</h2>
      <p :class="textColor" class="text-sm max-w-xs ml-8">{{ helperText }}</p>
    </div>
    <textarea
      ref="textareaRef"
      :id="`form-textarea-${title.toLowerCase().replace(/\s+/g, '-')}`"
      :name="`form-textarea-${title.toLowerCase().replace(/\s+/g, '-')}`"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="[
        textColor,
        'w-full min-h-[6.5rem] max-h-48 px-6 py-4 border border-border rounded-[3rem] text-lg resize-none focus:outline-none focus:border-accent focus:ring-0 placeholder:text-sm placeholder:text-accent overflow-y-auto',
      ]"
      :style="{ height: textareaHeight }"
    />
    <p v-if="error" class="client-form-error text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'

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

const textareaRef = ref<HTMLTextAreaElement>()
const textareaHeight = ref('6.5rem')
const hasReachedMaxHeight = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  // Автоматическое изменение высоты
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      const scrollHeight = textareaRef.value.scrollHeight
      const maxHeight = 250 // 15.625rem = 250px
      const minHeight = 104 // 6.5rem = 104px

      // Removed console.log for production performance

      if (target.value.trim() === '') {
        // Если текст пустой - возвращаем к минимальной высоте
        textareaHeight.value = `${minHeight}px`
        hasReachedMaxHeight.value = false
        // Removed console.log for production performance
      } else if (scrollHeight < maxHeight && !hasReachedMaxHeight.value) {
        // Если есть текст и он помещается - растягиваем под контент
        textareaHeight.value = `${scrollHeight}px`
        // Removed console.log for production performance
      } else if (scrollHeight >= maxHeight) {
        // Если текст достигает или превышает максимум - устанавливаем максимальную высоту
        textareaHeight.value = `${maxHeight}px`
        hasReachedMaxHeight.value = true
        // Removed console.log for production performance
      } else if (hasReachedMaxHeight.value) {
        // Если уже достигли максимума - сохраняем максимальную высоту
        textareaHeight.value = `${maxHeight}px`
        // Removed console.log for production performance
      }
    }
  })
}

// Инициализация высоты при монтировании компонента
watch(
  () => props.modelValue,
  () => {
    // Только при первой загрузке, если есть текст
    if (props.modelValue && props.modelValue.trim() !== '') {
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.style.height = 'auto'
          const scrollHeight = textareaRef.value.scrollHeight
          const maxHeight = 250 // 15.625rem = 250px

          if (scrollHeight <= maxHeight) {
            textareaHeight.value = `${scrollHeight}px`
          } else {
            textareaHeight.value = `${maxHeight}px`
          }
        }
      })
    }
  },
  { immediate: true }
)

const sectionClasses = computed(() => [
  'rounded-[3rem] p-8 shadow-sm',
  props.variant === 'blue' ? 'bg-text border border-bg' : 'bg-bg',
])
const textColor = computed(() => [props.variant === 'blue' ? 'text-bg' : 'text-text'])
</script>
<script lang="ts">
export default {}
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
















