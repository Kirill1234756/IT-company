<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { CalculatorFormAPI } from '../api/calculator-form'
const SEOContent = defineAsyncComponent(() => import('../components/seo/SEOContent.vue'))
const SectionHeading = defineAsyncComponent(() => import('../components/ui/SectionHeading.vue'))
const Breadcrumbs = defineAsyncComponent(() => import('../components/ui/Breadcrumbs.vue'))
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'
import { useHead } from '@unhead/vue'
import { watchEffect } from 'vue'
import IconContainer from '../components/IconContainer.vue'
import FormSuccessBanner from '../components/ui/FormSuccessBanner.vue'
import FormErrorBanner from '../components/ui/FormErrorBanner.vue'
import CtaButton from '../components/ui/CtaButton.vue'
import {
  siteTypes,
  designOptions,
  baseFeatures,
  additionalFeatures,
  shopFeatures,
  contentOptions,
  seoOptions,
  supportOptions,
  urgencyOptions,
  getBasePrice,
  getPagesPrice,
  getDesignPrice,
  getFeaturePrice,
  getContentPrice,
  getSEOPrice,
  getSupportPrice,
  getUrgencyMultiplier,
  getTimeline,
  pagesOptionsMap,
} from '../data/calculator-data'

const route = useRoute()

// Lazy load summary block
const PriceSummary = defineAsyncComponent({
  loader: () => import('../components/calculator/PriceSummary.vue'),
  delay: 100,
  timeout: 5000,
})

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

// Inject breadcrumb schema
watchEffect(() => {
  if (breadcrumbSchema.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema.value),
          key: 'breadcrumb-schema',
        },
      ],
    })
  }
})

// Типы данных
interface PriceBreakdown {
  basePrice: number
  pagesPrice: number
  designPrice: number
  featuresPrice: number
  contentPrice: number
  seoPrice: number
  supportPrice: number
  urgencyMultiplier: number
  subtotal: number
  total: number
  minPrice: number
  maxPrice: number
  timeline: string
}

// Состояние калькулятора
const currentStep = ref<number>(0)
const totalSteps = 7

// Ответы пользователя
const answers = ref({
  siteType: '', // landing, business, shop, portfolio, blog
  pages: '', // 1-5, 6-10, 11-15, 16-20, 20+
  design: 'template', // ready, template, unique, premium
  features: [] as string[], // массив выбранных функций
  products: '' as string | undefined, // для магазина: 1-50, 51-200, 201-500, 500+
  content: 'ready', // ready, media, copywriting, full
  seo: 'basic', // basic, extended, complex
  ads: false, // настройка рекламы
  urgency: 'standard', // standard, fast, urgent
  support: '1month', // none, 1month, 3months, 6months, 12months
})

// Форма для получения коммерческого предложения
const contactForm = ref({
  name: '',
  phone: '',
  email: '',
})

// Время начала заполнения формы (для антибот-защиты)
const formStartedAt = ref<number>(Date.now())

// ШАГ 2: Количество страниц
const pagesOptions = computed(() => {
  if (answers.value.siteType === 'landing') {
    return [] // Для лендинга скрываем
  }
  return [
    { id: '1-5', label: 'До 5 страниц', price: 'Включено' },
    { id: '6-10', label: '6-10 страниц', price: '+15,000₽' },
    { id: '11-15', label: '11-15 страниц', price: '+30,000₽' },
    { id: '16-20', label: '16-20 страниц', price: '+45,000₽' },
    { id: '20+', label: 'Больше 20', price: 'Индивидуально' },
  ]
})

