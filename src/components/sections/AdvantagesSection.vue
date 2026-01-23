<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'

const AdvantageCard = defineAsyncComponent(() => import('../AdvantageCard.vue'))
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))

const rootEl = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const isAnimationInitialized = ref(false)
const isMobile = ref(false)

// Функция для обновления состояния мобильного устройства
const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

// Our Advantages data
const advantages = [
  {
    title: 'Комплексный подход',
    description:
      'Мы можем взяться как за отдельные задачи, так и за весь проект целиком: от анализа рынка до разработки решений и продвижения «под ключ».',
  },
  {
    title: 'Бизнес‑задачи',
    description:
      'Все решения предлагаем исходя из целей вашего бизнеса — рост продаж, автоматизация, выстраивание коммуникаций с клиентами.',
  },
  {
    title: 'Каждый клиент важен',
    description:
      'Строим долгосрочные отношения: после разработки продолжаем работу над продвижением и аналитикой.',
  },
  {
    title: 'Высокая рабочая скорость',
    description:
      'Процессы внутри команды отлажены и гибко организованы — быстро включаемся в работу над проектом.',
  },
  {
    title: 'Выгодное предложение',
    description:
      'Вы не переплачиваете за бренд — получаете проект высокого уровня с оптимальным бюджетом.',
  },
  {
    title: 'Гибкая команда',
    description:
      'Небольшая команда адаптируется под процессы заказчика и оперативно принимает решения.',
  },
]

// Initialize GSAP animations when component mounts
onMounted(async () => {
  // Проверяем prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return
  }

  // Defer GSAP loading until after LCP для оптимизации производительности
  const initGSAP = async () => {
    try {
      // Этап 1: Дождаться idle времени или LCP
      const isMobileDevice = window.innerWidth < 768
      const delay = isMobileDevice ? 2000 : 1500

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

      // Этап 3: Поиск элементов в секции
      const section = rootEl.value
      if (!section) return

      // Ждем загрузки асинхронных компонентов
      let initAttempts = 0
      const maxAttempts = 10

      const findElements = () => {
        const title = section.querySelector('h2.title')
        const cards = Array.from(section.querySelectorAll('.adv-card')) as HTMLElement[]
        const ctaButton = section.querySelector('button') as HTMLElement
        return { title, cards, ctaButton }
      }

      let { title, cards, ctaButton } = findElements()

      // Ждем появления элементов (для async компонентов)
      while ((!title || !cards.length || !ctaButton) && initAttempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 200))
        const found = findElements()
        title = found.title
        cards = found.cards
        ctaButton = found.ctaButton
        initAttempts++
      }

      if (!title || !cards.length || !ctaButton) {
        return
      }

      initAttempts = 0

      // Этап 4: Создание timeline и анимаций при появлении секции в viewport
      // Используем IntersectionObserver вместо ScrollTrigger, так как ScrollTrigger
      // не работает корректно внутри pinned контейнера с абсолютным позиционированием
      const runAnimations = () => {
        if (isAnimationInitialized.value) return
        isAnimationInitialized.value = true

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // Анимация заголовка - плавное появление сверху с масштабом
        if (title) {
          gsap.set(title, { opacity: 0, y: 50, scale: 0.9 })
          tl.to(
            title,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
            },
            0
          )
        }

        // Анимация карточек - каскадное появление с эффектом масштаба и поворота
        if (cards.length > 0) {
          cards.forEach((card) => {
            gsap.set(card, {
              opacity: 0,
              y: 60,
              scale: 0.85,
              rotationX: 10,
            })
          })
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 0.8,
              stagger: {
                each: 0.12,
                from: 'start',
                ease: 'power2.out',
              },
              ease: 'back.out(1.3)',
            },
            '-=0.5'
          )
        }

        // Анимация CTA кнопки - плавное появление с эффектом bounce
        if (ctaButton) {
          gsap.set(ctaButton, { opacity: 0, y: 40, scale: 0.9 })
          tl.to(
            ctaButton,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'back.out(1.4)',
            },
            '-=0.3'
          )
        }
      }

      // Используем IntersectionObserver для отслеживания видимости секции
      // Это работает даже внутри pinned контейнера
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              runAnimations()
              observer.disconnect()
            }
          })
        },
        {
          threshold: 0.3,
          rootMargin: '0px',
        }
      )

      observer.observe(section)

      // Запускаем анимацию с задержкой, если секция уже видна
      setTimeout(() => {
        const rect = section.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        if (isVisible && !isAnimationInitialized.value) {
          runAnimations()
          observer.disconnect()
        }
      }, 500)
    } catch {
      // Fallback: показываем элементы без анимации
      const section = rootEl.value
      if (section) {
        const elements = section.querySelectorAll('.title, .adv-card, button')
        elements.forEach((el) => {
          ;(el as HTMLElement).style.opacity = '1'
          ;(el as HTMLElement).style.transform = 'none'
        })
      }
    }
  }

  // Запускаем инициализацию GSAP
  const isMobileDevice = window.innerWidth < 768
  const delay = isMobileDevice ? 2000 : 1500

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

  // Инициализируем определение мобильного устройства
  updateIsMobile()

  // Отслеживаем изменения размера окна
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsMobile)
  }

  // Настраиваем обработчики скролла
  // На мобильных используем touch события, на десктопе - wheel
  const setupScrollHandler = () => {
    if (!scrollContainerRef.value) {
      setTimeout(setupScrollHandler, 100)
      return
    }

    const scrollContainer = scrollContainerRef.value
    if ((scrollContainer as unknown as Record<string, unknown>).__scrollHandler) return

    const currentIsMobile = isMobile.value
    if (currentIsMobile) {
      // На мобильных не добавляем обработчики - полагаемся на CSS overscroll-behavior-y: auto
      // который автоматически передает скролл дальше, когда достигнуты границы
      // Это позволяет stack scroll корректно обрабатывать touch события
      return
    } else {
      // На десктопе добавляем обработчик wheel
      const handleWheel = (e: WheelEvent) => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer
        const threshold = 10
        const isAtTop = scrollTop <= threshold
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold

        if (e.deltaY > 0) {
          // Скроллим вниз
          if (!isAtBottom) {
            e.stopPropagation()
          }
        } else if (e.deltaY < 0) {
          // Скроллим вверх
          if (!isAtTop) {
            e.stopPropagation()
          }
        }
      }

      scrollContainer.addEventListener('wheel', handleWheel, { passive: false, capture: true })
      ;(scrollContainer as unknown as Record<string, unknown>).__scrollHandler = handleWheel
    }
  }

  // Ждем загрузки контейнера
  setTimeout(setupScrollHandler, 500)
  setTimeout(setupScrollHandler, 1500)
})

