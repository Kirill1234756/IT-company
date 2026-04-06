/**
 * TypeScript типы для интеграции с Яндекс.Метрикой
 */

// Глобальный объект Яндекс.Метрики
declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: any[]) => void;
  }
}

// Конфигурация счётчика (для SPA: referrer и url задаются при init)
export interface YandexMetrikaConfig {
  id: number;
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
  webvisor?: boolean;
  ecommerce?: string | boolean;
  ssr?: boolean;
  referrer?: string;
  url?: string;
}

// Параметры для отслеживания событий
export interface YandexMetrikaParams {
  [key: string]: string | number | boolean;
}

// Параметры для e-commerce
export interface EcommerceParams {
  currency?: string;
  orderId?: string;
  total?: number;
  items?: EcommerceItem[];
}

export interface EcommerceItem {
  id: string;
  name: string;
  category?: string;
  quantity?: number;
  price?: number;
}

// Типы пользовательских событий
export type UserEventType =
  | 'page_view'
  | 'form_submit'
  | 'button_click'
  | 'modal_open'
  | 'service_view'
  | 'blog_view'
  | 'portfolio_view'
  | 'navigation_click'
  | 'cta_click';

// Интерфейс для пользовательского события
export interface UserEvent {
  type: UserEventType;
  target?: string;
  category?: string;
  value?: string | number;
  params?: YandexMetrikaParams;
}

// Цели для отслеживания
export type YandexMetrikaGoal =
  | 'FORM_SUBMIT'
  | 'BLOG_VIEW'
  | 'PORTFOLIO_VIEW'
  | 'SERVICE_VIEW'
  | 'NAVIGATION_CLICK'
  | 'CTA_CLICK'
  | 'MODAL_OPEN'
  | 'BUTTON_CLICK';

// Интерфейс для целей
export interface GoalParams {
  goal: YandexMetrikaGoal;
  params?: YandexMetrikaParams;
  callback?: () => void;
}

// Конфигурация по умолчанию (оптимизирована для SPA)
export const DEFAULT_METRIKA_CONFIG: YandexMetrikaConfig = {
  id: 0,
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
  ecommerce: 'dataLayer',
  ssr: true
};

/**
 * Единая точка получения ID счётчика Яндекс.Метрики.
 *
 * Логика:
 * - В первую очередь читаем VITE_YANDEX_METRIKA_ID из переменных окружения.
 * - В non-production режимах (dev/preview) можем использовать безопасный fallback ID,
 *   чтобы разработка и тестирование не ломали инициализацию.
 * - В production при отсутствии ID возвращаем null и не инициализируем счётчик.
 */
export const getYandexMetrikaId = (): number | null => {
  const rawFromEnv = import.meta.env.VITE_YANDEX_METRIKA_ID;

  if (rawFromEnv) {
    const parsed = Number(rawFromEnv);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  // В dev/preview оставляем возможность использовать fallback,
  // чтобы не ломать локальную разработку, даже если .env ещё не настроен.
  if (import.meta.env.MODE !== 'production') {
    const fallback = 106861768;
    return fallback;
  }

  // В production без явного ID счётчик не инициализируем
  return null;
};

// Константы для событий
export const METRIKA_EVENTS = {
  PAGE_VIEW: 'page_view' as const,
  FORM_SUBMIT: 'form_submit' as const,
  BUTTON_CLICK: 'button_click' as const,
  MODAL_OPEN: 'modal_open' as const,
  SERVICE_VIEW: 'service_view' as const,
  BLOG_VIEW: 'blog_view' as const,
  PORTFOLIO_VIEW: 'portfolio_view' as const,
  NAVIGATION_CLICK: 'navigation_click' as const,
  CTA_CLICK: 'cta_click' as const,
} as const;

// Константы для целей
export const METRIKA_GOALS = {
  FORM_SUBMIT: 'FORM_SUBMIT' as const,
  BLOG_VIEW: 'BLOG_VIEW' as const,
  PORTFOLIO_VIEW: 'PORTFOLIO_VIEW' as const,
  SERVICE_VIEW: 'SERVICE_VIEW' as const,
  NAVIGATION_CLICK: 'NAVIGATION_CLICK' as const,
  CTA_CLICK: 'CTA_CLICK' as const,
  MODAL_OPEN: 'MODAL_OPEN' as const,
  BUTTON_CLICK: 'BUTTON_CLICK' as const,
} as const;









