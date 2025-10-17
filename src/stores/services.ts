import { defineStore } from 'pinia'
import type { ServiceCategory, ServiceDetail } from '../types/services'

export const useServicesStore = defineStore('services', {
  state: () => ({
    categories: [
      {
        id: 1,
        title: 'Разработка сайта',
        type: 'list' as const,
        slug: 'site-development',
        items: [
          {
            id: 1,
            title: 'SaaS solutions',
            price: 'from €12900',
            description: 'If you offer innovative solutions to problems, we can help you develop a technological base (SaaS platform / service) for implementing your project. We create flexible, scalable, and secure systems tailored to the needs of your request.',
            type: 'detail' as const,
            slug: 'saas-solutions'
          },
          {
            id: 2,
            title: 'Online Store',
            price: 'from €5900',
            description: 'Developing a unique e-commerce solution for creating full-fledged online sales over the Internet. We offer professional design, convenient navigation, reliable security system, and integration with various systems.',
            type: 'detail' as const
          },
          {
            id: 3,
            title: 'Site Catalog',
            price: 'from €5200',
            description: 'A website where users can view and learn about a company\'s products. Suitable for B2B and when you just want to showcase your product range without the need for online sales.',
            type: 'detail' as const
          },
          {
            id: 4,
            title: 'Corporate website',
            price: 'from €4600',
            description: 'Basic resource that represents a company on the Internet and allows clients to get comprehensive information about your company and its products / services, as well as leave an application / request.',
            type: 'detail' as const
          },
          {
            id: 5,
            title: 'Landing page',
            price: 'from €2500',
            description: 'Landing page website that presents a specific product (type of products) or service. Great for conducting demand research in a specific field / test running a new direction.',
            type: 'detail' as const
          },
          {
            id: 6,
            title: 'Business card site',
            price: 'from €3900',
            description: 'Small website with 3-4 pages that allows creating the first impression of a company, briefly introducing its services / products, and submitting an application.',
            type: 'detail' as const
          }
        ]
      },
      {
        id: 2,
        title: 'Интеграция сайта с внешними сервисами',
        type: 'detail' as const,
        slug: 'site-integration',
        detail: {
          id: 2,
          title: 'Site integration with external services',
          breadcrumbs: ['Home', 'Services', 'Development'],
          about: {
            title: 'About',
            description: [
              'We offer a service of integration with various systems that help our clients simplify and automate workflows, improve data management and increase business efficiency.',
              'We have experience with various systems such as: CRM, ERP, social networks, as well as with external APIs and databases. We are also ready to develop an individual solution that will meet the needs of your business.',
              'When integrating, we use advanced technologies and tools that help us speed up the process, reduce risks and deliver high-quality results. Our team of development, testing and integration experts are ready to take on all the integration tasks so you can focus on what matters and grow your business.'
            ]
          },
          metrics: {
            cost: '€700',
            workingDays: 10
          },
          features: [
            {
              id: 1,
              title: 'Can provide users with quick access to relevant information, speed up purchase processes, improve service quality',
              description: ''
            },
            {
              id: 2,
              title: 'Integration with CRM, ERP or other systems allows you to optimize business processes and save time and resources',
              description: ''
            },
            {
              id: 3,
              title: 'Integration with analytics systems allows you to get detailed information about user behavior on the site, their preferences and conversion rates',
              description: ''
            },
            {
              id: 4,
              title: 'Integration with various marketing services, can help the site create effective and personalized marketing campaigns',
              description: ''
            }
          ],
          stages: [
            {
              id: 1,
              number: '01',
              title: 'Requirements Analysis',
              description: 'Определение необходимых функций и возможностей, типов данных и автоматизируемых процессов.'
            },
            {
              id: 2,
              number: '02',
              title: 'Selection of suitable tools and technologies',
              description: 'Выбор инструментов и технологий (API, протоколы, плагины, фреймворки).'
            },
            {
              id: 3,
              number: '03',
              title: 'Development and customization',
              description: 'Разработка и настройка (написание кода, создание конфигурационных файлов, использование конструктора).'
            },
            {
              id: 4,
              number: '04',
              title: 'Testing',
              description: 'Тестирование для проверки работоспособности, корректности передачи данных, стабильности.'
            },
            {
              id: 5,
              number: '05',
              title: 'Deployment',
              description: 'Развертывание (установка и настройка на сервере, внедрение в существующую систему).'
            },
            {
              id: 6,
              number: '06',
              title: 'Support and update',
              description: 'Поддержка и обновление (мониторинг производительности, исправление ошибок, обновление систем, отслеживание изменений требований).'
            }
          ],
          faq: [
            {
              id: 1,
              question: 'How long does integration with different systems take?',
              answer: 'The integration time depends on the complexity of the systems and the required functionality. On average, it takes from 5 to 20 working days.'
            },
            {
              id: 2,
              question: 'What kind of support will be provided after the integration?',
              answer: 'We provide comprehensive support including monitoring, troubleshooting, updates and consultations for 6 months after project completion.'
            },
            {
              id: 3,
              question: 'Which systems can be integrated with the website?',
              answer: 'We can integrate with CRM, ERP, payment systems, analytics, social networks, email services and many other external systems.'
            },
            {
              id: 4,
              question: 'How do you integrate with external systems?',
              answer: 'We use APIs, webhooks, database connections and other modern integration methods depending on the system requirements.'
            },
            {
              id: 5,
              question: 'What data can be integrated with external systems?',
              answer: 'We can integrate user data, orders, products, analytics, payments and any other data that your business needs.'
            },
            {
              id: 6,
              question: 'Do I need to actively participate in the integration process?',
              answer: 'We handle most of the technical work, but we may need your input for requirements clarification and testing.'
            }
          ]
        }
      }
    ] as ServiceCategory[],

    // Детальная информация для SaaS solutions
    saasDetail: {
      id: 1,
      title: 'SaaS solutions',
      breadcrumbs: ['Home', 'Services', 'Development', 'SaaS solutions'],
      about: {
        title: 'About',
        description: [
          'If you offer innovative solutions to problems, we can help you develop a technological base (SaaS platform / service) for implementing your project. We create flexible, scalable, and secure systems tailored to the needs of your request.',
          'SaaS solutions simplify business processes, improve customer interaction, increase efficiency, and reduce costs. They offer scalability, data security, privacy, and regulatory compliance.',
          'Our team specializes in developing custom SaaS platforms that meet the specific needs of your business and help you achieve your goals.'
        ]
      },
      metrics: {
        cost: '€12900',
        workingDays: 50
      },
      features: [
        {
          id: 1,
          title: 'Development of a SaaS platform for startups aiming to offer the market innovative solutions.',
          description: ''
        },
        {
          id: 2,
          title: 'For automating business processes, structuring department workflows, and organizing operational procedures.',
          description: ''
        },
        {
          id: 3,
          title: 'To enhance communication and collaboration within the company and with clients.',
          description: ''
        },
        {
          id: 4,
          title: 'To increase the efficiency of company operations and achieve target performance indicators.',
          description: ''
        }
      ],
      stages: [
        {
          id: 1,
          number: '01',
          title: 'Interview and analytics',
          description: 'Определение бизнес-целей, задач, анализ информационной среды клиента и текущих бизнес-процессов.'
        },
        {
          id: 2,
          number: '02',
          title: 'Compilation of terms of reference',
          description: 'Составление технического задания на основе собранной информации, детализация технических требований, функциональных модулей и процедур согласования.'
        },
        {
          id: 3,
          number: '03',
          title: 'Prototyping',
          description: 'Визуализация будущего продукта, построение структуры страниц, создание интерактивных прототипов.'
        },
        {
          id: 4,
          number: '04',
          title: 'Design development',
          description: 'Определение визуальной концепции, стиля, подготовка демонстраций элементов интерфейса и анимаций.'
        },
        {
          id: 5,
          number: '05',
          title: 'Frontend and Backend development',
          description: 'Подбор разработчиков и реализация всего задуманного на предыдущих этапах в виде кода.'
        },
        {
          id: 6,
          number: '06',
          title: 'Testing',
          description: 'Тщательная проверка сайта на производительность и устранение ошибок.'
        },
        {
          id: 7,
          number: '07',
          title: 'Project Transfer',
          description: 'Передача готового продукта заказчику, демонстрация функционала, обучение.'
        },
        {
          id: 8,
          number: '08',
          title: 'Support',
          description: 'Формирование категории для запросов клиентов, организация мониторинга серверов, поддержка ПО, резервное копирование.'
        }
      ],
      faq: [
        {
          id: 1,
          question: 'How do you know if your business needs a SaaS solution?',
          answer: 'If you need to automate processes, scale your business, or provide services to multiple clients through a web platform, a SaaS solution might be right for you.'
        },
        {
          id: 2,
          question: 'How long does it take to develop a SaaS solution?',
          answer: 'Development time varies from 2 to 6 months depending on complexity, features, and requirements. We provide detailed timelines during consultation.'
        },
        {
          id: 3,
          question: 'Can the SaaS solution be integrated with other systems?',
          answer: 'Yes, we can integrate with CRM, ERP, payment systems, and other third-party services through APIs and webhooks.'
        },
        {
          id: 4,
          question: 'How is the SaaS solution implemented and staff trained?',
          answer: 'We provide comprehensive training, documentation, and support during implementation to ensure smooth adoption by your team.'
        },
        {
          id: 5,
          question: 'How is my data secure when using a SaaS solution?',
          answer: 'We implement enterprise-grade security measures including encryption, secure authentication, regular backups, and compliance with data protection regulations.'
        },
        {
          id: 6,
          question: 'Are there any limits on the number of users who can use SaaS solutions?',
          answer: 'SaaS solutions are designed to scale with your business. We can accommodate from a few users to thousands depending on your needs.'
        }
      ]
    } as ServiceDetail,
    // Cached services data (lazy-loaded on first use)
    growthServices: [] as Array<{ id: number; title: string; description: string; priceFrom: string; icon: string; iconBg: string }>,
    strategyServices: [] as Array<{ id: number; title: string; description: string; priceFrom: string; icon: string; iconBg: string }>,
    developmentServices: [] as Array<{ id: number; title: string; description: string; priceFrom: string; icon: string; iconBg: string }>,
    servicesDataLoaded: false,
  }),

  getters: {
    // O(1) maps for fast lookups
    categoriesById: (state) => {
      return state.categories.reduce<Record<number, ServiceCategory>>((acc, cat) => {
        acc[cat.id] = cat
        return acc
      }, {})
    },
    categoriesBySlug: (state) => {
      return state.categories.reduce<Record<string, ServiceCategory>>((acc, cat) => {
        if (cat.slug) acc[cat.slug] = cat
        return acc
      }, {})
    },
    serviceDetailsBySlug: (state) => {
      // Expand as more details are added
      const map: Record<string, ServiceDetail> = {}
      map['saas-solutions'] = state.saasDetail
      return map
    },

    // Public API using maps (no array searching)
    getCategoryById(this: { categoriesById: Record<number, ServiceCategory> }) {
      return (id: number): ServiceCategory | undefined => this.categoriesById[id]
    },
    getCategoryBySlug(this: { categoriesBySlug: Record<string, ServiceCategory> }) {
      return (slug: string): ServiceCategory | undefined => this.categoriesBySlug[slug]
    },
    getServiceDetail(this: { serviceDetailsBySlug: Record<string, ServiceDetail> }) {
      return (serviceId: number): ServiceDetail | null => {
        if (serviceId === 1) return this.serviceDetailsBySlug['saas-solutions'] ?? null
        return null
      }
    },
    getServiceDetailBySlug(this: { serviceDetailsBySlug: Record<string, ServiceDetail> }) {
      return (slug: string): ServiceDetail | null => this.serviceDetailsBySlug[slug] || null
    }
  },

  actions: {
    // Lazy-load services data once and cache across navigations
    async loadDataIfNeeded() {
      if (this.servicesDataLoaded) return
      const dataModule: {
        growthServices: Array<{ id: number; title: string; description: string; priceFrom: string; icon: string; iconBg: string }>
        strategyServices: Array<{ id: number; title: string; description: string; priceFrom: string; icon: string; iconBg: string }>
        developmentServices: Array<{ id: number; title: string; description: string; priceFrom: string; icon: string; iconBg: string }>
      } = await import('./services.data')
      this.growthServices = dataModule.growthServices
      this.strategyServices = dataModule.strategyServices
      this.developmentServices = dataModule.developmentServices
      this.servicesDataLoaded = true
    },
  }
})
