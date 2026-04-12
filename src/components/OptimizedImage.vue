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
  /** box — фиксированное соотношение width/height; intrinsic — высота по картинке; fill — заполнить родителя (absolute inset-0 + object-cover) */
  layout?: 'box' | 'intrinsic' | 'fill'
}

const props = withDefaults(defineProps<Props>(), {
  widths: () => [400, 800, 1200, 1600],
  format: 'webp',
  loading: 'lazy',
  decoding: 'async',
  fetchpriority: 'low',
  class: '',
  style: '',
  layout: 'box',
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
  const merge = (base: string) => {
    if (!props.style) return base
    if (typeof props.style === 'string') {
      return `${props.style}; ${base}`
    }
    const styleString = Object.entries(props.style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ')
    return `${styleString}; ${base}`
  }

  if (props.layout === 'intrinsic') {
    const intrinsic =
      'width: 100%; max-width: 100%; height: auto; display: block; aspect-ratio: auto;'
    return merge(intrinsic)
  }

  if (props.layout === 'fill') {
    const fill =
      'width: 100%; height: 100%; aspect-ratio: unset; max-width: none; max-height: none; display: block;'
    return merge(fill)
  }

  const baseStyle = `aspect-ratio: ${props.width} / ${props.height};`
  return merge(baseStyle)
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

