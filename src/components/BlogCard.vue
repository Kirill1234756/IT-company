<script setup lang="ts">
import type { BlogPost } from '../types/blog'
import OptimizedImage from './OptimizedImage.vue'

const props = withDefaults(
  defineProps<{
    post: BlogPost
    /** Лента на главной: прежний вид карточки, высота как у компактной ленты */
    inSwiper?: boolean
  }>(),
  { inSwiper: false }
)

const emit = defineEmits<{
  (e: 'click', post: BlogPost): void
}>()

const handleClick = () => {
  emit('click', props.post)
}
</script>

<template>
  <div
    class="blog-card-root rounded-2xl shadow-lg overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 border border-[var(--color-border)] hover:border-[var(--color-accent)]/35 bg-[#050a1b]"
    :class="inSwiper ? 'h-full max-h-[24rem] min-h-0' : ''"
    @click="handleClick"
  >
    <div
      class="relative w-full flex-shrink-0 overflow-hidden bg-[#050a1b]"
      style="aspect-ratio: 14/9"
    >
      <OptimizedImage
        layout="fill"
        :src="post.image"
        :alt="post.title"
        :width="400"
        :height="225"
        :widths="[300, 600, 900, 1200]"
        format="webp"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-300"
        style="box-sizing: border-box; transform: translateZ(0)"
        :sizes="{ mobile: '100vw', tablet: '50vw', desktop: '33vw' }"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050a1b]/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />
    </div>

    <div
      class="px-5 py-5 md:px-6 md:py-6 text-left flex flex-col flex-grow min-h-0"
      :class="inSwiper ? 'flex-1 justify-between overflow-hidden' : 'min-h-[7.5rem]'"
    >
      <h3
        class="text-lg md:text-xl font-bold text-white leading-snug font-display min-h-0 overflow-hidden line-clamp-2"
      >
        {{ post.title }}
      </h3>
      <div
        class="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-white/[0.08]"
      >
        <span
          class="text-[0.7rem] md:text-sm font-medium text-[var(--color-accent)] group-hover:text-[var(--color-peach)] transition-colors"
        >
          Читать статью
        </span>
        <div
          class="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 bg-[var(--color-accent)] text-[var(--color-bg)] group-hover:bg-[var(--color-purple)] group-hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 -translate-x-px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
