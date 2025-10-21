import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { useServicesStore } from '@/stores/services'

const HomePage = () => import('@/pages/HomePage.vue')
const ServicesPage = () => import('@/pages/ServicesPage.vue')
const CasesPage = () => import('@/pages/CasesPage.vue')
const ClientFormPage = () => import('@/pages/ClientFormPage.vue')
const ContactPage = () => import('@/pages/ContactPage.vue')
const BlogPage = () => import('@/pages/BlogPage.vue')
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
      meta: { title: 'Главная' }
    },
    {
      path: '/services',
      component: ServicesPage,
      meta: { title: 'Наши услуги' },
      children: [
        // default /services → stay on ServicesPage
        { path: '', name: 'services', component: ServicesPage },
        // top-level short categories (aliases handled by ServicesPage itself)
        { path: 'growth', name: 'services-growth', component: ServicesPage, meta: { title: 'Услуги роста' } },
        { path: 'strategy', name: 'services-strategy', component: ServicesPage, meta: { title: 'Стратегические услуги' } },
        { path: 'development', name: 'services-development', component: ServicesPage, meta: { title: 'Услуги разработки' } },
        // dynamic categories and details with validation guards, same component
        { path: ':category', name: 'service-category', component: ServicesPage, meta: { title: 'Категория услуг' }, beforeEnter: (to) => validateCategory(to) },
        { path: ':category/:service', name: 'service-detail', component: ServicesPage, meta: { title: 'Детали услуги' }, beforeEnter: (to) => validateServiceDetail(to) },
      ],
    },
    {
      path: '/cases',
      name: 'cases',
      component: CasesPage,
      meta: { title: 'Кейсы' }
    },
    {
      path: '/client-form',
      name: 'client-form',
      component: ClientFormPage,
      meta: { title: 'Стать клиентом' }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactPage,
      meta: { title: 'Контакты' }
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogPage,
      meta: { title: 'Блог' }
    },
    {
      path: '/blog/:category',
      name: 'blog-category',
      component: BlogPage,
      meta: { title: 'Категория блога' }
    },
    {
      path: '/blog/:category/:post',
      name: 'blog-post',
      component: BlogPage,
      meta: { title: 'Статья блога' }
    },
    // New route for blog posts opened from home page - made more specific
    {
      path: '/blog-post/:category/:post',
      name: 'home-blog-post',
      component: HomePage,
      meta: { title: 'Статья блога' }
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: 'Страница не найдена' } },
  ],
})

// Title + basic security hardening
router.beforeEach((to, _from, next) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'IT Company'
  document.title = `${title} - IT Company`
  next()
})

// Route param validators
function validateCategory(to: RouteLocationNormalized) {
  const store = useServicesStore()
  const category = String(to.params.category || '')
  // allow slug or numeric id
  if (store.getCategoryBySlug(category) || (/^\d+$/.test(category) && store.getCategoryById(Number(category)))) {
    return true
  }
  return { name: 'services' }
}

function validateServiceDetail(to: RouteLocationNormalized) {
  const store = useServicesStore()
  const category = String(to.params.category || '')
  const service = String(to.params.service || '')
  const categoryOk = store.getCategoryBySlug(category) || (/^\d+$/.test(category) && store.getCategoryById(Number(category)))
  const serviceOk = store.getServiceDetailBySlug(service) || (/^\d+$/.test(service) && store.getServiceDetail(Number(service)))
  if (categoryOk && serviceOk) return true
  return { name: 'services' }
}

export default router
