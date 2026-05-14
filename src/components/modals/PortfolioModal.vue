<script setup lang="ts">
import { defineProps, defineEmits, watch, nextTick, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '../../stores/portfolio'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import OptimizedImage from '../OptimizedImage.vue'

const Breadcrumbs = defineAsyncComponent(() => import('../ui/Breadcrumbs.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
const ContactSection = defineAsyncComponent(() => import('../sections/ContactSection.vue'))
const Footer = defineAsyncComponent(() => import('../../pages/Footer.vue'))
const { trackPortfolioView, trackButtonClick } = useYandexMetrika()

const router = useRouter()

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
const technologies = computed(() => modalData.value?.technologies ?? [])

const portfolioBreadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Кейсы', to: '/cases' },
  { label: modalData.value?.title || 'Проект' },
])

const goOrder = () => {
  const project = props.projectId != null ? portfolioStore.getProjectById(props.projectId) : null
  const title = project?.title ?? modalData.value?.title ?? ''
  const slug = project ? portfolioStore.getProjectSlug(project.title) : ''
  trackButtonClick('portfolio-modal-order', {
    project_id: props.projectId ?? -1,
    title,
    case_slug: slug,
  })
  router.push({
    path: '/contacts',
    hash: '#project-discussion',
    query: {
      ...(slug ? { case: slug } : {}),
      ...(title ? { caseTitle: title } : {}),
    },
  })
}

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
            technologies_count: modalData.value.technologies?.length ?? 0,
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
      class="fixed inset-0 z-50 flex flex-col ios-modal-fix bg-black/50 backdrop-blur-[2px]"
      @click="handleClose"
    >
      <div
        class="flex-1 overflow-y-auto bg-[var(--color-bg)] text-[var(--color-text)] min-h-0"
        style="-webkit-overflow-scrolling: touch"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 bg-[rgba(3,18,47,0.95)] border-b border-[var(--color-border)] backdrop-blur-[10px]"
        >
          <div
            class="max-w-7xl mx-auto px-[1rem] md:px-[3rem] py-4 flex flex-wrap items-center justify-between gap-3"
          >
            <button
              type="button"
              class="flex items-center gap-2 text-accent hover:text-text transition-colors"
              aria-label="Закрыть модальное окно портфолио"
              @click="handleClose"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Назад к кейсам
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center px-5 py-2.5 rounded-[3rem] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-95 transition-opacity"
              @click="goOrder"
            >
              Оставить заявку
            </button>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-[1rem] md:px-[3rem] pb-16">
          <Breadcrumbs :items="portfolioBreadcrumbItems" class="mb-8" />

          <SectionHeading
            :level="1"
            size="lg"
            color="accent"
            align="center"
            weight="black"
            animation-class="animate-cases-title"
            class="mb-4 md:mb-6 lg:mb-8"
          >
            {{ modalData.title }}
          </SectionHeading>

          <p
            v-if="modalData.description"
            class="mb-8 text-accent max-w-3xl mx-auto text-center text-base md:text-lg leading-relaxed px-2"
          >
            {{ modalData.description }}
          </p>

          <!-- Технологии -->
          <div v-if="technologies.length" class="mb-12">
            <h2 class="text-xl font-bold mb-6 font-display text-[var(--color-accent)]">
              Технологии и инструменты
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tech, idx) in technologies"
                :key="idx"
                class="inline-flex items-center px-4 py-2 rounded-[3rem] text-sm font-medium border border-[var(--color-border)] bg-[rgba(3,18,47,0.85)] text-[var(--color-text)] hover:border-[var(--color-accent)]/40 transition-colors"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Hero: как в BlogModal — без фиксированного 16:9, вертикальные макеты не обрезаются -->
          <div
            class="w-full mb-12 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[#050a1b] flex items-start justify-center"
          >
            <OptimizedImage
              layout="intrinsic"
              :src="heroImage"
              :alt="modalData.title || 'Изображение проекта'"
              :width="1200"
              :height="800"
              :widths="[800, 1200, 1600]"
              format="webp"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="w-full max-w-full h-auto max-h-[min(88vh,960px)] object-contain object-top"
              :sizes="{ mobile: '100vw', tablet: '100vw', desktop: '100vw' }"
            />
          </div>

          <!-- Карточки: о проекте, проблема, цель -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div
              v-for="item in cardData"
              :key="item.id"
              class="rounded-[3rem] p-6 md:p-8 border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
            >
              <h3 class="text-base font-bold mb-3 font-display text-[var(--color-accent)]">
                {{ item.title }}
              </h3>
              <p class="text-sm leading-relaxed text-[var(--color-text)]">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- Что было сделано -->
          <div v-if="textData.length" class="mb-12">
            <h2 class="text-xl font-bold mb-8 font-display text-[var(--color-accent)]">
              Что было сделано
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="item in textData"
                :key="item.id"
                class="rounded-[3rem] p-6 md:p-8 relative overflow-hidden border border-[var(--color-border)] bg-[rgba(3,18,47,0.8)]"
              >
                <h3 class="text-base font-bold mb-3 font-display text-[var(--color-accent)]">
                  {{ item.title }}
                </h3>
                <p class="text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Дополнительное изображение — тот же паттерн, что и герой в BlogModal -->
          <div
            v-if="bottomImage"
            class="w-full mb-12 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[#050a1b] flex items-start justify-center"
          >
            <OptimizedImage
              layout="intrinsic"
              :src="bottomImage"
              :alt="modalData.title || 'Дополнительный вид проекта'"
              :width="1200"
              :height="800"
              :widths="[800, 1200, 1600]"
              format="webp"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="w-full max-w-full h-auto max-h-[min(88vh,960px)] object-contain object-top"
              :sizes="{ mobile: '100vw', tablet: '100vw', desktop: '100vw' }"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-start sm:justify-start pb-4">
            <button
              type="button"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded-[3rem] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-95 transition-opacity"
              @click="goOrder"
            >
              Обсудить похожий проект
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded-[3rem] border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-sm hover:border-[var(--color-accent)]/50 transition-colors"
              @click="handleClose"
            >
              Закрыть
            </button>
          </div>
        </div>

        <ContactSection />
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

@supports (-webkit-touch-callout: none) {
  body:has(.ios-modal-fix) {
    position: fixed;
    width: 100%;
    overflow: hidden;
  }
}
</style>
