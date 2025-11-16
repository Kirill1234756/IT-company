<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, defineAsyncComponent, markRaw } from 'vue'

// Типы для scheduler API
interface SchedulerPostTaskOptions {
  priority?: 'user-blocking' | 'user-visible' | 'background'
  delay?: number
  signal?: AbortSignal
}

interface Scheduler {
  postTask(callback: () => void, options?: SchedulerPostTaskOptions): Promise<void>
}

declare global {
  interface Window {
    scheduler?: Scheduler
  }
}

const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))

// Memoized stats data - используем ref для полной реактивности
const stats = ref([
  { title: 'Многолетний опыт веб-разработки', count: 0, target: 7 },
  { title: 'Лучшие специалисты', count: 0, target: 23 },
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

// Counter animation logic using GSAP
const animateCounters = async () => {
  // Предотвращаем повторный запуск
  if (isCounterAnimationStarted.value) {
    return
  }
  isCounterAnimationStarted.value = true

  try {
    const { gsap } = await import('gsap')

    // Анимируем каждый счетчик
    stats.value.forEach((stat, index) => {
      // Создаем прокси-объект для анимации
      const proxy = { count: 0 }

      gsap.fromTo(
        proxy,
        { count: 0 },
        {
          count: stat.target,
          duration: 2.5,
          ease: 'power2.out',
          delay: index * 0.15, // Задержка между счетчиками
          onUpdate: function () {
            // Явно обновляем значение в реактивном массиве
            const currentValue = Math.floor(proxy.count)
            const statItem = stats.value[index]
            if (statItem && statItem.count !== currentValue) {
              statItem.count = currentValue
            }
          },
          onComplete: function () {
            // Убеждаемся, что финальное значение установлено
            const statItem = stats.value[index]
            if (statItem) {
              statItem.count = stat.target
            }
          },
        }
      )
    })
  } catch {
    // Fallback: устанавливаем финальные значения без анимации
    stats.value.forEach((stat) => {
      stat.count = stat.target
    })
  }
}

// Переменная для хранения ссылки на общую timeline (не используется в текущей реализации)
// const verticalTimeline = ref<gsap.core.Timeline | null>(null)

// Флаг для предотвращения множественного запуска
const isCounterAnimationStarted = ref(false)

// Удалены функции вертикальной анимации, так как элементы закомментированы в template
// Если понадобится - можно вернуть позже

// Initialize animations when component mounts
onMounted(async () => {
  // Проверяем prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    // Отключаем анимации, устанавливаем финальные значения
    stats.value.forEach((stat) => {
      stat.count = stat.target
    })
    return
  }

  // Defer GSAP loading until after LCP для оптимизации производительности
  const initGSAP = async () => {
    try {
      // Этап 1: Дождаться idle времени или LCP
      const isMobile = window.innerWidth < 768
      const delay = isMobile ? 2000 : 1500

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => {}, { priority: 'background', delay })
      } else if ('requestIdleCallback' in window) {
        await new Promise<void>((resolve) =>
          (
            window as Window & { requestIdleCallback: (callback: () => void) => void }
          ).requestIdleCallback(() => resolve(), { timeout: delay })
        )
      } else {
        await new Promise((r) => setTimeout(r, delay))
      }

      // Этап 2: Загрузить GSAP
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Yield для разбиения длинной задачи
      await new Promise((r) => setTimeout(r, 0))

      // Этап 3: Поиск элементов в main-section
      const mainSection = document.querySelector('.main-section')
      if (!mainSection) return

      // Используем более надежные селекторы
      const h1 = mainSection.querySelector('h1')
      // Ищем описание по тексту или структуре
      const descriptionBox = mainSection
        .querySelector('p')
        ?.closest('div[class*="bg-error"]') as HTMLElement
      // Ищем карточки статистики - они содержат числа с "+"
      const allCards = Array.from(
        mainSection.querySelectorAll('div[class*="bg-error"]')
      ) as HTMLElement[]
      const statCards = allCards.filter((card) => {
        const text = card.textContent || ''
        return text.includes('+') && !text.includes('Калькулятор')
      })
      const ctaButton = mainSection.querySelector('a[href*="calculator"], button') as HTMLElement

      // Этап 4: Создание timeline и анимаций
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Анимация заголовка - плавное появление сверху
      if (h1) {
        gsap.set(h1, { opacity: 0, y: 40, scale: 0.95 })
        tl.to(h1, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        })
      }

      // Анимация описания - плавное появление с небольшой задержкой
      if (descriptionBox) {
        gsap.set(descriptionBox, { opacity: 0, y: 25, scale: 0.98 })
        tl.to(
          descriptionBox,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        )
      }

      // Анимация карточек статистики - каскадное появление с эффектом масштаба
      if (statCards.length > 0) {
        statCards.forEach((card) => {
          gsap.set(card, { opacity: 0, y: 40, scale: 0.85, rotationX: 10 })
        })
        tl.to(
          statCards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.7,
            stagger: {
              each: 0.12,
              from: 'start',
              ease: 'power2.out',
            },
            ease: 'back.out(1.2)',
          },
          '-=0.4'
        )
      }

      // Анимация кнопки - плавное появление с эффектом bounce
      if (ctaButton) {
        gsap.set(ctaButton, { opacity: 0, y: 25, scale: 0.9 })
        tl.to(
          ctaButton,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
          },
          '-=0.3'
        )
      }

      // Этап 5: Инициализация ScrollTrigger для счетчиков
      ScrollTrigger.create({
        trigger: mainSection,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          animateCounters()
        },
      })
    } catch {
      // Fallback: устанавливаем финальные значения без анимации
      stats.value.forEach((stat) => {
        stat.count = stat.target
      })
    }
  }

  // Запускаем инициализацию GSAP
  const isMobile = window.innerWidth < 768
  const delay = isMobile ? 2000 : 1500

  if (window.scheduler?.postTask) {
    window.scheduler.postTask(
      () => {
        initGSAP()
      },
      { priority: 'background', delay }
    )
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        initGSAP()
      },
      { timeout: delay }
    )
  } else {
    setTimeout(() => {
      initGSAP()
    }, delay)
  }
})

