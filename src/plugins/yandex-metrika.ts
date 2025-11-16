import type { App } from 'vue'
import type { Router } from 'vue-router'
import { useYandexMetrika } from '@/composables/useYandexMetrika'
import type { YandexMetrikaConfig } from '@/types/yandex-metrika'

/**
 * Плагин для интеграции Яндекс.Метрики с Vue приложением
 */
export function createYandexMetrikaPlugin(config?: Partial<YandexMetrikaConfig>) {
  return {
    install(app: App, options?: { router?: Router }) {
      const { init, trackPageView, isEnabled } = useYandexMetrika()

      // Инициализируем Яндекс.Метрику при установке плагина
      init(config)

      // Интегрируемся с Vue Router для автоматического отслеживания переходов
      if (options?.router) {
        const router = options.router

        // Отслеживаем переходы между страницами
        router.afterEach((to, from) => {
          // Небольшая задержка для корректного отслеживания
          setTimeout(() => {
            if (isEnabled.value) {
              trackPageView(
                to.fullPath,
                to.meta.title as string || document.title
              )
            }
          }, 100)
        })
      }

      // Предоставляем композабл глобально
      app.provide('yandexMetrika', useYandexMetrika())
    }
  }
}

/**
 * Установка плагина с конфигурацией по умолчанию
 */
export function installYandexMetrika(app: App, router?: Router) {
  const plugin = createYandexMetrikaPlugin({
    id: Number(import.meta.env.VITE_YANDEX_METRIKA_ID) || 104923147,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: 'dataLayer',
    ssr: false
  })

  app.use(plugin, { router })
}




