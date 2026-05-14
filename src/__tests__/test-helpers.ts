import type { ServiceDetail } from '@/types/services'

export function createServiceDetail(overrides: Partial<ServiceDetail> = {}): ServiceDetail {
  return {
    id: 999,
    title: 'Тестовая услуга',
    breadcrumbs: ['Главная', 'Услуги', 'Тестовая услуга'],
    about: {
      title: 'О тестовой услуге',
      description: ['Описание 1', 'Описание 2'],
    },
    metrics: {
      cost: 'от 10 000 ₽',
      workingDays: 10,
    },
    features: [
      {
        id: 1,
        title: 'Фича 1',
        description: 'Описание фичи 1',
      },
    ],
    faq: [
      {
        id: 1,
        question: 'Вопрос 1?',
        answer: 'Ответ 1',
      },
      {
        id: 2,
        question: 'Вопрос 2?',
        answer: 'Ответ 2',
      },
    ],
    ...overrides,
  }
}
