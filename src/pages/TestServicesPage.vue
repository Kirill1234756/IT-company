<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = ref([
  {
    id: 'web-development',
    title: 'Веб-разработка',
    description: 'Создаем онлайн-сервисы и сайты',
    technologies: [
      'PHP, NodeJS, 1С-Би',
      'Laravel, MySQL, PostgreSQL',
      'Redis, Apache Supersets',
      'Jasper, Docker, JavaScript',
      'Vue.js, Nuxt.js, October CMS',
      'Wordpress',
    ],
  },
  {
    id: 'design',
    title: 'Дизайн',
    description: 'Создаем решения, которые становится бенчмарком для отрасли',
    technologies: ['UX/UI дизайн, исследования', 'айдентика, графический дизайн', 'поддержка, 3D'],
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    description: 'Делаем все типы исследований и отвечаем за метрики проекта',
    technologies: ['UX-аналитика', 'веб-аналитика', 'исследования'],
  },
  {
    id: 'branding',
    title: 'Брендинг',
    description: 'Создаем, имплементируем и развиваем фирменный стиль',
    technologies: ['Айдентика', 'Платформа бренда', 'Стратегия коммуникаций'],
  },
  {
    id: 'tech-support',
    title: 'Техподдержка',
    description: 'Обеспечиваем работу сайта 24/7 и несем ответственность за его развитие',
    technologies: ['Политика SLA', 'логирование и мониторинг', 'защита от атак'],
  },
  {
    id: 'bitrix24',
    title: 'Внедрение Битрикс24',
    description:
      'Осуществляем полное внедрение Битрикс24 с учетом индивидуальных потребностей бизнеса',
    technologies: ['Корпоративные порталы', 'CRM', 'HR-решения', 'крупные проекты'],
  },
  {
    id: 'seo',
    title: 'Продвижение сайтов',
    description: 'Выводим сайты в топ поисковой выдачи и увеличиваем число целевых лидов',
    technologies: ['SEO-оптимизация и поддержка', 'сбор семантики и структуры'],
  },
  {
    id: 'nocode',
    title: 'No-code',
    description: 'В кратчайшие сроки запустим цифровой продукт на платформе Tilda',
    technologies: ['Tilda', 'Readymag', 'Webflow'],
  },
])

// Новая секция - Решения (как на фото)
const solutions = ref([
  {
    id: 'online-services',
    title: 'Онлайн-сервисы',
    description:
      'С нуля создаем и внедряем сервисы для решения самых разных бизнес-задач. Кастомизируем готовые IT-решения',
    technologies: '',
  },
  {
    id: 'personal-accounts',
    title: 'Личные кабинеты',
    description:
      'Создаем единые точки входа с доступом ко всем услугам и ресурсам компании, автоматизируем процессы и повышаем эффективность коммуникации со стейкхолдерами',
    technologies: '',
  },
  {
    id: 'data-systems',
    title: 'Системы сбора и визуализации данных',
    description:
      'Создаем удобные площадки для позиционирования бизнеса, презентации компании, взаимодействия с клиентами, инвесторами, партнерами, соискателями и СМИ',
    technologies: '',
  },
  {
    id: 'corporate-websites',
    title: 'Корпоративные сайты',
    description:
      'Создаем удобные площадки для позиционирования бизнеса, презентации компании, взаимодействия с клиентами, инвесторами, партнерами, соискателями и СМИ',
    technologies: '',
  },
  {
    id: 'corporate-portals',
    title: 'Корпоративные порталы',
    description:
      'Внедряем порталы для объединения сотрудников в едином инфопространстве, автоматизируя кадровые процессы, упрощая коммуникацию, помогая быстро находить информацию и принимать решения, доносить важные сведения',
    technologies: '',
  },
  {
    id: 'career-websites',
    title: 'Карьерные сайты',
    description:
      'Делаем карьерные сайты, которые привлекают кандидатов, усиливают HR-бренд компании и экономят бюджет на рекрутинг',
    technologies: '',
  },
  {
    id: 'crm-systems',
    title: 'CRM',
    description:
      'Интегрируем системы для хранения данных клиентов в единой базе, отслеживания истории общения с клиентами и ведения их по собственному алгоритму взаимодействия, повышая скорость обслуживания и сокращая цикл сделки',
    technologies: '',
  },
  {
    id: 'kedo',
    title: 'КЭДО',
    description:
      'Кадровый электронный документооборот (КЭДО) — система управления кадровыми документами в электронном формате. Помогает автоматизировать процессы создания, согласования, подписания и хранения документов по управлению персоналом',
    technologies: '',
  },
  {
    id: 'airport-websites',
    title: 'Сайты аэропортов',
    description:
      'Разрабатываем сайты аэропортов прибыльными за счет роста сервисов неавиационной выручки',
    technologies: '',
  },
])

