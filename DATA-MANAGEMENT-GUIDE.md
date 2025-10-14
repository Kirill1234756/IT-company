# Руководство по управлению данными в Vue 3 проекте

## 🎯 Когда использовать что

### 1. **В компонентах (ref/reactive)** - ✅ Для локальных данных

```vue
<script setup>
// ✅ Статичные данные компонента
const stats = [{ value: 13, label: 'лет', sublabel: 'на рынке' }]

// ✅ Локальное состояние формы
const formData = reactive({
  name: '',
  email: '',
})

// ✅ UI состояние
const isModalOpen = ref(false)
const isLoading = ref(false)
</script>
```

**Используй когда:**

- Статичные данные, специфичные для компонента
- Локальное состояние формы
- UI состояние (модалы, загрузки)
- Временные данные
- Данные, которые не нужно разделять между компонентами

---

### 2. **Composables** - ✅ Для переиспользуемой логики

```typescript
// ✅ Переиспользуемая логика
export function useClientForm() {
  const formData = reactive({...})
  const validateForm = () => {...}
  const submitForm = async () => {...}

  return { formData, validateForm, submitForm }
}
```

**Используй когда:**

- Переиспользуемая логика между компонентами
- Сложная бизнес-логика
- API вызовы
- Валидация
- Утилиты и хелперы

---

### 3. **Pinia Store** - ✅ Для глобального состояния

```typescript
// ✅ Глобальное состояние приложения
export const useAppStore = defineStore('app', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const login = async (credentials) => {...}

  return { user, isAuthenticated, login }
})
```

**Используй когда:**

- Данные нужны в нескольких компонентах
- Состояние пользователя
- Настройки приложения
- Кэш данных
- Состояние навигации

---

## 📁 Структура файлов

```
src/
├── components/           # Переиспользуемые компоненты
├── pages/               # Страницы приложения
├── stores/              # Pinia stores
│   ├── app.ts          # Глобальное состояние приложения
│   ├── content.ts      # Контентные данные (статистика, преимущества)
│   ├── portfolio.ts    # Данные портфолио
│   └── counter.ts      # Пример store
├── composables/         # Переиспользуемая логика
│   ├── useClientForm.ts
│   └── useStackScroll.ts
├── types/              # TypeScript типы
├── api/                # API сервисы
└── utils/              # Утилиты
```

---

## 🔄 Миграция существующих данных

### Из компонентов в Store:

**Было (в HomePage.vue):**

```typescript
const stats = [{ value: 13, label: 'лет', sublabel: 'на рынке' }]
```

**Стало (в content.ts store):**

```typescript
export const useContentStore = defineStore('content', () => {
  const stats = ref([{ value: 13, label: 'лет', sublabel: 'на рынке' }])

  return { stats }
})
```

**Использование в компоненте:**

```vue
<script setup>
import { useContentStore } from '../stores/content'

const contentStore = useContentStore()
</script>

<template>
  <div v-for="stat in contentStore.stats" :key="stat.label">{{ stat.value }} {{ stat.label }}</div>
</template>
```

---

## 🚀 Практические примеры

### 1. **Форма клиента** - Composables ✅

```typescript
// useClientForm.ts - правильный подход
export function useClientForm() {
  const formData = reactive({...})
  const validateForm = () => {...}
  const submitForm = async () => {...}

  return { formData, validateForm, submitForm }
}
```

### 2. **Данные портфолио** - Store ✅

```typescript
// portfolio.ts - для данных, используемых в разных местах
export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref([...])
  const selectedProject = ref(null)
  const filteredProjects = computed(() => {...})

  return { projects, selectedProject, filteredProjects }
})
```

### 3. **UI состояние** - В компоненте ✅

```vue
<script setup>
// Локальное состояние модала
const isModalOpen = ref(false)
const isLoading = ref(false)
</script>
```

---

## ⚡ Производительность

### ✅ **Оптимизация:**

- Используй `computed` для производных данных
- Ленивая загрузка компонентов с `defineAsyncComponent`
- Разделение store по функциональности
- Кэширование API данных в store

### ❌ **Избегай:**

- Слишком много мелких store
- Хранения UI состояния в глобальном store
- Дублирования данных между store
- Слишком глубокой вложенности реактивных объектов

---

## 🎨 Антипаттерны

### ❌ **НЕ делай так:**

```typescript
// Слишком много мелких store
export const useModalStore = defineStore('modal', () => ({
  isOpen: ref(false),
}))

export const useLoadingStore = defineStore('loading', () => ({
  isLoading: ref(false),
}))

// Лучше объединить в один
export const useUIStore = defineStore('ui', () => ({
  isModalOpen: ref(false),
  isLoading: ref(false),
  notifications: ref([]),
}))
```

### ✅ **Делай так:**

```typescript
// Логически сгруппированные store
export const useUIStore = defineStore('ui', () => ({
  // Все UI состояние в одном месте
  isModalOpen: ref(false),
  isLoading: ref(false),
  notifications: ref([]),
}))
```

---

## 🔧 Инструменты разработчика

### Vue DevTools:

- Устанавливай Vue DevTools для отладки
- Используй Pinia DevTools для мониторинга store
- Отслеживай изменения реактивных данных

### TypeScript:

- Строгая типизация всех store
- Интерфейсы для API ответов
- Типы для компонентных props

---

## 📋 Чеклист при выборе подхода

### Используй **локальное состояние** если:

- [ ] Данные используются только в одном компоненте
- [ ] Данные временные (форма, UI состояние)
- [ ] Данные статичные (константы)

### Используй **composable** если:

- [ ] Логика переиспользуется в нескольких компонентах
- [ ] Сложная бизнес-логика
- [ ] API вызовы
- [ ] Валидация

### Используй **Pinia store** если:

- [ ] Данные нужны в нескольких компонентах
- [ ] Глобальное состояние приложения
- [ ] Кэширование данных
- [ ] Состояние пользователя

---

## 🎯 Заключение

**Правильная архитектура данных:**

1. **Локальное состояние** → Простые компоненты
2. **Composables** → Переиспользуемая логика
3. **Pinia Store** → Глобальное состояние

**Помни:** Начинай с локального состояния, поднимай вверх по мере необходимости!
