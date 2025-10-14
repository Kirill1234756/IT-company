<script setup lang="ts">
import { defineProps, defineEmits, defineAsyncComponent } from 'vue'
import type { BlogPost, RelatedPost } from '@/types/blog'

const BlogCard = defineAsyncComponent(() => import('../components/BlogCard.vue'))

const props = defineProps<{
  post: BlogPost
  relatedPosts: RelatedPost[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'relatedClick', post: RelatedPost): void
}>()

const handleRelatedClick = (post: RelatedPost) => {
  emit('relatedClick', post)
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
    <div class="min-h-screen bg-white">
      <!-- Close Button -->
      <div class="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div class="max-w-4xl mx-auto px-[8rem] sm:px-6 lg:px-8 py-4">
          <button
            @click="$emit('close')"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumbs -->
        <div class="text-sm text-gray-500 mb-4">
          <span class="cursor-pointer hover:text-gray-700">Главная</span>
          <span class="mx-1">/</span>
          <span class="cursor-pointer hover:text-gray-700">{{
            post.category === 'development' ? 'Разработка' : 'Акция'
          }}</span>
          <span class="mx-1">/</span>
        </div>

        <!-- Main Title -->
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
          {{ post.fullTitle || post.title }}
        </h1>

        <!-- Hero Section -->
        <div class="bg-gray-50 rounded-3xl p-8 mb-12">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Main Image -->
            <div class="lg:w-2/3">
              <img
                v-lazy="post.image"
                :alt="post.title"
                class="w-full h-64 lg:h-80 object-cover rounded-2xl"
              />
            </div>

            <!-- Summary Card -->
            <div class="lg:w-1/3">
              <div class="bg-white rounded-2xl p-6 shadow-sm">
                <h2 class="text-xl font-bold text-gray-900 mb-4">
                  {{ post.fullTitle || post.title }}
                </h2>
                <p class="text-gray-700 mb-6 leading-relaxed">
                  {{ post.summary }}
                </p>

                <!-- Author -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span class="text-gray-600">{{
                    post.author || 'пользователь-администратор'
                  }}</span>
                </div>

                <!-- Metadata -->
                <div class="flex justify-between text-sm text-gray-500">
                  <span>время: {{ post.readTime }}</span>
                  <span>просмотров: {{ post.views || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="prose prose-lg max-w-none mb-12">
          <div v-for="(section, index) in post.content" :key="index" class="mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              {{ section.heading }}
            </h3>
            <p class="text-gray-700 leading-relaxed">
              {{ section.text }}
            </p>
          </div>
        </div>

        <!-- Related Materials -->
        <div class="border-t border-gray-200 pt-12">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Похожие материалы</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlogCard
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.id"
              :post="relatedPost"
              @click="handleRelatedClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: #374151;
}

.prose h3 {
  color: #111827;
  font-weight: 700;
}

.prose p {
  color: #374151;
  line-height: 1.7;
}
</style>
