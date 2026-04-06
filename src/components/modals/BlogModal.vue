<script setup lang="ts">
import { defineProps, defineEmits, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import type { BlogPost } from '../../types/blog'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import OptimizedImage from '../OptimizedImage.vue'

const BlogCard = defineAsyncComponent(() => import('../BlogCard.vue'))
const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
const ContactSection = defineAsyncComponent(() => import('../sections/ContactSection.vue'))
const Footer = defineAsyncComponent(() => import('../../pages/Footer.vue'))
const { trackBlogView } = useYandexMetrika()

const props = defineProps<{
  post: BlogPost
  relatedPosts: BlogPost[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'relatedClick', post: BlogPost): void
}>()

const handleRelatedClick = (post: BlogPost) => {
  emit('relatedClick', post)
}

// Блокируем скролл body при открытии модалки (iOS-совместимый способ)
onMounted(() => {
  // Сохраняем текущую позицию скролла
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop

  // iOS-совместимая блокировка скролла
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
  // Для iOS Safari
  document.body.style.height = '100%'
  document.body.style.overscrollBehavior = 'none'

  // Сохраняем позицию для восстановления
  document.body.setAttribute('data-scroll-y', scrollY.toString())

  trackBlogView(props.post.fullTitle || props.post.title, props.post.category, {
    post_id: props.post.id,
  })
})

// Восстанавливаем скролл body при закрытии модалки
onUnmounted(() => {
  const scrollY = document.body.getAttribute('data-scroll-y') || document.body.style.top

  // Восстанавливаем стили
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  document.body.style.height = ''
  document.body.style.overscrollBehavior = ''
  document.body.removeAttribute('data-scroll-y')

  // Восстанавливаем позицию скролла
  if (scrollY) {
    const scrollValue =
      typeof scrollY === 'string' && scrollY.startsWith('-')
        ? parseInt(scrollY.replace('-', ''))
        : parseInt(scrollY) || 0
    window.scrollTo(0, scrollValue)
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col ios-modal-fix">
      <div
        class="flex-1 overflow-y-auto bg-[var(--color-bg)] text-[var(--color-text)]"
        style="-webkit-overflow-scrolling: touch"
      >
        <!-- Close Button -->
        <div
          class="sticky top-0 border-b border-border z-10 bg-[rgba(3,18,47,0.95)] backdrop-blur-[10px]"
        >
          <div class="max-w-7xl mx-auto md:px-[3rem] px-[1rem] py-4">
            <button
              @click="$emit('close')"
              class="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
              aria-label="Закрыть модальное окно блога"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Назад
            </button>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem]">
          <Breadcrumbs
            :items="[
              { label: 'Главная', to: '/' },
              {
                label: $props.post.category === 'development' ? 'Разработка' : 'Акция',
                to: `/blog/${$props.post.category}`,
              },
              { label: $props.post.fullTitle || $props.post.title },
            ]"
            class="mb-4"
          />

          <!-- Main Title -->
          <SectionHeading
            :level="1"
            size="lg"
            color="accent"
            align="left"
            weight="black"
            class="mb-8 font-display text-condense"
          >
            {{ $props.post.fullTitle || $props.post.title }}
          </SectionHeading>

          <!-- Hero Section -->

          <div class="flex flex-col lg:flex-row gap-8 mb-5">
            <!-- Main Image -->
            <div class="lg:w-2/3" style="aspect-ratio: 16/9">
              <OptimizedImage
                :src="$props.post.image"
                :alt="$props.post.title"
                :width="800"
                :height="450"
                :widths="[800, 1200, 1600]"
                format="webp"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="w-full h-full object-cover rounded-2xl border border-[var(--color-border)]"
                :sizes="{ mobile: '100vw', tablet: '66vw', desktop: '66vw' }"
              />
            </div>

            <!-- Summary Card -->
            <div class="lg:w-1/3">
              <div
                class="rounded-2xl p-6 md:p-7 h-full border border-[var(--color-border)] bg-[#050a1b] shadow-lg flex flex-col"
              >
                <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-white mb-3">
                  Кратко о статье
                </p>
                <h2 class="text-lg md:text-xl font-bold mb-4 font-display text-accent leading-snug">
                  {{ $props.post.fullTitle || $props.post.title }}
                </h2>
                <p class="mb-0 leading-relaxed text-white/85 text-[15px] flex-grow">
                  {{ $props.post.summary }}
                </p>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="prose prose-lg max-w-none mb-12">
            <div v-for="(section, index) in $props.post.content" :key="index" class="mb-8">
              <h3 class="text-2xl font-bold mb-4 font-display text-accent">
                {{ section.heading }}
              </h3>
              <div v-if="section.table" class="blog-table-wrap">
                <table class="blog-table">
                  <thead>
                    <tr>
                      <th v-for="(col, i) in section.table.columns" :key="i">
                        {{ col }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, r) in section.table.rows" :key="r">
                      <td v-for="(cell, c) in row" :key="c">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="leading-relaxed text-white">
                {{ section.text }}
              </p>
            </div>
          </div>

          <!-- Related Materials -->
          <div class="border-t border-[var(--color-border)] pt-12">
            <h2 class="text-2xl md:text-3xl font-bold text-center mb-8 font-display text-accent">
              Похожие материалы
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BlogCard
                v-for="relatedPost in $props.relatedPosts"
                :key="relatedPost.id"
                :post="relatedPost"
                @click="handleRelatedClick"
              />
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <ContactSection />

        <!-- Footer Section -->
        <Footer />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.prose {
  color: var(--color-text-muted);
}

.prose h3 {
  color: var(--color-accent);
  font-weight: 700;
  font-family: var(--font-condensed);
}

.prose p {
  color: white;
  line-height: 1.7;
  white-space: pre-line;
}

.blog-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: #050a1b;
}

.blog-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.blog-table th,
.blog-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  vertical-align: top;
  color: white;
  line-height: 1.5;
}

.blog-table th {
  position: sticky;
  top: 0;
  background: #050a1b;
  color: var(--color-accent);
  font-weight: 800;
}

.blog-table tbody tr:last-child td {
  border-bottom: none;
}
</style>

<style>
/* iOS fix для модальных окон */
.ios-modal-fix {
  /* Исправляем проблему с fixed positioning на iOS */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Используем динамический viewport height для iOS */
  min-height: -webkit-fill-available; /* Fallback for older iOS */
  height: 100vh;
  height: 100dvh;
  /* Улучшаем прокрутку на iOS (устаревшее, но все еще работает) */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
</style>
