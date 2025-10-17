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
      title: 'Интернет-магазин RB Home',
      category: 'Интернет-магазины',
      description: 'Полнофункциональный интернет-магазин мебели и товаров для дома с системой управления заказами, интеграцией с 1С и мобильной версией.',
      bgColor: 'from-amber-50 to-amber-100',
      logoColor: 'bg-gradient-to-br from-amber-600 to-amber-800',
      logoText: 'RB-HOME',
      technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
      link: '#',
      image: '/api/placeholder/400/300',
      year: '2024',
      status: 'Завершен'
    },
    {
      id: 2,
      title: 'Корпоративный сайт БЫТПЛаст',
      category: 'Корпоративные сайты',
      description: 'Современный корпоративный сайт для производителя пластиковых изделий с каталогом продукции, системой заказов и админ-панелью.',
      bgColor: 'from-slate-50 to-slate-100',
      logoColor: 'bg-gradient-to-br from-orange-500 to-red-600',
      logoText: 'БЫТПЛаст',
      technologies: ['React', 'Next.js', 'MongoDB', 'AWS'],
      link: '#',
      image: '/api/placeholder/400/300',
      year: '2024',
      status: 'Завершен'
    },
    {
      id: 3,
      title: 'Платформа бронирования отелей',
      category: 'Мобильные приложения',
      description: 'Мобильное приложение для бронирования отелей с геолокацией, системой отзывов, интеграцией с платежными системами и push-уведомлениями.',
      bgColor: 'from-blue-50 to-blue-100',
      logoColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
      logoText: 'BOOKING',
      technologies: ['React Native', 'Node.js', 'Redis', 'Stripe'],
      link: '#',
      image: '/api/placeholder/400/300',
      year: '2023',
      status: 'Завершен'
    },
    {
      id: 4,
      title: 'Лендинг для IT-компании',
      category: 'Лендинги',
      description: 'Высококонверсионный лендинг для IT-компании с анимациями, формой обратной связи, интеграцией с CRM и системой аналитики.',
      bgColor: 'from-green-50 to-green-100',
      logoColor: 'bg-gradient-to-br from-green-600 to-emerald-700',
      logoText: 'IT-LAND',
      technologies: ['Vue.js', 'GSAP', 'Tailwind CSS', 'HubSpot'],
      link: '#',
      image: '/api/placeholder/400/300',
      year: '2024',
      status: 'Завершен'
    },
    {
      id: 5,
      title: 'Промо-сайт для стартапа',
      category: 'Промо-сайты',
      description: 'Креативный промо-сайт для финтех-стартапа с интерактивными элементами, презентацией продукта и системой регистрации.',
      bgColor: 'from-purple-50 to-purple-100',
      logoColor: 'bg-gradient-to-br from-purple-600 to-indigo-700',
      logoText: 'FINTECH',
      technologies: ['Next.js', 'Framer Motion', 'TypeScript', 'Vercel'],
      link: '#',
      image: '/api/placeholder/400/300',
      year: '2023',
      status: 'Завершен'
    },
    {
      id: 6,
      title: 'Система технической поддержки',
      category: 'Техническая поддержка',
      description: 'Веб-приложение для управления технической поддержкой с тикет-системой, чатом, базой знаний и аналитикой.',
      bgColor: 'from-gray-50 to-gray-100',
      logoColor: 'bg-gradient-to-br from-gray-700 to-gray-900',
      logoText: 'SUPPORT',
      technologies: ['Vue.js', 'Express.js', 'Socket.io', 'MySQL'],
      link: '#',
      image: '/api/placeholder/400/300',
      year: '2024',
      status: 'В разработке'
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

    // Map store filter to actual categories
    const categoryMap: Record<string, string[]> = {
      'web': ['Интернет-магазины', 'Корпоративные сайты', 'Лендинги', 'Промо-сайты', 'Техническая поддержка'],
      'mobile': ['Мобильные приложения'],
      'design': ['Design'],
      'marketing': ['Marketing']
    }

    const categories = categoryMap[activeFilter.value] || []
    return projects.value.filter(project =>
      categories.includes(project.category)
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
