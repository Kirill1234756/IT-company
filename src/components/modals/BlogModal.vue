<script setup lang="ts">
import { defineProps, defineEmits, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import type { BlogPost } from '../../types/blog'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import OptimizedImage from '../OptimizedImage.vue'

const BlogCard = defineAsyncComponent(() => import('../BlogCard.vue'))
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

// Блокируем скролл body при открытии модалки
onMounted(() => {
  // Сохраняем текущую позицию скролла
  const scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'

  trackBlogView(props.post.fullTitle || props.post.title, props.post.category, {
    post_id: props.post.id,
    read_time: props.post.readTime,
    views: props.post.views || 0,
  })
})

// Восстанавливаем скролл body при закрытии модалки
onUnmounted(() => {
  const scrollY = document.body.style.top
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
      <div class="flex-1 overflow-y-auto blog-modal">
        <!-- Close Button -->
        <div class="sticky top-0 bg-blog-card border-b border-border z-10">
          <div class="mx-auto px-10 md:px-[3rem] sm:px-6 lg:px-8 py-4">
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

        <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Breadcrumbs -->
          <div class="text-sm text-text-muted mb-4">
            <span class="cursor-pointer hover:text-text">Главная</span>
            <span class="mx-1">/</span>
            <span class="cursor-pointer hover:text-text">{{
              $props.post.category === 'development' ? 'Разработка' : 'Акция'
            }}</span>
            <span class="mx-1">/</span>
          </div>

          <!-- Main Title -->
          <h1
            class="text-4xl md:text-5xl font-extrabold text-blog-title mb-8 leading-tight font-display"
          >
            {{ $props.post.fullTitle || $props.post.title }}
          </h1>

          <!-- Hero Section -->
          <div class="bg-blog-card rounded-3xl p-8 mb-12 border border-border">
            <div class="flex flex-col lg:flex-row gap-8">
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
                  class="w-full h-64 lg:h-80 object-cover rounded-2xl"
                  :sizes="{ mobile: '100vw', tablet: '66vw', desktop: '66vw' }"
                />
              </div>

              <!-- Summary Card -->
              <div class="lg:w-1/3">
                <div class="bg-blog-card rounded-2xl p-6 shadow-sm border border-border">
                  <h2 class="text-xl font-bold text-blog-title mb-4 font-display">
                    {{ $props.post.fullTitle || $props.post.title }}
                  </h2>
                  <p class="text-blog-muted mb-6 leading-relaxed">
                    {{ $props.post.summary }}
                  </p>

                  <!-- Author -->
                  <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-accent rounded-full"></div>
                    <span class="text-text-muted">{{
                      $props.post.author || 'пользователь-администратор'
                    }}</span>
                  </div>

                  <!-- Metadata -->
                  <div class="flex justify-between text-sm text-text-muted">
                    <span>время: {{ $props.post.readTime }}</span>
                    <span>просмотров: {{ $props.post.views || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="prose prose-lg max-w-none mb-12">
            <div v-for="(section, index) in $props.post.content" :key="index" class="mb-8">
              <h3 class="text-2xl font-bold text-blog-title mb-4 font-display">
                {{ section.heading }}
              </h3>
              <p class="text-blog-muted leading-relaxed">
                {{ section.text }}
              </p>
            </div>
          </div>

          <!-- Internal Links Section -->
          <div class="mb-12 p-6 rounded-2xl border border-border bg-blog-card">
            <h3 class="text-xl font-bold text-blog-title mb-4">Полезные ссылки</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="/services/development/corporate-website"
                  class="text-accent hover:underline"
                >
                  Разработка сайта
                </a>
              </li>
              <li>
                <a href="/services/development/online-store" class="text-accent hover:underline">
                  Интернет‑магазин
                </a>
              </li>
              <li>
                <a href="/services/development/landing-page" class="text-accent hover:underline">
                  Лендинг
                </a>
              </li>
              <li>
                <a href="/services/development/saas-solutions" class="text-accent hover:underline">
                  SaaS‑разработка
                </a>
              </li>
              <li>
                <a href="/services/development/crm-integration" class="text-accent hover:underline">
                  Интеграция с CRM
                </a>
              </li>
            </ul>
          </div>

          <!-- Related Materials -->
          <div class="border-t border-border pt-12">
            <h2 class="text-3xl font-bold text-blog-title text-center mb-8 font-display">
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
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.prose {
  color: var(--color-text-muted);
}

.prose h3 {
  color: var(--color-text);
  font-weight: 700;
  font-family: var(--font-condensed);
}

.prose p {
  color: var(--color-text-muted);
  line-height: 1.7;
}
</style>
