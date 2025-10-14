<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { defineAsyncComponent } from 'vue'
import { useStackScroll } from '../composables/useStackScroll'
import { useContentStore } from '../stores/content'
import { useAppStore } from '../stores/app'

// Async components
const WhatWeDoCard = defineAsyncComponent(() => import('../components/WhatWeDoCard.vue'))
const WhatWeDoCta = defineAsyncComponent(() => import('../components/WhatWeDoCta.vue'))
const AdvantageCard = defineAsyncComponent(() => import('../components/AdvantageCard.vue'))
const CasesPage = defineAsyncComponent(() => import('./CasesPage.vue'))

// Stores
const contentStore = useContentStore()
const appStore = useAppStore()

// Router
const router = useRouter()

// Stack scroll setup
const stackRoot = ref<HTMLElement | null>(null)

// Navigation handlers
const handleCardClick = (cardTitle: string) => {
  // Update current page in store
  appStore.setCurrentPage(cardTitle.toLowerCase())

  switch (cardTitle) {
    case 'Стратегия':
      router.push('/services/strategy')
      break
    case 'Рост':
      router.push('/services/growth')
      break
    case 'Разработка':
      router.push('/services/development')
      break
    default:
      router.push('/services')
  }
}

// Intersection-based lazy mounting for heavy sections
const whatWeDoEl = ref<HTMLElement | null>(null)
const whatWeDoVisible = ref(false)
useIntersectionObserver(
  whatWeDoEl,
  ([entry]) => {
    if (entry.isIntersecting) whatWeDoVisible.value = true
  },
  { rootMargin: '200px' }
)

const portfolioEl = ref<HTMLElement | null>(null)
const portfolioVisible = ref(false)
useIntersectionObserver(
  portfolioEl,
  ([entry]) => {
    if (entry.isIntersecting) portfolioVisible.value = true
  },
  { rootMargin: '200px' }
)

// Form data for contact section (keeping local state for form)
const formData = ref({
  name: '',
  phone: '',
  email: '',
  privacyAccepted: false,
})

const submitForm = () => {
  if (!formData.value.privacyAccepted) {
    alert('Please accept the Privacy Policy')
    return
  }

  // Here you can add your form submission logic
  console.log('Form submitted:', formData.value)

  // Reset form
  formData.value = {
    name: '',
    phone: '',
    email: '',
    privacyAccepted: false,
  }

  alert('Thank you! Your request has been sent.')
}

// Initialize theme on mount
onMounted(() => {
  appStore.initializeTheme()
})
</script>

