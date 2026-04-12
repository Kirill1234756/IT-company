import { ref, watch, onUnmounted, type Ref } from 'vue'

/**
 * Первое попадание элемента в viewport → isInView = true, observer отключается.
 * При prefers-reduced-motion сразу isInView = true.
 */
export function useInViewOnce(
  target: Ref<HTMLElement | null>,
  options: IntersectionObserverInit = { rootMargin: '80px 0px -5% 0px', threshold: 0.08 }
) {
  const isInView = ref(false)
  let observer: IntersectionObserver | null = null

  const stopWatch = watch(
    () => target.value,
    (el) => {
      observer?.disconnect()
      observer = null
      if (!el || isInView.value) return
      if (typeof window === 'undefined') {
        isInView.value = true
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        isInView.value = true
        return
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            isInView.value = true
            observer?.disconnect()
            observer = null
          }
        },
        options
      )
      observer.observe(el)
    },
    { immediate: true, flush: 'post' }
  )

  onUnmounted(() => {
    observer?.disconnect()
    stopWatch()
  })

  return { isInView }
}
