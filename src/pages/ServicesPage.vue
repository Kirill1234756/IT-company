<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { ServiceCardProps } from '../components/ServiceCard.vue'

const ServiceCard = defineAsyncComponent(() => import('../components/ServiceCard.vue'))

const router = useRouter()

// Growth services data
const growthServices = ref([
  {
    id: 1,
    title: 'Promoting',
    description:
      "An essential element of any company's development in digital, allowing to attract customers / buyers for any product / service / product in the market. High-quality promotion online is the key to successful business for any industry in current conditions.",
    priceFrom: '€400',
    icon: '✅',
    iconBg: 'from-green-50 to-emerald-100',
  },
  {
    id: 2,
    title: 'Drawing up a marketing strategy',
    description:
      'Developing a business development path in the market and increasing its competitiveness. Defining the target audience, analyzing the market, competitors and trends, promotion channels and performance metrics.',
    priceFrom: '€500',
    icon: '📣',
    iconBg: 'from-blue-50 to-indigo-100',
  },
  {
    id: 3,
    title: 'Marketing campaign audit',
    description:
      'Improving the efficiency of marketing activities. The service includes analyzing the results of configured campaigns, assessing the effectiveness of marketing channels and metrics, identifying strengths and weaknesses, and adjusting the marketing strategy.',
    priceFrom: '€500',
    icon: '📄',
    iconBg: 'from-purple-50 to-violet-100',
  },
  {
    id: 4,
    title: 'Research for business development',
    description:
      'We determine the needs and preferences of customers, identify market features, and analyze competitors. We conduct marketing research, analyze statistical data, and other sources.',
    priceFrom: '€700',
    icon: '🔬',
    iconBg: 'from-orange-50 to-amber-100',
  },
  {
    id: 5,
    title: 'Market analysis',
    description:
      'This is an important tool that allows us to obtain complete information about competitors, prices, demand and market trends. Based on this information, we can develop an effective business promotion strategy and increase revenue.',
    priceFrom: '€700',
    icon: '🔍',
    iconBg: 'from-cyan-50 to-blue-100',
  },
  {
    id: 6,
    title: 'Competitor analysis',
    description:
      "Competitor analysis allows us to obtain comprehensive information about competitors, their strategies and strengths. This is an essential tool for developing an effective product promotion strategy and increasing a company's competitiveness.",
    priceFrom: '€500',
    icon: '📊',
    iconBg: 'from-indigo-50 to-purple-100',
  },
])

// Strategy services data
const strategyServices = ref([
  {
    id: 7,
    title: 'Drawing up a business plan',
    description:
      'Creating a business plan is an important process that allows you to determine the strategy for business development, its goals and objectives, develop a model, and also measure the achievement of these goals.',
    priceFrom: '€1000',
    icon: '📋',
    iconBg: 'from-red-50 to-rose-100',
  },
  {
    id: 8,
    title: 'Drawing up a preliminary marketing strategy',
    description: 'Plan for promoting a product/service in the market.',
    priceFrom: '€500',
    icon: '💼',
    iconBg: 'from-blue-50 to-indigo-100',
  },
  {
    id: 9,
    title: 'Branding',
    description:
      "Building and maintaining a brand image, creating a unique concept and positioning that will attract and retain customers, as well as increase a company's profits.",
    priceFrom: '€1100',
    icon: '🏷️',
    iconBg: 'from-purple-50 to-violet-100',
  },
])

// Development services data
const developmentServices = ref([
  {
    id: 10,
    title: 'Site development',
    description:
      'We offer a full cycle of developing websites of any complexity. Our team of professionals will create a unique design and functionality suitable for your business.',
    priceFrom: '€2500',
    icon: '⚙️',
    iconBg: 'from-indigo-50 to-blue-100',
  },
  {
    id: 11,
    title: 'Site integration with external services',
    description:
      'Automation and simplification of order processing in the company. Integration will significantly speed up order processing and increase the convenience of purchase for customers.',
    priceFrom: '€700',
    icon: '🔗',
    iconBg: 'from-cyan-50 to-teal-100',
  },
  {
    id: 12,
    title: 'Automation of business processes',
    description:
      'Services that aim to improve the overall operation of a company. Creating an efficient system for managing and controlling business processes, automating work with documents, and optimizing team management.',
    priceFrom: '€2600',
    icon: '📈',
    iconBg: 'from-green-50 to-emerald-100',
  },
  {
    id: 13,
    title: 'Integration with CRM',
    description:
      'Integration with CRM simplifies interaction with customers and increases sales efficiency. Automation of order processing processes, control of the level of service, management of marketing campaigns.',
    priceFrom: '€1200',
    icon: '🚀',
    iconBg: 'from-orange-50 to-red-100',
  },
])

// Filter state
const activeFilter = ref('All')
const allServices = ref([
  ...growthServices.value.map((s) => ({ ...s, category: 'Growth' })),
  ...strategyServices.value.map((s) => ({ ...s, category: 'Strategy' })),
  ...developmentServices.value.map((s) => ({ ...s, category: 'Development' })),
])

const filteredServices = ref(allServices.value)

// Filter functions
const filterServices = (category: string) => {
  activeFilter.value = category
  if (category === 'All') {
    filteredServices.value = allServices.value
  } else {
    filteredServices.value = allServices.value.filter((service) => service.category === category)
  }
}

// Handle service click
const handleServiceClick = (service: ServiceCardProps) => {
  // Navigate to service detail page
  router.push(`/services/${service.id}`)
}

// Handle back to home
const goHome = () => {
  router.push('/')
}

// Initialize filter based on route
onMounted(() => {
  const route = router.currentRoute.value
  const path = route.path

  if (path.includes('/growth')) {
    filterServices('Growth')
  } else if (path.includes('/strategy')) {
    filterServices('Strategy')
  } else if (path.includes('/development')) {
    filterServices('Development')
  } else {
    filterServices('All')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button
              @click="goHome"
              class="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 class="ml-4 text-2xl font-bold text-gray-900">Our Services</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumbs -->
      <div class="text-sm text-gray-500 mb-8">
        <span class="cursor-pointer hover:text-gray-700" @click="goHome">Home</span>
        <span class="mx-1">/</span>
        <span class="cursor-default">Service</span>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap gap-4 mb-12">
        <button
          v-for="category in ['All', 'Development', 'Growth', 'Strategy']"
          :key="category"
          @click="filterServices(category)"
          :class="[
            'px-6 py-3 rounded-full font-semibold transition-all duration-300',
            activeFilter === category
              ? 'bg-[#2455ff] text-white shadow-lg'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#2455ff] hover:shadow-md',
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Services List -->
      <div class="space-y-10">
        <ServiceCard
          v-for="service in filteredServices"
          :key="service.id"
          :id="service.id"
          :title="service.title"
          :description="service.description"
          :priceFrom="service.priceFrom"
          :icon="service.icon"
          :iconBg="service.iconBg"
          :isClickable="true"
          @click="handleServiceClick"
        />
      </div>

      <!-- CTA Section -->
      <section
        class="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] rounded-3xl p-12 text-center text-white"
      >
        <h3 class="text-4xl font-bold mb-4">Ready to Get Started?</h3>
        <p class="text-xl mb-8 opacity-90">
          Choose the services that best fit your business needs and let's build something amazing
          together.
        </p>
        <button
          @click="goHome"
          class="bg-white text-[var(--color-accent)] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
        >
          Back to Home
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Custom styles for the services page */
.service-section {
  max-width: 5xl;
  margin: 0 auto;
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}

/* Hover effects for cards */
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}
</style>
