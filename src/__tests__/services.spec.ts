import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useServicesStore } from '@/stores/services'
import { useServices } from '@/composables/useServices'

describe('services store and useServices', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes categories once', () => {
    const store = useServicesStore()
    store.loadDataIfNeeded()
    const firstLength = store.categories.length

    store.loadDataIfNeeded()

    expect(store.initialized).toBe(true)
    expect(firstLength).toBeGreaterThan(0)
    expect(store.categories.length).toBe(firstLength)
  })

  it('resolves category and catalog by slug/id', () => {
    const store = useServicesStore()
    store.loadDataIfNeeded()

    const category = store.getCategoryBySlug('analytics-research')
    expect(category?.slug).toBe('analytics-research')
    expect(store.getCategoryById(category!.id)?.slug).toBe('analytics-research')

    const item = store.getCatalogItemBySlug('market-analysis')
    expect(item?.id).toBe(1)
    expect(store.getCatalogItemById(1)?.slug).toBe('market-analysis')
    expect(store.getCategorySlugForServiceSlug('market-analysis')).toBe('analytics-research')
  })

  it('returns null for unknown service details', async () => {
    const store = useServicesStore()
    await expect(store.getServiceDetailBySlug('unknown-service')).resolves.toBeNull()
    await expect(store.getServiceDetail(999999)).resolves.toBeNull()
  })

  it('returns known service details by slug and id', async () => {
    const store = useServicesStore()

    const bySlug = await store.getServiceDetailBySlug('market-analysis')
    const byId = await store.getServiceDetail(1)

    expect(bySlug?.title).toBeTruthy()
    expect(bySlug?.features.length).toBeGreaterThan(0)
    expect(byId?.id).toBe(1)
  })

  it('computes flattened and filtered lists in useServices', () => {
    const store = useServicesStore()
    store.loadDataIfNeeded()
    const services = useServices()

    expect(services.allServiceItems.value.length).toBeGreaterThan(10)
    expect(services.popularServices.value.length).toBeGreaterThan(0)
    expect(Object.keys(services.servicesByCategory.value).length).toBeGreaterThan(0)

    const first = services.allServiceItems.value[0]
    expect(first).toBeDefined()
    expect(services.getServicePrice(first!)).toBeGreaterThan(0)
    expect(services.formatPrice(1500)).toContain('1')
    expect(services.getServiceCategoryColor('AutomationGrowth')).toContain('text-')
    expect(services.getCategoryUrl('AnalyticsResearch')).toContain('/services?category=')
  })
})
