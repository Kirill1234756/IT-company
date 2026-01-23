/**
 * Unified GSAP loader to prevent multiple imports and improve bundle size
 * This composable ensures GSAP is loaded only once and shared across components
 */

import { ref, type Ref } from 'vue'

interface GsapInstance {
  gsap: typeof import('gsap').gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

// Global cache for GSAP instance
let gsapInstance: GsapInstance | null = null
let gsapLoadPromise: Promise<GsapInstance> | null = null

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

/**
 * Wait for LCP (Largest Contentful Paint) before loading GSAP
 * This improves TBT by deferring non-critical animations
 */
async function waitForLCP(): Promise<void> {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    // Fallback для старых браузеров
    const isMobile = typeof window !== 'undefined' && (window as Window).innerWidth < 768
    await new Promise((r) => setTimeout(r, isMobile ? 2000 : 1500))
    return
  }

  return new Promise((resolve) => {
    let lcpObserved = false
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      if (lastEntry && !lcpObserved) {
        lcpObserved = true
        lcpObserver.disconnect()
        // Увеличиваем задержку после LCP для лучшей производительности на мобильных
        const isMobile = typeof window !== 'undefined' && (window as Window).innerWidth < 768
        const delay = isMobile ? 2000 : 1000
        
        if (window.scheduler?.postTask) {
          window.scheduler.postTask(() => resolve(), { priority: 'background', delay })
        } else {
          setTimeout(() => resolve(), delay)
        }
      }
    })
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Fallback: если LCP не произошел за 5 секунд (мобильные) или 3 секунды (десктоп)
      // Увеличиваем задержку для лучшей производительности
      const isMobile = typeof window !== 'undefined' && (window as Window).innerWidth < 768
      const fallbackDelay = isMobile ? 5000 : 3000
      setTimeout(() => {
        if (!lcpObserved) {
          lcpObserved = true
          lcpObserver.disconnect()
          resolve()
        }
      }, fallbackDelay)
    } catch {
      // Fallback если PerformanceObserver не поддерживается
      const isMobile = typeof window !== 'undefined' && (window as Window).innerWidth < 768
      setTimeout(() => resolve(), isMobile ? 3000 : 2000)
    }
  })
}

/**
 * Loads GSAP and ScrollTrigger once, caches the result
 * @param delay - Optional delay before loading (for non-critical animations)
 * @param waitForLCPFirst - Wait for LCP before loading (default: true for better TBT)
 * @returns Promise with GSAP instance
 */
export async function loadGsap(delay: number = 0, waitForLCPFirst: boolean = true): Promise<GsapInstance> {
  // Return cached instance if available
  if (gsapInstance) {
    return gsapInstance
  }

  // Return existing promise if loading is in progress
  if (gsapLoadPromise) {
    return gsapLoadPromise
  }

  // Create new loading promise
  gsapLoadPromise = (async () => {
    // Wait for LCP first to improve TBT
    if (waitForLCPFirst) {
      await waitForLCP()
    }
    
    // Apply additional delay if specified
    if (delay > 0) {
      if (window.scheduler?.postTask) {
        await window.scheduler.postTask(() => {}, { priority: 'background', delay })
      } else if ('requestIdleCallback' in window) {
        await new Promise<void>((resolve) =>
          window.requestIdleCallback(() => resolve(), { timeout: delay })
        )
      } else {
        await new Promise((r) => setTimeout(r, delay))
      }
    }

    // Load GSAP core
    const { gsap } = await import('gsap')
    
    // Yield to break up long task
    if (window.scheduler?.postTask) {
      await window.scheduler.postTask(() => {}, { priority: 'background' })
    } else {
      await new Promise((r) => setTimeout(r, 0))
    }

    // Load ScrollTrigger
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    // Cache the instance
    gsapInstance = { gsap, ScrollTrigger }

    return gsapInstance
  })()

  return gsapLoadPromise
}

/**
 * Composable for using GSAP in Vue components
 * @param options - Options for GSAP loading
 * @returns Reactive refs and functions for GSAP usage
 */
export function useGsap(options?: {
  delay?: number
  priority?: 'user-blocking' | 'user-visible' | 'background'
  immediate?: boolean
}) {
  const gsap = ref<typeof import('gsap').gsap | null>(null)
  const scrollTrigger = ref<typeof import('gsap/ScrollTrigger').ScrollTrigger | null>(null)
  const isLoaded = ref(false)
  const isLoading = ref(false)

  const load = async () => {
    if (isLoaded.value || isLoading.value) {
      return
    }

    isLoading.value = true

    try {
      const delay = options?.delay || 0
      const instance = await loadGsap(delay)
      gsap.value = instance.gsap
      scrollTrigger.value = instance.ScrollTrigger
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load GSAP:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Auto-load if immediate is true
  if (options?.immediate !== false) {
    if (window.scheduler?.postTask) {
      window.scheduler.postTask(
        () => load(),
        { priority: options?.priority || 'background', delay: options?.delay || 0 }
      )
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(() => load(), { timeout: options?.delay || 0 })
    } else {
      setTimeout(() => load(), options?.delay || 0)
    }
  }

  return {
    gsap,
    scrollTrigger,
    isLoaded,
    isLoading,
    load,
  }
}


