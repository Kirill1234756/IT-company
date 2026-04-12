<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, defineAsyncComponent, markRaw } from 'vue'
import { useYandexMetrika } from '../../composables/useYandexMetrika'
import { yieldToMain } from '../../utils/performance' // Используется в animateCounters

const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))
const SectionHeading = defineAsyncComponent(() => import('../ui/SectionHeading.vue'))

const { trackCtaClick } = useYandexMetrika()

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

type MainVisualVariant = 'mesh' | 'photo'
const MAIN_VISUAL_AB_KEY = 'ab_main_visual_v1'

const getMainVisualVariant = (): MainVisualVariant => {
  if (typeof window === 'undefined') return 'mesh'

  // На мобильных всегда показываем фото (A/B только для больших экранов)
  if (window.innerWidth < 768) return 'photo'

  const url = new URL(window.location.href)
  const forced = url.searchParams.get('ab_main_visual')
  if (forced === 'photo' || forced === 'mesh') return forced

  const stored = window.localStorage.getItem(MAIN_VISUAL_AB_KEY)
  if (stored === 'photo' || stored === 'mesh') return stored

  const assigned: MainVisualVariant = Math.random() < 0.5 ? 'mesh' : 'photo'
  window.localStorage.setItem(MAIN_VISUAL_AB_KEY, assigned)
  return assigned
}

const mainVisualVariant = ref<MainVisualVariant>('mesh')

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
  mainVisualVariant.value = getMainVisualVariant()

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
.main-section [class*='bg-error'] p.tabular-nums {
  font-variant-numeric: tabular-nums; /* Предотвращает скачки при изменении чисел */
  /* Резервируем место для максимального числа (999+) */
  min-width: 4ch;
  text-align: center;
}

