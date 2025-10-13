import { createRouter, createWebHistory } from 'vue-router'
import ServicesPage from '@/pages/ServicesPage.vue'
import GrowComponent from '@/components/services/GrowComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue')
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
      path: '/services/:id',
      name: 'service-detail',
      component: () => import('@/pages/ServiceDetailPage.vue'),
      meta: {
        title: 'Детали услуги'
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
