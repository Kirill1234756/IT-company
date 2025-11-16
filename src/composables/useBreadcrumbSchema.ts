import { computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { useBlogStore } from '@/stores/blog'

interface BreadcrumbItem {
    '@type': 'ListItem'
    position: number
    name: string
    url: string
}

/**
 * Генерирует BreadcrumbList schema для Яндекса
 * Соответствует требованиям: https://yandex.ru/support/webmaster/schema-org/breadcrumbs.html
 */
export function useBreadcrumbSchema(route: RouteLocationNormalized) {
    const servicesStore = useServicesStore()
    const blogStore = useBlogStore()

    const schema = computed(() => {
        const baseUrl =
            typeof window !== 'undefined' ? window.location.origin : 'https://kodifyweb.ru'
        const items: BreadcrumbItem[] = []

        // Функция для получения названия из route
        const getBreadcrumbName = (path: string, segment: string, index: number): string => {
            // Для главной страницы
            if (path === '/') return 'Главная'

            // Для услуг - используем данные из stores
            if (path.startsWith('/services')) {
                const { category, service } = route.params

                if (service && index === 2) {
                    // Детальная страница услуги
                    const serviceDetail = servicesStore.getServiceDetailBySlug(String(service))
                    if (serviceDetail?.title) return serviceDetail.title
                }

                if (category && index === 1) {
                    // Категория услуг
                    const categoryData = servicesStore.getCategoryBySlug(String(category))
                    if (categoryData?.title) return categoryData.title

                    // Fallback для известных категорий
                    if (category === 'development') return 'Разработка'
                    if (category === 'growth') return 'Рост'
                    if (category === 'strategy') return 'Стратегия'
                }

                if (segment === 'services') return 'Услуги'
            }

            // Для блога
            if (path.startsWith('/blog')) {
                const { category, post } = route.params

                if (post && index === 2) {
                    // Статья блога
                    const blogPost = blogStore.getPostBySlug(String(post))
                    if (blogPost?.title) return blogPost.title
                }

                if (category && index === 1) {
                    // Категория блога
                    const tab = blogStore.tabs.find((t) => t.id === String(category))
                    if (tab?.name) return tab.name
                }

                if (segment === 'blog') return 'Блог'
            }

            // Для других страниц используем meta.title или генерируем из segment
            const routeMeta = route.matched.find((r) => r.path === path || r.path.includes(segment))
            if (routeMeta?.meta?.title) {
                return String(routeMeta.meta.title)
            }

            // Fallback: генерируем из segment
            return segment
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        }

        // Всегда добавляем главную
        items.push({
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            url: `${baseUrl}/`,
        })

        // Строим breadcrumbs из пути
        const pathSegments = route.path.split('/').filter(Boolean)
        let currentPath = ''

        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`
            const position = index + 2 // Начинаем с 2 (Главная = 1)

            const name = getBreadcrumbName(currentPath, segment, index)

            // Проверка: название должно быть не менее 4 символов (требование Яндекса)
            // Исключение для коротких, но важных слов
            const shortImportantWords = ['Рост', 'Блог', 'Кейсы']
            if (name.length < 4 && !shortImportantWords.includes(name)) {
                return // Пропускаем слишком короткие элементы
            }

            items.push({
                '@type': 'ListItem',
                position,
                name,
                url: `${baseUrl}${currentPath}`,
            })
        })

        // Ограничиваем до 3 элементов (рекомендация Яндекса)
        // Берем последние 3 элемента (включая главную)
        const limitedItems = items.slice(-3)

        // Убеждаемся, что последний элемент не имеет URL (текущая страница)
        if (limitedItems.length > 0) {
            const lastItem = limitedItems[limitedItems.length - 1]
            // Последний элемент может иметь URL, но Яндекс рекомендует его оставить
            // для правильной индексации
        }

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: limitedItems,
        }
    })

    return { schema }
}



