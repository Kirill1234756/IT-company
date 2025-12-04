/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, onUnmounted, nextTick, type Ref } from 'vue'

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

  onMounted(() => {
    const initScroll = async () => {
      // Ждем, пока Vue полностью отрендерит компоненты
      await nextTick()
      await nextTick()
      await nextTick()

      // Увеличиваем начальную задержку для async компонентов
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background', delay: 1200 })
      } else if ('requestIdleCallback' in window) {
        await new Promise((resolve) => window.requestIdleCallback(() => resolve(null), { timeout: 3000 }))
        await new Promise((resolve) => setTimeout(resolve, 1200))
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      const root = stackContainer.value
      if (!root) {
        console.error('[useStackScroll] Root container not found')
        return
      }

      // Функция для проверки, что секции полностью загружены
      const areSectionsReady = (sections: HTMLElement[]) => {
        if (!sections.length) return false
        // Проверяем, что все секции имеют размеры (загружены) и видны
        return sections.every(section => {
          const rect = section.getBoundingClientRect()
          const hasSize = rect.width > 0 && rect.height > 0
          const isInDOM = section.isConnected
          return hasSize && isInDOM
        })
      }

      // Ждем появления ВСЕХ секций в DOM (для async компонентов)
      const expectedSectionsCount = 5
      let sections: HTMLElement[] = []
      let attempts = 0
      const maxAttempts = 50 // Увеличено для async компонентов

      // Retry механизм с проверкой размеров секций
      while ((sections.length < expectedSectionsCount || !areSectionsReady(sections)) && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const foundSections = Array.from(root.querySelectorAll('.stack-section')) as HTMLElement[]
        sections = foundSections.filter(section => section.classList.contains('stack-section'))
        attempts++

        if (sections.length >= expectedSectionsCount && areSectionsReady(sections)) {
          break
        }
      }

      if (!sections.length) {
        console.error('[useStackScroll] No sections found after', attempts, 'attempts')
        // Пробуем найти хотя бы одну секцию
        const fallbackSections = Array.from(root.querySelectorAll('.stack-section')) as HTMLElement[]
        if (fallbackSections.length > 0) {
          sections = fallbackSections
          console.warn('[useStackScroll] Using fallback sections:', sections.length)
        } else {
          return
        }
      }

      if (sections.length < expectedSectionsCount) {
        console.warn(`[useStackScroll] Expected ${expectedSectionsCount} sections, found ${sections.length}. Continuing anyway...`)
      }

      console.log('[useStackScroll] Found', sections.length, 'sections after', attempts, 'attempts')

      // Загрузить GSAP после того, как секции найдены
      const { gsap } = await import('gsap')

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      gsap.registerPlugin(ScrollTrigger)
      scrollTriggerRef = ScrollTrigger

      // Очистка существующих триггеров
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

      // Убеждаемся, что страница в начале перед инициализацией
      // Это важно для правильной работы ScrollTrigger
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'instant' })
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Дополнительное ожидание для стабилизации DOM
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Настройка контейнера
      // Для ScrollTrigger с pinning контейнер должен иметь высоту, достаточную для скролла
      // Высота будет установлена через pinSpacing автоматически
      gsap.set(root, {
        height: 'auto',
        minHeight: '100vh', // Минимальная высота - одна секция, остальное добавит pinSpacing
        overflow: 'visible',
        backgroundColor: 'transparent',
        position: 'relative'
      })

      // НЕ блокируем скролл на body/html - ScrollTrigger нужен скролл для работы
      // ScrollTrigger будет управлять скроллом через pinning

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      // Настройка секций через GSAP
      // Используем force3D для аппаратного ускорения
      // Важно: overflowY должен быть 'visible' или 'hidden', чтобы не блокировать скролл страницы
      sections.forEach((section, index) => {
        gsap.set(section, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflowY: 'visible', // Изменено с 'auto' - не блокируем скролл страницы
          overflowX: 'hidden',
          force3D: true,
          zIndex: index + 1
        })
      })

      // Начальное состояние секций
      if (sections[0]) {
        gsap.set(sections[0], {
          zIndex: sections.length,
          autoAlpha: 1,
          yPercent: 0,
          force3D: true
        })
      }
      sections.slice(1).forEach((s, i) => {
        gsap.set(s, {
          zIndex: sections.length - i - 1,
          autoAlpha: 0,
          yPercent: 100,
          force3D: true
        })
      })

      // Дополнительное ожидание для применения стилей
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 50))

      // Убраны wheel listeners - они блокировали скролл страницы
      // ScrollTrigger будет управлять скроллом напрямую через pinning
      // Если внутри секций есть скроллируемый контент, он будет работать через CSS overflow

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      // Создание timeline
      // ScrollDistance должен быть равен высоте скролла для всех секций кроме первой
      const scrollDistance = (sections.length - 1) * window.innerHeight
      console.log('[useStackScroll] Initializing timeline:', {
        sectionsCount: sections.length,
        scrollDistance,
        rootHeight: root.offsetHeight,
        windowHeight: window.innerHeight,
        rootPosition: root.getBoundingClientRect()
      })

      // Убеждаемся, что root имеет правильную позицию
      const rootRect = root.getBoundingClientRect()
      if (rootRect.top !== 0) {
        // Если root не в начале страницы, скроллим к нему
        window.scrollTo({ top: 0, behavior: 'instant' })
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const tl = gsap.timeline({
        defaults: { ease: 'sine.inOut', duration: 1 },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: true,
          scrub: 1, // Увеличено для более плавного скролла
          snap: options?.snap
            ? {
              snapTo: 1 / (sections.length - 1),
              duration: { min: 0.3, max: 0.8 },
              delay: 0.1,
              directional: false,
            }
            : undefined,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          anticipatePin: 1,
          pinSpacing: true,
          markers: false, // Включите для отладки: true
          onUpdate: (self) => {
            // Отладочная информация
            console.log('[useStackScroll] ScrollTrigger progress:', self.progress.toFixed(3))
          },
          onEnter: () => {
            console.log('[useStackScroll] ScrollTrigger entered')
          },
          onLeave: () => {
            console.log('[useStackScroll] ScrollTrigger left')
          },
          onEnterBack: () => {
            console.log('[useStackScroll] ScrollTrigger entered back')
          },
          onLeaveBack: () => {
            console.log('[useStackScroll] ScrollTrigger left back')
          }
        },
      })

      console.log('[useStackScroll] Timeline created, ScrollTrigger count:', ScrollTrigger.getAll().length)

      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => { }, { priority: 'background' })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      // Настройка анимаций секций
      // Важно: анимации должны быть синхронизированы правильно
      // Позиции в timeline должны быть равномерно распределены от 0 до sections.length - 1
      for (let i = 1; i < sections.length; i++) {
        const prev = sections[i - 1]
        const next = sections[i]
        // Позиция в timeline: равномерно распределяем от 0 до sections.length - 1
        // Каждая секция занимает 1 единицу времени в timeline
        const position = i - 1

        if (prev) {
          tl.to(prev, {
            autoAlpha: 0,
            yPercent: -100,
            zIndex: sections.length - i,
            duration: 1,
            ease: 'power2.inOut',
            force3D: true
          }, position)
        }
        if (next) {
          tl.fromTo(
            next,
            {
              autoAlpha: 0,
              yPercent: 100,
              zIndex: sections.length - i,
              force3D: true
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              zIndex: sections.length - i + 1,
              duration: 1,
              ease: 'power2.inOut',
              force3D: true
            },
            position
          )
        }
      }

      console.log('[useStackScroll] Animations configured for', sections.length, 'sections')

      // Финальная инициализация
      if (options?.onAfterGsapReady) {
        options.onAfterGsapReady({ gsap, ScrollTrigger, sections })
      }

      // Дополнительное ожидание перед refresh для гарантии рендера
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Обновляем ScrollTrigger несколько раз для гарантии правильной работы
      ScrollTrigger.refresh()

      // Дополнительный refresh после небольшой задержки для async компонентов
      setTimeout(() => {
        ScrollTrigger.refresh()
        console.log('[useStackScroll] ScrollTrigger refreshed, active triggers:', ScrollTrigger.getAll().length)

        // Проверяем, что анимация работает
        const activeTrigger = ScrollTrigger.getAll().find((t: any) => t.vars?.trigger === root)
        if (activeTrigger) {
          console.log('[useStackScroll] ScrollTrigger is active and ready')
        } else {
          console.warn('[useStackScroll] ScrollTrigger may not be properly initialized')
        }
      }, 500)
    }

    // Запуск инициализации с использованием scheduler или requestIdleCallback
    if (window.scheduler?.postTask) {
      window.scheduler.postTask(() => {
        initScroll().catch((error) => {
          console.error('[useStackScroll] Initialization error:', error)
        })
      }, { priority: 'background' })
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initScroll().catch((error) => {
          console.error('[useStackScroll] Initialization error:', error)
        })
      }, { timeout: 2000 })
    } else {
      setTimeout(() => {
        initScroll().catch((error) => {
          console.error('[useStackScroll] Initialization error:', error)
        })
      }, 1500)
    }
  })

  onUnmounted(async () => {
    if (scrollTriggerRef) {
      scrollTriggerRef.getAll().forEach((trigger: { kill: () => void }) => trigger.kill())
    }
    // Очистка стилей контейнера
    const root = stackContainer.value
    if (root) {
      try {
        const { gsap } = await import('gsap')
        gsap.set(root, { clearProps: 'all' })
      } catch {
        // GSAP не загружен, просто очищаем стили вручную
        root.style.height = ''
        root.style.minHeight = ''
      }
    }
  })
}
