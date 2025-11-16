import { ref, onMounted, onUnmounted } from 'vue'
import type {
    YandexMetrikaConfig,
    YandexMetrikaParams,
    UserEvent,
    GoalParams,
    EcommerceParams,
    EcommerceItem,
    YandexMetrikaGoal,
    UserEventType
} from '@/types/yandex-metrika'
import { DEFAULT_METRIKA_CONFIG, METRIKA_EVENTS, METRIKA_GOALS } from '@/types/yandex-metrika'

/**
 * Композабл для работы с Яндекс.Метрикой
 * Предоставляет реактивные методы для отслеживания событий и целей
 */
export function useYandexMetrika() {
    const isInitialized = ref(false)
    const isEnabled = ref(false)
    const counterId = ref<number | null>(null)

    /**
     * Инициализация Яндекс.Метрики
     */
    const init = (config?: Partial<YandexMetrikaConfig>) => {
        // Проверяем, что мы в production режиме
        if (import.meta.env.MODE !== 'production') {
            console.log('Yandex Metrika: отключена в режиме разработки')
            return
        }

        // Получаем ID из переменных окружения или конфигурации
        const metrikaId = import.meta.env.VITE_YANDEX_METRIKA_ID || config?.id
        if (!metrikaId) {
            console.warn('Yandex Metrika: ID счётчика не найден')
            return
        }

        counterId.value = Number(metrikaId)
        const finalConfig: YandexMetrikaConfig = {
            ...DEFAULT_METRIKA_CONFIG,
            ...config,
            id: counterId.value
        }

        // Проверяем, что скрипт ещё не загружен
        if (window.ym) {
            console.log('Yandex Metrika: уже инициализирована')
            isInitialized.value = true
            isEnabled.value = true
            return
        }

        // Загружаем скрипт Яндекс.Метрики
        loadScript(() => {
            if (window.ym) {
                // Инициализируем счётчик
                window.ym(finalConfig.id, 'init', {
                    clickmap: finalConfig.clickmap,
                    trackLinks: finalConfig.trackLinks,
                    accurateTrackBounce: finalConfig.accurateTrackBounce,
                    webvisor: finalConfig.webvisor,
                    ecommerce: finalConfig.ecommerce,
                    ssr: finalConfig.ssr
                })

                isInitialized.value = true
                isEnabled.value = true
                console.log('Yandex Metrika: успешно инициализирована', finalConfig)
            }
        })
    }

    /**
     * Загрузка скрипта Яндекс.Метрики
     */
    const loadScript = (callback: () => void) => {
        // Проверяем, что скрипт ещё не загружен
        for (let i = 0; i < document.scripts.length; i++) {
            if (document.scripts?.[i]?.src === 'https://mc.yandex.ru/metrika/tag.js') {
                callback()
                return
            }
        }

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://mc.yandex.ru/metrika/tag.js'
        script.onload = callback

        const firstScript = document.getElementsByTagName('script')[0]
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript)
        } else {
            document.head.appendChild(script)
        }
    }

    /**
     * Отправка хита (просмотр страницы)
     */
    const hit = (url?: string, options?: YandexMetrikaParams) => {
        if (!isEnabled.value || !window.ym || !counterId.value) return

        try {
            window.ym(counterId.value, 'hit', url || window.location.href, options)
        } catch (error) {
            console.error('Yandex Metrika: ошибка отправки хита', error)
        }
    }

    /**
     * Достижение цели
     */
    const reachGoal = (goal: YandexMetrikaGoal, params?: YandexMetrikaParams, callback?: () => void) => {
        if (!isEnabled.value || !window.ym || !counterId.value) return

        try {
            window.ym(counterId.value, 'reachGoal', goal, params, callback)
            console.log('Yandex Metrika: цель достигнута', goal, params)
        } catch (error) {
            console.error('Yandex Metrika: ошибка достижения цели', error)
        }
    }

    /**
     * Отслеживание пользовательского события
     */
    const trackEvent = (event: UserEvent) => {
        if (!isEnabled.value) return

        console.log('Yandex Metrika: событие', event)

        // Определяем цель на основе типа события
        let goal: YandexMetrikaGoal | null = null
        const eventParams: YandexMetrikaParams = {
            event_type: event.type,
            ...event.params
        }

        switch (event.type) {
            case METRIKA_EVENTS.FORM_SUBMIT:
                goal = METRIKA_GOALS.FORM_SUBMIT
                break
            case METRIKA_EVENTS.BLOG_VIEW:
                goal = METRIKA_GOALS.BLOG_VIEW
                break
            case METRIKA_EVENTS.PORTFOLIO_VIEW:
                goal = METRIKA_GOALS.PORTFOLIO_VIEW
                break
            case METRIKA_EVENTS.SERVICE_VIEW:
                goal = METRIKA_GOALS.SERVICE_VIEW
                break
            case METRIKA_EVENTS.NAVIGATION_CLICK:
                goal = METRIKA_GOALS.NAVIGATION_CLICK
                break
            case METRIKA_EVENTS.CTA_CLICK:
                goal = METRIKA_GOALS.CTA_CLICK
                break
            case METRIKA_EVENTS.MODAL_OPEN:
                goal = METRIKA_GOALS.MODAL_OPEN
                break
            case METRIKA_EVENTS.BUTTON_CLICK:
                goal = METRIKA_GOALS.BUTTON_CLICK
                break
        }

        if (goal) {
            reachGoal(goal, eventParams)
        } else {
            // Для событий без цели отправляем хит
            hit(undefined, eventParams)
        }
    }

    /**
     * Удобные методы для частых событий
     */
    const trackPageView = (url?: string, title?: string) => {
        trackEvent({
            type: METRIKA_EVENTS.PAGE_VIEW,
            params: {
                page_title: title || document.title,
                page_url: url || window.location.href
            }
        })
    }

    const trackFormSubmit = (formName: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.FORM_SUBMIT,
            target: formName,
            params: {
                form_name: formName,
                ...params
            }
        })
    }

    const trackButtonClick = (buttonName: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.BUTTON_CLICK,
            target: buttonName,
            params: {
                button_name: buttonName,
                ...params
            }
        })
    }

    const trackModalOpen = (modalName: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.MODAL_OPEN,
            target: modalName,
            params: {
                modal_name: modalName,
                ...params
            }
        })
    }

    const trackServiceView = (serviceName: string, category?: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.SERVICE_VIEW,
            target: serviceName,
            category: category ?? '',
            params: {
                service_name: serviceName,
                service_category: category ?? '',
                ...params
            }
        })
    }

    const trackBlogView = (postTitle: string, category?: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.BLOG_VIEW,
            target: postTitle,
            category: category ?? '',
            params: {
                post_title: postTitle,
                post_category: category ?? '',
                ...params
            }
        })
    }

    const trackPortfolioView = (projectName: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.PORTFOLIO_VIEW,
            target: projectName,
            params: {
                project_name: projectName,
                ...params
            }
        })
    }

    const trackNavigationClick = (menuItem: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.NAVIGATION_CLICK,
            target: menuItem,
            params: {
                menu_item: menuItem,
                ...params
            }
        })
    }

    const trackCtaClick = (ctaName: string, params?: YandexMetrikaParams) => {
        trackEvent({
            type: METRIKA_EVENTS.CTA_CLICK,
            target: ctaName,
            params: {
                cta_name: ctaName,
                ...params
            }
        })
    }

    /**
     * E-commerce методы
     */
    const trackPurchase = (orderId: string, total: number, items: EcommerceItem[], params?: EcommerceParams) => {
        if (!isEnabled.value || !window.ym || !counterId.value) return

        try {
            window.ym(counterId.value, 'ecommerce', 'purchase', {
                orderId,
                total,
                items,
                ...params
            })
        } catch (error) {
            console.error('Yandex Metrika: ошибка e-commerce', error)
        }
    }

    const trackAddToCart = (item: EcommerceItem, params?: EcommerceParams) => {
        if (!isEnabled.value || !window.ym || !counterId.value) return

        try {
            window.ym(counterId.value, 'ecommerce', 'add', {
                items: [item],
                ...params
            })
        } catch (error) {
            console.error('Yandex Metrika: ошибка добавления в корзину', error)
        }
    }

    /**
     * Получение информации о счётчике
     */
    const getCounterInfo = () => {
        return {
            isInitialized: isInitialized.value,
            isEnabled: isEnabled.value,
            counterId: counterId.value
        }
    }

    return {
        // Состояние
        isInitialized,
        isEnabled,
        counterId,

        // Основные методы
        init,
        hit,
        reachGoal,
        trackEvent,

        // Удобные методы
        trackPageView,
        trackFormSubmit,
        trackButtonClick,
        trackModalOpen,
        trackServiceView,
        trackBlogView,
        trackPortfolioView,
        trackNavigationClick,
        trackCtaClick,

        // E-commerce
        trackPurchase,
        trackAddToCart,

        // Утилиты
        getCounterInfo
    }
}









