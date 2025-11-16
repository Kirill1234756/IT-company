import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { useBlogStore } from '@/stores/blog'
import { usePortfolioStore } from '@/stores/portfolio'
import { getSEOConfig } from '@/config/seo'

const HomePage = () => import('@/pages/HomePage.vue')
const ServicesPage = () => import('@/pages/ServicesPage.vue')
const CasesPage = () => import('@/pages/CasesPage.vue')
const ClientFormPage = () => import('@/pages/ClientFormPage.vue')
const ContactPage = () => import('@/pages/ContactPage.vue')
const BlogPage = () => import('@/pages/BlogPage.vue')
const CalculatorPage = () => import('@/pages/CalculatorPage.vue')
const NotFound = () => import('@/pages/NotFound.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'Главная', description: 'Kodify — продажа сайтов и цифровых решений для развития бизнеса. Разработка корпоративных сайтов, интернет-магазинов, лендингов. Продвижение и поддержка. Портфолио и экспертный блог.', canonicalPath: '/', ogImage: '/og-image.jpg' }
    },
    {
      path: '/services',
      component: ServicesPage,
      meta: { title: 'Наши услуги', description: 'Создание сайтов: интернет‑магазины, корпоративные сайты, лендинги, мобильные приложения, промо, техподдержка.', canonicalPath: '/services', ogImage: '/og-image.jpg' },
      children: [
        // default /services → stay on ServicesPage
        { path: '', name: 'services', component: ServicesPage },
        // top-level short categories (aliases handled by ServicesPage itself)
        {
          path: 'growth',
          name: 'services-growth',
          component: ServicesPage,
          meta: {
            title: 'Услуги роста',
            description: 'Комплексное продвижение сайтов: SEO-оптимизация, контент-маркетинг, контекстная реклама, аналитика. Увеличиваем трафик и конверсию.',
            canonicalPath: '/services/growth',
            ogImage: '/og-image.jpg',
          },
        },
        {
          path: 'strategy',
          name: 'services-strategy',
          component: ServicesPage,
          meta: {
            title: 'Стратегические услуги',
            description: 'Разработка бизнес-стратегии, брендинг и позиционирование. Исследования рынка, анализ конкурентов, создание платформы бренда.',
            canonicalPath: '/services/strategy',
            ogImage: '/og-image.jpg',
          },
        },
        {
          path: 'development',
          name: 'services-development',
          component: ServicesPage,
          meta: {
            title: 'Услуги разработки',
            description: 'Разработка сайтов под ключ: корпоративные сайты, интернет-магазины, лендинги, SaaS-платформы. Интеграции и поддержка.',
            canonicalPath: '/services/development',
            ogImage: '/og-image.jpg',
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
      meta: { title: 'Кейсы', description: 'Портфолио реализованных проектов: интернет‑магазины, корпоративные сайты, лендинги и приложения.', canonicalPath: '/cases', ogImage: '/og-image.jpg' }
    },
    {
      path: '/cases/:projectTitle',
      name: 'portfolio-project',
      component: CasesPage,
      meta: {
        title: 'Проект портфолио',
        description: 'Детальное описание реализованного проекта. Технологии, этапы разработки, результаты и достижения.',
        canonicalPath: '/cases',
        ogImage: '/og-image.jpg',
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
      meta: { title: 'Блог', description: 'Создание и развитие сайтов: статьи, руководства, кейсы и аналитика.', canonicalPath: '/blog', ogImage: '/og-image.jpg' }
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: CalculatorPage,
      meta: {
        title: 'Калькулятор стоимости сайта',
        description: 'Рассчитайте стоимость разработки сайта за 60 секунд. Получите подробную смету в PDF и консультацию менеджера.',
        canonicalPath: '/calculator',
        ogImage: '/og-image.jpg',
      },
    },
    {
      path: '/blog/:category',
      name: 'blog-category',
      component: BlogPage,
      meta: {
        title: 'Категория блога',
        description: 'Статьи и материалы по теме. Экспертные статьи о разработке сайтов, продвижении и веб-технологиях.',
        canonicalPath: '/blog',
        ogImage: '/og-image.jpg',
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
        ogImage: '/og-image.jpg',
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
        ogImage: '/og-image.jpg',
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

// SEO: Load metadata from seo.ts config and dynamic routes
router.beforeEach((to, _from, next) => {
  try {
    // 1. Сначала загружаем из seo.ts конфигурации
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

    // 2. Для динамических роутов блога - загружаем description из store
    if (to.name === 'blog-post' || to.name === 'home-blog-post') {
      const { category, post } = to.params
      if (post && typeof post === 'string') {
        try {
          const blogStore = useBlogStore()
          const blogPost = blogStore.getPostBySlug(post)
          if (blogPost) {
            // Генерируем description из контента статьи
            const postDescription =
              blogPost.summary ||
              (blogPost.content && blogPost.content[0]?.text
                ? blogPost.content[0].text.substring(0, 160)
                : null) ||
              `Статья "${blogPost.title}" о разработке сайтов и веб-технологиях. Экспертные советы и практические рекомендации.`
            to.meta = {
              ...to.meta,
              title: `${blogPost.fullTitle || blogPost.title} - Блог`,
              description: postDescription.length > 160 ? postDescription.substring(0, 157) + '...' : postDescription,
              canonicalPath: `/blog/${category}/${post}`,
              ogImage: blogPost.image || '/og-image.jpg',
            }
          }
        } catch (error) {
          console.warn('Failed to load blog post metadata:', error)
        }
      }
    }

    // 3. Для динамических роутов портфолио - загружаем description из store
    if (to.name === 'portfolio-project') {
      const { projectTitle } = to.params
      if (projectTitle && typeof projectTitle === 'string') {
        try {
          const portfolioStore = usePortfolioStore()
          const project = portfolioStore.findProjectBySlug(projectTitle)
          if (project) {
            const technologiesText = project.technologies && project.technologies.length > 0
              ? ` Технологии: ${project.technologies.join(', ')}.`
              : ''
            const projectDescription =
              project.description ||
              `Проект "${project.title}". ${project.category}.${technologiesText} Детальное описание реализации и результатов.`
            to.meta = {
              ...to.meta,
              title: `${project.title} - Портфолио`,
              description: projectDescription.length > 160 ? projectDescription.substring(0, 157) + '...' : projectDescription,
              canonicalPath: `/cases/${projectTitle}`,
              ogImage: project.image || '/og-image.jpg',
            }
          }
        } catch (error) {
          console.warn('Failed to load portfolio project metadata:', error)
        }
      }
    }

    // 4. Для категорий блога - генерируем description на основе категории
    if (to.name === 'blog-category') {
      const { category } = to.params
      const categoryNames: Record<string, string> = {
        all: 'Все статьи',
        development: 'Разработка сайтов',
        marketing: 'Маркетинг и продвижение',
        design: 'Дизайн и UX',
        business: 'Бизнес и стратегия',
      }
      const categoryName = categoryNames[category as string] || category
      to.meta = {
        ...to.meta,
        title: `${categoryName} - Блог`,
        description: `Статьи по теме "${categoryName}". Экспертные материалы о разработке сайтов, веб-технологиях и продвижении.`,
        canonicalPath: `/blog/${category}`,
      }
    }

    // 5. Убеждаемся, что description всегда есть (fallback)
    if (!to.meta.description) {
      to.meta.description =
        to.meta.title && typeof to.meta.title === 'string'
          ? `${to.meta.title}. Kodify — продажа сайтов и цифровых решений для развития бизнеса.`
          : 'Kodify — продажа сайтов и цифровых решений для развития бизнеса. Разработка корпоративных сайтов, интернет-магазинов, лендингов. Продвижение и поддержка.'
    }

    next()
  } catch (error) {
    console.error('Error in router beforeEach:', error)
    // Fallback на главную при ошибке
    if (to.name !== 'home') {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

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
    const serviceOk = store.getServiceDetailBySlug(service) || (/^\d+$/.test(service) && store.getServiceDetail(Number(service)))
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
