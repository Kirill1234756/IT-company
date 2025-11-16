<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue'
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'

const WhatWeDoCard = defineAsyncComponent(() => import('../WhatWeDoCard.vue'))

const router = useRouter()

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

// Флаг для предотвращения повторного запуска анимаций
const isAnimationInitialized = ref(false)
// Счетчик попыток инициализации для предотвращения бесконечных рекурсий
let initAttempts = 0
const MAX_INIT_ATTEMPTS = 5

const whatWeDoCards = [
  {
    title: 'Стратегия',
    description:
      'Мы поможем создать бизнес‑план, разработать стратегию развития продукта и воплотить цели в реальность.',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23L11 13V7z',
    wrapperClass: 'md:col-span-6 ',
  },
  {
    title: 'Рост',
    description:
      'Мы проведём исследование и анализ вашего цифрового продукта, обновим веб‑ресурсы и скорректируем маркетинговую стратегию для повышения эффективности вашего бизнеса.',
    icon: 'M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z',
    wrapperClass: 'md:col-span-6 ',
  },
  {
    title: 'Разработка',
    description:
      'Мы создадим привлекательные веб‑сайты или эффективные веб‑приложения, поможем автоматизировать бизнес‑процессы и интегрируемся с другими информационными системами для улучшения общей функциональности.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    wrapperClass: 'md:col-span-8 md:py-[2rem]',
  },
]

const handleCardClick = (cardTitle: string) => {
  switch (cardTitle) {
    case 'Стратегия':
      router.push('/services/strategy')
      break
    case 'Рост':
      router.push('/services/growth')
      break
    case 'Разработка':
      router.push('/services/development')
      break
    default:
      router.push('/services')
  }
}

// Lazy mount internal content when in view
const rootEl = ref<HTMLElement | null>(null)
const visible = ref(true) // Changed to true for immediate display

// Removed console.log for production performance

useIntersectionObserver(
  rootEl,
  ([entry]) => {
    if (entry && entry.isIntersecting) visible.value = true
  },
  { rootMargin: '200px' }
)

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

      // Этап 3: Поиск элементов в секции
      const section = rootEl.value
      if (!section) return

      // Ждем загрузки асинхронных компонентов
      await new Promise((r) => setTimeout(r, 100))

      const title = section.querySelector('h2.title')
      const cards = Array.from(section.querySelectorAll('.wwd-card')) as HTMLElement[]
      const ctaBox = section.querySelector('.wwd-cta') as HTMLElement
      const ctaButton = section.querySelector('a[href*="services"]') as HTMLElement

      // Проверяем наличие элементов - если их нет, ждем еще
      if (!title && cards.length === 0 && !ctaBox) {
        // Если элементы еще не загружены, ждем немного и повторяем
        initAttempts++
        if (initAttempts < MAX_INIT_ATTEMPTS) {
          setTimeout(() => initGSAP(), 500)
        }
        return
      }

      // Сбрасываем счетчик при успешной инициализации
      initAttempts = 0

      // Этап 4: Создание timeline и анимаций через ScrollTrigger
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          if (isAnimationInitialized.value) return
          isAnimationInitialized.value = true

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

          // Анимация заголовка - плавное появление сверху
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
                scale: 0.8,
                rotationY: 15,
              })
            })
            tl.to(
              cards,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationY: 0,
                duration: 0.8,
                stagger: {
                  each: 0.15,
                  from: 'start',
                  ease: 'power2.out',
                },
                ease: 'back.out(1.3)',
              },
              '-=0.5'
            )
          }

          // Анимация CTA блока - плавное появление с эффектом bounce
          if (ctaBox) {
            gsap.set(ctaBox, { opacity: 0, y: 40, scale: 0.9 })
            tl.to(
              ctaBox,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'back.out(1.5)',
              },
              '-=0.4'
            )
          }

          // Анимация кнопки "Узнать больше" - финальное появление
          if (ctaButton) {
            gsap.set(ctaButton, { opacity: 0, y: 30, scale: 0.95 })
            tl.to(
              ctaButton,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
              },
              '-=0.3'
            )
          }
        },
      })
    } catch {
      // Fallback: если GSAP не загрузился, просто показываем элементы
      isAnimationInitialized.value = true
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
  // Сбрасываем флаг и счетчик
  isAnimationInitialized.value = false
  initAttempts = 0
})
</script>

<template>
  <section
    ref="rootEl"
    class="stack-section no-scrollbar bg-text h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[15rem] md:px-[6rem] px-[1rem]"
    style="min-height: 600px; box-sizing: border-box; contain: layout style paint"
  >
    <h2
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-bg opacity-100"
    >
      Что мы делаем
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl w-full mb-8">
      <template v-if="visible">
        <WhatWeDoCard
          v-for="card in whatWeDoCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :iconPath="card.icon"
          :wrapperClass="card.wrapperClass"
          @click="handleCardClick(card.title)"
        />

        <div
          class="wwd-cta group rounded-[3rem] p-6 sm:p-4 flex flex-col justify-center items-center text-center cursor-pointer text-white w-full md:col-span-4 bg-[var(--color-purple)] hover:bg-[var(--color-accent)] transition-colors border border-[color-mix(in_oklab,var(--color-border)_40%,transparent)] hover:border-[var(--color-accent)] hover:ring-2 hover:ring-[var(--color-accent)]"
          @click="router.push('/services')"
          role="button"
          tabindex="0"
          aria-label="Перейти к услугам"
          @keydown.enter="router.push('/services')"
          @keydown.space.prevent="router.push('/services')"
        >
          <h3
            class="text-base text-[0.8rem] md:text-sm px-2 sm:px-2 font-bold transition-transform duration-300 group-hover:translate-y-[-2px] group-hover:text-white"
          >
            Мы предлагаем полный спектр готовых цифровых решений для вашего бизнеса
          </h3>
        </div>
      </template>
      <div v-else class="text-center text-white col-span-12">
        Loading WhatWeDo cards... visible={{ visible }}
      </div>
    </div>

    <div class="flex justify-center">
      <CtaButton to="/services">Узнать больше</CtaButton>
    </div>
  </section>
</template>

<style scoped>
/* Начальное состояние для анимации - предотвращает FOUC */
.stack-section h2.title {
  will-change: transform, opacity;
  transform: translateZ(0); /* Создаем композиционный слой */
}

.wwd-card {
  will-change: transform, opacity;
  transform: translateZ(0);
}

.wwd-cta {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* Плавные переходы для интерактивных элементов */
.wwd-card:hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wwd-cta:hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>