// Навигация
const nextStep = () => {
  // Сценарий: лендинг — нужно пропустить шаг со страницами
  if (answers.value.siteType === 'landing') {
    // Если идем со стартового шага (0), сразу прыгаем на дизайн (2)
    if (currentStep.value === 0) {
      currentStep.value = 2
      return
    }
    // Если каким-то образом оказались на шаге 1, также перескакиваем
    if (currentStep.value === 1) {
      currentStep.value = 2
      return
    }
  }

  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  // Для лендинга при возврате со 2-го шага сразу идем на 0-й (пропускаем страницы)
  if (answers.value.siteType === 'landing' && currentStep.value === 2) {
    currentStep.value = 0
    return
  }
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 0:
      return answers.value.siteType !== ''
    case 1:
      return answers.value.siteType === 'landing' || answers.value.pages !== ''
    case 2:
      return answers.value.design !== ''
    case 3:
      return true // функции опциональны
    case 4:
      return answers.value.content !== ''
    case 5:
      return answers.value.seo !== ''
    case 6:
      return answers.value.urgency !== '' && answers.value.support !== ''
    default:
      return false
  }
})

// Расчет стоимости - оптимизированная версия с использованием helper функций
const calculatePrice = (): PriceBreakdown => {
  const basePrice = getBasePrice(answers.value.siteType)
  const pagesPrice = getPagesPrice(answers.value.siteType, answers.value.pages || '')
  const designPrice = getDesignPrice(answers.value.design)

  // Функционал
  let featuresPrice = 0
  answers.value.features.forEach((featureId) => {
    featuresPrice += getFeaturePrice(featureId)
  })

  const contentPrice = getContentPrice(answers.value.content)
  const seoPrice = getSEOPrice(answers.value.seo, answers.value.ads)
  const supportPrice = getSupportPrice(answers.value.support)
  const urgencyMultiplier = getUrgencyMultiplier(answers.value.urgency)

  // Промежуточная сумма
  let subtotal = basePrice + pagesPrice + designPrice + featuresPrice + contentPrice + seoPrice
  subtotal = subtotal * urgencyMultiplier

  // Финальная сумма
  const total = subtotal + supportPrice

  // Диапазон (±15%)
  const minPrice = Math.floor(total * 0.85)
  const maxPrice = Math.ceil(total * 1.15)

  // Сроки
  const timeline = getTimeline(answers.value.urgency, answers.value.siteType)

  return {
    basePrice,
    pagesPrice,
    designPrice,
    featuresPrice,
    contentPrice,
    seoPrice,
    supportPrice,
    urgencyMultiplier,
    subtotal,
    total,
    minPrice,
    maxPrice,
    timeline,
  }
}

const priceBreakdown = computed(() => calculatePrice())

// getTimeline импортирован из calculator-data.ts

// Переключение функций
const toggleFeature = (featureId: string) => {
  const index = answers.value.features.indexOf(featureId)
  if (index > -1) {
    answers.value.features.splice(index, 1)
  } else {
    answers.value.features.push(featureId)
  }
}

// Форматирование цены
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Прогресс
const progress = computed(() => {
  return Math.round(((currentStep.value + 1) / totalSteps) * 100)
})

// Состояние отправки
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
const submitSuccess = ref(false)
const successMessage = ref('')
const submitErrorKey = ref(0)
const submitButtonSuccess = ref(false)
let submitSuccessBtnTimer: ReturnType<typeof setTimeout> | null = null

const stepPanelRef = ref<HTMLElement | null>(null)

const stepTransitionKey = computed(() => `${currentStep.value}-${answers.value.siteType}`)

watch(currentStep, () => {
  nextTick(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return
    stepPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

function dismissCalcSuccess() {
  submitSuccess.value = false
  successMessage.value = ''
}

// Валидация полей (как в ContactSection)
const validateName = (name: string): string | undefined => {
  if (!name || !name.trim()) {
    return 'Имя обязательно для заполнения'
  }
  if (name.trim().length < 2) {
    return 'Имя должно содержать минимум 2 символа'
  }
  return undefined
}

const validatePhone = (phone: string): string | undefined => {
  if (!phone || !phone.trim()) {
    return 'Телефон обязателен для заполнения'
  }
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) {
    return 'Введите корректный номер телефона'
  }
  return undefined
}

const validateEmail = (email: string): string | undefined => {
  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Введите корректный email адрес'
    }
  }
  return undefined
}

