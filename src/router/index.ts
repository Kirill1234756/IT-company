import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationGeneric, RouteLocationNormalized } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { useBlogStore } from '@/stores/blog'
import { usePortfolioStore } from '@/stores/portfolio'
import { getSEOConfig, getBlogPostSEO } from '@/config/seo'
import { fetchSeoFromApi } from '@/services/seoService'

/** Called after deferred meta is computed so main can update head (avoids blocking navigation). */
export type MetaUpdatePayload = { title?: string; meta?: object[]; link?: object[] }
let metaUpdateCallback: ((payload: MetaUpdatePayload) => void) | null = null
export function setRouterMetaUpdateCallback(cb: (payload: MetaUpdatePayload) => void) {
  metaUpdateCallback = cb
}

const HomePage = () => import('@/pages/HomePage.vue')
const ServicesPage = () => import('@/pages/ServicesPage.vue')
const CasesPage = () => import('@/pages/CasesPage.vue')
const ClientFormPage = () => import('@/pages/ClientFormPage.vue')
const ContactPage = () => import('@/pages/ContactPage.vue')
const BlogPage = () => import('@/pages/BlogPage.vue')
const CalculatorPage = () => import('@/pages/CalculatorPage.vue')
const PackagesPage = () => import('@/pages/PackagesPage.vue')
const NotFound = () => import('@/pages/NotFound.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Главная: всегда показывать с main section, не восстанавливать прошлую позицию
    if (to.path === '/' || to.path === '/home') {
      return { top: 0, left: 0 }
    }
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // Внутри /services один и тот же layout: push категории/деталки не должен сбрасывать скролл наверх
    // (иначе конфликтует с scrollIntoView к блоку карточек в ServicesPage).
    if (to.path.startsWith('/services') && from.path.startsWith('/services')) {
      return false
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'Главная', description: 'Kodify — продажа сайтов и цифровых решений для развития бизнеса. Разработка корпоративных сайтов, интернет-магазинов, лендингов. Продвижение и поддержка. Портфолио и экспертный блог.', canonicalPath: '/', ogImage: '/og-image.webp' }
    },

    {
      path: '/services',
      component: ServicesPage,
      meta: { title: 'Наши услуги', description: 'Создание сайтов: интернет‑магазины, корпоративные сайты, лендинги, мобильные приложения, промо, техподдержка.', canonicalPath: '/services', ogImage: '/og-image.webp' },
      children: [
        // default /services → stay on ServicesPage
        { path: '', name: 'services', component: ServicesPage },
        // legacy slugs → hub or canonical category/service URLs
        { path: 'growth', redirect: '/services' },
        {
          path: 'growth/:service',
          redirect: (to) => redirectLegacyServicePath(to),
        },
        { path: 'strategy', redirect: '/services/strategy-positioning' },
        {
          path: 'strategy/:service',
          redirect: (to) => redirectLegacyServicePath(to),
        },
        { path: 'development', redirect: '/services/development-launch' },
        {
          path: 'development/:service',
          redirect: (to) => redirectLegacyServicePath(to),
        },
        {
          path: 'analytics-research',
          name: 'services-analytics-research',
          component: ServicesPage,
          meta: {
            title: 'Аналитика и исследования',
            description:
              'Аудит кампаний, исследования аудитории, анализ рынка и конкурентов. Решения на основе данных.',
            canonicalPath: '/services/analytics-research',
            ogImage: '/og-image.webp',
          },
        },
        {
          path: 'strategy-positioning',
          name: 'services-strategy-positioning',
          component: ServicesPage,
          meta: {
            title: 'Стратегия и позиционирование',
            description:
              'Маркетинговая стратегия, бизнес-план, брендинг и позиционирование на рынке.',
            canonicalPath: '/services/strategy-positioning',
            ogImage: '/og-image.webp',
          },
        },
        {
          path: 'development-launch',
          name: 'services-development-launch',
          component: ServicesPage,
          meta: {
            title: 'Разработка и запуск',
            description:
              'Разработка сайта, дизайн, интеграции, тексты и калькуляторы — запуск инструмента продаж.',
            canonicalPath: '/services/development-launch',
            ogImage: '/og-image.webp',
          },
        },
        {
          path: 'automation-growth',
          name: 'services-automation-growth',
          component: ServicesPage,
          meta: {
            title: 'Автоматизация и рост',
            description: 'Продвижение, CRM и автоматизация: больше заявок и прозрачная воронка.',
            canonicalPath: '/services/automation-growth',
            ogImage: '/og-image.webp',
          },
        },
        // dynamic categories and details with validation guards, same component
        {
          path: ':category',
          name: 'service-category',
          component: ServicesPage,
          meta: {
            title: 'Категория услуг',
            description: 'Услуги разработки, продвижения и стратегии. Профессиональные решения для вашего бизнеса.',
          },
          beforeEnter: (to) => validateCategory(to),
        },
        {
          path: ':category/:service',
          name: 'service-detail',
          component: ServicesPage,
          meta: {
            title: 'Детали услуги',
            description: 'Подробное описание услуги. Стоимость, сроки, технологический стек и примеры работ.',
          },
          beforeEnter: (to) => validateServiceDetail(to),
        },
      ],
    },
    {
      path: '/cases',
      name: 'cases',
      component: CasesPage,
      meta: { title: 'Кейсы', description: 'Портфолио реализованных проектов: интернет‑магазины, корпоративные сайты, лендинги и приложения.', canonicalPath: '/cases', ogImage: '/og-image.webp' }
    },
    {
      path: '/cases/:projectTitle',
      name: 'portfolio-project',
      component: CasesPage,
      meta: {
        title: 'Проект портфолио',
        description: 'Детальное описание реализованного проекта. Технологии, этапы разработки, результаты и достижения.',
        canonicalPath: '/cases',
        ogImage: '/og-image.webp',
      },
    },
    {
      path: '/client-form',
      name: 'client-form',
      component: ClientFormPage,
      meta: { title: 'Стать клиентом', description: 'Расскажите о задаче — рассчитаем стоимость и сроки разработки.', canonicalPath: '/client-form' }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactPage,
      meta: { title: 'Контакты', description: 'Свяжитесь с нами: телефон, почта, Telegram. Работаем по всей России.', canonicalPath: '/contacts' }
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogPage,
      meta: { title: 'Блог', description: 'Создание и развитие сайтов: статьи, руководства, кейсы и аналитика.', canonicalPath: '/blog', ogImage: '/og-image.webp' }
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: CalculatorPage,
      meta: {
        title: 'Калькулятор стоимости сайта',
        description: 'Рассчитайте стоимость разработки сайта за 60 секунд. Получите подробную смету в PDF и консультацию менеджера.',
        canonicalPath: '/calculator',
        ogImage: '/og-image.webp',
        /** Нужен для SEOContent: без h2Outline слоты секций не монтируются */
        h2Outline: ['Шаги', 'Результат', 'Что дальше'],
      },
    },
    {
      path: '/packages',
      name: 'packages',
      component: PackagesPage,
      meta: {
        title: 'Пакеты услуг',
        description: 'Превращаем сайт в инструмент продаж: выберите пакет под вашу задачу и начните получать заявки',
        canonicalPath: '/packages',
        ogImage: '/og-image.webp',
      },
    },
    {
      path: '/seo-core',
      name: 'seo-core',
      component: () => import('@/pages/SeoCorePage.vue'),
      meta: { title: 'SEO ядро', robots: 'noindex,nofollow' },
    },
    {
      path: '/blog/:category',
      name: 'blog-category',
      component: BlogPage,
      meta: {
        title: 'Категория блога',
        description: 'Статьи и материалы по теме. Экспертные статьи о разработке сайтов, продвижении и веб-технологиях.',
        canonicalPath: '/blog',
        ogImage: '/og-image.webp',
      },
    },
    {
      path: '/blog/:category/:post',
      name: 'blog-post',
      component: BlogPage,
      meta: {
        title: 'Статья блога',
        description: 'Экспертная статья о разработке сайтов, веб-технологиях и продвижении. Практические советы и кейсы.',
        canonicalPath: '/blog',
        ogImage: '/og-image.webp',
      },
    },
    // New route for blog posts opened from home page - made more specific
    {
      path: '/blog-post/:category/:post',
      name: 'home-blog-post',
      component: HomePage,
      meta: {
        title: 'Статья блога',
        description: 'Экспертная статья о разработке сайтов, веб-технологиях и продвижении. Практические советы и кейсы.',
        canonicalPath: '/blog',
        ogImage: '/og-image.webp',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: {
        title: 'Страница не найдена',
        description: 'Запрашиваемая страница не найдена. Вернитесь на главную или воспользуйтесь навигацией сайта.',
        noindex: true,
      },
    },
  ],
})