// Очистка при размонтировании компонента
onBeforeUnmount(() => {
  // Сбрасываем флаг
  isCounterAnimationStarted.value = false
})
</script>

<style scoped>
/* Начальное состояние для анимации - предотвращает FOUC */
.main-section h1 {
  will-change: transform, opacity;
  transform: translateZ(0); /* Создаем композиционный слой */
}

.main-section [class*='bg-error'] {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* Плавные переходы для интерактивных элементов */
.main-section [class*='bg-error']:hover {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Оптимизация для счетчиков */
.main-section [class*='bg-error'] p[class*='text-2xl'],
.main-section [class*='bg-error'] p[class*='text-3xl'] {
  font-variant-numeric: tabular-nums; /* Предотвращает скачки при изменении чисел */
}
</style>

<template>
  <!-- Main Hero Section -->
  <section
    class="stack-section main-section no-scrollbar h-auto md:h-screen flex items-center justify-center py-5 md:py-[5rem] bg-bg text-white relative overflow-hidden px-4 md:px-[1rem] gap-6 md:gap-15"
    style="
      min-height: 400px;
      width: 100%;
      padding-top: 64px;
      box-sizing: border-box;
      contain: layout style paint;
    "
  >
    <div
      class="flex flex-col w-full md:w-7/8 gap-6 md:gap-10 md:mt-[5rem]"
      style="min-height: 300px; max-width: 1200px; width: 100%; box-sizing: border-box"
    >
      <div
        class="flex w-full md:w-2/3"
        style="min-height: 120px; width: 100%; box-sizing: border-box"
      >
        <h1
          class="text-3xl md:text-5xl text-condense text-purple"
          style="
            width: 100%;
            font-size: clamp(1.5rem, 4vw, 3rem);
            font-weight: 700;
            line-height: 1.2;
            margin: 0;
            color: #6366f1;
            font-family: 'IBM Plex Sans Condensed', sans-serif;
            box-sizing: border-box;
            contain: layout style paint;
          "
        >
          Продажа сайтов и цифровых решений для развития бизнеса
        </h1>
      </div>

      <div class="flex flex-col md:flex-row justify-center md:justify-end gap-6 md:gap-10">
        <!-- <div class="w-3/12 bg-error rounded-[3rem]"></div> -->
        <div
          class="flex flex-col gap-6 md:gap-10 w-full md:w-[62.5%] md:flex-shrink-0 md:flex-grow-0 items-start"
          style="box-sizing: border-box"
        >
          <div
            class="flex justify-end items-center p-6 md:p-10 bg-error rounded-[3rem] w-full md:w-[62.5%]"
            style="box-sizing: border-box; contain: layout style paint; min-height: 80px"
          >
            <p style="box-sizing: border-box; margin: 0; line-height: 1.5">
              От анализа целевого рынка до разработки сложных веб-приложений и внедрения
              маркетинговой стратегии в короткие сроки по разумной цене.
            </p>
          </div>
          <div
            class="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-4 md:gap-10 w-full"
            style="box-sizing: border-box; min-height: 120px"
          >
            <div
              v-for="stat in stats"
              :key="stat.title"
              class="flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] w-[calc(50%-0.5rem)] md:w-full max-w-[200px]"
              style="
                box-sizing: border-box;
                contain: layout style paint;
                min-height: 100px;
                width: 100%;
              "
            >
              <p
                class="text-xs md:text-sm text-gray-300 text-center"
                style="box-sizing: border-box; margin: 0; min-height: 20px"
              >
                {{ stat.title }}
              </p>

              <p
                class="text-2xl md:text-3xl font-black text-white"
                style="box-sizing: border-box; margin: 0; min-height: 40px; line-height: 1.2"
              >
                {{ stat.count.toString().padStart(3, '0') }}+
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex justify-center w-full mt-2 md:mt-0"
        style="box-sizing: border-box; min-height: 50px; contain: layout style paint"
      >
        <CtaButton to="/calculator" bgClass="bg-accent" textClass="text-bg"
          >Калькулятор цены</CtaButton
        >
      </div>
    </div>
    <!-- <div class="flex w-3/8 py-[5rem] h-screen overflow-hidden relative">
      <div class="vertical-animation-container absolute inset-0 w-full">
        <div class="first-column-container">
          <div
            v-for="(content, index) in 2"
            :key="`first-content-${index}`"
            class="vertical-content"
          >
            <div
              v-for="item in firstColumnData"
              :key="`first-${index}-${item.title}`"
              class="animation-item rounded-[3rem] p-3 mb-8 mx-2 border border-accent/50"
            >
              <h3 class="text-purple text-sm font-bold mb-2 text-center">{{ item.title }}</h3>
              <p class="text-[0.7rem] text-center text-success">{{ item.subtitle }}</p>
            </div>
          </div>
        </div>

        <div class="second-column-container">
          <div
            v-for="(content, index) in 2"
            :key="`second-content-${index}`"
            class="vertical-content"
          >
            <div
              v-for="item in secondColumnData"
              :key="`second-${index}-${item.title}`"
              class="animation-item rounded-[3rem] p-3 mb-8 mx-2 border border-accent/50"
            >
              <h3 class="text-purple text-sm font-bold mb-2 text-center">{{ item.title }}</h3>
              <p class="text-[0.7rem] text-center text-success">{{ item.subtitle }}</p>
            </div>
          </div>
        </div>
      </div> -->
  </section>
</template>
