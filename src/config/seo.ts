export type SEOConfig = {
  title: string
  description: string
  canonicalPath: string
  h1?: string
  h2Outline?: string[]
  faq?: string[]
  ogImage?: string
}

// Базовые локальные SEO‑настройки по пути.
// Если нужного пути нет в этом объекте, вернётся null,
// а роутер использует meta из самого маршрута.
const seoByPath: Record<string, SEOConfig> = {
  '/': {
    title: 'Главная',
    description:
      'Kodify — продажа сайтов и цифровых решений для развития бизнеса. Разработка корпоративных сайтов, интернет‑магазинов, лендингов. Продвижение и поддержка.',
    canonicalPath: '/',
    h1: 'Агентство Kodify — сайты и цифровые решения под ключ',
    h2Outline: [],
    faq: [],
    ogImage: '/og-image.webp',
  },
  '/blog': {
    title: 'Блог Kodify',
    description:
      'Блог Kodify о создании и продвижении сайтов: статьи, руководства, кейсы и аналитика для владельцев бизнеса и маркетологов.',
    canonicalPath: '/blog',
    h1: 'Блог о разработке и росте проектов',
    h2Outline: [],
    faq: [],
    ogImage: '/og-image.webp',
  },
}

export function getSEOConfig(path: string): SEOConfig | null {
  return seoByPath[path] ?? null
}

// Локальные настройки SEO для отдельных постов блога по slug.
// Сейчас карта пустая — роутер использует fallback из данных поста.
// Когда понадобится, сюда можно добавить записи вида:
// 'post-slug': { title: '...', description: '...', h1: '...', ... }
const blogPostSeo: Record<string, Partial<SEOConfig>> = {}

export function getBlogPostSEO(slug: string): Partial<SEOConfig> | null {
  return blogPostSeo[slug] ?? null
}

