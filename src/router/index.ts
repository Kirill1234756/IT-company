import { createRouter, createWebHistory } from 'vue-router'
const ServicesPage = () => import('@/pages/ServicesPage.vue')
const GrowComponent = () => import('@/components/services/GrowComponent.vue')


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { title: 'Главная' }
    },
    {
      path: '/growth',
      name: 'growth',
      component: GrowComponent,
      meta: {
        title: 'Рост'
      }
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesPage,
      meta: {
        title: 'Наши услуги'
      }
    },
    {
      path: '/services/growth',
      name: 'services-growth',
      component: ServicesPage,
      meta: {
        title: 'Услуги роста'
      }
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('@/pages/CasesPage.vue'),
      meta: {
        title: 'cases'
      }
    },
    {
      path: '/client-form',
      name: 'client-form',
      component: () => import('@/pages/ClientFormPage.vue'),
      meta: {
        title: 'client-form'
      }
    },
    {
      path: '/services/strategy',
      name: 'services-strategy',
      component: ServicesPage,
      meta: {
        title: 'Стратегические услуги'
      }
    },
    {
      path: '/services/development',
      name: 'services-development',
      component: ServicesPage,
      meta: {
        title: 'Услуги разработки'
      }
    },
    {
      path: '/services/:id',
      name: 'service-detail',
      component: () => import('@/pages/ServiceDetailPage.vue'),
      meta: {
        title: 'Детали услуги'
      }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../sections/BlogSection.vue'),
      meta: {
        title: 'Блог'
      }
    },
    {
      path: '/become-client',
      name: 'become-client',
      component: () => import('@/pages/ClientFormPage.vue'),
      meta: {
        title: 'Стать клиентом'
      }
    }
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - IT Company`
  } else {
    document.title = 'IT Company'
  }
  next()
})

export default router
