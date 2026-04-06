<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, defineAsyncComponent, markRaw } from 'vue'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import { yieldToMain } from '../../utils/performance' // Используется в animateCounters

const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))

const { trackCtaClick } = useYandexMetrika()

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

// Ref для корневого элемента секции
const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

// Memoized stats data - используем ref для полной реактивности
const stats = ref([
  { title: 'Опыт веб-разработки', count: 0, target: 7 },
  { title: 'Лучшие специалисты', count: 0, target: 13 },
  { title: 'Успешные проекты', count: 0, target: 160 },
])

// Memoized animation data with markRaw for static content
const firstColumnData = markRaw([
  {
    title: 'Веб-разработка',
    subtitle: 'Современные сайты и приложения',
    color: 'bg-purple-600',
    textColor: 'text-purple-100',
  },
  {
    title: 'Мобильные приложения',
    subtitle: 'iOS и Android ',
    color: 'bg-blue-600',
    textColor: 'text-blue-100',
  },
  {
    title: 'E-commerce',
    subtitle: 'Интернет-магазины и платформы',
    color: 'bg-green-600',
    textColor: 'text-green-100',
  },
  {
    title: 'UI/UX Дизайн',
    subtitle: 'Современный пользовательский опыт',
    color: 'bg-red-600',
    textColor: 'text-red-100',
  },
  {
    title: 'Маркетинг',
    subtitle: 'Цифровые стратегии продвижения',
    color: 'bg-yellow-600',
    textColor: 'text-yellow-100',
  },
])

const secondColumnData = markRaw([
  {
    title: 'Аналитика',
    subtitle: 'Глубокий анализ данных',
    color: 'bg-indigo-600',
    textColor: 'text-indigo-100',
  },
  {
    title: 'Автоматизация',
    subtitle: 'Оптимизация бизнес-процессов',
    color: 'bg-teal-600',
    textColor: 'text-teal-100',
  },
  {
    title: 'Консалтинг',
    subtitle: 'Стратегическое планирование',
    color: 'bg-orange-600',
    textColor: 'text-orange-100',
  },
  {
    title: 'Поддержка',
    subtitle: 'Техническая поддержка 24/7',
    color: 'bg-pink-600',
    textColor: 'text-pink-100',
  },
  {
    title: 'Интеграции',
    subtitle: 'Связывание различных систем',
    color: 'bg-cyan-600',
    textColor: 'text-cyan-100',
  },
])

// keep data referenced to avoid unused warnings (reserved for future animations)
;(() => {
  void firstColumnData
  void secondColumnData
})()

// Counter animation logic using requestAnimationFrame - оптимизировано для мобильных
const isCounterAnimationStarted = ref(false)

const animateCounters = () => {
  if (isCounterAnimationStarted.value) return
  isCounterAnimationStarted.value = true

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    stats.value.forEach((stat) => {
      stat.count = stat.target
    })
    return
  }

  // Используем yieldToMain для разбиения работы на чанки и снижения TBT
  void yieldToMain().then(() => {
    stats.value.forEach((stat, index) => {
      const startTime = Date.now() + index * 150
      const duration = 2500
      const startValue = 0
      const endValue = stat.target

      const animate = () => {
        const elapsed = Date.now() - startTime
        if (elapsed < 0) {
          requestAnimationFrame(animate)
          return
        }

        const progress = Math.min(elapsed / duration, 1)
        // Easing function: easeOut
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress)

        if (stat.count !== currentValue) {
          stat.count = currentValue
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          stat.count = endValue
        }
      }

      requestAnimationFrame(animate)
    })
  })
}

// Initialize animations when component mounts - оптимизировано для мобильных
onMounted(() => {
  // Проверяем prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // На мобильных отключаем анимацию счетчиков полностью для предотвращения CLS
  if (prefersReducedMotion || isMobile) {
    stats.value.forEach((stat) => {
      stat.count = stat.target
    })
  } else {
    // На десктопе запускаем анимацию после LCP используя requestIdleCallback или scheduler
    // Задержка 3-5 секунд для гарантии, что LCP уже произошел
    const animationDelay = 4000

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        setTimeout(() => {
          void animateCounters()
        }, animationDelay)
      }, { timeout: animationDelay + 1000 })
    } else {
      const win = window as Window & { scheduler?: { postTask: (callback: () => void, options?: { priority?: string; delay?: number }) => Promise<void> } }
      if (win.scheduler?.postTask) {
        win.scheduler.postTask(() => {
          setTimeout(() => {
            void animateCounters()
          }, animationDelay)
        }, { priority: 'background', delay: animationDelay })
      } else {
        setTimeout(() => {
          void animateCounters()
        }, animationDelay)
      }
    }
  }

  // Обработчики wheel удалены - используем чистый CSS scroll-snap
  // .internal-scroll-container имеет overflow: hidden, поэтому скролл происходит только на уровне страницы
})

// Очистка при размонтировании компонента
onBeforeUnmount(() => {
  // Сбрасываем флаг
  isCounterAnimationStarted.value = false
})
</script>

<style scoped>
/* Скрываем элементы с bg-error до инициализации анимаций */
.main-section [class*='bg-error'] {
  contain: layout style paint;
}

/* Плавные переходы для интерактивных элементов - используем только transform и opacity для GPU */
.main-section [class*='bg-error']:hover {
  transition: transform 0.3s ease, opacity 0.3s ease;
  will-change: transform, opacity;
}

/* Оптимизация для счетчиков */
.main-section [class*='bg-error'] p[class*='text-2xl'],
.main-section [class*='bg-error'] p[class*='text-3xl'] {
  font-variant-numeric: tabular-nums; /* Предотвращает скачки при изменении чисел */
  /* Резервируем место для максимального числа (999+) */
  min-width: 4ch;
  text-align: center;
}

