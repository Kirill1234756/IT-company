<template>
  <div :class="['flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 w-full', containerClass]">
    <button
      v-for="item in items"
      :key="getItemKey(item)"
      @click="handleClick(item)"
      :class="[
        'border-none px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full transition-all duration-300 text-xs sm:text-sm font-semibold font-display relative overflow-hidden group shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2',
        isActive(item) ? activeTextColor : textColor,
        getButtonClasses(item),
      ]"
    >
      <span class="relative z-10">{{ getItemLabel(item) }}</span>
      <div
        v-if="isActive(item)"
        :class="[
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full',
          hoverInnerColor,
        ]"
      ></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type FilterItem = string | { label: string; value: string }

interface FilterButtonColors {
  bg?: string
  border?: string
  hover?: string
  inner?: string
  text?: string
  activeBg?: string
  activeBorder?: string
  activeText?: string
}

interface Props {
  items: Array<FilterItem>
  modelValue: string
  filterMap?: Record<string, string>
  colors?: FilterButtonColors
  containerClass?: string
  getItemKey?: (item: FilterItem) => string
  getItemLabel?: (item: FilterItem) => string
  getItemValue?: (item: FilterItem) => string
}

const props = withDefaults(defineProps<Props>(), {
  filterMap: () => ({}),
  colors: () => ({
    bg: '!bg-accent',
    border: 'border-rose-custom',
    hover: 'hover:bg-[#ae70ac] hover:border-[#ae70ac]',
    inner: 'bg-[#ae70ac]',
    text: 'text-white',
  }),
  containerClass: '',
  getItemKey: undefined,
  getItemLabel: undefined,
  getItemValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Computed functions that use props after they're defined
const getItemKeyFn = computed(() => {
  return (
    props.getItemKey ||
    ((item: FilterItem) => {
      if (typeof item === 'string') return item
      return item.value
    })
  )
})

const getItemLabelFn = computed(() => {
  return (
    props.getItemLabel ||
    ((item: FilterItem) => {
      if (typeof item === 'string') return item
      return item.label
    })
  )
})

const getItemValueFn = computed(() => {
  return (
    props.getItemValue ||
    ((item: FilterItem) => {
      if (typeof item === 'string') {
        return props.filterMap[item] || item
      }
      return item.value
    })
  )
})

const getItemKey = (item: FilterItem) => getItemKeyFn.value(item)
const getItemLabel = (item: FilterItem) => getItemLabelFn.value(item)
const getItemValue = (item: FilterItem) => getItemValueFn.value(item)

const textColor = computed(() => props.colors.text || 'text-white')
const activeTextColor = computed(() => props.colors.activeText || 'text-white')

const hoverInnerColor = computed(() => props.colors.inner || 'bg-[#ae70ac]')

const getButtonClasses = (item: FilterItem) => {
  const isItemActive = isActive(item)

  if (isItemActive) {
    // Активная кнопка - фиолетовый фон
    return [
      props.colors.activeBg || 'bg-purple',
      props.colors.activeBorder || 'border-purple',
      props.colors.hover || 'hover:bg-purple/90 hover:border-purple/90',
    ].join(' ')
  } else {
    // Неактивная кнопка - оранжевый фон
    return [
      props.colors.bg || '!bg-accent',
      props.colors.border || 'border-rose-custom',
      props.colors.hover || 'hover:bg-[#ae70ac] hover:border-[#ae70ac]',
    ].join(' ')
  }
}

const isActive = (item: FilterItem) => {
  const itemValue = getItemValue(item)
  return props.modelValue === itemValue
}

const handleClick = (item: FilterItem) => {
  const itemValue = getItemValue(item)
  emit('update:modelValue', itemValue)
}
</script>
