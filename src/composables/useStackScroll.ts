/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, onUnmounted, type Ref } from 'vue'

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

type GsapLite = {
  set: (...args: any[]) => any
  to: (...args: any[]) => any
  fromTo: (...args: any[]) => any
  timeline: (...args: any[]) => any
  registerPlugin: (...args: any[]) => any
  utils: { toArray: <T = any>(selector: any) => T[] }
}

type ScrollTriggerLite = {
  create: (...args: any[]) => any
  refresh: () => any
  getAll: () => Array<{ kill: () => void }>
}

export type SectionAnimationHook = (opts: {
  gsap: GsapLite
  ScrollTrigger: ScrollTriggerLite
  sections: HTMLElement[]
}) => void

export function useStackScroll(
  stackContainer: Ref<HTMLElement | null>,
  options?: {
    onAfterGsapReady?: SectionAnimationHook
    snap?: boolean
  }
) {
  let scrollTriggerRef: ScrollTriggerLite | null = null

  onMounted(async () => {
    // Removed console.log for production performance

    // Defer heavy GSAP initialization - разбито на этапы для оптимизации TBT
    const initScroll = async () => {
      // Этап 1: Дождаться idle времени или LCP - уменьшено для лучшей производительности на десктопе
      const delay = 1000
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background', delay })
      } else if ('requestIdleCallback' in window) {
        await new Promise<void>((resolve) =>
          (window as any).requestIdleCallback(() => resolve(), { timeout: delay })
        )
      } else {
        await new Promise((r) => setTimeout(r, delay))
      }

      // Этап 2: Загрузить GSAP
      const { gsap } = await import('gsap')

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      gsap.registerPlugin(ScrollTrigger)
      scrollTriggerRef = ScrollTrigger

      // Этап 3: Получить root и sections
      const root = stackContainer.value
      if (!root) {
        return
      }

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      const sections = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.stack-section'))
      if (!sections.length) {
        return
      }

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      // Этап 4: Очистка и настройка
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      gsap.set(root, {
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'transparent'
      })

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      gsap.set(sections, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden'
      })

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      if (sections[0]) gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 })
      sections.slice(1).forEach((s, i) => gsap.set(s, { zIndex: i + 2, autoAlpha: 0, yPercent: 100 }))

      // Этап 5: Добавление scroll listeners
      sections.forEach((section) => {
        section.addEventListener('wheel', (e) => {
          const isScrollingUp = e.deltaY < 0
          const isScrollingDown = e.deltaY > 0
          const scrollTop = section.scrollTop
          const scrollHeight = section.scrollHeight
          const clientHeight = section.clientHeight

          if ((isScrollingUp && scrollTop === 0) || (isScrollingDown && scrollTop + clientHeight >= scrollHeight)) {
            return
          }

          e.stopPropagation()
        }, { passive: true })
      })

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      // Этап 6: Создание timeline
      const tl = gsap.timeline({
        defaults: { ease: 'sine.inOut', duration: 1.2 },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => '+=' + (sections.length - 1) * window.innerHeight,
          pin: true,
          scrub: 0.5,
          snap: options?.snap
            ? {
              snapTo: 1 / (sections.length - 1),
              duration: { min: 0.5, max: 1.2 },
              delay: 0.2,
              directional: false,
            }
            : undefined,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          anticipatePin: 1,
          pinSpacing: true,
        },
      })

      // Yield для разбиения длинной задачи
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((r) => setTimeout(r, 0))
      }

      // Этап 7: Настройка анимаций секций
      for (let i = 1; i < sections.length; i++) {
        const prev = sections[i - 1]
        const next = sections[i]
        if (prev) tl.to(prev, { autoAlpha: 0, yPercent: -100, duration: 0.5, ease: 'power2.inOut' }, i - 0.5)
        if (next)
          tl.fromTo(
            next,
            { autoAlpha: 0, yPercent: 100 },
            { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'power2.inOut' },
            i - 0.5
          )

        // Yield после каждых 2 секций для разбиения длинной задачи
        if (i > 1 && i % 2 === 0) {
          if ('scheduler' in window && (window as any).scheduler?.postTask) {
            await new Promise<void>((resolve) =>
              (window as any).scheduler.postTask(() => resolve(), { priority: 'background' })
            )
          } else {
            await new Promise((r) => setTimeout(r, 0))
          }
        }
      }

      // Финальная инициализация
      options?.onAfterGsapReady?.({ gsap, ScrollTrigger, sections })
      ScrollTrigger.refresh()
    }

    // Defer scroll initialization until after LCP - уменьшено для лучшей производительности на десктопе
    // ВАЖНО: useStackScroll критичен для отображения секций на десктопе
    if (window.scheduler?.postTask) {
      window.scheduler.postTask(() => {
        initScroll()
      }, { priority: 'background', delay: 500 })
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initScroll()
      }, { timeout: 1000 })
    } else {
      setTimeout(() => {
        initScroll()
      }, 800)
    }
  })

  onUnmounted(() => {
    if (scrollTriggerRef) {
      scrollTriggerRef.getAll().forEach((trigger: { kill: () => void }) => trigger.kill())
    }
  })
}

