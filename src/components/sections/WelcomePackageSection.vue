<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useYandexMetrika } from '../../composables/useYandexMetrika'

const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))

defineProps<{
  dataVInspector?: string
}>()

const router = useRouter()
const { trackCtaClick } = useYandexMetrika()

/** Категории и вопросы для блока «Что нужно подготовить клиенту ДО встречи» */
type PrepCategory = { id: string; title: string; questions: string[] }

const prepCategories = markRaw<PrepCategory[]>([
  {
    id: 'business',
    title: 'О бизнесе',
    questions: [
      'Чем вы отличаетесь от конкурентов?',
      'Почему клиент выбирает вас?',
      'Средний чек?',
      'Маржинальность?',
      'География работы?',
    ],
  },
  {
    id: 'audience',
    title: 'О целевой аудитории',
    questions: [
      'Кто ваш идеальный клиент?',
      'Какие у него страхи?',
      'Почему он откладывает покупку?',
    ],
  },
  {
    id: 'competitors',
    title: 'О конкурентах',
    questions: ['3–5 сайтов конкурентов', 'Что нравится / что раздражает', 'Кто лидер рынка?'],
  },
  {
    id: 'goals',
    title: 'О целях',
    questions: ['Зачем вам сайт?', 'Лиды? Имидж? Автоматизация?', 'KPI (если есть)'],
  },
])

const openCategoryId = ref<string | null>(null)
const selectedCategory = () => prepCategories.find((c) => c.id === openCategoryId.value)

function openPrepModal(id: string) {
  openCategoryId.value = id
}

function closePrepModal() {
  openCategoryId.value = null
}

// Блокировка скролла body при открытой модалке (как в BlogModal)
watch(openCategoryId, (id) => {
  if (id) {
    const scrollY = window.scrollY || document.documentElement.scrollTop
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.body.setAttribute('data-prep-modal-scroll-y', String(scrollY))
  } else {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    const saved = document.body.getAttribute('data-prep-modal-scroll-y')
    document.body.removeAttribute('data-prep-modal-scroll-y')
    if (saved) window.scrollTo(0, parseInt(saved, 10) || 0)
  }
})
onUnmounted(() => {
  if (openCategoryId.value) {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    document.body.removeAttribute('data-prep-modal-scroll-y')
  }
})
</script>

