export interface SEOConfig {
  title: string
  h1: string
  description: string
  h2Outline: string[]
  faq: string[]
  canonicalPath: string
  ogImage?: string
}

export const seoConfig: Record<string, SEOConfig> = {
  '/services/development/corporate-website': {
    title: 'Разработка корпоративного сайта под ключ — Kodify',
    h1: 'Разработка корпоративного сайта под ключ',
    description:
      'Разработка корпоративного сайта под ключ от Kodify. Создание корпоративного сайта с учетом SEO, интеграций и безопасности. Профессиональная разработка сайта с гарантией качества. Цены и сроки на kodifyweb.ru',
    h2Outline: ['Преимущества', 'Что включено', 'Сроки и стоимость', 'Интеграции', 'Кейсы', 'FAQ'],
    faq: [
      'Сколько стоит корпоративный сайт?',
      'Как происходит разработка корпоративного сайта?',
      'Какие сроки создания корпоративного сайта?',
      'Что включает разработка корпоративного сайта под ключ?',
    ],
    canonicalPath: '/services/development/corporate-website',
    ogImage: '/og-image.jpg',
  },
  '/services/development/online-store': {
    title: 'Разработка интернет‑магазина — цены и сроки | Kodify',
    h1: 'Создание интернет‑магазина',
    description:
      'Разработка интернет‑магазина от Kodify. Проектируем и запускаем интернет‑магазины: UX, каталоги, оплата, CRM и 1С. Под ключ. Узнайте стоимость на kodifyweb.ru',
    h2Outline: [
      'Почему мы',
      'Варианты',
      'Каталог и фильтры',
      'Оплата и доставка',
      'Интеграции',
      'Кейсы',
      'FAQ',
    ],
    faq: ['Сколько стоит магазин?', 'Сколько занимает запуск?'],
    canonicalPath: '/services/development/online-store',
    ogImage: '/og-image.jpg',
  },
  '/services/development/landing-page': {
    title: 'Лендинг под ключ — цена и сроки | Kodify',
    h1: 'Разработка лендинга',
    description:
      'Разработка лендинга от Kodify. Делаем конверсионные лендинги с быстрым запуском и анимациями. Интеграции с CRM/аналитикой. Цены на kodifyweb.ru',
    h2Outline: ['Когда нужен лендинг', 'Из чего состоит', 'Примеры', 'Сроки и стоимость', 'FAQ'],
    faq: ['Какая конверсия', 'Какие сроки', 'Что нужно от клиента?'],
    canonicalPath: '/services/development/landing-page',
    ogImage: '/og-image.jpg',
  },
  '/services/development/saas-solutions': {
    title: 'Разработка SaaS‑платформ',
    h1: 'SaaS‑разработка',
    description:
      'Проектируем и создаём SaaS: архитектура, безопасность, биллинг, аналитика. Масштабируемость по требованию.',
    h2Outline: [
      'Архитектура',
      'Функциональные модули',
      'Безопасность',
      'Биллинг',
      'DevOps',
      'Кейсы',
      'FAQ',
    ],
    faq: ['Сколько стоит MVP', 'Как обеспечить масштабируемость?'],
    canonicalPath: '/services/development/saas-solutions',
    ogImage: '/og-image.jpg',
  },
  '/services/development/crm-integration': {
    title: 'Интеграция сайта с CRM',
    h1: 'Интеграция с CRM',
    description:
      'Интегрируем сайт с Bitrix24, amoCRM и др.: лиды, сделки, статусы, уведомления. Сократим ручной труд.',
    h2Outline: ['Какие CRM', 'Что интегрируем', 'Примеры', 'Сроки', 'Стоимость', 'FAQ'],
    faq: ['Сколько занимает интеграция', 'Что нужно для старта?'],
    canonicalPath: '/services/development/crm-integration',
    ogImage: '/og-image.jpg',
  },
  '/services/development/business-automation': {
    title: 'Автоматизация бизнес‑процессов',
    h1: 'Автоматизация процессов',
    description:
      'Оптимизируем процессы: заявки, документы, уведомления, отчёты. Интеграции и сценарии.',
    h2Outline: ['Какие процессы', 'Инструменты', 'Результаты', 'Кейсы', 'Стоимость', 'FAQ'],
    faq: ['С чего начать', 'Какие риски?'],
    canonicalPath: '/services/development/business-automation',
    ogImage: '/og-image.jpg',
  },
  '/services/development/business-card-site': {
    title: 'Сайт‑визитка под ключ — цена и сроки',
    h1: 'Сайт‑визитка',
    description:
      'Небольшой, быстрый сайт для старта: структура, дизайн, форма заявки, аналитика.',
    h2Outline: ['Когда нужен', 'Структура', 'Примеры', 'Стоимость', 'Сроки', 'FAQ'],
    faq: ['Сколько стоит визитка', 'Что входит?'],
    canonicalPath: '/services/development/business-card-site',
    ogImage: '/og-image.jpg',
  },
  '/services/development/site-catalog': {
    title: 'Разработка каталога сайта — цены и сроки',
    h1: 'Создание каталога сайта',
    description:
      'Проектируем каталоги с фильтрами, поиском, карточками товаров/услуг. Интеграции с CRM/1С.',
    h2Outline: [
      'Что включено',
      'Структура каталога',
      'Фильтры и поиск',
      'Интеграции',
      'Кейсы',
      'FAQ',
    ],
    faq: ['Сколько стоит каталог', 'Какие сроки', 'Что нужно от клиента?'],
    canonicalPath: '/services/development/site-catalog',
    ogImage: '/og-image.jpg',
  },
  '/services/growth/promotion': {
    title: 'Продвижение сайта: SEO и трафик | Kodify',
    h1: 'Продвижение сайта',
    description:
      'Продвижение сайта от Kodify. Повышаем видимость и лиды: SEO, контент, техоптимизация, линкбилдинг, аналитика. Узнайте стоимость на kodifyweb.ru',
    h2Outline: ['Аудит', 'Семантика', 'Контент', 'Линки', 'Отчёты', 'Кейсы', 'FAQ'],
    faq: ['Когда ждать результат', 'Что входит в тариф?'],
    canonicalPath: '/services/growth/promotion',
    ogImage: '/og-image.jpg',
  },
  '/services/strategy/branding': {
    title: 'Брендинг и айдентика',
    h1: 'Брендинг',
    description:
      'Создаём бренд‑стратегию и визуальную айдентику: платформа бренда, логотип, гайдлайн.',
    h2Outline: ['Платформа бренда', 'Нейминг', 'Дизайн', 'Гайдлайн', 'Кейсы', 'FAQ'],
    faq: ['Сроки и этапы', 'Что входит?'],
    canonicalPath: '/services/strategy/branding',
    ogImage: '/og-image.jpg',
  },
  '/calculator': {
    title: 'Калькулятор стоимости сайта | Kodify',
    h1: 'Калькулятор стоимости',
    description: 'Калькулятор стоимости сайта от Kodify. Узнайте бюджет и сроки проекта за 60 секунд. PDF‑смета и обратная связь от менеджера. Рассчитайте на kodifyweb.ru',
    h2Outline: ['Шаги', 'Результат', 'Что дальше'],
    faq: ['Как считается цена', 'Можно ли сэкономить?'],
    canonicalPath: '/calculator',
    ogImage: '/og-image.jpg',
  },
  '/services/development': {
    title: 'Разработка сайтов под ключ — цены, сроки, портфолио | Kodify',
    h1: 'Разработка сайтов',
    description:
      'Разработка сайтов под ключ от Kodify. Проектируем и создаём сайты: корпоративные, интернет‑магазины, лендинги, SaaS. Интеграции и поддержка. Портфолио на kodifyweb.ru',
    h2Outline: ['Услуги', 'Технологии', 'Интеграции', 'Кейсы', 'Стоимость', 'FAQ'],
    faq: ['Сколько стоит сайт', 'Сроки разработки', 'Какая CMS лучше?'],
    canonicalPath: '/services/development',
    ogImage: '/og-image.jpg',
  },
  '/services/growth': {
    title: 'Рост: продвижение и маркетинг',
    h1: 'Услуги роста',
    description:
      'Комплексное продвижение сайтов: SEO-оптимизация, контент-маркетинг, контекстная реклама, аналитика. Увеличиваем трафик и конверсию.',
    h2Outline: ['Что делаем', 'Процессы', 'Отчётность', 'Кейсы', 'FAQ'],
    faq: ['Когда ждать результат?', 'Какие тарифы?'],
    canonicalPath: '/services/growth',
    ogImage: '/og-image.jpg',
  },
  '/services/strategy': {
    title: 'Стратегия и брендинг',
    h1: 'Стратегические услуги',
    description:
      'Разработка бизнес-стратегии, брендинг и позиционирование. Исследования рынка, анализ конкурентов, создание платформы бренда.',
    h2Outline: ['Услуги', 'Этапы', 'Результаты', 'Кейсы', 'FAQ'],
    faq: ['Что входит в стратегию', 'Сроки и стоимость?'],
    canonicalPath: '/services/strategy',
    ogImage: '/og-image.jpg',
  },
  '/services': {
    title: 'Наши услуги — разработка, продвижение, поддержка | Kodify',
    h1: 'Наши услуги',
    description:
      'Услуги Kodify: разработка сайтов (корпоративные, интернет-магазины, лендинги), продвижение, автоматизация бизнеса, интеграции с CRM. Полный цикл услуг на kodifyweb.ru',
    h2Outline: ['Разработка', 'Продвижение', 'Стратегия', 'Кейсы', 'FAQ'],
    faq: ['Какие услуги вы предоставляете?', 'Как выбрать подходящую услугу?'],
    canonicalPath: '/services',
    ogImage: '/og-image.jpg',
  },
}

export function getSEOConfig(path: string): SEOConfig | null {
  return seoConfig[path] || null
}


