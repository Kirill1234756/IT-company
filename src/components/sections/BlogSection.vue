<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  shallowRef,
  ref,
  nextTick,
  onMounted,
  onUnmounted,
} from 'vue'
import { useBlogStore } from '../../stores/blog'
import { useRoute } from 'vue-router'
import { debounce } from '../../utils/performance'
import type { BlogPost } from '../../types/blog'
import FilterButtons from '../FilterButtons.vue'

const BlogCard = defineAsyncComponent(() => import('../BlogCard.vue'))

const blogStore = useBlogStore()
const route = useRoute()

// Filter state with shallowRef for better performance
const activeTab = shallowRef('all')

// Реактивное отслеживание размера экрана для определения количества карточек
const isMobile = ref(false)

// Функция для обновления состояния мобильного устройства
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

// Определяем, находимся ли мы на главной странице
// На главной странице route.path === '/', на отдельной странице '/blog'
const isOnHomePage = computed(() => {
  if (typeof window === 'undefined') return false
  return route.path === '/' || route.path === '/home'
})

// Ограничение для главной страницы - показываем разное количество в зависимости от устройства
// На десктопе: 6 карточек
// На мобильных: 3 карточки
const maxItemsOnHomePage = computed(() => {
  return isMobile.value ? 3 : 6
})

const showAllItems = ref(false)

// Define emits
const emit = defineEmits<{
  (e: 'postClick', post: BlogPost): void
}>()

// Memoized filtered posts with better caching
const filteredPosts = computed(() => {
  return blogStore.getPostsByCategory(activeTab.value)
})

// Вычисляем, какие посты показывать
const displayedPosts = computed(() => {
  // Если не на главной странице или уже показаны все - показываем все
  if (!isOnHomePage.value || showAllItems.value) {
    return filteredPosts.value
  }
  // На главной странице показываем ограниченное количество карточек (3 на мобильных, 6 на десктопе)
  return filteredPosts.value.slice(0, maxItemsOnHomePage.value)
})

// Проверяем, есть ли скрытые посты
const hasMoreItems = computed(() => {
  return (
    isOnHomePage.value &&
    filteredPosts.value.length > maxItemsOnHomePage.value &&
    !showAllItems.value
  )
})

// Функция для показа всех постов
const showMore = async () => {
  showAllItems.value = true
  // Плавная прокрутка к новым постам после небольшой задержки
  await nextTick()
  setTimeout(() => {
    const grid = document.querySelector('.blog-grid')
    if (grid) {
      const firstNewPost = grid.querySelector(
        `.blog-card:nth-child(${maxItemsOnHomePage.value + 1})`
      )
      if (firstNewPost) {
        firstNewPost.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, 100)
}

// Debounced tab switching for better performance
const debouncedSetTab = debounce(
  ((tabId: string) => {
    activeTab.value = tabId
    // Сбрасываем показ всех элементов при смене категории
    showAllItems.value = false
  }) as unknown as (...args: unknown[]) => unknown,
  100
)

// Handle post click
const handlePostClick = (post: BlogPost) => {
  emit('postClick', post)
}

// Set tab with debouncing
const setTab = (tabId: string) => {
  debouncedSetTab(tabId)
}

// Оранжевые цвета как в портфолио
const filterButtonColors = {
  bg: '!bg-accent',
  border: 'border-rose-custom',
  hover: 'hover:bg-[#ae70ac] hover:border-[#ae70ac]',
  inner: 'bg-[#ae70ac]',
  text: 'text-white',
}

// Обработчик изменения фильтра
const handleFilterChange = (value: string) => {
  debouncedSetTab(value)
}

// Инициализация и очистка обработчика изменения размера окна
onMounted(() => {
  // Инициализируем определение мобильного устройства
  updateIsMobile()

  // Отслеживаем изменения размера окна
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile)
  }
})

onUnmounted(() => {
  // Удаляем обработчик изменения размера окна
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }
})
</script>

<template>
  <div class="w-full mb-20">
    <!-- Main Title -->
    <h1
      class="title no-title-effects text-center text-3xl md:text-4xl font-black tracking-tight mb-8 text-accent opacity-100"
    >
      Блог
    </h1>

    <!-- Category Tabs -->
    <FilterButtons
      :items="blogStore.tabs.map(tab => ({ label: tab.name, value: tab.id }))"
      :model-value="activeTab"
      :colors="filterButtonColors"
      container-class="mb-12"
      @update:model-value="handleFilterChange"
    />

    <!-- Blog Posts Grid with v-memo optimization -->
    <div class="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogCard
        v-for="post in displayedPosts"
        :key="post.id"
        v-memo="[post.id, activeTab]"
        class="blog-card"
        :post="post"
        @click="handlePostClick"
      />
    </div>

    <!-- Show More Button (только на главной странице) -->
    <div v-if="hasMoreItems" class="flex justify-center mt-8 md:mt-12">
      <button
        @click="showMore"
        class="group flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-accent text-bg font-semibold text-sm md:text-base hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <span>Показать больше</span>
        <svg
          class="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-y-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Blog section specific styles */
.text-blog-title {
  color: #6366f1;
}

.bg-blog-title {
  background-color: #6366f1;
}

/* Performance optimizations */
.grid {
  contain: layout;
}

/* will-change удален - не нужен для статических элементов */
</style>
