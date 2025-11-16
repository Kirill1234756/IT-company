import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(true)
const progress = ref(0)
const isRouteChange = ref(false)

export const usePageLoader = () => {
  // Minimum loading time only for route changes (to avoid flash)
  const MIN_ROUTE_TIME = 300 // 0.3 second for route changes
  let startTime = Date.now()
  let loadingPromises: Promise<void>[] = []

  // Simulate loading progress with more realistic behavior
  const simulateProgress = () => {
    const interval = setInterval(() => {
      // More realistic progress simulation
      const timeElapsed = Date.now() - startTime
      const maxTime = isRouteChange.value ? MIN_ROUTE_TIME * 2 : 3000 // 3 seconds max for initial load
      const baseProgress = Math.min(timeElapsed / maxTime, 0.7) // Max 70%

      // Add some randomness but keep it smooth
      const randomFactor = Math.random() * 0.1 - 0.05 // -0.05 to 0.05
      progress.value = Math.min(baseProgress * 100 + randomFactor * 100, 70)
    }, 100)

    return interval
  }

  // Complete loading - wait for all promises or minimum time for route changes
  const completeLoading = async () => {
    const MAX_WAIT_TIME = 5000 // Максимум 5 секунд ожидания
    const startWaitTime = Date.now()

    // Wait for all loading promises to resolve with timeout
    if (loadingPromises.length > 0) {
      try {
        await Promise.race([
          Promise.all(loadingPromises),
          new Promise<void>((resolve) => {
            setTimeout(() => {
              // Таймаут - принудительно завершаем ожидание
              resolve()
            }, MAX_WAIT_TIME)
          })
        ])
      } catch (error) {
        // Игнорируем ошибки промисов, чтобы лоадер не зависал
      }
      loadingPromises = []
    }

    const timeElapsed = Date.now() - startTime
    const minTime = isRouteChange.value ? MIN_ROUTE_TIME : 0
    const remainingTime = Math.max(0, minTime - timeElapsed)

    // Максимальное время ожидания - 5 секунд
    const maxWaitTime = Math.min(remainingTime, MAX_WAIT_TIME - (Date.now() - startWaitTime))

    setTimeout(() => {
      progress.value = 100
      setTimeout(() => {
        isLoading.value = false
        isRouteChange.value = false
      }, 300) // Smooth fade out
    }, Math.max(0, maxWaitTime))
  }

  // Add a promise to wait for before hiding loader
  const addLoadingPromise = (promise: Promise<void>) => {
    loadingPromises.push(promise)
  }

  // Start loading for route changes
  const startRouteLoading = () => {
    isRouteChange.value = true
    startTime = Date.now()
    isLoading.value = true
    progress.value = 0
    return simulateProgress()
  }

  // Start loading for initial page load
  const startLoading = () => {
    isRouteChange.value = false
    startTime = Date.now()
    isLoading.value = true
    progress.value = 0
    return simulateProgress()
  }

  // Handle page load events - wait for window.load and Vue components
  const handlePageLoad = async () => {
    // Wait for window.load event
    if (document.readyState === 'complete') {
      // Wait a bit for Vue to mount and components to start loading
      await new Promise(resolve => setTimeout(resolve, 100))
      // Добавляем таймаут для completeLoading
      const timeout = setTimeout(() => {
        // Принудительно завершаем загрузку через 5 секунд
        isLoading.value = false
        isRouteChange.value = false
        progress.value = 100
      }, 5000)

      try {
        await completeLoading()
      } finally {
        clearTimeout(timeout)
      }
    }
  }

  // Initialize loader for initial page load
  const initLoader = () => {
    const interval = startLoading()

    // Listen for page load
    window.addEventListener('load', handlePageLoad)

    // Check if already loaded
    if (document.readyState === 'complete') {
      // Wait a bit for Vue to mount
      const timeout = setTimeout(() => {
        // Принудительно завершаем загрузку через 5 секунд
        clearInterval(interval)
        isLoading.value = false
        isRouteChange.value = false
        progress.value = 100
      }, 5000)

      setTimeout(async () => {
        clearInterval(interval)
        try {
          await completeLoading()
        } finally {
          clearTimeout(timeout)
        }
      }, 100)
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('load', handlePageLoad)
    }
  }

  // Initialize router loader
  const initRouterLoader = () => {
    const router = useRouter()
    let routeInterval: number | null = null

    // Show loader before route change
    router.beforeEach((to, from, next) => {
      // Don't show loader for same route
      if (to.path === from.path) {
        next()
        return
      }

      // Start route loading
      routeInterval = Number(startRouteLoading())
      next()
    })

    // Hide loader after route change
    router.afterEach(() => {
      if (routeInterval) {
        clearInterval(routeInterval)
        routeInterval = null
      }
      // Добавляем таймаут для route changes
      const timeout = setTimeout(() => {
        // Принудительно завершаем загрузку через 3 секунды для route changes
        isLoading.value = false
        isRouteChange.value = false
        progress.value = 100
      }, 3000)

      completeLoading().finally(() => {
        clearTimeout(timeout)
      })
    })

    return () => {
      if (routeInterval) {
        clearInterval(routeInterval)
      }
    }
  }

  return {
    isLoading,
    progress,
    isRouteChange,
    initLoader,
    initRouterLoader,
    completeLoading,
    startLoading,
    startRouteLoading,
    addLoadingPromise
  }
}
