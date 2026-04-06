import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyLoad from 'vue3-lazyload'
import { initGlobalPerformanceMonitoring } from './utils/performance'
import { installYandexMetrika } from './plugins/yandex-metrika'
import { createHead } from '@unhead/vue'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router, { setRouterMetaUpdateCallback } from './router'
import './style.css'

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

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)
app.use(MotionPlugin)
setRouterMetaUpdateCallback((payload) => head.push(payload))

// Отложенная загрузка не критичных плагинов до после LCP
const isMobile = typeof window !== 'undefined' && (window as Window).innerWidth < 768

// Функция для загрузки некритичных плагинов
const loadNonCriticalPlugins = () => {
  // Увеличиваем задержку на мобильных для лучшей производительности (4s вместо 2s)
  const pluginDelay = isMobile ? 4000 : 1500
  
  const win = window as Window & { scheduler?: Scheduler }
  if (win.scheduler?.postTask) {
    win.scheduler.postTask(() => {
      app.use(VueLazyLoad, {
        loading: '/favicon.ico',
      })
      installYandexMetrika(app, router)
      initGlobalPerformanceMonitoring()
    }, { priority: 'background', delay: pluginDelay })
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      app.use(VueLazyLoad, {
        loading: '/favicon.ico',
      })
      installYandexMetrika(app, router)
      initGlobalPerformanceMonitoring()
    }, { timeout: pluginDelay })
  } else {
    setTimeout(() => {
      app.use(VueLazyLoad, {
        loading: '/favicon.ico',
      })
      installYandexMetrika(app, router)
      initGlobalPerformanceMonitoring()
    }, pluginDelay)
  }
}

// Используем PerformanceObserver для отслеживания LCP
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  let lcpObserved = false
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number; startTime?: number }
    
    if (lastEntry && !lcpObserved) {
      lcpObserved = true
      lcpObserver.disconnect()
      
      // Загружаем некритичные плагины после LCP с увеличенной задержкой для лучшей производительности
      const delay = isMobile ? 5000 : 2500
      const win = window as Window & { scheduler?: Scheduler }
      if (win.scheduler?.postTask) {
        win.scheduler.postTask(loadNonCriticalPlugins, { priority: 'background', delay })
      } else if ('requestIdleCallback' in window) {
        requestIdleCallback(loadNonCriticalPlugins, { timeout: delay })
      } else {
        setTimeout(loadNonCriticalPlugins, delay)
      }
    }
  })
  
  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    
    // Fallback: если LCP не произошел за 5 секунд (мобильные) или 3 секунды (десктоп)
    const fallbackDelay = isMobile ? 5000 : 3000
    setTimeout(() => {
      if (!lcpObserved) {
        lcpObserved = true
        lcpObserver.disconnect()
        loadNonCriticalPlugins()
      }
    }, fallbackDelay)
  } catch {
    // Fallback если PerformanceObserver не поддерживается
    const fallbackDelay = isMobile ? 5000 : 3000
    const win = window as Window & { scheduler?: Scheduler }
    if (win.scheduler?.postTask) {
      win.scheduler.postTask(loadNonCriticalPlugins, { priority: 'background', delay: fallbackDelay })
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(loadNonCriticalPlugins, { timeout: fallbackDelay })
    } else {
      setTimeout(loadNonCriticalPlugins, fallbackDelay)
    }
  }
} else {
  // Fallback для старых браузеров
  const fallbackDelay = isMobile ? 3000 : 2000
  const win = window as Window & { scheduler?: Scheduler }
  if (win.scheduler?.postTask) {
    win.scheduler.postTask(loadNonCriticalPlugins, { priority: 'background', delay: fallbackDelay })
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(loadNonCriticalPlugins, { timeout: fallbackDelay })
  } else {
    setTimeout(loadNonCriticalPlugins, fallbackDelay)
  }
}