<template>
  <div id="stack" class="relative" ref="stackRoot">
    <!-- Main section -->
    <section
      class="stack-section no-scrollbar h-screen flex items-center justify-center rounded-t-3xl py-[5rem]"
    >
      <h1 class="title text-5xl md:text-7xl font-black tracking-tight">Main</h1>
    </section>

    <!-- What we do section -->
    <section
      ref="whatWeDoEl"
      class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[12rem] md:px-[6rem] px-[1rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100"
      >
        Что мы делаем
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl w-full mb-8">
        <template v-if="whatWeDoVisible">
          <!-- Using data from store -->
          <WhatWeDoCard
            v-for="card in contentStore.whatWeDoCards"
            :key="card.title"
            :title="card.title"
            :description="card.description"
            :iconPath="card.icon"
            :wrapperClass="card.wrapperClass"
            @click="handleCardClick(card.title)"
          />
          <WhatWeDoCta
            text="Мы предлагаем полный спектр готовых цифровых решений для вашего бизнеса"
            @click="router.push('/services')"
          />
        </template>
      </div>

      <!-- Learn More Button -->
      <button
        class="mt-6 text-[0.8rem] md:text-sm bg-gray-800 text-white py-3 px-[5rem] rounded-[3rem] font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 hover:ring-[var(--color-accent)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        @click="router.push('/services')"
      >
        Узнать больше
      </button>
    </section>

    <!-- Portfolio section -->
    <section
      ref="portfolioEl"
      class="stack-section no-scrollbar bg-gradient-to-br bg-[var(--color-purple))] h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
    >
      <CasesPage />
    </section>

    <!-- Our Advantages section -->
    <section
      id="advantages"
      class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100 text-center"
      >
        Наши преимущества
      </h2>

      <div class="w-full grid grid-cols-1 md:grid-cols-2 items-stretch">
        <!-- Using data from store -->
        <AdvantageCard
          v-for="(advantage, i) in contentStore.advantages"
          :key="advantage.title + i"
          :title="advantage.title"
          :description="advantage.description"
          :index="i"
          :isCentral="i === 2 || i === 3"
          class="adv-card"
        />
      </div>

      <div class="mt-8 flex justify-center">
        <button
          class="mt-6 text-[0.8rem] md:text-sm bg-gray-800 text-white py-3 px-[5rem] rounded-[3rem] font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 hover:ring-[var(--color-accent)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          Связаться с нам
        </button>
      </div>
    </section>

    <!-- About us section -->
    <section
      id="stats-section"
      class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[12rem] md:px-[6rem] px-[1rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100"
      >
        О нас
      </h2>

      <div class="max-w-6xl w-full">
        <div class="text-center mb-12">
          <h3 class="text-sm tracking-widest font-semibold text-[var(--color-accent)] mb-8">
            КЛЮЧЕВЫЕ ЦИФРЫ
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          <!-- Using data from store -->
          <div
            v-for="(stat, i) in contentStore.stats"
            :key="i"
            class="stats-card group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-[var(--color-accent)]/10"
          >
            <div class="text-center">
              <div
                class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-white mb-3"
              >
                <span data-counter data-plus :data-target="stat.value">0</span>
              </div>
              <div class="text-lg md:text-xl font-semibold text-white mb-1">{{ stat.label }}</div>
              <div v-if="stat.sublabel" class="text-white/70 text-sm">{{ stat.sublabel }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact section -->
    <section
      id="contact-section"
      class="stack-section no-scrollbar bg-gradient-to-br bg-[var(--color-purple))] h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-0"
      >
        Контакты
      </h2>

      <!-- Contact form with local state -->
      <div class="contact-container w-full max-w-5xl opacity-0">
        <div
          class="contact-card relative bg-gradient-to-br from-[var(--color-bg)]/90 to-[var(--color-border)]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-[var(--color-accent)]/30 shadow-2xl shadow-[var(--color-accent)]/10"
        >
          <div class="contact-header mb-8">
            <h3
              class="contact-form-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0"
            >
              Become our new partner
            </h3>
            <p
              class="contact-form-subtitle text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl opacity-0"
            >
              Leave a request for cooperation right now and get project price today
            </p>
          </div>

          <form @submit.prevent="submitForm" class="contact-form space-y-6">
            <div class="contact-inputs grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div class="contact-input-wrapper opacity-0">
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="Your name"
                  required
                  class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-gray-800 placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                />
              </div>
              <div class="contact-input-wrapper opacity-0">
                <input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="Phone"
                  required
                  class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-gray-800 placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                />
              </div>
              <div class="contact-input-wrapper opacity-0">
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="E-mail"
                  required
                  class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-transparent text-white placeholder-white/60 focus:border-[var(--color-accent)] focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40"
                />
              </div>
              <div class="contact-button-wrapper opacity-0">
                <button
                  type="submit"
                  class="contact-button w-full px-6 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-bg)] rounded-2xl font-bold text-lg transition-all duration-300 hover:from-[var(--color-accent)]/90 hover:to-[var(--color-accent)]/70 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_color-mix(in_oklab,var(--color-accent)_50%,transparent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/30 active:translate-y-0"
                >
                  <span class="button-text">Send</span>
                  <span class="button-icon ml-2">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Same styles as original HomePage.vue */
</style>