/* Предотвращаем CLS при анимации счетчиков */
.main-section-stat-card {
  /* Резервируем место для контента */
  min-height: 100px;
  height: 100px;
  contain: layout style paint;
  /* Фиксируем размеры для предотвращения CLS */
  position: relative;
  overflow: hidden;
}

/* Фиксируем размеры текста в карточках */
.main-section-stat-card p {
  width: 100%;
  text-align: center;
  contain: layout style;
}

/* Обеспечиваем видимость кнопки калькулятора на всех устройствах после анимации */
.main-section-cta {
  display: flex;
  position: relative;
  z-index: 10;
}

.main-section-cta button {
  opacity: 1;
  visibility: visible;
  display: block;
}
</style>

<template>
  <!-- Main Hero Section -->
  <section
    ref="rootEl"
    class="stack-section main-section no-scrollbar h-screen flex items-start justify-center bg-bg text-white relative gap-6 md:gap-10 w-full [contain:layout_style_paint]"
  >
    <div
      class="internal-scroll-container w-full h-full flex flex-col min-h-full"
      ref="scrollContainerRef"
    >
      <div
        class="flex flex-col w-full md:w-7/8 gap-6 md:gap-8 max-w-7xl mx-auto"
      >
        <div
          class="flex !w-full justify-center  mb-5"
        >
          <SectionHeading
            :level="1"
            size="md"
            align="center"
            color="accent"
            weight="bold"
            animation-class="hero-animate-title"
            class="text-condense main-section-title !text-3xl md:!text-4xl w-full"
          >
            Цифровые продукты, которые растят выручку вашего бизнеса
          </SectionHeading>
        </div>

        <div class="flex flex-col md:flex-row md:justify-start gap-6 md:gap-10">
          <div
            class="flex flex-col gap-6 md:gap-10 w-full md:flex-shrink-0 md:flex-grow-0 items-start "
          >
            <div
              class="hero-animate-desc flex justify-center items-center p-6 md:p-10 bg-error text-white rounded-[3rem] md:w-[62.5%] w-full main-section-description text-center"
              style=""
            >
              <p class="text-center">
                Проектируем и запускаем сайты, сервисы и CRM-решения под задачи вашего бизнеса:
                от аналитики и UX до разработки и маркетинга с измеримыми результатами.
              </p>
            </div>
            <!-- На мобильных: первые 2 карточки рядом, третья внизу по центру -->
            <!-- На десктопе: все 3 карточки в ряд -->
            <div
              class="flex flex-row md:flex-row justify-center md:justify-end gap-2 md:gap-6 w-full  [contain:layout_style_paint]"
            >
              <!-- Первые 2 карточки - всегда в ряд -->
              <div
                v-for="(stat, index) in stats.slice(0, 2)"
                :key="stat.title"
                :class="[
                  'hero-animate-card',
                  'hero-card-' + (index + 1),
                  'flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] w-[calc(50%-0.25rem)] md:w-full max-w-[200px] main-section-stat-card text-center shrink-0',
                ]"
              >
                <p
                  class="text-xs md:text-sm text-gray-300 text-center"
                >
                  {{ stat.title }}
                </p>

                <p
                  class="text-2xl md:text-3xl font-black text-white  m-0 min-h-[40px] leading-[1.2] w-full text-center tabular-nums"
                >
                  <span class="inline-block min-w-[3ch] text-center">
                    {{ stat.count.toString().padStart(3, '0') }}
                  </span>
                  +
                </p>
              </div>

              <!-- Третья карточка - только на десктопе в ряд -->
              <div
                v-for="stat in stats.slice(2)"
                :key="stat.title"
                class="hero-animate-card hero-card-3 hidden md:flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] md:w-full max-w-[200px] main-section-stat-card text-center  shrink-0"
              >
                <p
                  class="text-xs md:text-sm text-gray-300 text-center  m-0 min-h-[20px]"
                >
                  {{ stat.title }}
                </p>

                <p
                  class="text-2xl md:text-3xl font-black text-white  m-0 min-h-[40px] leading-[1.2] w-full text-center tabular-nums"
                >
                  <span class="inline-block min-w-[3ch] text-center">
                    {{ stat.count.toString().padStart(3, '0') }}
                  </span>
                  +
                </p>
              </div>
            </div>

            <!-- Третья карточка - только на мобильных внизу по центру -->
            <div
              class="flex md:hidden justify-center w-full  min-h-[120px] mt-2"
            >
              <div
                v-for="stat in stats.slice(2)"
                :key="stat.title"
                class="hero-animate-card hero-card-3 flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] w-1/2 md:w-full max-w-[200px] main-section-stat-card text-center shrink-0"
              >
                <p
                  class="text-xs md:text-sm text-gray-300 text-center  m-0 min-h-[20px]"
                >
                  {{ stat.title }}
                </p>

                <p
                  class="text-2xl md:text-3xl font-black text-white  m-0 min-h-[40px] leading-[1.2] w-full text-center tabular-nums"
                >
                  <span class="inline-block min-w-[3ch] text-center">
                    {{ stat.count.toString().padStart(3, '0') }}
                  </span>
                  +
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="hero-animate-cta flex justify-center items-center w-full main-section-cta flex-shrink-0  min-h-[60px] pb-6"
        >
          <CtaButton
            to="/calculator"
            bgClass="bg-accent"
            textClass="text-bg"
            @click="() => trackCtaClick('cta_home_calculator', { location: 'hero_main_section' })"
          >
            Рассчитать стоимость проекта
          </CtaButton>
        </div>
      </div>
    </div>
  </section>
</template>
