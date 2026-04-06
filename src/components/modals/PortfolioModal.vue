<script setup lang="ts">
import { defineProps, defineEmits, watch, nextTick, defineAsyncComponent, computed } from 'vue'
import { usePortfolioStore } from '../../stores/portfolio'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import OptimizedImage from '../OptimizedImage.vue'

const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
const ContactSection = defineAsyncComponent(() => import('../sections/ContactSection.vue'))
const Footer = defineAsyncComponent(() => import('../../pages/Footer.vue'))
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
      // Блокируем скролл body (как в BlogModal)
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100%'
      document.body.style.overscrollBehavior = 'none'
      document.body.setAttribute('data-scroll-y', scrollY.toString())

      document.addEventListener('keydown', handleKeydown)

      nextTick(() => {
        if (modalData.value) {
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
      })
    } else {
      // Восстанавливаем скролл body
      const scrollY = document.body.getAttribute('data-scroll-y') || document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.overscrollBehavior = ''
      document.body.removeAttribute('data-scroll-y')

      if (scrollY) {
        const scrollValue =
          typeof scrollY === 'string' && scrollY.startsWith('-')
            ? parseInt(scrollY.replace('-', ''))
            : parseInt(scrollY) || 0
        window.scrollTo(0, scrollValue)
      }

      document.removeEventListener('keydown', handleKeydown)
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showModal && modalData"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col ios-modal-fix"
      @click="handleClose"
    >
      <div
        class="flex-1 overflow-y-auto bg-[var(--color-bg)] text-[var(--color-text)]"
        style="-webkit-overflow-scrolling: touch"
        @click.stop
      >
        <!-- Header with Back button -->
        <div
          class="sticky top-0 border-b border-[var(--color-border)] z-10 bg-[rgba(3,18,47,0.95)] backdrop-blur-[10px]"
        >
          <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem] py-4">
            <button
              @click="handleClose"
              class="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
              aria-label="Закрыть модальное окно портфолио"
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

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem]">
          <!-- Breadcrumbs and Title -->
          <Breadcrumbs
            :items="[
              { label: 'Главная', to: '/' },
              { label: 'Кейсы', to: '/cases' },
              { label: modalData?.title || 'Проект' },
            ]"
            class="mb-4"
          />

          <SectionHeading
            :level="1"
            size="lg"
            color="accent"
            align="center"
            weight="black"
            class="mb-8 font-display text-condense"
          >
            {{ modalData?.title || 'Проект из портфолио' }}
          </SectionHeading>
           <SectionHeading
        :level="1"
        size="md"
        color="accent"
        align="center"
        weight="black"
        animation-class="animate-cases-title"
        class="mb-4 md:mb-6 lg:mb-8"
      >
        Услуги
      </SectionHeading>

          <!-- Hero Image Section -->
          <div
            class="rounded-3xl mb-10 flex justify-center items-center overflow-hidden bg-[rgba(3,18,47,0.95)] border border-[var(--color-border)]"
            style="aspect-ratio: 16/9; min-height: min(220px, 45vw)"
          >
            <OptimizedImage
              :src="heroImage"
              :alt="modalData?.title || 'Изображение проекта'"
              :width="1200"
              :height="675"
              :widths="[800, 1200, 1600]"
              format="webp"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="w-full h-full object-contain"
              :sizes="{ mobile: '100vw', tablet: '100vw', desktop: '100vw' }"
            />
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div
              v-for="item in cardData"
              :key="item.id"
              class="rounded-[2rem] p-6 border border-[var(--color-border)] bg-[rgba(3,18,47,0.95)] backdrop-blur-[10px]"
            >
              <h3 class="text-lg md:text-xl font-bold mb-3 font-display text-[var(--color-accent)]">
                {{ item.title }}
              </h3>
              <p class="text-sm md:text-md leading-relaxed text-white">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- What was done Section -->
          <h2
            class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-display text-[var(--color-accent)]"
          >
            Что было сделано
          </h2>
          <div class="flex flex-col gap-6 md:gap-10 mb-8 md:mb-12">
            <div v-for="item in textData" :key="item.id" class="flex flex-col gap-4">
              <h3
                class="text-lg md:text-xl font-bold font-display text-[var(--color-accent)] md:flex-shrink-0 md:w-48"
              >
                {{ item.title }}
              </h3>
              <p class="text-sm md:text-md leading-relaxed text-white flex-1">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- Bottom Image Section (if available) -->
          <div
            v-if="bottomImage"
            class="rounded-3xl mb-12 flex justify-center items-center overflow-hidden bg-[rgba(3,18,47,0.95)] border border-[var(--color-border)]"
            style="aspect-ratio: 16/9; min-height: min(220px, 45vw)"
          >
            <OptimizedImage
              :src="bottomImage"
              :alt="modalData?.title || 'Дополнительный вид проекта'"
              :width="1200"
              :height="675"
              :widths="[800, 1200, 1600]"
              format="webp"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="w-full h-full object-contain"
              :sizes="{ mobile: '100vw', tablet: '100vw', desktop: '100vw' }"
            />
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
/* Custom scrollbar for modal content */
.ios-modal-fix::-webkit-scrollbar {
  width: 8px;
}

.ios-modal-fix::-webkit-scrollbar-track {
  background: var(--color-border);
  border-radius: 4px;
}

.ios-modal-fix::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 4px;
}

.ios-modal-fix::-webkit-scrollbar-thumb:hover {
  background: var(--color-purple);
}
</style>

<style>
/* iOS fix для модальных окон */
.ios-modal-fix {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: -webkit-fill-available;
  height: 100vh;
  height: 100dvh;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
</style>
