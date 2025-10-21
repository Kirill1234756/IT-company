import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { PortfolioProject, FilterType } from '@/types/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  // State - объединенные данные проектов с модальными данными
  const projects = ref<PortfolioProject[]>([
    {
      id: 1,
      title: 'Интернет-магазин RB Home',
      category: 'Интернет-магазины',
      image: "https://avatars.mds.yandex.net/get-altay/13947802/2a0000019488a7cb593ba8d213404c645469/orig",
      // Модальные данные - modalImg будет использовать image автоматически
      modalCard: [
        {
          id: 1,
          title: "About what",
          description: "This case is dedicated to the successful creation of a modern corporate catalog website for the company RB Home. The goal of the project was to provide customers with a unique opportunity to purchase premium interior products through an intuitive and colorful online portal. It was important to reflect the company's service - Design Project, which is provided by the company on favorable terms. And also tell designers, businesses and partners about cooperation with RB Home."
        },
        {
          id: 2,
          title: "Problem",
          description: "The RB Home company has a virtual space for the presentation, exclusively, of lighting and electrical products. The inability to present other categories of goods, services and terms of interaction with customers has become a significant obstacle to the company's development in the modern market."
        },
        {
          id: 3,
          title: "Target",
          description: "The goal of the project was to create a recognizable, fashionable and modern website that would not only provide customers with the opportunity to purchase products, but would also emphasize the style and premium quality of the brand. The customer's key request was also the development of a personal account with unique capabilities for ordinary users and interior designers. An important condition was to introduce marketing techniques into the site to increase conversion on the site and increase requests for the company's services and products."
        }
      ],
      modalText: [
        {
          id: 1,
          title: "Analytics",
          description: "During the analytics phase, our team conducted comprehensive research aimed at understanding the unique needs and goals of RB Home. We sought to identify the core characteristics and values of the brand, as well as best practices in the premium home furnishings industry. We've scrutinized the websites of premium interiors and design brands to highlight the key elements of successful online platforms. Analyzing the catalog structure and customer interactions on competitor sites allowed us to identify effective product presentation methods. We held discussions with the RB Home team and identified the unique features of their brand in order to tailor the site design to match the corporate identity. Having learned that RB Home emphasizes the understated and elegant design of its products, we integrated the corresponding color schemes and structure of elements into the visual design of the site. We analyzed user experience sites similar to the company to identify pros and cons in navigation and functionality. The study found that the convenience of a personal account is a key factor in attracting interior designers. We took this into account when developing the functionality of the personal account. Taking into account the results of the analytics, at the site development stage steps were taken to create a unique and functional web platform for RB Home."
        },
        {
          id: 2,
          title: "Site development",
          description: "Our designers created a visual design that reflects the style and aesthetics of the brand. We ensured the site's attractiveness through the use of high-quality product images and harmonious color schemes. The integration of beige and brown shades into the website design elements emphasized the premium nature of the products. Marketing elements added zest to the site design, both visually and functionally. The choice of the Bitrix platform ensured ease of content and functionality management, giving the RB Home team flexibility in managing the site. Integration with Bitrix ensures fast order processing and updating of the product catalog. A personal account with individual functions for ordinary users and designers was developed. This included the ability to create articles and interact with 3D models of products. Designers can easily publish their projects and interact with clients through their personal account, creating a unique brand experience. Integration of the site with AmoCRM will allow the company to quickly process every order and every request from the site. The addition of quizzes and landing pages further focused attention on the product and attracted various categories of customers. Quiz quizzes such as Find Your Style have created engaging content and increased engagement with site visitors. We have ensured that the site is displayed correctly on all devices, which allows customers to conveniently use the site on tablets and smartphones. The adaptive design of the RB Home website ensures equally convenient interaction with the platform on any device."
        }
      ]
    },
    {
      id: 2,
      title: 'Корпоративный сайт БЫТПЛаст',
      category: 'Корпоративные сайты',
      image: "https://via.placeholder.com/400/300/D0D0D0/A0A0A0?text=Bytplast+Website",
      // Модальные данные - modalImg будет использовать image автоматически
      modalCard: [
        {
          id: 1,
          title: "About what",
          description: "This case is dedicated to the creation of a modern website for Bytplast, a Russian manufacturer of plastic products for home and children. The main focus was on improving the site's usability, ensuring quick and easy access to information and the product catalog, and adapting the site for various devices."
        },
        {
          id: 2,
          title: "Problem",
          description: "\"Bytplast\" faced the need to modernize its old website. The site did not meet modern usability and design standards, was difficult to use on mobile devices, and had navigation issues within the product catalog. The company aimed to enhance the presentation of its extensive product line, consisting of over 1,100 items, and make the information accessible and understandable for users."
        },
        {
          id: 3,
          title: "Target",
          description: "The goal of the project was to create a modern and functional website for \"Bytplast,\" combining attractive design, usability, and extensive capabilities for presenting the vast product catalog."
        }
      ],
      modalText: [
        {
          id: 1,
          title: "Analytics",
          description: "In the analysis phase, our team conducted comprehensive research to understand the company's current needs and determine the optimal solutions. We studied the behavior of potential users to understand their needs and expectations. Competitor research helped identify best practices in product presentation and user experience. Competitor analysis showed that clear and intuitive catalog navigation significantly improves the user experience. We took this into account when developing the structure of the new site. We gathered all necessary information about the company's products, including descriptions, photos, and texts. This content was revised and adapted for the new design. Product photos were updated and optimized for the web to improve visual perception and page load speed. Collecting and analyzing existing content helped us understand how best to structure the information on the new site. We conducted UX research to identify the main needs and preferences of users. This included analyzing user behavior, creating user scenarios, and conducting interviews with potential customers. Testing showed that users value simplicity and quick access to the information they need. Therefore, we prioritized developing convenient and intuitive navigation and filter systems for the catalog."
        },
        {
          id: 2,
          title: "Site development",
          description: "In the development phase, our team took the following key steps to create the new site: 1. Unique Design Development. We created a new, modern website design that reflects the \"Bytplast\" brand and products. The design was developed in the Figma editor and took into account all aspects of the company's corporate identity. The color palette, including orange and light gray colors, and visual elements were chosen to match the company's corporate style while creating a fresh and attractive look for the site. The design included the use of large product images, minimalist icons, and convenient navigation buttons. 2. Responsive Design Creation. We developed seven responsive versions of the site for various devices, ensuring correct display and usability on all platforms. Carefully crafted design elements, such as menus and buttons, were adapted for convenient use on both desktop computers and mobile devices. Responsive design ensures that users can easily browse the site regardless of whether they use a computer, tablet, or smartphone. 3. Catalog Functionality Development. We implemented catalog filter functionality so that users could easily find the necessary products. The catalog was organized by categories, brands, and product lines. Implementing filters by parameters such as line, brand, and product type significantly simplified the process of finding the desired product. Filters were designed so that users could quickly sort products and find exactly what they need. 4. 3D Animation Implementation. A unique feature of the project was 3D animation, allowing users to rotate a virtual cup with a design that the company can provide. Interactive 3D animation demonstrates the possibilities of product customization and attracts users' attention, making the interaction with the site more engaging and informative. 5. 1C:Bitrix Integration. The site was developed on the 1C:Bitrix platform, ensuring convenient content and functionality management. Integration allows \"Bytplast\" to easily update the product catalog and manage the site without needing to contact developers. This solution also ensures high performance and site security. As a result, the new \"Bytplast\" website became a modern and functional tool, contributing to improved user experience, increased customer loyalty, and strengthening the company's market position. The development process included solving complex design, layout, and programming tasks on the 1C:Bitrix platform."
        }
      ]
    },
    {
      id: 3,
      title: 'Платформа бронирования отелей',
      category: 'Мобильные приложения',
      image: "https://via.placeholder.com/400/300/4F46E5/FFFFFF?text=Booking+App"
    },
    {
      id: 4,
      title: 'Лендинг для IT-компании',
      category: 'Лендинги',
      image: "https://via.placeholder.com/400/300/10B981/FFFFFF?text=IT+Landing"
    },
    {
      id: 5,
      title: 'Промо-сайт для стартапа',
      category: 'Промо-сайты',
      image: "https://via.placeholder.com/400/300/8B5CF6/FFFFFF?text=Fintech+Promo"
    },
    {
      id: 6,
      title: 'Система технической поддержки',
      category: 'Техническая поддержка',
      image: "https://via.placeholder.com/400/300/6B7280/FFFFFF?text=Support+System"
    }
  ])

  // Удаляем отдельный массив modalData, так как данные теперь встроены в projects

  const activeFilter = ref<FilterType>('all')
  const selectedProject = ref<PortfolioProject | null>(null)
  const isLoading = ref(false)

  // Computed
  const filteredProjects = computed(() => {
    console.log('Store: Computing filtered projects, activeFilter:', activeFilter.value)
    console.log('Store: Total projects:', projects.value.length)

    if (activeFilter.value === 'all') {
      console.log('Store: Returning all projects')
      return projects.value
    }

    // Map store filter to actual categories - simplified mapping
    const filtered = projects.value.filter(project => {
      let match = false

      switch (activeFilter.value) {
        case 'ecommerce':
          match = project.category === 'Интернет-магазины'
          break
        case 'corporate':
          match = project.category === 'Корпоративные сайты'
          break
        case 'landing':
          match = project.category === 'Лендинги'
          break
        case 'promo':
          match = project.category === 'Промо-сайты'
          break
        case 'mobile':
          match = project.category === 'Мобильные приложения'
          break
        case 'tech-support':
          match = project.category === 'Техническая поддержка'
          break
        default:
          match = false
      }

      console.log(`Store: Project "${project.title}" (${project.category}) vs filter "${activeFilter.value}": ${match}`)
      return match
    })

    console.log('Store: Filtered results:', filtered.length, 'projects')
    console.log('Store: Filtered project titles:', filtered.map(p => p.title))
    return filtered
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

  // Мемоизированные данные для модальных окон
  const getModalDataById = computed(() => (id: number) => {
    const project = projects.value.find(p => p.id === id)
    if (!project) return null

    return {
      id: project.id,
      img: project.modalImg || project.image || '/api/placeholder/1200x700',
      card: project.modalCard || [],
      text: project.modalText || []
    }
  })

  const getProjectWithModal = computed(() => (id: number) => {
    const project = projects.value.find(p => p.id === id)
    if (!project) return null

    return {
      project,
      modal: {
        id: project.id,
        img: project.modalImg || project.image || '/api/placeholder/1200x700',
        card: project.modalCard || [],
        text: project.modalText || []
      }
    }
  })

  // Actions
  const setActiveFilter = (filter: FilterType) => {
    console.log('Store: setActiveFilter called with:', filter)
    console.log('Store: Previous activeFilter:', activeFilter.value)
    activeFilter.value = filter
    console.log('Store: New activeFilter:', activeFilter.value)
    console.log('Store: activeFilter.value type:', typeof activeFilter.value)
    console.log('Store: activeFilter.value === "ecommerce":', activeFilter.value === 'ecommerce')

    // Force recomputation by accessing the computed
    console.log('Store: Forcing recomputation of filteredProjects...')
    const currentFiltered = filteredProjects.value
    console.log('Store: Current filtered projects count:', currentFiltered.length)
    console.log('Store: Current filtered projects:', currentFiltered.map(p => p.title))
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
    getModalDataById,
    getProjectWithModal,

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