const router = useRouter()

const selectService = (service: { id: string }) => {
  router.push(`/services/${service.id}`)
}

const selectSolution = (solution: { id: string }) => {
  router.push(`/services/${solution.id}`)
}

onMounted(() => {
  // Animate service rows
  gsap.fromTo(
    '.service-row',
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services-list',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )

  // Animate CTA button
  gsap.fromTo(
    '.cta-button',
    {
      opacity: 0,
      scale: 0.9,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cta-button',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )

  // Animate solutions section
  gsap.fromTo(
    '.solution-row',
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.solutions-list',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Services List -->
    <div class="services-list max-w-6xl mx-auto px-6 py-16">
      <!-- CTA Button -->
      <div class="flex justify-end mb-8">
        <button
          class="cta-button bg-[#00df82] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00df82]/90 transition-colors"
        >
          обсудить проект
        </button>
      </div>

      <!-- Services -->
      <div class="space-y-0">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-row opacity-0 border-b border-gray-200 py-8 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="selectService(service)"
        >
          <div class="grid grid-cols-12 gap-8 items-start">
            <!-- Service Title -->
            <div class="col-span-3">
              <h3 class="text-xl font-bold text-gray-900">
                {{ service.title }}
              </h3>
            </div>

            <!-- Service Description -->
            <div class="col-span-4">
              <p class="text-gray-700 leading-relaxed">
                {{ service.description }}
              </p>
            </div>

            <!-- Technologies -->
            <div class="col-span-4">
              <div class="space-y-1">
                <p v-for="tech in service.technologies" :key="tech" class="text-sm text-gray-600">
                  {{ tech }}
                </p>
              </div>
            </div>

            <!-- Arrow Icon -->
            <div class="col-span-1 flex justify-end">
              <svg
                class="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Новая секция - Решения (как на фото) -->
    <div class="solutions-list max-w-6xl mx-auto px-6 py-16">
      <!-- Заголовок секции -->
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Решения</h2>
        <button
          class="cta-button bg-[#00df82] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00df82]/90 transition-colors"
        >
          обсудить проект
        </button>
      </div>

      <!-- Решения -->
      <div class="space-y-0">
        <div
          v-for="solution in solutions"
          :key="solution.id"
          class="solution-row opacity-0 border-b border-gray-200 py-8 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="selectSolution(solution)"
        >
          <div class="grid grid-cols-12 gap-8 items-start">
            <!-- Название решения -->
            <div class="col-span-3">
              <h3 class="text-xl font-bold text-gray-900">
                {{ solution.title }}
              </h3>
            </div>

            <!-- Описание решения -->
            <div class="col-span-8">
              <p class="text-gray-700 leading-relaxed">
                {{ solution.description }}
              </p>
            </div>

            <!-- Стрелка -->
            <div class="col-span-1 flex justify-end">
              <svg
                class="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the services page */
.service-row {
  transition: all 0.3s ease;
}

.service-row:hover {
  background-color: #f9fafb;
}

/* Стили для секции решений */
.solution-row {
  transition: all 0.3s ease;
}

.solution-row:hover {
  background-color: #f9fafb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-12 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .col-span-3,
  .col-span-4,
  .col-span-1 {
    grid-column: span 1;
  }

  .services-list {
    padding: 1rem;
  }

  .service-row {
    padding: 1.5rem 0;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .col-span-3 {
    grid-column: span 4;
  }

  .col-span-4 {
    grid-column: span 3;
  }

  .col-span-1 {
    grid-column: span 2;
  }
}
</style>
