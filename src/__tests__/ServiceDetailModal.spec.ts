import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ServiceDetailModal from '@/components/modals/ServiceDetailModal.vue'
import { createServiceDetail } from './test-helpers'

const trackModalOpen = vi.fn()

vi.mock('@/composables/useYandexMetrika', () => ({
  useYandexMetrika: () => ({
    trackModalOpen,
  }),
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'home', component: { template: '<div />' } }],
  })
}

describe('ServiceDetailModal', () => {
  beforeEach(() => {
    trackModalOpen.mockClear()
    setActivePinia(createPinia())
  })

  it('calls trackModalOpen on mount with service title', () => {
    const router = createTestRouter()
    const service = createServiceDetail({ title: 'Услуга X' })

    mount(ServiceDetailModal, {
      props: { service },
      global: {
        plugins: [router],
        stubs: {
          Breadcrumbs: {
            props: ['items'],
            template: '<div data-testid="bc-stub">{{ JSON.stringify(items) }}</div>',
          },
          SectionHeading: { template: '<div><slot /></div>' },
          ContactSection: true,
          Footer: true,
        },
      },
    })

    expect(trackModalOpen).toHaveBeenCalledWith('service-detail', { service: 'Услуга X' })
  })

  it('emits close when back button is clicked', async () => {
    const router = createTestRouter()
    const service = createServiceDetail()

    const wrapper = mount(ServiceDetailModal, {
      props: { service },
      global: {
        plugins: [router],
        stubs: {
          Breadcrumbs: true,
          SectionHeading: { template: '<div><slot /></div>' },
          ContactSection: true,
          Footer: true,
        },
      },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('breadcrumb items map Главная and Услуги to routes', () => {
    const router = createTestRouter()
    const service = createServiceDetail({
      breadcrumbs: ['Главная', 'Услуги', 'Деталь'],
    })

    const wrapper = mount(ServiceDetailModal, {
      props: { service },
      global: {
        plugins: [router],
        stubs: {
          Breadcrumbs: {
            props: ['items'],
            template: '<div data-testid="bc-stub">{{ JSON.stringify(items) }}</div>',
          },
          SectionHeading: { template: '<div><slot /></div>' },
          ContactSection: true,
          Footer: true,
        },
      },
    })

    const raw = wrapper.get('[data-testid="bc-stub"]').text()
    const items = JSON.parse(raw) as { label: string; to?: string }[]
    expect(items[0]).toEqual({ label: 'Главная', to: '/' })
    expect(items[1]).toEqual({ label: 'Услуги', to: '/services' })
    expect(items[2]).toEqual({ label: 'Деталь' })
  })

  it('renders optional CTA and toggles FAQ answers', async () => {
    const router = createTestRouter()
    const service = createServiceDetail({
      primaryCta: { label: 'Заказать', href: '/client-form' },
    })

    const wrapper = mount(ServiceDetailModal, {
      props: { service },
      global: {
        plugins: [router],
        stubs: {
          Breadcrumbs: true,
          SectionHeading: { template: '<div><slot /></div>' },
          ContactSection: true,
          Footer: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Заказать')
    const cta = wrapper.get('a[href="/client-form"]')
    expect(cta.text()).toContain('Заказать')

    const faqButtons = wrapper.findAll('button')
    const faqToggle = faqButtons.find((b) => b.text().includes('Вопрос 1?'))
    expect(faqToggle).toBeTruthy()
    await faqToggle!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Ответ 1')

    await faqToggle!.trigger('click')
    await flushPromises()
  })
})
