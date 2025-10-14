import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // User state
  const user = ref<{
    id: string
    name: string
    email: string
    company?: string
  } | null>(null)

  // App state
  const isLoading = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  // Navigation state
  const currentPage = ref('')
  const breadcrumbs = ref<Array<{ label: string, to?: string }>>([])

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userDisplayName = computed(() =>
    user.value?.name || user.value?.email || 'Гость'
  )

  // Actions
  const setUser = (userData: typeof user.value) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const setBreadcrumbs = (items: Array<{ label: string, to?: string }>) => {
    breadcrumbs.value = items
  }

  const setCurrentPage = (page: string) => {
    currentPage.value = page
  }

  // Initialize theme from localStorage
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      theme.value = savedTheme
    }
  }

  return {
    // State
    user,
    isLoading,
    theme,
    currentPage,
    breadcrumbs,

    // Computed
    isAuthenticated,
    userDisplayName,

    // Actions
    setUser,
    clearUser,
    setLoading,
    setTheme,
    setBreadcrumbs,
    setCurrentPage,
    initializeTheme
  }
})