// SEO: derive head tags from vue-router meta - отложено для мобильных
const seoDelay = isMobile ? 6000 : 3000
  const win = window as Window & { scheduler?: Scheduler }
  if (win.scheduler?.postTask) {
    win.scheduler.postTask(() => {
      router.afterEach((to) => {
      const meta = to.meta || {}
      const titlePart = typeof meta.title === 'string' ? meta.title : 'Kodify'
      const fullTitle = `${titlePart} - Kodify`
      const description = (meta as Record<string, unknown>).description as string || 'Веб‑компания полного цикла: разработка, поддержка, продвижение. Кейсы и блог.'
      const canonicalPath = (meta as Record<string, unknown>).canonicalPath as string || to.fullPath
      const ogImage = (meta as Record<string, unknown>).ogImage as string || '/og-image.webp'

      head.push({
        title: fullTitle,
        meta: [
          { name: 'description', content: description },
          { property: 'og:title', content: fullTitle },
          { property: 'og:description', content: description },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + canonicalPath : canonicalPath },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
        ],
        link: [
          { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + canonicalPath : canonicalPath },
        ],
      })
    })
  }, { priority: 'background', delay: seoDelay })
} else if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    router.afterEach((to) => {
      const meta = to.meta || {}
      const titlePart = typeof meta.title === 'string' ? meta.title : 'Kodify'
      const fullTitle = `${titlePart} - Kodify`
      const description = (meta as Record<string, unknown>).description as string || 'Веб‑компания полного цикла: разработка, поддержка, продвижение. Кейсы и блог.'
      const canonicalPath = (meta as Record<string, unknown>).canonicalPath as string || to.fullPath
      const ogImage = (meta as Record<string, unknown>).ogImage as string || '/og-image.webp'

      head.push({
        title: fullTitle,
        meta: [
          { name: 'description', content: description },
          { property: 'og:title', content: fullTitle },
          { property: 'og:description', content: description },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + canonicalPath : canonicalPath },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
        ],
        link: [
          { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + canonicalPath : canonicalPath },
        ],
      })
    })
  }, { timeout: seoDelay })
} else {
  setTimeout(() => {
    router.afterEach((to) => {
      const meta = to.meta || {}
      const titlePart = typeof meta.title === 'string' ? meta.title : 'Kodify'
      const fullTitle = `${titlePart} - Kodify`
      const description = (meta as Record<string, unknown>).description as string || 'Веб‑компания полного цикла: разработка, поддержка, продвижение. Кейсы и блог.'
      const canonicalPath = (meta as Record<string, unknown>).canonicalPath as string || to.fullPath
      const ogImage = (meta as Record<string, unknown>).ogImage as string || '/og-image.webp'

      head.push({
        title: fullTitle,
        meta: [
          { name: 'description', content: description },
          { property: 'og:title', content: fullTitle },
          { property: 'og:description', content: description },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: typeof window !== 'undefined' ? window.location.origin + canonicalPath : canonicalPath },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
        ],
        link: [
          { rel: 'canonical', href: typeof window !== 'undefined' ? window.location.origin + canonicalPath : canonicalPath },
        ],
      })
    })
  }, seoDelay)
}

// Global Organization / WebSite JSON-LD - отложено для мобильных
const jsonLdDelay = isMobile ? 5000 : 3000
if (window.scheduler?.postTask) {
  window.scheduler.postTask(() => {
    head.push({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Kodify',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru',
            logo: '/favicon.ico',
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kodify',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: (typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru') + '/search?q={search_term_string}',
              },
              query: 'required name=search_term_string',
            },
          }),
        },
      ],
    })
  }, { priority: 'background', delay: jsonLdDelay })
} else if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    head.push({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Kodify',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru',
            logo: '/favicon.ico',
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kodify',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: (typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru') + '/search?q={search_term_string}',
              },
              query: 'required name=search_term_string',
            },
          }),
        },
      ],
    })
  }, { timeout: jsonLdDelay })
} else {
  setTimeout(() => {
    head.push({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Kodify',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru',
            logo: '/favicon.ico',
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kodify',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: (typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru') + '/search?q={search_term_string}',
              },
              query: 'required name=search_term_string',
            },
          }),
        },
      ],
    })
  }, jsonLdDelay)
}

app.mount('#app')

// Preload MainSection chunk for home route - только на десктопе и после первого рендера
if (typeof window !== 'undefined') {
  const prefetchMainSection = () => {
    // Prefetch только на десктопе и только для главной страницы
    if (!isMobile && (window.location.pathname === '/' || window.location.pathname === '/home')) {
      void import('./components/sections/MainSection.vue')
    }
  }
  // На мобильных не prefetch'им, чтобы не тратить bandwidth
  // На десктопе prefetch после первого рендера через requestIdleCallback
  if (!isMobile) {
    if (typeof requestIdleCallback !== 'undefined') {
      // Задержка для prefetch после первого рендера
      requestIdleCallback(prefetchMainSection, { timeout: 3000 })
    } else {
      setTimeout(prefetchMainSection, 2000)
    }
  }
}
