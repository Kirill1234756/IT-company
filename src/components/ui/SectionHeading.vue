<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * Уровень заголовка. По умолчанию h2.
     */
    level?: 1 | 2 | 3 | 4 | 5 | 6
    /**
     * Принудительный тег, если нужен не стандартный h1–h6
     */
    as?: string
    /**
     * Выравнивание текста
     */
    align?: 'left' | 'center' | 'right'
    /**
     * Цвет текста на основе дизайн‑токенов
     * - accent: акцентный (оранжевый) на тёмном фоне
     * - bg: тёмный цвет фона (для светлого бэкграунда)
     * - text: базовый текстовый цвет
     * - muted: приглушённый текст
     */
    color?: 'accent' | 'bg' | 'text' | 'muted'
    /**
     * Размер заголовка
     * sm  – поменьше
     * md  – стандартный для секций
     * lg  – крупный (hero / ключевые блоки)
     */
    size?: 'sm' | 'md' | 'lg'
    /**
     * Насыщенность шрифта
     */
    weight?: 'normal' | 'bold' | 'black'
    /**
     * Дополнительный CSS‑класс для анимаций и т.п.
     */
    animationClass?: string
    /**
     * Дополнительные классы (tailwind / utility)
     */
    class?: string
  }>(),
  {
    level: 2,
    align: 'center',
    color: 'text',
    size: 'md',
    weight: 'black',
    animationClass: '',
    class: '',
  }
)

const tagName = computed(() => {
  if (props.as) return props.as
  const safeLevel = String(props.level ?? 2)
  return `h${safeLevel}`
})

const headingClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const colorMap: Record<string, string> = {
    accent: 'text-accent',
    bg: 'text-bg',
    text: 'text-text',
    muted: 'text-muted',
  }

  const sizeMap: Record<string, string> = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  }

  const weightMap: Record<string, string> = {
    normal: 'font-normal',
    bold: 'font-bold',
    black: 'font-black',
  }

  return [
    // Базовая типографика для всех заголовков
    'heading-font tracking-tight',
    // Выравнивание
    alignMap[props.align] ?? alignMap.center,
    // Цвет
    colorMap[props.color] ?? colorMap.text,
    // Размер
    sizeMap[props.size] ?? sizeMap.md,
    // Насыщенность
    weightMap[props.weight] ?? weightMap.black,
    // Анимационные / внешние классы
    props.animationClass,
    props.class,
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <component :is="tagName" :class="headingClass">
    <slot />
  </component>
</template>

<style scoped>
/* Дополнительные правки под разные экраны без ломания Tailwind */
</style>