/* Предотвращаем CLS при анимации счетчиков */
.main-section-stat-card {
  /* ~80% от прежних 80px — как визуал при zoom 80% при 100% масштабе браузера */
  min-height: 64px;
  height: 64px;
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

/* CtaButton по умолчанию с mt-6/py-3 — в hero ужимаем под «как при 80% zoom» */
.main-section-cta :deep(button) {
  margin-top: 0;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1.35rem;
  padding-right: 1.35rem;
  font-size: 0.8125rem;
  min-height: 2.25rem;

}

/* Правый блок: «glass card» — мягкое свечение, градиентная обводка, без clip-path */
.main-visual-panel {
  box-shadow:
    0 0 0 1px color-mix(in oklab, white 8%, transparent),
    0 20px 50px -18px color-mix(in oklab, var(--color-success) 35%, transparent),
    0 0 70px -24px color-mix(in oklab, var(--color-purple) 28%, transparent);
}

.main-visual-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 6;
  border-radius: inherit;
  pointer-events: none;
  padding: 1px;
  background: linear-gradient(
    130deg,
    color-mix(in oklab, white 24%, transparent),
    transparent 38%,
    color-mix(in oklab, var(--color-success) 30%, transparent) 72%,
    color-mix(in oklab, var(--color-accent) 18%, transparent)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.main-visual-panel__noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/*
 * Квадрат в правой колонке: Tailwind `w-full` + flex/grid давали ширину 100% колонки
 * и ломали aspect-ratio. Размер = min(ширина ячейки, высота строки) через container query.
 */
@media (min-width: 768px) {
  .main-visual-host {
    /* standard: https://developer.mozilla.org/en-US/docs/Web/CSS/container-type */
    container-type: size;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  .main-visual-panel.main-visual-panel--desktop-square {
    flex: 0 0 auto;
    align-self: center;
    box-sizing: border-box;
    width: 85%;
    max-width: 100%;
    aspect-ratio: 1;
    height: auto;
  }
}

@supports not (width: 1cqw) {
  @media (min-width: 768px) {
    .main-visual-panel.main-visual-panel--desktop-square {
      align-self: center;
      width: auto;
      height: 100%;
      max-width: 100%;
      aspect-ratio: 1;
    }
  }
}

</style>

<template>
  <section
    class="stack-section main-section no-scrollbar flex h-full min-h-0 flex-col bg-bg text-white [contain:layout_style_paint]"
  >
    <div
      class="internal-scroll-container mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start py-[1rem] px-[1rem] md:px-[5rem] md:pb-3"
    >
      <div
        class="flex w-full flex-1 min-h-0 flex-col gap-2.5 md:grid md:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)] md:gap-16"
      >
        <div
          class="relative flex flex-col gap-2.5 overflow-hidden bg-bg md:gap-5"
        >
          <SectionHeading
            :level="1"
            size="lg"
            align="left"
            color="accent"
            weight="bold"
            animation-class="hero-animate-title"
            class="text-condense main-section-title w-full !text-[clamp(1.8rem,8vw,2.7rem)] md:!text-[clamp(2.475rem,4.275vw,4.125rem)] leading-[0.98] md:leading-[0.94] tracking-[-0.02em]"
          >
            Цифровые продукты, которые растят выручку вашего бизнеса
          </SectionHeading>

          <div
            class="hero-animate-desc main-section-description w-full rounded-[3rem]   text-white "
          >
            <p
              class="max-w-[62ch] text-[clamp(0.8rem,2.4vw,02rem)] leading-snug md:text-[clamp(0.8rem,0.95vw,0.95rem)] md:leading-[1.45] max-md:line-clamp-3"
            >
              Проектируем и запускаем сайты, сервисы и CRM-решения под задачи вашего бизнеса:
              от аналитики и UX до разработки и маркетинга с измеримыми результатами.
            </p>
          </div>

          <div
            class="hero-animate-cta main-section-cta flex min-h-[40px] w-full items-center justify-start"
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

          <div
            class="grid w-full grid-cols-2 gap-1 [contain:layout_style_paint] max-md:shrink-0 md:grid-cols-3 md:gap-1.5 [&>*:last-child]:col-span-2 [&>*:last-child]:w-full [&>*:last-child]:max-w-[176px] [&>*:last-child]:justify-self-center md:[&>*:last-child]:col-span-1 md:[&>*:last-child]:max-w-none md:[&>*:last-child]:justify-self-auto"
          >
            <div
              v-for="(stat, index) in stats"
              :key="stat.title"
              :class="[
                'hero-animate-card',
                'hero-card-' + (index + 1),
                'main-section-stat-card flex flex-col items-center justify-center    text-center  ',
              ]"
            >

              <p
                class="m-0 min-h-[26px] w-full text-center text-[clamp(1.05rem,3.8vw,1.35rem)] font-black tabular-nums leading-[1.1] text-white md:text-[clamp(1.1rem,1.45vw,1.45rem)]"
              >
                <span class="inline-block min-w-[3ch] text-center">
                  {{ stat.count.toString().padStart(3, '0') }}
                </span>
                +
              </p>
               <p class="m-0 min-h-[16px] text-center text-[9px] text-gray-300 max-md:line-clamp-2 md:text-[10px]">
                {{ stat.title }}
              </p>
            </div>
          </div>
        </div>

        <div class="main-visual-host max-md:w-full max-md:flex-none md:pb-5">
          <div
            class="main-visual-panel main-visual-panel--desktop-square  relative isolate max-md:w-full overflow-hidden bg-gradient-modern rounded-[3rem] max-md:aspect-square"
            :data-ab-variant="mainVisualVariant"
          >
            <div v-if="mainVisualVariant === 'photo'" class="absolute inset-0 z-0 hidden md:block">
              <img
                class="!h-full w-full object-cover object-center"
                src="/img/hero/office.png"
                alt="Офис компании"
                decoding="async"
                loading="eager"
              />
            </div>
            <div class="absolute inset-0 z-0 md:hidden">
              <img
                class="!h-full w-full object-cover object-center"
                src="/img/hero/office.png"
                alt="Офис компании"
                decoding="async"
                fetchpriority="high"
              />
            </div>
            <div
              v-if="mainVisualVariant !== 'photo'"
              class="absolute inset-0 z-0 bg-[radial-gradient(120%_90%_at_18%_10%,rgba(255,102,0,0.35),transparent_48%)]"
            />
            <div
              v-if="mainVisualVariant !== 'photo'"
              class="absolute inset-0 z-0 bg-[radial-gradient(90%_70%_at_78%_20%,rgba(0,209,255,0.4),transparent_44%)]"
            />
            <div
              v-if="mainVisualVariant !== 'photo'"
              class="absolute inset-0 z-0 bg-[radial-gradient(70%_58%_at_52%_72%,rgba(91,79,255,0.55),transparent_60%)]"
            />
            <div
              v-if="mainVisualVariant !== 'photo'"
              class="absolute -right-6 top-6 z-[1] h-20 w-20 rounded-full bg-cyan-400/45 opacity-75 blur-[28px] md:-right-8 md:top-8 md:h-[4.5rem] md:w-[4.5rem]"
            />
            <div
              v-if="mainVisualVariant !== 'photo'"
              class="absolute bottom-8 left-6 z-[1] h-[4.5rem] w-[4.5rem] rounded-full bg-purple-500/40 opacity-75 blur-[28px] md:bottom-10 md:left-8 md:h-28 md:w-28"
            />
            <div
              class="absolute inset-0 z-[2] bg-gradient-to-t from-black/40 via-transparent to-transparent md:from-black/40 max-md:from-black/55"
            />
            <div
              class="main-visual-panel__noise pointer-events-none absolute inset-0 z-[3] rounded-[inherit] opacity-[0.045] mix-blend-soft-light"
            />
            <div
              class="pointer-events-none absolute inset-x-[10%] top-0 z-[5] h-px rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
