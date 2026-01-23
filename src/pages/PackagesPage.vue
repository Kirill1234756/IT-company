<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import type { PackageCardProps } from '../components/PackageCard.vue'
import { useYandexMetrika } from '../composables/useYandexMetrika'

const PackageCard = defineAsyncComponent(() => import('../components/PackageCard.vue'))
const Breadcrumbs = defineAsyncComponent(() => import('../components/ui/Breadcrumbs.vue'))
const { trackButtonClick } = useYandexMetrika()

const router = useRouter()

// Пакеты услуг
const packages = ref<PackageCardProps[]>([
  {
    id: 1,
    title: 'Стартовый пакет',
    description:
      'Идеальное решение для старта бизнеса. Сайт-визитка с базовой SEO-оптимизацией для быстрого запуска.',
    price: 'от 80 000 ₽',
    originalPrice: 'от 100 000 ₽',
    features: [
      'Сайт-визитка до 5 страниц',
      'Адаптивный дизайн',
      'Базовая SEO-оптимизация',
      'Интеграция с аналитикой',
      'Обучение работе с сайтом',
      'Техподдержка 1 месяц',
    ],
    iconPath:
      'm15 14 2.045-1.533C19.469 10.648 20.542 6.98 20 4c-2.981-.542-6.649.531-8.467 2.955L10 9m5 5-3.5 2.5-4-4L10 9m5 5v2.667a4 4 0 0 1-.8 2.4l-.7.933-1-1M10 9H7.333a4 4 0 0 0-2.4.8L4 10.5l1 1M8.5 18 5 19l1.166-3.5m9.334-6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    slug: 'starter',
  },
  {
    id: 2,
    title: 'Бизнес пакет',
    description:
      'Комплексное решение для развития бизнеса. Корпоративный сайт с продвижением и поддержкой.',
    price: 'от 180 000 ₽',
    originalPrice: 'от 220 000 ₽',
    features: [
      'Корпоративный сайт до 10 страниц',
      'Уникальный дизайн',
      'SEO-продвижение 3 месяца',
      'Контент-маркетинг',
      'Интеграция CRM',
      'Техподдержка 3 месяца',
      'Ежемесячные отчеты',
    ],
    iconPath:
      'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
    isPopular: true,
    slug: 'business',
  },
  {
    id: 4,
    title: 'Премиум пакет',
    description:
      'Максимальное решение для крупного бизнеса. Полный цикл разработки, продвижения и поддержки.',
    price: 'от 540 000 ₽',
    originalPrice: 'от 650 000 ₽',
    features: [
      'Корпоративный сайт или SaaS-платформа',
      'Индивидуальный дизайн',
      'SEO-продвижение 12 месяцев',
      'Контент-стратегия',
      'Маркетинговая стратегия',
      'Интеграция всех систем',
      'Мобильное приложение',
      'Техподдержка 12 месяцев',
      'Персональный менеджер',
    ],
    iconPath:
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    slug: 'premium',
  },
])

const handlePackageClick = (packageData: PackageCardProps) => {
  // Отслеживаем клик по пакету
  trackButtonClick(`package-${packageData.slug}`, {
    package_id: packageData.id,
    package_title: packageData.title,
    package_price: packageData.price,
  })

  // Переход на форму клиента с предзаполненными данными
  router.push({
    path: '/client-form',
    query: {
      package: packageData.slug,
      packageTitle: packageData.title,
    },
  })
}
</script>

<template>
  <div class="min-h-screen py-[5rem] px-4 md:px-8 lg:px-[3rem] bg-text">
    <main class="mx-auto">
      <!-- Breadcrumbs -->
      <Breadcrumbs
        :items="[{ label: 'Главная', to: '/' }, { label: 'Пакеты услуг' }]"
        class="mb-8"
      />

      <!-- Header Section -->
      <div class="mb-12 text-center">
        <h1
          class="text-3xl md:text-5xl font-bold !text-accent mb-4 font-display"
          style="font-family: 'IBM Plex Sans Condensed', sans-serif"
        >
          Готовые пакеты услуг
        </h1>
        <p class="text-lg md:text-xl text-text-muted max-w-3xl mx-auto">
          Выберите готовое решение для вашего бизнеса. Каждый пакет включает комплекс услуг с
          выгодной экономией.
        </p>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
        <PackageCard
          v-for="pkg in packages"
          :key="pkg.id"
          :id="pkg.id"
          :title="pkg.title"
          :description="pkg.description"
          :price="pkg.price"
          :original-price="pkg.originalPrice"
          :features="pkg.features"
          :icon-path="pkg.iconPath"
          :is-popular="pkg.isPopular"
          :slug="pkg.slug"
          @click="handlePackageClick"
        />
      </div>

      <!-- Benefits Section -->
      <div class="mb-12 p-8 md:p-12 rounded-3xl border border-border bg-bg">
        <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center font-display">
          Преимущества пакетных решений
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-lg font-semibold mb-2">Экономия до 20%</h3>
            <p class="text-sm text-text-muted">
              При покупке пакета вы экономите по сравнению с заказом услуг отдельно
            </p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-lg font-semibold mb-2">Быстрый старт</h3>
            <p class="text-sm text-text-muted">
              Все услуги согласованы и готовы к работе. Запуск проекта без задержек
            </p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-lg font-semibold mb-2">Комплексный подход</h3>
            <p class="text-sm text-text-muted">
              Все компоненты работают вместе для достижения максимального результата
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center p-8 md:p-12 rounded-3xl border border-border bg-gradient-accent">
        <h3 class="text-2xl md:text-3xl font-bold mb-4 text-bg font-display">
          Нужен индивидуальный пакет?
        </h3>
        <p class="text-lg mb-6 text-bg/90">
          Мы можем составить персональный пакет услуг специально для вашего бизнеса
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/calculator"
            class="px-8 py-4 rounded-full font-semibold bg-bg text-accent hover:bg-bg/90 transition-colors"
          >
            Рассчитать стоимость
          </a>
          <a
            href="/client-form"
            class="px-8 py-4 rounded-full font-semibold border-2 border-bg text-bg hover:bg-bg/10 transition-colors"
          >
            Оставить заявку
          </a>
          <a
            href="/contacts"
            class="px-8 py-4 rounded-full font-semibold border-2 border-bg text-bg hover:bg-bg/10 transition-colors"
          >
            Связаться с нами
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom styles for packages page */
.package-card {
  min-height: 100%;
}
</style>