// Валидация всей формы
const validateForm = (): boolean => {
  fieldErrors.value = {}

  const nameError = validateName(contactForm.value.name)
  if (nameError) fieldErrors.value.name = nameError

  const phoneError = validatePhone(contactForm.value.phone)
  if (phoneError) fieldErrors.value.phone = phoneError

  const emailError = validateEmail(contactForm.value.email)
  if (emailError) fieldErrors.value.email = emailError

  // Проверка, что есть хотя бы базовые данные калькулятора
  if (!answers.value.siteType) {
    submitError.value = 'Пожалуйста, заполните калькулятор'
    submitErrorKey.value += 1
    return false
  }

  return Object.keys(fieldErrors.value).length === 0
}

// Отправка формы
const submitContactForm = async () => {
  // Валидация
  if (!validateForm()) {
    submitError.value = 'Пожалуйста, исправьте ошибки в форме'
    submitErrorKey.value += 1
    return
  }

  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false
  fieldErrors.value = {}

  try {
    const formData = {
      name: contactForm.value.name,
      phone: contactForm.value.phone,
      email: contactForm.value.email || undefined,
      siteType: answers.value.siteType,
      pages: answers.value.pages,
      design: answers.value.design,
      features: answers.value.features,
      content: answers.value.content,
      seo: answers.value.seo,
      ads: answers.value.ads,
      urgency: answers.value.urgency,
      support: answers.value.support,
      calculatedPrice: priceBreakdown.value.total,
      minPrice: priceBreakdown.value.minPrice,
      maxPrice: priceBreakdown.value.maxPrice,
      timeline: priceBreakdown.value.timeline,
      formStartedAt: formStartedAt.value,
    }

    const result = await CalculatorFormAPI.submitForm(formData)

    if (result.success) {
      contactForm.value.name = ''
      contactForm.value.phone = ''
      contactForm.value.email = ''

      successMessage.value =
        result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.'
      submitSuccess.value = true
      submitButtonSuccess.value = true
      if (submitSuccessBtnTimer) clearTimeout(submitSuccessBtnTimer)
      submitSuccessBtnTimer = setTimeout(() => {
        submitButtonSuccess.value = false
        submitSuccessBtnTimer = null
      }, 2600)
    } else {
      submitError.value = result.message || 'Произошла ошибка при отправке формы'
      submitErrorKey.value += 1
    }
  } catch (error: unknown) {
    console.error('Ошибка отправки формы:', error)
    const err = error as { message?: string }
    if (err.message && err.message.includes('Ошибка валидации')) {
      submitError.value = err.message
    } else {
      submitError.value = 'Произошла ошибка при отправке формы. Попробуйте еще раз.'
    }
    submitErrorKey.value += 1
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-text px-4">
    <div class="max-w-7xl mx-auto">
      <Breadcrumbs
        :items="[{ label: 'Главная', to: '/' }, { label: 'Калькулятор стоимости' }]"
        class="mb-8 !text-bg/70 [&_a]:!text-bg/80 [&_a:hover]:!text-bg"
      />
      <!-- Заголовок -->
      <div class="text-center !text-bg mb-8">
        <SectionHeading :level="1" size="lg" color="bg" align="center" weight="black" class="mb-4">
          Сколько будет стоить ваш сайт?
        </SectionHeading>
        <p class="text-lg text-accent mb-2">
          Узнайте примерную стоимость вашего проекта за 60 секунд
        </p>
        <div class="flex justify-center gap-4 text-sm text-bg/70">
          <span>⚡ Без звонков и встреч</span>
          <span>🎯 Точность ±15%</span>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-bg"
            >Шаг {{ currentStep + 1 }} из {{ totalSteps }}</span
          >
          <span class="text-sm font-medium text-bg">{{ progress }}%</span>
        </div>
        <div class="w-full bg-bg/20 rounded-full h-3">
          <div
            class="bg-accent h-3 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Левая колонка: Вопросы -->
        <div class="lg:col-span-2">
          <div ref="stepPanelRef" class="bg-bg rounded-[3rem] p-6 md:p-8">
            <Transition name="calc-step" mode="out-in">
              <div :key="stepTransitionKey" class="calc-step-panel">
            <!-- ШАГ 1: Тип сайта -->
            <div v-if="currentStep === 0">
              <h2
                class="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-3 md:mb-6 text-center"
              >
                1. Какой тип сайта вам нужен?
              </h2>
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <button
                  v-for="type in siteTypes"
                  :key="type.id"
                  @click="answers.siteType = type.id"
                  :aria-label="`Выбрать тип сайта: ${type.label}`"
                  :class="[
                    'p-3 md:p-6 rounded-2xl md:rounded-[3rem] border-2 flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 bg-bg/30 backdrop-blur-sm',
                    answers.siteType === type.id
                      ? 'border-accent bg-accent/20 shadow-lg shadow-accent/20 scale-[1.02]'
                      : 'border-border/60 hover:border-accent/70 bg-bg/30 hover:bg-bg/50 hover:shadow-lg',
                  ]"
                >
                  <IconContainer
                    :icon-path="type.iconPath"
                    bg-color="bg-accent"
                    hover-bg-color="group-hover:bg-[var(--color-purple)]"
                    icon-color="text-white"
                    :use-fill="type.iconUseFill !== false"
                    container-class="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl"
                  />
                  <div class="text-center">
                    <div class="text-sm md:text-lg lg:text-xl font-bold text-text mb-0.5 md:mb-1">
                      {{ type.label }}
                    </div>
                    <div class="text-xs md:text-sm text-text-muted mb-1.5 md:mb-3">
                      {{ type.description }}
                    </div>
                    <div class="text-sm md:text-base lg:text-lg font-semibold text-accent">
                      {{ type.price }}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- ШАГ 2: Количество страниц -->
            <div v-if="currentStep === 1 && answers.siteType !== 'landing'">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">
                2. Сколько страниц нужно?
              </h2>
              <p class="text-text-muted mb-6">
                ℹ️ Типовые страницы: Главная, О нас, Услуги, Портфолио, Контакты
              </p>
              <div class="space-y-3">
                <label
                  v-for="option in pagesOptions"
                  :key="option.id"
                  :class="[
                    'flex items-center justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                    answers.pages === option.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="answers.pages"
                      class="mr-3 w-5 h-5 accent-accent"
                    />
                    <span class="text-text font-medium">{{ option.label }}</span>
                  </div>
                  <span class="text-sm text-accent font-semibold">{{ option.price }}</span>
                </label>
              </div>
            </div>

            <!-- ШАГ 3: Дизайн -->
            <div v-if="currentStep === 2">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">3. Дизайн сайта</h2>
              <p class="text-text-muted mb-6">
                ℹ️ Уникальный дизайн включает: 2-3 варианта, правки, адаптив
              </p>
              <div class="space-y-3">
                <label
                  v-for="option in designOptions"
                  :key="option.id"
                  :class="[
                    'flex items-center justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                    answers.design === option.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="answers.design"
                      class="mr-3 w-5 h-5 accent-accent"
                    />
                    <span class="text-text font-medium">{{ option.label }}</span>
                  </div>
                  <span class="text-sm text-accent font-semibold">{{ option.price }}</span>
                </label>
              </div>
            </div>

            <!-- ШАГ 4: Функционал -->
            <div v-if="currentStep === 3">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">
                4. Необходимый функционал
              </h2>
              <div class="space-y-4">
                <!-- Базовые функции (включены) -->
                <div>
                  <h3 class="text-lg font-semibold text-text mb-3">Включено:</h3>
                  <div class="space-y-2">
                    <label
                      v-for="feature in baseFeatures"
                      :key="feature.id"
                      class="flex items-center p-3 rounded-2xl bg-bg/30 border border-border/50 cursor-not-allowed opacity-60"
                    >
                      <input type="checkbox" checked disabled class="mr-3" />
                      <span class="text-text">{{ feature.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Дополнительные функции -->
                <div>
                  <h3 class="text-lg font-semibold text-text mb-3">Дополнительно:</h3>
                  <div class="space-y-2">
                    <label
                      v-for="feature in additionalFeatures"
                      :key="feature.id"
                      :class="[
                        'flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all',
                        answers.features.includes(feature.id)
                          ? 'border-accent bg-accent/20'
                          : 'border-border hover:border-accent/50 bg-bg/50',
                      ]"
                    >
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          :checked="answers.features.includes(feature.id)"
                          @change="toggleFeature(feature.id)"
                          class="mr-3 w-5 h-5 accent-accent"
                        />
                        <span class="text-text">{{ feature.label }}</span>
                      </div>
                      <span class="text-sm text-accent font-semibold"
                        >+{{ formatPrice(feature.price) }}</span
                      >
                    </label>
                  </div>
                </div>

                <!-- Функции для магазина -->
                <div v-if="answers.siteType === 'shop'">
                  <h3 class="text-lg font-semibold text-text mb-3">Для интернет-магазина:</h3>
                  <div class="space-y-2">
                    <label
                      v-for="feature in shopFeatures"
                      :key="feature.id"
                      :class="[
                        'flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all',
                        answers.features.includes(feature.id)
                          ? 'border-accent bg-accent/20'
                          : 'border-border hover:border-accent/50 bg-bg/50',
                      ]"
                    >
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          :checked="answers.features.includes(feature.id)"
                          @change="toggleFeature(feature.id)"
                          class="mr-3 w-5 h-5 accent-accent"
                        />
                        <span class="text-text">{{ feature.label }}</span>
                      </div>
                      <span class="text-sm text-accent font-semibold"
                        >+{{ formatPrice(feature.price) }}</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- ШАГ 5: Контент -->
            <div v-if="currentStep === 4">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">5. Контент для сайта</h2>
              <div class="space-y-3">
                <label
                  v-for="option in contentOptions"
                  :key="option.id"
                  :class="[
                    'flex items-center justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                    answers.content === option.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="answers.content"
                      class="mr-3 w-5 h-5 accent-accent"
                    />
                    <span class="text-text font-medium">{{ option.label }}</span>
                  </div>
                  <span class="text-sm text-accent font-semibold">{{ option.price }}</span>
                </label>
                <p class="text-sm text-text-muted mt-4">
                  ℹ️ Профессиональная фотосъемка обсуждается отдельно
                </p>
              </div>
            </div>

            <!-- ШАГ 6: SEO -->
            <div v-if="currentStep === 5">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">6. Продвижение и SEO</h2>
              <div class="space-y-3 mb-6">
                <label
                  v-for="option in seoOptions"
                  :key="option.id"
                  :class="[
                    'flex items-start justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                    answers.seo === option.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="flex items-start">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="answers.seo"
                      class="mr-3 mt-1 w-5 h-5 accent-accent"
                    />
                    <div>
                      <div class="text-text font-medium">{{ option.label }}</div>
                      <div class="text-sm text-text-muted mt-1">{{ option.description }}</div>
                    </div>
                  </div>
                  <span v-if="option.price" class="text-sm text-accent font-semibold">{{
                    option.price
                  }}</span>
                </label>
              </div>
              <label
                :class="[
                  'flex items-center justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                  answers.ads
                    ? 'border-accent bg-accent/20'
                    : 'border-border hover:border-accent/50 bg-bg/50',
                ]"
              >
                <div class="flex items-center">
                  <input type="checkbox" v-model="answers.ads" class="mr-3 w-5 h-5 accent-accent" />
                  <span class="text-text font-medium">Настройка рекламы (Яндекс/Google)</span>
                </div>
                <span class="text-sm text-accent font-semibold">+20,000₽</span>
              </label>
            </div>

            <!-- ШАГ 7: Сроки и поддержка -->
            <div v-if="currentStep === 6">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">7. Сроки выполнения</h2>
              <div class="space-y-3 mb-8">
                <label
                  v-for="option in urgencyOptions"
                  :key="option.id"
                  :class="[
                    'flex items-center justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                    answers.urgency === option.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="answers.urgency"
                      class="mr-3 w-5 h-5 accent-accent"
                    />
                    <span class="text-text font-medium">{{ option.label }}</span>
                  </div>
                  <span class="text-sm text-accent font-semibold">{{ option.price }}</span>
                </label>
              </div>

              <h3 class="text-xl font-bold text-text mb-4">Поддержка после запуска:</h3>
              <p class="text-sm text-text-muted mb-4">
                ℹ️ Поддержка: правки, обновления, консультации, бекапы
              </p>
              <div class="space-y-3">
                <label
                  v-for="option in supportOptions"
                  :key="option.id"
                  :class="[
                    'flex items-center justify-between p-4 rounded-[3rem] border-2 cursor-pointer transition-all',
                    answers.support === option.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="answers.support"
                      class="mr-3 w-5 h-5 accent-accent"
                    />
                    <span class="text-text font-medium">{{ option.label }}</span>
                  </div>
                  <span class="text-sm text-accent font-semibold">{{ option.price }}</span>
                </label>
              </div>
            </div>

              </div>
            </Transition>

            <!-- Навигация -->
            <div class="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <button
                type="button"
                @click="prevStep"
                :disabled="currentStep === 0"
                :class="[
                  'px-6 py-3 rounded-full border-2 transition-all active:scale-[0.98] motion-reduce:active:scale-100',
                  currentStep === 0
                    ? 'border-border/30 text-text-muted cursor-not-allowed'
                    : 'border-border hover:border-accent text-accent hover:bg-accent/20',
                ]"
              >
                ← Назад
              </button>
              <button
                v-if="currentStep < totalSteps - 1"
                type="button"
                @click="nextStep"
                :disabled="!canGoNext"
                :class="[
                  'px-8 py-3 rounded-full font-semibold transition-all active:scale-[0.98] motion-reduce:active:scale-100',
                  canGoNext ? 'text-accent hover:bg-accent/90' : 'text-bg cursor-not-allowed',
                ]"
              >
                Далее →
              </button>
            </div>
          </div>
        </div>

        <!-- Правая колонка: Липкий виджет расчета -->
        <div class="lg:col-span-1">
          <div
            class="bg-bg rounded-[3rem] p-6 border border-border sticky top-8"
            v-if="answers.siteType || currentStep > 0"
          >
            <h3 class="text-2xl font-bold text-text mb-6 text-center">💰 ВАША ОЦЕНКА</h3>

            <Suspense>
              <template #default>
                <PriceSummary :priceBreakdown="priceBreakdown" :answers="answers" />
              </template>
              <template #fallback>
                <div class="space-y-3 mb-6 animate-pulse">
                  <div class="h-4 bg-border rounded w-1/3"></div>
                  <div class="h-6 bg-border rounded w-1/2"></div>
                  <div class="h-4 bg-border rounded w-2/3"></div>
                  <div class="h-4 bg-border rounded w-1/2"></div>
                  <div class="h-24 bg-border rounded w-full mt-2"></div>
                </div>
              </template>
            </Suspense>

            <!-- Форма для получения коммерческого предложения -->
            <div class="border-t border-border pt-6">
              <FormSuccessBanner
                :show="submitSuccess"
                :message="successMessage"
                variant="on-light"
                :auto-dismiss-ms="6000"
                @dismiss="dismissCalcSuccess"
              />
              <p class="text-sm text-text-muted mb-4 text-center">
                🎯 Хотите точный расчет? Оставьте контакты:
              </p>
              <div class="space-y-3">
                <div>
                  <input
                    v-model="contactForm.name"
                    type="text"
                    placeholder="Ваше имя"
                    @input="fieldErrors.name = ''"
                    :class="[
                      'w-full px-4 py-3 rounded-[3rem] bg-bg/50 border text-text placeholder:text-text-muted focus:outline-none transition-colors',
                      fieldErrors.name ? 'border-error' : 'border-border focus:border-accent',
                    ]"
                  />
                  <p v-if="fieldErrors.name" class="text-sm text-error mt-1">
                    {{ fieldErrors.name }}
                  </p>
                </div>
                <div>
                  <input
                    v-model="contactForm.phone"
                    type="tel"
                    placeholder="Телефон"
                    @input="fieldErrors.phone = ''"
                    :class="[
                      'w-full px-4 py-3 rounded-[3rem] bg-bg/50 border text-text placeholder:text-text-muted focus:outline-none transition-colors',
                      fieldErrors.phone ? 'border-error' : 'border-border focus:border-accent',
                    ]"
                  />
                  <p v-if="fieldErrors.phone" class="text-sm text-error mt-1">
                    {{ fieldErrors.phone }}
                  </p>
                </div>
                <div>
                  <input
                    v-model="contactForm.email"
                    type="email"
                    placeholder="Email (опционально)"
                    @input="fieldErrors.email = ''"
                    :class="[
                      'w-full px-4 py-3 rounded-[3rem] bg-bg/50 border text-text placeholder:text-text-muted focus:outline-none transition-colors',
                      fieldErrors.email ? 'border-error' : 'border-border focus:border-accent',
                    ]"
                  />
                  <p v-if="fieldErrors.email" class="text-sm text-error mt-1">
                    {{ fieldErrors.email }}
                  </p>
                </div>
                <FormErrorBanner
                  v-if="submitError"
                  :key="submitErrorKey"
                  :message="submitError"
                  shake
                />
                <CtaButton
                  type="button"
                  class="!mt-3 w-full"
                  bg-class="!bg-[var(--color-accent)]"
                  text-class="!text-[var(--color-bg)]"
                  label="Отправить"
                  :loading="isSubmitting"
                  :success="submitButtonSuccess"
                  :disabled="submitButtonSuccess"
                  loading-label="Отправка..."
                  success-label="Отправлено"
                  @click="submitContactForm"
                />
              </div>
              <p class="text-sm text-text-muted mt-4 text-center">
                📞 Или позвоните прямо сейчас:<br />
                <a href="tel:+79042964072" class="text-accent hover:underline">+7 904 296 40 72</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- SEO Content: h2Outline задан в meta маршрута /calculator, иначе SEOContent не рендерится -->
      <div class="mb-8 text-bg">
        <SEOContent>
          <!-- Шаги section -->
          <template #section-шаги>
            <div class="mb-8">
              <p class="text-sm text-accent leading-relaxed mb-4">
                Калькулятор стоимости сайта поможет вам быстро оценить бюджет проекта. Выберите тип
                сайта, количество страниц, дизайн и дополнительные функции.
              </p>
              <ol class="list-decimal list-inside space-y-2 text-sm text-bg/90">
                <li>Выберите тип сайта (лендинг, визитка, магазин и т.д.)</li>
                <li>Укажите количество страниц (для лендинга этот шаг пропускается)</li>
                <li>Выберите вариант дизайна</li>
                <li>Добавьте необходимый функционал</li>
                <li>Настройте контент и SEO</li>
                <li>Выберите срочность и поддержку</li>
                <li>Получите итоговую оценку</li>
              </ol>
            </div>
          </template>

          <!-- Результат section -->
          <template #section-результат>
            <div class="mb-8">
              <p class="text-sm text-accent leading-relaxed">
                После заполнения всех шагов вы получите детальную оценку стоимости проекта с
                разбивкой по категориям. Вы можете отправить заявку для получения коммерческого
                предложения или связаться с нами для консультации.
              </p>
            </div>
          </template>

          <!-- Что дальше section -->
          <template #section-что-дальше>
            <div class="mb-8">
              <p class="text-sm text-accent leading-relaxed mb-4">
                После получения оценки вы можете:
              </p>
              <ul class="list-disc list-inside space-y-2 text-sm text-bg/90">
                <li>Отправить заявку для получения детального коммерческого предложения</li>
                <li>Связаться с нами для консультации по телефону или Telegram</li>
                <li>Посмотреть примеры наших работ в разделе кейсов</li>
                <li>Изучить подробности услуг в разделе услуг</li>
              </ul>
            </div>
          </template>
        </SEOContent>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calc-step-enter-active,
.calc-step-leave-active {
  transition:
    opacity 0.22s ease-out,
    transform 0.22s ease-out;
}

.calc-step-enter-from,
.calc-step-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

@media (prefers-reduced-motion: reduce) {
  .calc-step-enter-active,
  .calc-step-leave-active {
    transition-duration: 0.01ms;
  }

  .calc-step-enter-from,
  .calc-step-leave-to {
    transform: none;
  }
}
</style>
