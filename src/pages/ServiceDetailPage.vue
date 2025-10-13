<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const router = useRouter()

const services = ref([
  {
    id: 'web-development',
    title: 'Веб-разработка',
    subtitle: 'Создаем онлайн-сервисы и сайты',
    description: 'Полнофункциональные веб-приложения и сайты с современными технологиями',
    fullDescription:
      'Мы специализируемся на создании высокопроизводительных веб-приложений и сайтов, используя самые современные технологии и подходы. Наша команда имеет многолетний опыт в разработке сложных систем, от простых лендингов до крупных корпоративных порталов.',
    technologies: [
      'PHP',
      'NodeJS',
      '1С-Битрикс',
      'Laravel',
      'MySQL',
      'PostgreSQL',
      'Redis',
      'Apache Superset',
      'Jasper',
      'Docker',
      'JavaScript',
      'Vue.js',
      'Nuxt.js',
      'October CMS',
      'Wordpress',
    ],
    icon: '🌐',
    color: 'from-blue-500 to-purple-600',
    features: [
      'Разработка веб-приложений любой сложности',
      'Интеграция с внешними системами',
      'Оптимизация производительности',
      'Мобильная адаптация',
      'SEO-оптимизация',
      'Техническая поддержка',
    ],
    process: [
      {
        step: 1,
        title: 'Анализ требований',
        description: 'Изучаем ваши потребности и формируем техническое задание',
      },
      {
        step: 2,
        title: 'Проектирование',
        description: 'Создаем архитектуру системы и дизайн интерфейсов',
      },
      {
        step: 3,
        title: 'Разработка',
        description: 'Реализуем функционал с использованием современных технологий',
      },
      {
        step: 4,
        title: 'Тестирование',
        description: 'Проводим комплексное тестирование всех компонентов',
      },
      {
        step: 5,
        title: 'Запуск',
        description: 'Развертываем проект и обеспечиваем стабильную работу',
      },
      {
        step: 6,
        title: 'Поддержка',
        description: 'Обеспечиваем техническую поддержку и развитие проекта',
      },
    ],
  },
  {
    id: 'design',
    title: 'Дизайн',
    subtitle: 'Создаем решения, которые становятся бенчмарком для отрасли',
    description: 'UX/UI дизайн, исследования, айдентика и графический дизайн',
    fullDescription:
      'Наш дизайн-отдел создает не просто красивые интерфейсы, а решения, которые решают бизнес-задачи и улучшают пользовательский опыт. Мы проводим глубокие исследования пользователей и создаем дизайн, который конвертирует посетителей в клиентов.',
    technologies: [
      'UX/UI дизайн',
      'исследования',
      'айдентика',
      'графический дизайн',
      'поддержка',
      '3D',
    ],
    icon: '🎨',
    color: 'from-pink-500 to-red-600',
    features: [
      'UX/UI дизайн интерфейсов',
      'Пользовательские исследования',
      'Создание айдентики',
      'Графический дизайн',
      '3D визуализация',
      'Дизайн-системы',
    ],
    process: [
      { step: 1, title: 'Исследование', description: 'Изучаем целевую аудиторию и конкурентов' },
      { step: 2, title: 'Концепция', description: 'Разрабатываем концепцию и стиль проекта' },
      { step: 3, title: 'Прототипирование', description: 'Создаем интерактивные прототипы' },
      { step: 4, title: 'Визуальный дизайн', description: 'Разрабатываем финальные макеты' },
      { step: 5, title: 'Тестирование', description: 'Проводим пользовательское тестирование' },
      { step: 6, title: 'Реализация', description: 'Передаем готовые материалы разработчикам' },
    ],
  },
])

const currentService = computed(() => {
  return services.value.find((service) => service.id === route.params.id)
})

const goBack = () => {
  router.push('/services')
}

onMounted(() => {
  if (!currentService.value) {
    router.push('/services')
    return
  }

  // Animate page elements
  gsap.fromTo(
    '.page-header',
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
  )

  gsap.fromTo(
    '.service-content',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power2.out' }
  )

  gsap.fromTo(
    '.feature-card',
    { opacity: 0, y: 30, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )

  gsap.fromTo(
    '.process-step',
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.process-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )
})
</script>

<template>
  <div
    v-if="currentService"
    class="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-border)] text-white"
  >
    <!-- Header -->
    <div class="page-header container mx-auto px-4 py-16">
      <button
        @click="goBack"
        class="mb-8 flex items-center gap-2 text-[var(--color-accent)] hover:text-white transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Назад к услугам
      </button>

      <div class="flex items-center gap-6 mb-8">
        <div class="text-6xl">{{ currentService.icon }}</div>
        <div>
          <h1 class="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span
              class="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] bg-clip-text text-transparent"
            >
              {{ currentService.title }}
            </span>
          </h1>
          <p class="text-xl text-white/80">{{ currentService.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Service Content -->
    <div class="service-content container mx-auto px-4 pb-16">
      <!-- Description -->
      <div
        class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-12"
      >
        <h2 class="text-3xl font-bold text-white mb-6">О услуге</h2>
        <p class="text-lg text-white/90 leading-relaxed">{{ currentService.fullDescription }}</p>
      </div>

      <!-- Features -->
      <div class="features-section mb-12">
        <h2 class="text-3xl font-bold text-white mb-8">Что мы предлагаем</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in currentService.features"
            :key="feature"
            class="feature-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[var(--color-accent)]/50 transition-all duration-300"
          >
            <div
              class="w-12 h-12 bg-[var(--color-accent)]/20 rounded-xl flex items-center justify-center mb-4"
            >
              <svg
                class="w-6 h-6 text-[var(--color-accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ feature }}</h3>
          </div>
        </div>
      </div>

      <!-- Technologies -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-white mb-8">Технологии</h2>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="tech in currentService.technologies"
            :key="tech"
            class="px-4 py-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full font-medium hover:bg-[var(--color-accent)] hover:text-white transition-colors cursor-pointer"
          >
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- Process -->
      <div class="process-section mb-12">
        <h2 class="text-3xl font-bold text-white mb-8">Процесс работы</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="step in currentService.process"
            :key="step.step"
            class="process-step bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <div
              class="w-12 h-12 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg"
            >
              {{ step.step }}
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ step.title }}</h3>
            <p class="text-white/70">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div
        class="bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-purple)]/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center border border-[var(--color-accent)]/30"
      >
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Заинтересовала услуга?</h2>
        <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Свяжитесь с нами для обсуждения деталей и получения коммерческого предложения
        </p>
        <button
          class="bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[var(--color-accent)]/90 transition-colors"
        >
          Обсудить проект
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-card:hover {
  transform: translateY(-5px);
}

.process-step:hover {
  transform: translateY(-3px);
}
</style>