// Обработка ошибок роутера
router.onError((error) => {
  console.error('Router error:', error)
  // Перенаправляем на главную при ошибке загрузки компонента
  if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.href = '/'
  }
})

// SEO: minimal meta in beforeEach (non-blocking), heavy meta deferred to avoid main-thread work
function applyDeferredMeta(to: RouteLocationNormalized) {
  try {
    if (to.name === 'blog-post' || to.name === 'home-blog-post') {
      const { category, post } = to.params
      if (post && typeof post === 'string') {
        const blogStore = useBlogStore()
        const blogPost = blogStore.getPostBySlug(post)
        if (blogPost) {
          const blogSEO = getBlogPostSEO(post)
          if (blogSEO) {
            Object.assign(to.meta, {
              title: blogSEO.title || `${blogPost.fullTitle || blogPost.title} - Блог`,
              description: blogSEO.description || blogPost.summary ||
                (blogPost.content?.[0]?.text?.substring(0, 160) ?? `Статья "${blogPost.title}" о разработке сайтов и веб-технологиях.`),
              canonicalPath: `/blog/${category}/${post}`,
              h1: blogSEO.h1 || blogPost.fullTitle || blogPost.title,
              h2Outline: blogSEO.h2Outline ?? [],
              faq: blogSEO.faq ?? [],
              ogImage: blogPost.image || blogSEO.ogImage || '/og-image.webp',
            })
          } else {
            const postDescription = blogPost.summary ?? blogPost.content?.[0]?.text?.substring(0, 160) ?? `Статья "${blogPost.title}" о разработке сайтов и веб-технологиях.`
            Object.assign(to.meta, {
              title: `${blogPost.fullTitle || blogPost.title} - Блог`,
              description: postDescription.length > 160 ? postDescription.substring(0, 157) + '...' : postDescription,
              canonicalPath: `/blog/${category}/${post}`,
              ogImage: blogPost.image || '/og-image.webp',
            })
          }
        }
      }
    } else if (to.name === 'portfolio-project') {
      const { projectTitle } = to.params
      if (projectTitle && typeof projectTitle === 'string') {
        const portfolioStore = usePortfolioStore()
        const project = portfolioStore.findProjectBySlug(projectTitle)
        if (project) {
          const technologiesText = project.technologies?.length ? ` Технологии: ${project.technologies.join(', ')}.` : ''
          const projectDescription = project.description ?? `Проект "${project.title}". ${project.category}.${technologiesText}`
          Object.assign(to.meta, {
            title: `${project.title} - Портфолио`,
            description: projectDescription.length > 160 ? projectDescription.substring(0, 157) + '...' : projectDescription,
            canonicalPath: `/cases/${projectTitle}`,
            ogImage: project.image || '/og-image.webp',
          })
        }
      }
    } else if (to.name === 'blog-category') {
      const category = to.params.category as string
      const categoryNames: Record<string, string> = {
        all: 'Все статьи',
        development: 'Разработка сайтов',
        marketing: 'Маркетинг и продвижение',
        design: 'Дизайн и UX',
        business: 'Бизнес и стратегия',
      }
      const categoryName = categoryNames[category] || category
      Object.assign(to.meta, {
        title: `${categoryName} - Блог`,
        description: `Статьи по теме "${categoryName}". Экспертные материалы о разработке сайтов, веб-технологиях и продвижении.`,
        canonicalPath: `/blog/${category}`,
      })
    }

    const titlePart = typeof to.meta.title === 'string' ? to.meta.title : 'Kodify'
    const fullTitle = `${titlePart} - Kodify`
    const description = (to.meta.description as string) || 'Веб‑компания полного цикла: разработка, поддержка, продвижение. Кейсы и блог.'
    const canonicalPath = (to.meta.canonicalPath as string) || to.fullPath
    const ogImage = (to.meta.ogImage as string) || '/og-image.webp'
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru'
    metaUpdateCallback?.({
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: origin + canonicalPath },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'canonical', href: origin + canonicalPath }],
    })
  } catch (err) {
    console.warn('Deferred meta update failed:', err)
  }
}

