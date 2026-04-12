<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { PackageCardProps } from '../components/PackageCard.vue'
import { useYandexMetrika } from '../composables/useYandexMetrika'
import { getPackageDetail } from '../stores/packages.detail.data'

const PackageCard = defineAsyncComponent(() => import('../components/PackageCard.vue'))
const PackageDetailModal = defineAsyncComponent(
  () => import('../components/modals/PackageDetailModal.vue')
)
const SectionHeading = defineAsyncComponent(() => import('../components/ui/SectionHeading.vue'))
const Breadcrumbs = defineAsyncComponent(() => import('../components/ui/Breadcrumbs.vue'))
const SEOContent = defineAsyncComponent(() => import('../components/seo/SEOContent.vue'))
const { trackButtonClick } = useYandexMetrika()

const route = useRoute()
const openPackageSlug = ref<string | null>(null)

const activePackageDetail = computed(() => {
  const slug = openPackageSlug.value
  return slug ? getPackageDetail(slug) : undefined
})

const pageH1 = computed(() => (route.meta.h1 as string) || 'От запуска сайта до стабильного потока клиентов')
const pageDescription = computed(() => (route.meta.description as string) || '')

// Пакеты услуг
const packages = ref<PackageCardProps[]>([
  {
    id: 1,
    title: 'Стартовый пакет',
    description:
      'Идеальное решение для старта бизнеса. Сайт-визитка с базовой SEO-оптимизацией для быстрого запуска.',
    price: 'от 80 000 ₽',
    originalPrice: 'от 180 000 ₽',
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
      'Система привлечения клиентов: продающий сайт, SEO, контент, CRM и отчёты — не разовые действия, а рост.',
    price: 'от 180 000 ₽',
    originalPrice: 'от 320 000 ₽',
    popularBadgeText: 'Популярный',
    offerLine: 'Запуск системы привлечения клиентов за 30 дней',
    resultHook: 'Первые заявки уже в процессе разработки',
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
      'Единая экосистема роста: продукт, стратегия, SEO на год, интеграции и внешний digital-уровень — не набор подрядчиков.',
    price: 'от 540 000 ₽',
    originalPrice: 'от 1 190 000 ₽',

    offerLineViolet: true,
    offerLine: 'Система роста бизнеса под ключ за 60–90 дней',
    resultHook: 'От стратегии до первых масштабируемых продаж',
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
  trackButtonClick(`package-open-detail-${packageData.slug}`, {
    package_id: packageData.id,
    package_title: packageData.title,
    package_price: packageData.price,
  })
  if (packageData.slug) {
    openPackageSlug.value = packageData.slug
  }
}

const closePackageModal = () => {
  openPackageSlug.value = null
}
</script>

<template>
  <div class="min-h-screen px-4 md:px-8 lg:px-[3rem] bg-text">
    <PackageDetailModal
      v-if="activePackageDetail"
      :package-detail="activePackageDetail"
      @close="closePackageModal"
    />
    <main class="mx-auto">
      <!-- Breadcrumbs -->
      <Breadcrumbs
        :items="[{ label: 'Главная', to: '/' }, { label: 'Пакеты услуг' }]"
        class="mb-8"
      />

      <!-- Header Section -->
      <div class="mb-12 text-center">
        <SectionHeading
          :level="1"
          size="lg"
          color="bg"
          align="center"
          weight="black"
          class="mb-4"
        >
          {{ pageH1 }}
        </SectionHeading>
        <p class="text-lg md:text-xl text-accent max-w-3xl mx-auto">
          {{
            pageDescription ||
            'Выберите готовое решение для вашего бизнеса. Каждый пакет включает комплекс услуг с выгодной экономией.'
          }}
        </p>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
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
          :popular-badge-text="pkg.popularBadgeText"
          :anchor-badge-text="pkg.anchorBadgeText"
          :offer-line-violet="pkg.offerLineViolet"
          :offer-line="pkg.offerLine"
          :result-hook="pkg.resultHook"
          :slug="pkg.slug"
          @click="handlePackageClick"
        />
      </div>



      <!-- SEO Content (семантическое ядро / h2_outline из БД для /packages) -->
      <div class="mb-8">
        <SEOContent>
          <template #section-преимущества-пакетных-решений>
            <!-- Секция уже есть выше, повторяем кратко для SEO-блока -->
            <p class="text-sm text-text-muted leading-relaxed">
              Пакетные решения позволяют запустить проект быстрее и дешевле: мы заранее собрали
              набор работ, которые чаще всего нужны бизнесу, и оптимизировали стоимость за счёт
              комплексного подхода.
            </p>
          </template>

          <template #section-стартовый-пакет>
            <p class="text-sm text-text-muted leading-relaxed">
              Стартовый пакет подходит для быстрого запуска: сайт-визитка, базовая SEO-оптимизация и
              подключение аналитики.
            </p>
          </template>

          <template #section-бизнес-пакет>
            <p class="text-sm text-text-muted leading-relaxed">
              Бизнес пакет — для компаний, которым важны доверие, структура и рост: корпоративный
              сайт, контент и SEO-продвижение.
            </p>
          </template>

          <template #section-e-commerce-пакет>
            <p class="text-sm text-text-muted leading-relaxed">
              E-commerce пакет — для продаж: интернет-магазин, корзина, оплата/доставка и подготовка
              к SEO-продвижению.
            </p>
          </template>

          <template #section-премиум-пакет>
            <p class="text-sm text-text-muted leading-relaxed">
              Премиум пакет — максимальный охват: индивидуальный дизайн, стратегия, интеграции и
              длительное продвижение.
            </p>
          </template>

          <template #section-сравнение-пакетов>
            <p class="text-sm text-text-muted leading-relaxed">
              Если вы сомневаетесь, начните с базового: мы поможем выбрать пакет по целям
              (лиды/продажи/имидж) и бюджету.
            </p>
          </template>

          <template #section-как-выбрать-пакет>
            <ul class="list-disc list-inside space-y-2 text-sm text-text-muted">
              <li>Определите цель: заявки, продажи или презентация компании.</li>
              <li>Оцените объём контента и количество страниц.</li>
              <li>Проверьте необходимость интеграций (CRM, платежи, каталоги).</li>
              <li>Выберите скорость запуска и уровень поддержки.</li>
            </ul>
          </template>

          <template #section-faq>
            <p class="text-sm text-text-muted leading-relaxed">
              Ответы на частые вопросы отображаются в метаданных страницы и используются для
              разметки. При необходимости добавим расширенный FAQ.
            </p>
          </template>
        </SEOContent>
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
