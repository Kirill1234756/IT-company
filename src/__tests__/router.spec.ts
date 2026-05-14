import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/seoService', () => ({
  fetchSeoFromApi: vi.fn(() => Promise.resolve(null)),
}))

import router from '@/router'

function getScrollBehavior() {
  const fn = router.options.scrollBehavior
  if (!fn) throw new Error('scrollBehavior missing')
  return fn
}

describe('router', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('scrollBehavior resets scroll on home', () => {
    const scroll = getScrollBehavior()
    const res = scroll({ path: '/' } as any, { path: '/x' } as any, null)
    expect(res).toEqual({ top: 0, left: 0 })
  })

  it('scrollBehavior restores savedPosition', () => {
    const scroll = getScrollBehavior()
    const pos = { left: 5, top: 10 }
    expect(scroll({ path: '/x' } as any, {} as any, pos)).toEqual(pos)
  })

  it('scrollBehavior scrolls to hash smoothly', () => {
    const scroll = getScrollBehavior()
    expect(scroll({ path: '/p', hash: '#block' } as any, {} as any, null)).toEqual({
      el: '#block',
      behavior: 'smooth',
    })
  })

  it('scrollBehavior keeps position between /services routes', () => {
    const scroll = getScrollBehavior()
    expect(
      scroll({ path: '/services/a', fullPath: '/services/a' } as any, { path: '/services/b' } as any, null),
    ).toBe(false)
  })

  it('scrollBehavior defaults to top for other routes', () => {
    const scroll = getScrollBehavior()
    expect(scroll({ path: '/contacts' } as any, {} as any, null)).toEqual({ top: 0 })
  })

  it('redirects legacy /services/growth/:service to canonical path', async () => {
    await router.push('/services/growth/market-analysis')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/services/analytics-research/market-analysis')
  })

  it('falls back to services hub for invalid category slug', async () => {
    await router.push('/services/not-a-valid-category-slug-xyz')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('services')
  })
})