router.beforeEach((to, _from, next) => {
  try {
    const seo = getSEOConfig(to.path)
    if (seo) {
      to.meta = {
        ...to.meta,
        title: seo.title,
        description: seo.description,
        canonicalPath: seo.canonicalPath,
        h1: seo.h1,
        h2Outline: seo.h2Outline,
        faq: seo.faq,
        ogImage: seo.ogImage,
      }
    }
    if (!to.meta.description) {
      to.meta.description =
        to.meta.title && typeof to.meta.title === 'string'
          ? `${to.meta.title}. Kodify — продажа сайтов и цифровых решений для развития бизнеса.`
          : 'Kodify — продажа сайтов и цифровых решений для развития бизнеса. Разработка корпоративных сайтов, интернет-магазинов, лендингов. Продвижение и поддержка.'
    }
    next()

    // Отложенная обработка meta для мобильных - не блокируем навигацию
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const deferredDelay = isMobile ? 1000 : 0
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => applyDeferredMeta(to), { timeout: deferredDelay + 2000 })
    } else {
      setTimeout(() => applyDeferredMeta(to), deferredDelay)
    }

    // Асинхронно подтягиваем SEO из backend, если есть запись в БД (пропускаем внутренние страницы без SEO в БД)
    const skipSeoApi = to.path === '/seo-core'
    if (typeof window !== 'undefined' && !skipSeoApi) {
      const path = to.path
      const city = (to.query?.city as string | undefined) || undefined
      const win = window as Window & {
        scheduler?: {
          postTask?: (cb: () => void, opts?: { priority?: string; delay?: number }) => void
        }
      }

      const scheduleFetch = () => {
        fetchSeoFromApi(path, city)
          .then((apiSeo) => {
            if (!apiSeo) return
            Object.assign(to.meta, {
              title: apiSeo.title,
              description: apiSeo.description,
              canonicalPath: apiSeo.canonicalPath,
              h1: apiSeo.h1,
              h2Outline: apiSeo.h2Outline,
              faq: apiSeo.faq,
              ogImage: apiSeo.ogImage,
            })
            applyDeferredMeta(to)
          })
          .catch(() => {
            // fallback: nothing, локальный seoConfig уже применён
          })
      }

      if (win.scheduler?.postTask) {
        win.scheduler.postTask(scheduleFetch, { priority: 'background', delay: deferredDelay + 500 })
      } else if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(scheduleFetch, { timeout: deferredDelay + 1500 })
      } else {
        setTimeout(scheduleFetch, deferredDelay + 500)
      }
    }
  } catch (error) {
    console.error('Error in router beforeEach:', error)
    if (to.name !== 'home') {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

/** Old /services/{growth|strategy|development}/:service → canonical /services/:category/:service */
function redirectLegacyServicePath(to: RouteLocationGeneric) {
  try {
    const store = useServicesStore()
    store.loadDataIfNeeded()
    const s = String(to.params.service ?? '')
    if (!s) return '/services'
    const cat = store.getCategorySlugForServiceSlug(s)
    return cat ? `/services/${cat}/${s}` : '/services'
  } catch {
    return '/services'
  }
}

// Route param validators
function validateCategory(to: RouteLocationNormalized) {
  try {
    const store = useServicesStore()
    const category = String(to.params.category || '')
    // allow slug or numeric id
    if (store.getCategoryBySlug(category) || (/^\d+$/.test(category) && store.getCategoryById(Number(category)))) {
      return true
    }
    // Fallback на страницу услуг
    return { name: 'services' }
  } catch (error) {
    console.error('Error validating category:', error)
    // Fallback на главную при ошибке
    return { name: 'home' }
  }
}

function validateServiceDetail(to: RouteLocationNormalized) {
  try {
    const store = useServicesStore()
    const category = String(to.params.category || '')
    const service = String(to.params.service || '')
    const categoryOk = store.getCategoryBySlug(category) || (/^\d+$/.test(category) && store.getCategoryById(Number(category)))
    const serviceOk =
      store.getCatalogItemBySlug(service) != null ||
      (/^\d+$/.test(service) && store.getCatalogItemById(Number(service)) != null)
    if (categoryOk && serviceOk) return true
    // Fallback на страницу услуг
    return { name: 'services' }
  } catch (error) {
    console.error('Error validating service detail:', error)
    // Fallback на главную при ошибке
    return { name: 'home' }
  }
}

export default router
