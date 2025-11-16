import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyLoad from 'vue3-lazyload'
import { initGlobalPerformanceMonitoring } from './utils/performance'
import { installYandexMetrika } from './plugins/yandex-metrika'
import { createHead } from '@unhead/vue'

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)

// Отложенная загрузка не критичных плагинов для мобильных
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const nonCriticalDelay = isMobile ? 12000 : 5000

if (window.scheduler?.postTask) {
  window.scheduler.postTask(() => {
    app.use(VueLazyLoad, {
      loading: '/favicon.ico',
    })
    installYandexMetrika(app, router)
    initGlobalPerformanceMonitoring()
  }, { priority: 'background', delay: nonCriticalDelay })
} else if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    app.use(VueLazyLoad, {
      loading: '/favicon.ico',
    })
    installYandexMetrika(app, router)
    initGlobalPerformanceMonitoring()
  }, { timeout: nonCriticalDelay })
} else {
  setTimeout(() => {
    app.use(VueLazyLoad, {
      loading: '/favicon.ico',
    })
    installYandexMetrika(app, router)
    initGlobalPerformanceMonitoring()
  }, nonCriticalDelay)
}

// SEO: derive head tags from vue-router meta - отложено для мобильных
const seoDelay = isMobile ? 8000 : 3000
if (window.scheduler?.postTask) {
  window.scheduler.postTask(() => {
    router.afterEach((to) => {
      const meta = to.meta || {}
      const titlePart = typeof meta.title === 'string' ? meta.title : 'Kodify'
      const fullTitle = `${titlePart} - Kodify`
      const description = (meta as Record<string, unknown>).description as string || 'Веб‑компания полного цикла: разработка, поддержка, продвижение. Кейсы и блог.'
      const canonicalPath = (meta as Record<string, unknown>).canonicalPath as string || to.fullPath
      const ogImage = (meta as Record<string, unknown>).ogImage as string || '/og-image.jpg'

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
      const ogImage = (meta as Record<string, unknown>).ogImage as string || '/og-image.jpg'

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
      const ogImage = (meta as Record<string, unknown>).ogImage as string || '/og-image.jpg'

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
const jsonLdDelay = isMobile ? 12000 : 5000
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
