/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMounted, onUnmounted, type Ref } from 'vue'

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
    // Defer heavy GSAP initialization to next frame/idle to avoid blocking LCP
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    if ('requestIdleCallback' in window) {
      await new Promise<void>((resolve) => (window as any).requestIdleCallback(() => resolve()))
    }

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    scrollTriggerRef = ScrollTrigger

    const root = stackContainer.value
    if (!root) return

    const sections = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.stack-section'))
    if (!sections.length) return

    // Layout stacked
    gsap.set(sections, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' })
    if (sections[0]) gsap.set(sections[0], { zIndex: 1, autoAlpha: 1 })
    sections.slice(1).forEach((s, i) => gsap.set(s, { zIndex: i + 2, autoAlpha: 0, yPercent: 100 }))

    const tl = gsap.timeline({
      defaults: { ease: 'sine.inOut', duration: 1.2 },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => '+=' + (sections.length - 1) * window.innerHeight,
        pin: true,
        scrub: 1,
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
      },
    })

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
    }

    options?.onAfterGsapReady?.({ gsap, ScrollTrigger, sections })
    ScrollTrigger.refresh()
  })

  onUnmounted(() => {
    if (scrollTriggerRef) {
      scrollTriggerRef.getAll().forEach((trigger: { kill: () => void }) => trigger.kill())
    }
  })
}

