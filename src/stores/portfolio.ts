import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Types
export interface PortfolioProject {
  id: number
  title: string
  category: string
  description: string
  bgColor: string
  logoColor: string
  logoText: string
  technologies: string[]
  link: string
  image: string
  year: string
  status: string
}

export type FilterType = 'all' | 'web' | 'mobile' | 'design' | 'marketing'

export const usePortfolioStore = defineStore('portfolio', () => {
  // State
  const projects = ref<PortfolioProject[]>([
    {
      id: 1,
      title: 'E-commerce Platform',
      category: 'Web Development',
      description: 'Полнофункциональная платформа электронной коммерции с интеграцией платежных систем и системой управления заказами.',
      bgColor: 'from-blue-500 to-purple-600',
      logoColor: 'bg-gradient-to-r from-blue-600 to-purple-700',
      logoText: 'EC',
      technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'],
      link: 'https://example.com',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      year: '2024',
      status: 'Завершен'
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'Mobile Development',
      description: 'Безопасное мобильное приложение для банковских операций с биометрической аутентификацией.',
      bgColor: 'from-green-500 to-teal-600',
      logoColor: 'bg-gradient-to-r from-green-600 to-teal-700',
      logoText: 'MB',
      technologies: ['React Native', 'Firebase', 'Biometric Auth'],
      link: 'https://example.com',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
      year: '2024',
      status: 'В разработке'
    },
    {
      id: 3,
      title: 'Brand Identity Design',
      category: 'Design',
      description: 'Создание уникальной айдентики бренда включая логотип, цветовую схему и руководство по стилю.',
      bgColor: 'from-pink-500 to-rose-600',
      logoColor: 'bg-gradient-to-r from-pink-600 to-rose-700',
      logoText: 'BI',
      technologies: ['Adobe Creative Suite', 'Figma', 'Brand Guidelines'],
      link: 'https://example.com',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
      year: '2023',
      status: 'Завершен'
    },
    {
      id: 4,
      title: 'Digital Marketing Campaign',
      category: 'Marketing',
      description: 'Комплексная цифровая маркетинговая кампания с SEO, SMM и контекстной рекламой.',
      bgColor: 'from-orange-500 to-red-600',
      logoColor: 'bg-gradient-to-r from-orange-600 to-red-700',
      logoText: 'DM',
      technologies: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
      link: 'https://example.com',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      year: '2023',
      status: 'Завершен'
    }
  ])

  const activeFilter = ref<FilterType>('all')
  const selectedProject = ref<PortfolioProject | null>(null)
  const isLoading = ref(false)

  // Computed
  const filteredProjects = computed(() => {
    if (activeFilter.value === 'all') {
      return projects.value
    }
    return projects.value.filter(project =>
      project.category.toLowerCase().includes(activeFilter.value)
    )
  })

  const projectCategories = computed(() => {
    const categories = new Set(projects.value.map(p => p.category))
    return Array.from(categories)
  })

  const completedProjects = computed(() =>
    projects.value.filter(p => p.status === 'Завершен')
  )

  const projectsInProgress = computed(() =>
    projects.value.filter(p => p.status === 'В разработке')
  )

  const totalProjects = computed(() => projects.value.length)

  // Actions
  const setActiveFilter = (filter: FilterType) => {
    activeFilter.value = filter
  }

  const setSelectedProject = (project: PortfolioProject | null) => {
    selectedProject.value = project
  }

  const addProject = (project: Omit<PortfolioProject, 'id'>) => {
    const newProject: PortfolioProject = {
      ...project,
      id: Math.max(...projects.value.map(p => p.id)) + 1
    }
    projects.value.push(newProject)
  }

  const updateProject = (id: number, updates: Partial<Omit<PortfolioProject, 'id'>>) => {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates } as PortfolioProject
    }
  }

  const deleteProject = (id: number) => {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
  }

  const getProjectById = (id: number) => {
    return projects.value.find(p => p.id === id)
  }

  const getProjectsByCategory = (category: string) => {
    return projects.value.filter(p =>
      p.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  const getProjectsByStatus = (status: string) => {
    return projects.value.filter(p => p.status === status)
  }

  // Simulate API call
  const fetchProjects = async () => {
    isLoading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, you would fetch from API here
      console.log('Projects loaded from store')
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    projects,
    activeFilter,
    selectedProject,
    isLoading,

    // Computed
    filteredProjects,
    projectCategories,
    completedProjects,
    projectsInProgress,
    totalProjects,

    // Actions
    setActiveFilter,
    setSelectedProject,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByCategory,
    getProjectsByStatus,
    fetchProjects
  }
})
