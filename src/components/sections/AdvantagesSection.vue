<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue'

const AdvantageCard = defineAsyncComponent(() => import('../AdvantageCard.vue'))
const CtaButton = defineAsyncComponent(() => import('../ui/CtaButton.vue'))

const rootEl = ref<HTMLElement | null>(null)
const isAnimationInitialized = ref(false)

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
</script>

<template>
  <section
    ref="rootEl"
    id="advantages"
    class="stack-section no-scrollbar bg-text h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem]"
    style="min-height: 800px; box-sizing: border-box; contain: layout style paint"
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
  </section>
</template>

<style scoped>
/* Убрано will-change и transform: translateZ(0) - GSAP управляет анимациями напрямую */

/* Плавные переходы для интерактивных элементов */
.adv-card:hover {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>






