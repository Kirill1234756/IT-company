import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(true)
const progress = ref(0)
const isRouteChange = ref(false)

export const usePageLoader = () => {
  // Minimum loading time to avoid flash
  const MIN_LOADING_TIME = 1000 // 1 second
  const MIN_ROUTE_TIME = 500 // 0.5 second for route changes
  let startTime = Date.now()

  // Simulate loading progress with more realistic behavior
  const simulateProgress = () => {
    const interval = setInterval(() => {
      // More realistic progress simulation
      const timeElapsed = Date.now() - startTime
      const maxTime = isRouteChange.value ? MIN_ROUTE_TIME : MIN_LOADING_TIME * 2
      const baseProgress = Math.min(timeElapsed / maxTime, 0.7) // Max 70%

      // Add some randomness but keep it smooth
      const randomFactor = Math.random() * 0.1 - 0.05 // -0.05 to 0.05
      progress.value = Math.min(baseProgress * 100 + randomFactor * 100, 70)
    }, 100)

    return interval
  }

  // Complete loading with minimum time check
  const completeLoading = () => {
    const timeElapsed = Date.now() - startTime
    const minTime = isRouteChange.value ? MIN_ROUTE_TIME : MIN_LOADING_TIME
    const remainingTime = Math.max(0, minTime - timeElapsed)

    setTimeout(() => {
      progress.value = 100
      setTimeout(() => {
        isLoading.value = false
        isRouteChange.value = false
      }, 300) // Smooth fade out
    }, remainingTime)
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

  // Handle page load events
  const handlePageLoad = () => {
    if (document.readyState === 'complete') {
      completeLoading()
    }
  }

  // Initialize loader for initial page load
  const initLoader = () => {
    const interval = startLoading()

    // Listen for page load
    window.addEventListener('load', handlePageLoad)

    // Check if already loaded
    if (document.readyState === 'complete') {
      clearInterval(interval)
      completeLoading()
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
      routeInterval = startRouteLoading()
      next()
    })

    // Hide loader after route change
    router.afterEach(() => {
      if (routeInterval) {
        clearInterval(routeInterval)
        routeInterval = null
      }
      completeLoading()
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
    startRouteLoading
  }
}
