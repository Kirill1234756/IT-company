<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, defineAsyncComponent, markRaw } from 'vue'
import { loadGsap } from '../../composables/useGsap'

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

// Ref для корневого элемента секции
const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

// Memoized stats data - используем ref для полной реактивности
const stats = ref([
  { title: 'Опыт веб-разработки', count: 0, target: 7 },
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
    const { gsap } = await loadGsap()

    // Анимируем каждый счетчик (разбиваем на мелкие задачи для производительности)
    for (let index = 0; index < stats.value.length; index++) {
      const stat = stats.value[index]
      if (!stat) continue // Пропускаем, если stat undefined

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

      // Yield каждые 2 счетчика для разбиения длинной задачи
      if (index % 2 === 1 && window.scheduler?.postTask) {
        await window.scheduler.postTask(() => {}, { priority: 'background' })
      } else if (index % 2 === 1) {
        await new Promise((r) => setTimeout(r, 0))
      }
    }
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

  // Defer GSAP loading - минимальная задержка для первой секции
  const initGSAP = async () => {
    try {
      // Этап 1: Задержка для оптимизации производительности
      const isMobile = window.innerWidth < 768
      const delay = isMobile ? 200 : 100 // Минимальная задержка для разбиения задач

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => {}, { priority: 'user-visible', delay })
      } else if ('requestIdleCallback' in window) {
        await new Promise<void>((resolve) =>
          (
            window as Window & { requestIdleCallback: (callback: () => void) => void }
          ).requestIdleCallback(() => resolve(), { timeout: delay })
        )
      } else {
        await new Promise((r) => setTimeout(r, delay))
      }

      // Этап 2: Загрузить GSAP через единый loader (loadGsap сам ждет LCP)
      const { gsap } = await loadGsap(0, true)

      // Yield для разбиения длинной задачи
      await new Promise((r) => setTimeout(r, 0))

      // Этап 3: Поиск элементов в main-section с повторными попытками
      // Используем rootEl.value вместо document.querySelector для правильного элемента
      const mainSection = rootEl.value
      if (!mainSection) {
        // Повторяем попытку через небольшую задержку
        setTimeout(() => initGSAP(), 300)
        return
      }

      // Функция для поиска элементов
      const findElements = () => {
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
        // Ищем wrapper div для CTA кнопки
        const ctaWrapper = mainSection.querySelector('.main-section-cta') as HTMLElement
        // Ищем кнопку внутри wrapper (CtaButton рендерится как button)
        const ctaButton =
          (ctaWrapper?.querySelector('button') as HTMLElement) ||
          (mainSection.querySelector('.main-section-cta button') as HTMLElement) ||
          null

        return { h1, descriptionBox, statCards, ctaButton, ctaWrapper }
      }

      // Ждем появления элементов (для async компонентов)
      let initAttempts = 0
      const maxAttempts = 15
      let { h1, descriptionBox, statCards, ctaButton, ctaWrapper } = findElements()

      // Ждем появления элементов, особенно важны h1 и statCards
      while ((!h1 || statCards.length === 0) && initAttempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 200))
        const found = findElements()
        h1 = found.h1
        descriptionBox = found.descriptionBox
        statCards = found.statCards
        ctaButton = found.ctaButton
        ctaWrapper = found.ctaWrapper
        initAttempts++
      }

      // Если wrapper не найден, ищем его еще раз
      if (!ctaWrapper && mainSection) {
        ctaWrapper = mainSection.querySelector('.main-section-cta') as HTMLElement
      }

      if (!h1 || statCards.length === 0) {
        // Показываем элементы без анимации
        stats.value.forEach((stat) => {
          stat.count = stat.target
        })
        // Показываем кнопку и контейнер даже если GSAP не загрузился
        if (ctaWrapper) {
          ctaWrapper.style.opacity = '1'
          ctaWrapper.style.transform = 'none'
        }
        if (ctaButton && ctaButton !== ctaWrapper) {
          ctaButton.style.opacity = '1'
          ctaButton.style.transform = 'none'
        }
        return
      }

      // Этап 4: Создание timeline и анимаций
      // Запускаем анимации сразу, без ScrollTrigger, чтобы не конфликтовать с stack scroll
      // Yield перед созданием timeline для разбиения задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => {}, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Анимация заголовка - плавное появление сверху
      // НЕ скрываем h1, так как он является LCP элементом и должен быть виден сразу
      // Анимируем только transform для плавного появления без влияния на LCP
      if (h1) {
        // h1 уже виден (opacity: 1), анимируем только transform
        h1.style.willChange = 'transform'
        gsap.set(h1, { y: 20, scale: 0.98 })
        tl.to(h1, {
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => {
            if (h1) h1.style.willChange = 'auto'
          },
        })
      }

      // Анимация описания - плавное появление с небольшой задержкой
      if (descriptionBox) {
        descriptionBox.style.willChange = 'opacity, transform'
        gsap.set(descriptionBox, { opacity: 0, y: 25, scale: 0.98 })
        tl.to(
          descriptionBox,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              if (descriptionBox) descriptionBox.style.willChange = 'auto'
            },
          },
          '-=0.5'
        )
      }

      // Анимация карточек статистики - каскадное появление с эффектом масштаба
      // Разбиваем на мелкие задачи для производительности
      if (statCards.length > 0) {
        // Yield перед настройкой карточек
        if (window.scheduler?.postTask) {
          await window.scheduler.postTask(() => {}, { priority: 'background' })
        } else {
          await new Promise((r) => setTimeout(r, 0))
        }

        // Устанавливаем will-change только для анимации
        statCards.forEach((card) => {
          card.style.willChange = 'opacity, transform'
          gsap.set(card, { opacity: 0, y: 40, scale: 0.85, rotationX: 10 })
        })

        // Yield перед анимацией
        if (window.scheduler?.postTask) {
          await window.scheduler.postTask(() => {}, { priority: 'background' })
        } else {
          await new Promise((r) => setTimeout(r, 0))
        }

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
            onComplete: () => {
              // Убираем will-change после анимации
              statCards.forEach((card) => {
                card.style.willChange = 'auto'
              })
            },
          },
          '-=0.4'
        )
      }

      // Анимация кнопки - плавное появление с эффектом bounce
      // Анимируем контейнер кнопки (важно анимировать контейнер)
      if (ctaWrapper) {
        ctaWrapper.style.willChange = 'opacity, transform'
        // Устанавливаем начальное состояние через GSAP (перезаписывает inline стили)
        gsap.set(ctaWrapper, { opacity: 0, y: 25 })
        tl.to(
          ctaWrapper,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.4)',
            onComplete: () => {
              if (ctaWrapper) {
                ctaWrapper.style.willChange = 'auto'
                // Убеждаемся, что opacity установлена через inline стиль с important
                ctaWrapper.style.setProperty('opacity', '1', 'important')
                ctaWrapper.style.visibility = 'visible'
              }
            },
          },
          '-=0.3'
        )
      } else if (ctaButton) {
        // Если wrapper не найден, анимируем кнопку напрямую
        ctaButton.style.willChange = 'opacity, transform'
        gsap.set(ctaButton, { opacity: 0, y: 25, scale: 0.9 })
        tl.to(
          ctaButton,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            onComplete: () => {
              if (ctaButton) {
                ctaButton.style.willChange = 'auto'
                ctaButton.style.setProperty('opacity', '1', 'important')
                ctaButton.style.visibility = 'visible'
              }
            },
          },
          '-=0.3'
        )
      }

      // Этап 5: Запуск анимации счетчиков сразу, без ScrollTrigger
      // Это предотвращает конфликт с основным stack scroll ScrollTrigger
      // Запускаем счетчики с небольшой задержкой после основной анимации
      tl.call(
        () => {
          animateCounters()
        },
        undefined,
        '+=0.5'
      )
    } catch {
      // Fallback: устанавливаем финальные значения без анимации
      stats.value.forEach((stat) => {
        stat.count = stat.target
      })
      // Показываем все элементы без анимации
      const mainSection = rootEl.value
      if (mainSection) {
        const h1 = mainSection.querySelector('h1')
        const descriptionBox = mainSection.querySelector('.main-section-description')
        const statCards = Array.from(mainSection.querySelectorAll('.main-section-stat-card'))
        const ctaWrapper = mainSection.querySelector('.main-section-cta') as HTMLElement
        const ctaButton = mainSection.querySelector('.main-section-cta button') as HTMLElement

        if (h1) h1.style.opacity = '1'
        if (descriptionBox) (descriptionBox as HTMLElement).style.opacity = '1'
        statCards.forEach((card) => {
          ;(card as HTMLElement).style.opacity = '1'
        })
        // Показываем контейнер кнопки только если GSAP не загрузился (fallback)
        // В нормальном случае кнопка показывается через GSAP анимацию
        if (ctaWrapper) {
          // Используем setTimeout для небольшой задержки, чтобы дать GSAP шанс загрузиться
          setTimeout(() => {
            if (ctaWrapper && (ctaWrapper.style.opacity === '0' || !ctaWrapper.style.opacity)) {
              ctaWrapper.style.opacity = '1'
              ctaWrapper.style.transform = 'none'
              ctaWrapper.style.visibility = 'visible'
            }
          }, 2000)
        }
      }
    }
  }

  // Запускаем инициализацию GSAP после LCP для оптимизации TBT
  // Увеличиваем задержку на мобильных для лучшей производительности
  const isMobile = typeof window !== 'undefined' && (window as Window).innerWidth < 768
  const gsapDelay = isMobile ? 3000 : 2000 // Большая задержка на мобильных

  if (window.scheduler?.postTask) {
    window.scheduler.postTask(
      () => {
        initGSAP()
      },
      { priority: 'background', delay: gsapDelay } // background приоритет с задержкой
    )
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        initGSAP()
      },
      { timeout: gsapDelay }
    )
  } else {
    // Fallback: задержка для старых браузеров
    setTimeout(() => {
      initGSAP()
    }, gsapDelay)
  }

  // Настраиваем обработчик wheel для внутреннего скролла
  const setupScrollHandler = () => {
    if (!scrollContainerRef.value) {
      setTimeout(setupScrollHandler, 100)
      return
    }

    const scrollContainer = scrollContainerRef.value
    if (!scrollContainer) return
    if ((scrollContainer as unknown as Record<string, unknown>).__scrollHandler) return

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const threshold = 10
      const isAtTop = scrollTop <= threshold
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold

      // Проверяем, есть ли что скроллить
      const hasScrollableContent = scrollHeight > clientHeight

      if (!hasScrollableContent) {
        // Если контент не переполняет контейнер, пропускаем событие дальше
        return
      }

      if (e.deltaY > 0) {
        // Скроллим вниз
        if (!isAtBottom) {
          // Есть место для скролла вниз - скроллим контейнер и останавливаем propagation
          e.preventDefault()
          e.stopPropagation()
          scrollContainer.scrollTop += e.deltaY
        }
        // Если достигли дна, пропускаем событие дальше для stack scroll
      } else if (e.deltaY < 0) {
        // Скроллим вверх
        if (!isAtTop) {
          // Есть место для скролла вверх - скроллим контейнер и останавливаем propagation
          e.preventDefault()
          e.stopPropagation()
          scrollContainer.scrollTop += e.deltaY
        }
        // Если достигли верха, пропускаем событие дальше для stack scroll
      }
    }

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    ;(scrollContainer as unknown as Record<string, unknown>).__scrollHandler = handleWheel
  }

  // Ждем загрузки контейнера
  setTimeout(setupScrollHandler, 500)
  setTimeout(setupScrollHandler, 1500)
})