// Очистка обработчика при размонтировании
onUnmounted(() => {
  // Удаляем обработчик изменения размера окна
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsMobile)
  }

  if (scrollContainerRef.value) {
    const scrollContainer = scrollContainerRef.value
    const containerWithHandler = scrollContainer as unknown as Record<string, unknown>
    const handler = containerWithHandler.__scrollHandler

    if (!isMobile.value && typeof handler === 'function') {
      // На десктопе удаляем wheel обработчик
      scrollContainer.removeEventListener('wheel', handler as (e: WheelEvent) => void, {
        capture: true,
      })
    }

    delete containerWithHandler.__scrollHandler
  }
})
</script>

<template>
  <section
    ref="rootEl"
    id="advantages"
    class="stack-section no-scrollbar bg-text h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[5rem]"
    style="min-height: 800px; box-sizing: border-box; contain: layout style paint"
  >
    <!-- Внутренний скроллируемый контейнер для всех устройств -->
    <!-- Настроен так, чтобы не блокировать stack scroll на мобильных -->
    <div
      class="internal-scroll-container w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center"
      ref="scrollContainerRef"
      :class="{ 'mobile-advantages-container': isMobile }"
      style="padding-bottom: 0; margin-bottom: 0"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-bg opacity-100 text-center"
      >
        Наши преимущества
      </h2>

      <div class="w-full grid grid-cols-1 md:grid-cols-2 items-stretch">
        <AdvantageCard
          v-for="(a, i) in advantages"
          :key="a.title + i"
          :title="a.title"
          :description="a.description"
          :index="i"
          :isCentral="i === 2 || i === 3"
          class="adv-card"
        />
      </div>

      <div class="flex justify-center">
        <CtaButton to="/services" bgClass="bg-bg">Узнать больше</CtaButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Убрано will-change и transform: translateZ(0) - GSAP управляет анимациями напрямую */

/* Плавные переходы для интерактивных элементов */
.adv-card:hover {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Обеспечиваем корректную работу touch событий на мобильных устройствах */
.internal-scroll-container {
  /* Разрешаем вертикальный скролл */
  touch-action: pan-y;
  /* Улучшаем производительность скролла */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* На мобильных устройствах настраиваем контейнер так, чтобы не блокировать stack scroll */
.mobile-advantages-container {
  /* Разрешаем передачу скролла родительскому элементу когда достигнуты границы */
  /* auto позволяет скроллу передаваться дальше, когда достигнуты границы */
  overscroll-behavior-y: auto;
  overscroll-behavior-x: contain;
  /* Убеждаемся, что touch события не блокируются */
  touch-action: pan-y;
  /* Позволяем скроллу страницы работать, когда внутренний контент достиг границ */
  -webkit-overflow-scrolling: touch;
}
</style>






