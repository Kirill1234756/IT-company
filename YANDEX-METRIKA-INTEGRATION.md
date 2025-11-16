# Интеграция Яндекс.Метрики

## Обзор

Полная интеграция Яндекс.Метрики в Vue 3 приложение с использованием современных технологий: Composition API, TypeScript, и реактивность.

## Особенности

- ✅ **Автоматическое отслеживание переходов** между страницами
- ✅ **Отслеживание пользовательских событий** (формы, клики, модальные окна)
- ✅ **TypeScript типизация** для всех методов
- ✅ **Только в production** - отключена в режиме разработки
- ✅ **Reactive composable** для удобного использования
- ✅ **Интеграция с Vue Router** для автоматического отслеживания

## Настройка

### 1. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_YANDEX_METRIKA_ID=104923147
```

### 2. Автоматическая инициализация

Плагин автоматически инициализируется в `main.ts` и подключается к Vue Router.

## Использование

### Базовое использование

```typescript
import { useYandexMetrika } from '@/composables/useYandexMetrika'

const { trackPageView, trackFormSubmit, trackButtonClick } = useYandexMetrika()

// Отслеживание просмотра страницы
trackPageView('/custom-page', 'Custom Page Title')

// Отслеживание отправки формы
trackFormSubmit('contact-form', {
  form_type: 'contact',
  user_type: 'new',
})

// Отслеживание клика по кнопке
trackButtonClick('cta-button', {
  button_location: 'header',
  action: 'signup',
})
```

### Отслеживание событий

```typescript
const { trackEvent } = useYandexMetrika()

// Кастомное событие
trackEvent({
  type: 'custom_action',
  target: 'special-button',
  params: {
    custom_param: 'value',
  },
})
```

### E-commerce отслеживание

```typescript
const { trackPurchase, trackAddToCart } = useYandexMetrika()

// Отслеживание покупки
trackPurchase('order-123', 1500, [
  {
    id: 'service-1',
    name: 'Web Development',
    category: 'Development',
    quantity: 1,
    price: 1500,
  },
])

// Отслеживание добавления в корзину
trackAddToCart({
  id: 'service-1',
  name: 'Web Development',
  category: 'Development',
  quantity: 1,
  price: 1500,
})
```

## Отслеживаемые события

### Автоматические события

- **Переходы между страницами** - автоматически через Vue Router
- **Отправка клиентской формы** - в `useClientForm.ts`
- **Открытие модальных окон** - BlogModal, PortfolioModal
- **Просмотр услуг** - ServicesPage

### Ручные события

- `trackPageView()` - просмотр страницы
- `trackFormSubmit()` - отправка формы
- `trackButtonClick()` - клик по кнопке
- `trackModalOpen()` - открытие модального окна
- `trackServiceView()` - просмотр услуги
- `trackBlogView()` - просмотр статьи блога
- `trackPortfolioView()` - просмотр проекта портфолио
- `trackNavigationClick()` - клик по навигации
- `trackCtaClick()` - клик по CTA

## Цели (Goals)

Все события автоматически конвертируются в цели Яндекс.Метрики:

- `FORM_SUBMIT` - отправка форм
- `BLOG_VIEW` - просмотр статей блога
- `PORTFOLIO_VIEW` - просмотр проектов
- `SERVICE_VIEW` - просмотр услуг
- `NAVIGATION_CLICK` - клики по навигации
- `CTA_CLICK` - клики по CTA
- `MODAL_OPEN` - открытие модальных окон
- `BUTTON_CLICK` - клики по кнопкам

## Конфигурация

### Настройки счётчика

```typescript
// В plugins/yandex-metrika.ts
const config = {
  id: 104923147,
  clickmap: true, // Карта кликов
  trackLinks: true, // Отслеживание ссылок
  accurateTrackBounce: true, // Точный показатель отказов
  webvisor: true, // Вебвизор
  ecommerce: 'dataLayer', // E-commerce через dataLayer
  ssr: false, // Клиентский режим
}
```

### Отключение в разработке

Аналитика автоматически отключается в режиме разработки (`import.meta.env.MODE !== 'production'`).

## Файлы

- `src/types/yandex-metrika.ts` - TypeScript типы
- `src/composables/useYandexMetrika.ts` - основной композабл
- `src/plugins/yandex-metrika.ts` - плагин Vue
- `src/main.ts` - инициализация плагина
- `index.html` - noscript fallback

## Отладка

В консоли браузера будут выводиться логи:

```javascript
// В production режиме
console.log('Yandex Metrika: успешно инициализирована', config)
console.log('Yandex Metrika: цель достигнута', goal, params)
console.log('Yandex Metrika: событие', event)

// В development режиме
console.log('Yandex Metrika: отключена в режиме разработки')
```

## Безопасность

- ID счётчика хранится в переменных окружения
- Скрипт загружается только в production
- Проверка на дублирование загрузки скрипта
- Обработка ошибок для всех методов