// Очистка при размонтировании компонента
onBeforeUnmount(() => {
  // Сбрасываем флаг
  isCounterAnimationStarted.value = false
})
</script>

<style scoped>
/* Убрано will-change и transform: translateZ(0) - GSAP управляет анимациями напрямую */

/* Скрываем элементы с bg-error до инициализации анимаций */
.main-section [class*='bg-error'] {
  opacity: 0;
  visibility: visible; /* Оставляем visible для анимации, но opacity: 0 */
  /* Резервируем место для предотвращения CLS */
  contain: layout style paint;
}

/* Плавные переходы для интерактивных элементов */
.main-section [class*='bg-error']:hover {
  transition: transform 0.3s ease, opacity 0.3s ease;
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
  /* Используем will-change только во время анимации */
  will-change: auto;
}

/* Фиксируем размеры текста в карточках */
.main-section-stat-card p {
  width: 100%;
  text-align: center;
  contain: layout style;
}

/* Обеспечиваем видимость кнопки калькулятора на всех устройствах после анимации */
.main-section-cta {
  /* Начальное состояние - скрыто, будет показано через GSAP анимацию */
  opacity: 0;
  visibility: visible;
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
    class="stack-section main-section no-scrollbar h-screen flex items-start justify-center py-5 md:py-[5rem] bg-bg text-white relative px-4 md:px-[1rem] gap-6 md:gap-10"
    style="width: 100%; box-sizing: border-box; contain: layout style paint"
  >
    <div
      class="internal-scroll-container w-full h-full overflow-y-auto overflow-x-hidden flex flex-col"
      ref="scrollContainerRef"
      style="padding-bottom: 2rem; margin-bottom: 0; align-content: flex-start; min-height: 100%"
    >
      <div
        class="flex flex-col w-full md:w-7/8 gap-6 md:gap-10"
        style="
          max-width: 1200px;
          width: 100%;
          box-sizing: border-box;
          padding-bottom: 0;
          margin-bottom: 0;
          flex-grow: 0;
        "
      >
        <div
          class="flex w-full md:w-2/3"
          style="min-height: 120px; width: 100%; box-sizing: border-box"
        >
          <h1
            class="text-3xl md:text-5xl text-condense text-purple main-section-title"
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
              opacity: 1;
            "
          >
            Продажа сайтов и цифровых решений для развития бизнеса
          </h1>
        </div>

        <div class="flex flex-col md:flex-row md:justify-start gap-6 md:gap-10">
          <!-- <div class="w-3/12 bg-error rounded-[3rem]"></div> -->
          <div
            class="flex flex-col gap-6 md:gap-10 w-full md:flex-shrink-0 md:flex-grow-0 items-start"
            style="box-sizing: border-box"
          >
            <div
              class="flex justify-start items-center p-6 md:p-10 bg-error rounded-[3rem] md:w-[62.5%] w-full main-section-description"
              style="
                box-sizing: border-box;
                contain: layout style paint;
                min-height: 80px;
                height: auto;
                opacity: 0;
              "
            >
              <p style="box-sizing: border-box; margin: 0; line-height: 1.5">
                От анализа целевого рынка до разработки сложных веб-приложений и внедрения
                маркетинговой стратегии в короткие сроки по разумной цене.
              </p>
            </div>
            <!-- На мобильных: первые 2 карточки рядом, третья внизу по центру -->
            <!-- На десктопе: все 3 карточки в ряд -->
            <div
              class="flex flex-row md:flex-row justify-center md:justify-end gap-2 md:gap-6 w-full"
              style="
                box-sizing: border-box;

                width: 100%;
                contain: layout style paint;
              "
            >
              <!-- Первые 2 карточки - всегда в ряд -->
              <div
                v-for="stat in stats.slice(0, 2)"
                :key="stat.title"
                class="flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] w-[calc(50%-0.5rem)] md:w-full max-w-[200px] main-section-stat-card"
                style="
                  box-sizing: border-box;
                  contain: layout style paint;
                  min-height: 100px;
                  height: 100px;
                  width: calc(50% - 0.5rem);
                  max-width: 200px;
                  opacity: 0;
                  flex-shrink: 0;
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
                  style="
                    box-sizing: border-box;
                    margin: 0;
                    min-height: 40px;
                    line-height: 1.2;
                    width: 100%;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                  "
                >
                  <span style="display: inline-block; min-width: 3ch; text-align: center">{{
                    stat.count.toString().padStart(3, '0')
                  }}</span
                  >+
                </p>
              </div>

              <!-- Третья карточка - только на десктопе в ряд -->
              <div
                v-for="stat in stats.slice(2)"
                :key="stat.title"
                class="hidden md:flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] md:w-full max-w-[200px] main-section-stat-card"
                style="
                  box-sizing: border-box;
                  contain: layout style paint;
                  min-height: 100px;
                  height: 100px;
                  width: 100%;
                  max-width: 200px;
                  opacity: 0;
                  flex-shrink: 0;
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
                  style="
                    box-sizing: border-box;
                    margin: 0;
                    min-height: 40px;
                    line-height: 1.2;
                    width: 100%;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                  "
                >
                  <span style="display: inline-block; min-width: 3ch; text-align: center">{{
                    stat.count.toString().padStart(3, '0')
                  }}</span
                  >+
                </p>
              </div>
            </div>

            <!-- Третья карточка - только на мобильных внизу по центру -->
            <div
              class="flex md:hidden justify-center w-full"
              style="box-sizing: border-box; min-height: 120px; margin-top: 0.5rem"
            >
              <div
                v-for="stat in stats.slice(2)"
                :key="stat.title"
                class="flex flex-col items-center justify-center p-3 md:p-4 bg-error rounded-[2rem] md:rounded-[3rem] w-[calc(50%-0.5rem)] md:w-full max-w-[200px] main-section-stat-card"
                style="
                  box-sizing: border-box;
                  contain: layout style paint;
                  min-height: 100px;
                  height: 100px;
                  width: calc(50% - 0.5rem);
                  max-width: 200px;
                  opacity: 0;
                  flex-shrink: 0;
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
                  style="
                    box-sizing: border-box;
                    margin: 0;
                    min-height: 40px;
                    line-height: 1.2;
                    width: 100%;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                  "
                >
                  <span style="display: inline-block; min-width: 3ch; text-align: center">{{
                    stat.count.toString().padStart(3, '0')
                  }}</span
                  >+
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex justify-center w-full main-section-cta"
          style="
            box-sizing: border-box;
            contain: layout style paint;
            min-height: 75px;
            height: auto;
            padding-top: 1rem;
            padding-bottom: 1rem;
            margin-top: 1rem;
            margin-bottom: 0;
            flex-shrink: 0;
            visibility: visible;
            opacity: 0;
            position: relative;
            z-index: 10;
          "
        >
          <CtaButton to="/calculator" bgClass="bg-accent" textClass="text-bg"
            >Калькулятор цены</CtaButton
          >
        </div>
      </div>
    </div>
  </section>
</template>
