<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { CalculatorFormAPI } from '../api/calculator-form'
const SEOContent = defineAsyncComponent(() => import('../components/seo/SEOContent.vue'))
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'
import { useHead } from '@unhead/vue'
import { watchEffect } from 'vue'
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

// Отправка формы
const submitContactForm = async () => {
  // Валидация
  if (!contactForm.value.name || !contactForm.value.phone) {
    submitError.value = 'Пожалуйста, заполните имя и телефон'
    return
  }

  // Проверка, что есть хотя бы базовые данные калькулятора
  if (!answers.value.siteType) {
    submitError.value = 'Пожалуйста, заполните калькулятор'
    return
  }

  isSubmitting.value = true
  submitError.value = null

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
      formStartedAt: Date.now(),
    }

    const result = await CalculatorFormAPI.submitForm(formData)

    if (result.success) {
      // Очистить форму
      contactForm.value.name = ''
      contactForm.value.phone = ''
      contactForm.value.email = ''

      // Показать успешное сообщение
      alert(result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.')
    } else {
      submitError.value = result.message || 'Произошла ошибка при отправке формы'
    }
  } catch (error) {
    console.error('Ошибка отправки формы:', error)
    submitError.value = 'Произошла ошибка при отправке формы. Попробуйте еще раз.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-text py-[5rem] px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Заголовок -->
      <div class="text-center !text-bg mb-8">
        <h1 class="text-4xl md:text-5xl font-black text-bg mb-4">💰 КАЛЬКУЛЯТОР СТОИМОСТИ САЙТА</h1>
        <p class="text-lg text-bg/80 mb-2">
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

      <!-- SEO Content -->
      <div class="mb-8">
        <SEOContent>
          <!-- Шаги section -->
          <template #section-шаги>
            <div class="mb-8 text-purple">
              <p class="text-sm text-accent leading-relaxed mb-4">
                Калькулятор стоимости сайта поможет вам быстро оценить бюджет проекта. Выберите тип
                сайта, количество страниц, дизайн и дополнительные функции.
              </p>
              <ol class="list-decimal list-inside space-y-2 text-sm">
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
            <div class="mb-8 text-purple">
              <p class="text-sm text-accent leading-relaxed mb-4">
                После получения оценки вы можете:
              </p>
              <ul class="list-disc list-inside space-y-2 text-sm">
                <li>Отправить заявку для получения детального коммерческого предложения</li>
                <li>Связаться с нами для консультации по телефону или Telegram</li>
                <li>Посмотреть примеры наших работ в разделе кейсов</li>
                <li>Изучить подробности услуг в разделе услуг</li>
              </ul>
            </div>
          </template>
        </SEOContent>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Левая колонка: Вопросы -->
        <div class="lg:col-span-2">
          <div class="bg-bg rounded-[3rem] p-6 md:p-8">
            <!-- ШАГ 1: Тип сайта -->
            <div v-if="currentStep === 0">
              <h2 class="text-2xl md:text-3xl font-bold text-text mb-4">
                1. Какой тип сайта вам нужен?
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  v-for="type in siteTypes"
                  :key="type.id"
                  @click="answers.siteType = type.id"
                  :aria-label="`Выбрать тип сайта: ${type.label}`"
                  :class="[
                    'p-3 rounded-[3rem] border-2 text-left transition-all duration-300',
                    answers.siteType === type.id
                      ? 'border-accent bg-accent/20'
                      : 'border-border hover:border-accent/50 bg-bg/50',
                  ]"
                >
                  <div class="text-4xl mb-2">{{ type.icon }}</div>
                  <div class="text-xl font-bold text-text mb-1">{{ type.label }}</div>
                  <div class="text-sm text-text-muted mb-2">{{ type.description }}</div>
                  <div class="text-sm font-semibold text-accent">{{ type.price }}</div>
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

            <!-- Навигация -->
            <div class="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <button
                @click="prevStep"
                :disabled="currentStep === 0"
                :class="[
                  'px-6 py-3 rounded-full border-2 transition-all',
                  currentStep === 0
                    ? 'border-border/30 text-text-muted cursor-not-allowed'
                    : 'border-border hover:border-accent text-accent hover:bg-accent/20',
                ]"
              >
                ← Назад
              </button>
              <button
                v-if="currentStep < totalSteps - 1"
                @click="nextStep"
                :disabled="!canGoNext"
                :class="[
                  'px-8 py-3 rounded-full font-semibold transition-all',
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
              <p class="text-sm text-text-muted mb-4 text-center">
                🎯 Хотите точный расчет? Оставьте контакты:
              </p>
              <div class="space-y-3">
                <input
                  v-model="contactForm.name"
                  type="text"
                  placeholder="Ваше имя"
                  class="w-full px-4 py-3 rounded-[3rem] bg-bg/50 border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
                <input
                  v-model="contactForm.phone"
                  type="tel"
                  placeholder="Телефон"
                  class="w-full px-4 py-3 rounded-[3rem] bg-bg/50 border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
                <input
                  v-model="contactForm.email"
                  type="email"
                  placeholder="Email (опционально)"
                  class="w-full px-4 py-3 rounded-[3rem] bg-bg/50 border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
                <div v-if="submitError" class="text-sm text-error mb-2">
                  {{ submitError }}
                </div>
                <button
                  @click="submitContactForm"
                  :disabled="isSubmitting"
                  class="w-full px-6 py-3 rounded-[3rem] !bg-accent text-bg font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
                </button>
              </div>
              <p class="text-sm text-text-muted mt-4 text-center">
                📞 Или позвоните прямо сейчас:<br />
                <a href="tel:+79042964072" class="text-accent hover:underline">+7 904 296 40 72</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
