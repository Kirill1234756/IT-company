// Global performance utilities for the entire application

// Performance monitoring interface
export interface PerformanceMetrics {
  renderStart: number
  renderEnd: number
  validationTime: number
  inputDebounceTime: number
  apiCallTime: number
  cacheHits: number
  cacheMisses: number
}

// Global performance metrics store
export const globalPerformanceMetrics = new Map<string, PerformanceMetrics>()

// Debounce utility with TypeScript support
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle utility with TypeScript support
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Generic validation cache
export const validationCache = new Map<string, unknown>()

// Performance monitoring composable with delayed initialization
export const usePerformanceMonitoring = (componentName: string) => {
  const metrics: PerformanceMetrics = {
    renderStart: 0,
    renderEnd: 0,
    validationTime: 0,
    inputDebounceTime: 0,
    apiCallTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
  }

  const startRender = () => {
    metrics.renderStart = performance.now()
  }

  const endRender = () => {
    metrics.renderEnd = performance.now()
    // Delayed logging to avoid conflicts with async components
    setTimeout(() => {
      console.log(`${componentName} render time: ${metrics.renderEnd - metrics.renderStart}ms`)
    }, 100)
  }

  const trackValidation = (fn: () => unknown) => {
    const start = performance.now()
    const result = fn()
    metrics.validationTime += performance.now() - start
    return result
  }

  const trackApiCall = async <T>(fn: () => Promise<T>): Promise<T> => {
    const start = performance.now()
    const result = await fn()
    metrics.apiCallTime += performance.now() - start
    setTimeout(() => {
      console.log(`${componentName} API call took: ${performance.now() - start}ms`)
    }, 100)
    return result
  }

  const trackCacheHit = () => {
    metrics.cacheHits++
  }

  const trackCacheMiss = () => {
    metrics.cacheMisses++
  }

  const logMetrics = () => {
    // Delayed logging to avoid conflicts
    setTimeout(() => {
      console.log(`${componentName} Performance Metrics:`, {
        renderTime: metrics.renderEnd - metrics.renderStart,
        validationTime: metrics.validationTime,
        inputDebounceTime: metrics.inputDebounceTime,
        apiCallTime: metrics.apiCallTime,
        cacheHits: metrics.cacheHits,
        cacheMisses: metrics.cacheMisses,
        cacheHitRate: metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) || 0,
      })

      // Store metrics globally
      globalPerformanceMetrics.set(componentName, metrics)
    }, 200)
  }

  return {
    startRender,
    endRender,
    trackValidation,
    trackApiCall,
    trackCacheHit,
    trackCacheMiss,
    logMetrics,
    metrics,
  }
}

// Generic validation with caching
export const createCachedValidator = <T>(
  validator: (value: T) => string | undefined,
  cacheKey: string
) => {
  return (value: T): string | undefined => {
    const key = `${cacheKey}-${JSON.stringify(value)}`

    if (validationCache.has(key)) {
      return validationCache.get(key) as string | undefined
    }

    const result = validator(value)
    validationCache.set(key, result)
    return result
  }
}

// Memory management utilities
export const clearValidationCache = () => {
  validationCache.clear()
  console.log('Validation cache cleared')
}

export const getCacheStats = () => {
  return {
    size: validationCache.size,
    entries: Array.from(validationCache.keys()),
  }
}

// Performance optimization helpers
export const optimizeForGPU = (element: HTMLElement) => {
  element.style.willChange = 'transform'
  element.style.transform = 'translateZ(0)'
}

export const addCSSContainment = (element: HTMLElement, containment: string) => {
  element.style.contain = containment
}

// Утилита для разбиения длинных задач на более мелкие (оптимизация TBT)
export const yieldToMain = async (): Promise<void> => {
  // Используем Scheduler API если доступен (Chrome 94+)
  if (window.scheduler?.postTask) {
    await window.scheduler.postTask(() => { }, { priority: 'background' })
    return
  }

  // Fallback на requestIdleCallback
  if ('requestIdleCallback' in window) {
    return new Promise<void>((resolve) => {
      (window as Window & { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void })
        .requestIdleCallback(() => resolve(), { timeout: 5 })
    })
  }

  // Fallback на setTimeout
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// Утилита для выполнения задач в фоне (не блокирует main thread)
export const runInBackground = async <T>(task: () => T | Promise<T>): Promise<T> => {
  await yieldToMain()
  return await task()
}

// Утилита для разбиения массива на чанки и обработки по частям
export const processInChunks = async <T>(
  items: T[],
  processor: (item: T) => void | Promise<void>,
  chunkSize: number = 10
): Promise<void> => {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    await Promise.all(chunk.map(processor))
    // Yield после каждого чанка
    if (i + chunkSize < items.length) {
      await yieldToMain()
    }
  }
}

// Bundle size optimization
export const lazyLoadComponent = (importFn: () => Promise<unknown>) => {
  return () => importFn()
}

// Global performance configuration
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 16, // 60fps
  CACHE_SIZE_LIMIT: 100,
  VALIDATION_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const

// Performance monitoring for the entire app
export const initGlobalPerformanceMonitoring = () => {
  // Monitor memory usage with better thresholds and cleanup
  if ('memory' in performance) {
    let memoryCheckCount = 0
    const maxMemoryChecks = 20 // Limit to 20 checks (10 minutes)

    const memoryInterval = setInterval(() => {
      memoryCheckCount++

      // Stop monitoring after max checks to prevent memory leaks
      if (memoryCheckCount > maxMemoryChecks) {
        clearInterval(memoryInterval)
        console.log('Memory monitoring stopped after 10 minutes to prevent leaks')
        return
      }

      const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory

      // Only warn if memory usage is significantly high (>100MB)
      if (memory.usedJSHeapSize > 100 * 1024 * 1024) {
        console.warn('High memory usage detected:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
          checkNumber: memoryCheckCount
        })

        // Clear validation cache if memory is very high
        if (memory.usedJSHeapSize > 150 * 1024 * 1024) {
          clearValidationCache()
          console.log('Cleared validation cache due to high memory usage')
        }
      }
    }, 30000) // Check every 30 seconds
  }

  // Monitor cache size with better cleanup
  let cacheCheckCount = 0
  const maxCacheChecks = 30 // Limit to 30 checks (30 minutes)

  const cacheInterval = setInterval(() => {
    cacheCheckCount++

    // Stop monitoring after max checks
    if (cacheCheckCount > maxCacheChecks) {
      clearInterval(cacheInterval)
      console.log('Cache monitoring stopped after 30 minutes')
      return
    }

    if (validationCache.size > PERFORMANCE_CONFIG.CACHE_SIZE_LIMIT) {
      console.warn('Cache size limit exceeded, clearing cache')
      clearValidationCache()
    }
  }, 60000) // Check every minute
}

// Export all utilities
export default {
  debounce,
  throttle,
  usePerformanceMonitoring,
  createCachedValidator,
  clearValidationCache,
  getCacheStats,
  optimizeForGPU,
  addCSSContainment,
  lazyLoadComponent,
  initGlobalPerformanceMonitoring,
  yieldToMain,
  runInBackground,
  processInChunks,
  PERFORMANCE_CONFIG,
}
