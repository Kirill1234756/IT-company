<script setup lang="ts">
import { defineProps, defineEmits, watch, nextTick, defineAsyncComponent, computed } from 'vue'
import { usePortfolioStore } from '../../stores/portfolio'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import OptimizedImage from '../OptimizedImage.vue'

const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))
const { trackPortfolioView } = useYandexMetrika()

const props = defineProps<{
  showModal: boolean
  projectId?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const portfolioStore = usePortfolioStore()

// Мемоизированные данные модального окна
const modalData = computed(() => {
  if (props.projectId) {
    return portfolioStore.getModalDataById(props.projectId)
  }
  return null
})

// Мемоизированные данные для карточек
const cardData = computed(() => modalData.value?.card || [])
const textData = computed(() => modalData.value?.text || [])
const heroImage = computed(() => modalData.value?.img || '')
const bottomImage = computed(() => modalData.value?.bottomImg || '')

const handleClose = () => {
  emit('close')
}

// Обработка клавиши Escape для закрытия модального окна
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.showModal) {
    handleClose()
  }
}

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden' // Запретить прокрутку фона
      document.body.classList.add('portfolio-modal-open') // Добавляем класс для скрытия Footer и кнопок
      document.addEventListener('keydown', handleKeydown)

      nextTick(() => {
        // Отслеживаем открытие модального окна портфолио
        if (modalData.value) {
          // Получаем название проекта из store
          const project = portfolioStore.projects.find((p) => p.id === props.projectId)
          const projectTitle = project?.title || 'Portfolio Project'

          trackPortfolioView(projectTitle, {
            project_id: props.projectId ?? -1,
            project_title: projectTitle,
            has_hero_image: modalData.value.img ? 'yes' : 'no',
            cards_count: modalData.value.card?.length || 0,
            text_sections_count: modalData.value.text?.length || 0,
          })
        }

        // Опционально: добавьте анимацию GSAP для входа модального окна, если нужно
        // gsap.fromTo(".modal-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      })
    } else {
      document.body.style.overflow = '' // Восстановить прокрутку фона
      document.body.classList.remove('portfolio-modal-open') // Убираем класс
      document.removeEventListener('keydown', handleKeydown)
    }
  }
)
</script>

<template>
  <!-- Project Modal - Full page content as per image -->
  <div
    v-if="showModal && modalData"
    class="fixed inset-0 z-50 bg-info overflow-y-auto px-4 md:px-8 lg:px-[5rem]"
    @click="handleClose"
  >
    <div @click.stop class="modal-content w-full min-h-full">
      <!-- Close Buttons -->
      <!-- Right top corner close button -->

      <!-- Main Content Area -->
      <div class="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8 lg:py-12">
        <!-- Breadcrumbs and Title -->
        <Breadcrumbs
          :items="[
            { label: 'Главная', to: '/' },
            { label: 'Портфолио', to: '/cases' },
            { label: 'Бизнес сайт' },
          ]"
          class="mb-2 md:mb-4"
        />
        <h1
          class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 md:mb-6 font-display flex items-center justify-between"
        >
          о
          <button
            @click="handleClose"
            class="ml-2 md:ml-4 w-8 h-8 md:w-10 md:h-10 bg-accent hover:bg-purple rounded-full flex items-center justify-center transition-colors duration-200"
            title="Закрыть"
            aria-label="Закрыть модальное окно"
          >
            <svg
              class="w-4 h-4 md:w-5 md:h-5 text-border"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </h1>

        <!-- Hero Image/Mockup Section -->
        <div
          class="rounded-2xl md:rounded-3xl mb-6 md:mb-8 lg:mb-12 flex justify-center items-center relative overflow-hidden"
          style="aspect-ratio: 16/9; min-height: min(200px, 40vw)"
        >
          <!-- Background gradient and texture -->

          <!-- This image should ideally contain the monitor, desk, lamp, plant, and chair as one asset -->
          <OptimizedImage
            :src="heroImage"
            alt="Computer Mockup"
            :width="1200"
            :height="675"
            :widths="[800, 1200, 1600]"
            format="webp"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            class="w-full h-auto object-contain"
            :sizes="{ mobile: '100vw', tablet: '100vw', desktop: '100vw' }"
          />
        </div>

        <!-- Three Cards Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-12">
          <div
            v-for="item in cardData"
            :key="item.id"
            class="border border-accent/30 rounded-2xl md:rounded-[3rem] p-4 md:p-6"
          >
            <h3 class="text-lg md:text-xl font-bold text-border mb-2 md:mb-3 font-display">
              {{ item.title }}
            </h3>
            <p class="text-success text-xs md:text-sm leading-relaxed font-sans">
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- What was done Section -->
        <h2 class="text-2xl md:text-3xl font-bold text-border mb-4 md:mb-6 lg:mb-8 font-display">
          Что было сделанно
        </h2>
        <div class="flex flex-col gap-6 md:gap-8 lg:gap-12 mb-6 md:mb-8 lg:mb-12">
          <div
            v-for="item in textData"
            :key="item.id"
            class="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8"
          >
            <h3
              class="text-lg md:text-xl font-bold text-border font-display md:flex-shrink-0 md:w-32"
            >
              {{ item.title }}
            </h3>
            <p
              class="text-success leading-relaxed font-sans text-sm md:text-base text-justify md:text-left flex-1"
            >
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- Bottom Image Section (if available) -->
        <div
          v-if="bottomImage"
          class="rounded-2xl md:rounded-3xl mb-6 md:mb-8 lg:mb-12 flex justify-center items-center relative overflow-hidden"
          style="aspect-ratio: 16/9; min-height: min(200px, 40vw)"
        >
          <OptimizedImage
            :src="bottomImage"
            alt="Project Additional View"
            :width="1200"
            :height="675"
            :widths="[800, 1200, 1600]"
            format="webp"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            class="w-full h-auto object-contain"
            :sizes="{ mobile: '100vw', tablet: '100vw', desktop: '100vw' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for modal */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--color-border);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-purple);
}
</style>

<style>
/* Скрываем Footer и плавающие кнопки когда открыта модалка портфолио */
body.portfolio-modal-open footer,
body.portfolio-modal-open footer button,
body.portfolio-modal-open a[aria-label='Написать в Telegram'] {
  display: none !important;
}
</style>
