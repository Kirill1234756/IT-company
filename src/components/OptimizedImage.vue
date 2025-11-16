<script setup lang="ts">
import { computed } from 'vue'
import { createOptimizedImage, type ImageSrcSet } from '../utils/imageOptimizer'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  widths?: number[]
  format?: 'webp' | 'avif' | 'jpg' | 'png'
  sizes?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  fetchpriority?: 'high' | 'low' | 'auto'
  class?: string
  style?: string | Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  widths: () => [400, 800, 1200],
  format: 'webp',
  loading: 'lazy',
  decoding: 'async',
  fetchpriority: 'low',
  class: '',
  style: '',
})

const optimizedImage = computed<ImageSrcSet>(() => {
  return createOptimizedImage(props.src, {
    width: props.width,
    height: props.height,
    widths: props.widths,
    sizes: props.sizes,
    loading: props.loading,
    decoding: props.decoding,
    fetchpriority: props.fetchpriority,
    alt: props.alt,
  })
})

// Computed style для правильной обработки строки или объекта
const computedStyle = computed(() => {
  const baseStyle = `aspect-ratio: ${props.width} / ${props.height};`
  if (!props.style) return baseStyle
  if (typeof props.style === 'string') {
    return `${props.style}; ${baseStyle}`
  }
  // Если объект, конвертируем в строку
  const styleString = Object.entries(props.style)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ')
  return `${styleString}; ${baseStyle}`
})
</script>

<template>
  <!-- Используем простой img с srcset для оригинальных файлов -->
  <!-- Если в будущем появятся оптимизированные версии, можно добавить picture с source -->
  <img
    :src="optimizedImage.src"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    :loading="props.loading"
    :decoding="props.decoding"
    :fetchpriority="props.fetchpriority"
    :class="props.class"
    :style="computedStyle"
    :srcset="optimizedImage.srcset"
    :sizes="optimizedImage.sizes"
  />
</template>