<template>
  <section
    class="welcome-packages-section bg-text stack-section no-scrollbar flex flex-col items-start justify-start rounded-t-3xl px-[1rem] pt-3 md:px-[3rem] md:min-h-[700px]"
    style="box-sizing: border-box; contain: layout style paint"
  >
    <div
      class="internal-scroll-container welcome-packages-inner w-full min-h-0 flex flex-1 flex-col items-start justify-start"
    >
      <div class="w-full max-w-7xl mx-auto flex shrink-0 flex-col max-md:w-full md:pb-2">
        <SectionHeading
          :level="2"
          size="md"
          color="bg"
          align="center"
          weight="black"
          animation-class="animate-section-title"
          class="!text-3xl md:!text-4xl mb-6 mt-3"
        >
          Welcome‑пакет для старта проекта
        </SectionHeading>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
          <!-- На мобильном блок «ДО встречи» первым; на lg порядок прежний: навигация слева, карточка справа -->
          <!-- Карточка «Что подготовить ДО встречи» -->
          <div
            class="animate-section-card delay-2 order-1 w-full rounded-[3rem] bg-bg p-5 lg:order-2"
          >
            <div
              class="text-center text-accent font-display font-semibold tracking-wide mb-4 md:mb-6 text-lg md:text-xl"
            >
              Что нужно подготовить клиенту ДО встречи
            </div>
            <div class="grid grid-cols-4 gap-2 md:gap-4">
              <button
                type="button"
                class="col-span-2 rounded-[3rem] !border !border-accent !bg-transparent !text-white min-h-[60px] md:min-h-[100px] flex justify-center items-center hover:!bg-accent hover:!text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="openPrepModal('business')"
              >
                О бизнесе
              </button>
              <button
                type="button"
                class="col-span-2 rounded-[3rem] !border !border-accent !bg-transparent !text-white min-h-[60px] md:min-h-[100px] flex justify-center items-center hover:!bg-accent hover:!text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="openPrepModal('competitors')"
              >
                О конкурентах
              </button>
              <button
                type="button"
                class="col-span-4 rounded-[3rem] !border !border-accent !bg-transparent !text-white min-h-[60px] md:min-h-[100px] flex justify-center items-center hover:!bg-accent hover:!text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="openPrepModal('audience')"
              >
                О целевой аудитории
              </button>
              <button
                type="button"
                class="col-span-1 rounded-[3rem] !border !border-accent !bg-transparent !text-white min-h-[60px] md:min-h-[100px] flex justify-center items-center hover:!bg-accent hover:!text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="openPrepModal('goals')"
              >
                Цели
              </button>
              <button
                type="button"
                class="col-span-3 rounded-[3rem] !bg-accent !text-bg min-h-[60px] md:min-h-[100px] flex justify-center items-center hover:!bg-accent hover:!text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="router.push('/contacts#project-discussion')"
              >
                Обсудить проект
              </button>
            </div>
          </div>

          <!-- Сетка: Пакеты, Кейсы, CTA и т.д. -->
          <div class="order-2 w-full lg:order-1">
            <div class="grid grid-cols-3 gap-[0.45rem] md:gap-4">
              <div
                class="animate-section-card delay-0 rounded-[3rem] bg-bg min-h-[100px] md:min-h-[160px] flex justify-center items-center hover:text-accent hover:border-accent hover:border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="router.push('/packages')"
              >
                <p class="">Пакеты</p>
              </div>
              <div
                class="animate-section-card delay-1 col-span-2 rounded-[3rem] bg-bg min-h-[100px] md:min-h-[160px] flex justify-center items-center hover:text-accent hover:border-accent hover:border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="router.push('/cases')"
              >
                Кейсы
              </div>
              <div
                class="animate-section-card delay-2 col-span-2 rounded-[3rem] bg-bg min-h-[100px] md:min-h-[160px] flex justify-center items-center hover:text-accent hover:border-accent hover:border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                @click="router.push('/blog')"
              >
                Блог
              </div>
              <div
                class="animate-section-card text-center delay-3 min-h-[100px] md:min-h-[160px] grid grid-rows-2 gap-2"
              >
                <div class="rounded-[3rem] bg-purple flex justify-center items-center">
                  Месяц гарантии
                </div>
                <div
                  class="rounded-[3rem] bg-bg flex justify-center items-center hover:text-accent hover:border-accent hover:border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  @click="router.push('/services')"
                >
                  <p class="">Услуги</p>
                </div>
              </div>
              <div
                class="animate-section-cta col-span-3 rounded-[3rem] bg-accent min-h-[60px] md:min-h-[80px] flex justify-center items-center w-full"
              >
                <CtaButton
                  to="/calculator"
                  bgClass="bg-accent"
                  textClass="text-bg"
                  class="!mt-0 text-center pointer"
                  @click="
                    () => trackCtaClick('cta_home_calculator', { location: 'hero_main_section' })
                  "
                >
                  Рассчитать стоимость проекта
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Модалка с вопросами по категории -->
  <Teleport to="body">
    <Transition name="prep-modal">
      <div
        v-if="openCategoryId && selectedCategory()"
        class="prep-modal-root fixed inset-0 z-50 flex items-center justify-center p-4 ios-modal-fix"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'prep-modal-title'"
        @keydown.escape="closePrepModal"
      >
        <div class="prep-modal-backdrop absolute inset-0 bg-black/60" @click="closePrepModal" />
        <div
          class="prep-modal-panel relative w-full max-w-lg rounded-[2rem] bg-[var(--color-bg)] border border-[var(--color-border)] shadow-xl overflow-hidden"
          @click.stop
        >
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]"
          >
            <h3 :id="'prep-modal-title'" class="text-xl font-display font-semibold text-accent">
              {{ selectedCategory()?.title }}
            </h3>
            <button
              type="button"
              class="p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Закрыть"
              @click="closePrepModal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul class="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
            <li
              v-for="(q, i) in selectedCategory()?.questions ?? []"
              :key="i"
              class="flex gap-3 text-[var(--color-text)]"
            >
              <span
                class="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold"
                >{{ i + 1 }}</span
              >
              <span class="pt-0.5">{{ q }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Модалка: появление/исчезновение */
.prep-modal-enter-active .prep-modal-backdrop,
.prep-modal-leave-active .prep-modal-backdrop {
  transition: opacity 0.2s ease;
}

.prep-modal-enter-from .prep-modal-backdrop,
.prep-modal-leave-to .prep-modal-backdrop {
  opacity: 0;
}

.prep-modal-enter-active .prep-modal-panel,
.prep-modal-leave-active .prep-modal-panel {
  transition: opacity 0.22s ease-out, transform 0.22s ease-out;
}

.prep-modal-enter-from .prep-modal-panel,
.prep-modal-leave-to .prep-modal-panel {
  opacity: 0;
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .prep-modal-enter-active .prep-modal-backdrop,
  .prep-modal-leave-active .prep-modal-backdrop,
  .prep-modal-enter-active .prep-modal-panel,
  .prep-modal-leave-active .prep-modal-panel {
    transition-duration: 0s;
  }

  .prep-modal-enter-from .prep-modal-panel,
  .prep-modal-leave-to .prep-modal-panel {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<style>
/* Ослабляем глобальный overflow:hidden только для Welcome на узких экранах */
@media (max-width: 767px) {
  section.welcome-packages-section.stack-section
    > .welcome-packages-inner.internal-scroll-container {
    -webkit-overflow-scrolling: touch;
  }
}
</style>

