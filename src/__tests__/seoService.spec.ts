import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

describe('fetchSeoFromApi', () => {
  const originalLocation = window.location

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: {
        port: '5173',
        origin: 'http://localhost:5173',
        href: 'http://localhost:5173/',
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalLocation,
      writable: true,
    })
    vi.resetModules()
  })

  it('returns null when response is not ok', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    })
    const { fetchSeoFromApi } = await import('@/services/seoService')
    await expect(fetchSeoFromApi('/any')).resolves.toBeNull()
  })

  it('returns null when json success is false', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    })
    const { fetchSeoFromApi } = await import('@/services/seoService')
    await expect(fetchSeoFromApi('/any')).resolves.toBeNull()
  })

  it('maps API page to SEOConfig when successful', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: '1',
          path: '/foo',
          page_type: 'static',
          title: 'Title',
          h1: 'H1',
          description: 'Desc',
          h2_outline: ['A', 'B'],
          faq: ['Q1'],
          canonical_path: '/foo',
          og_image: '/img.webp',
          is_indexable: true,
          noindex: false,
          city: null,
          region_type: null,
        },
      }),
    })
    const { fetchSeoFromApi } = await import('@/services/seoService')
    const result = await fetchSeoFromApi('/foo', 'msk')
    expect(result).toEqual({
      title: 'Title',
      h1: 'H1',
      description: 'Desc',
      h2Outline: ['A', 'B'],
      faq: ['Q1'],
      canonicalPath: '/foo',
      ogImage: '/img.webp',
    })
    const firstFetchUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as
      | string
      | undefined
    expect(firstFetchUrl).toBeDefined()
    expect(firstFetchUrl).toContain('path=%2Ffoo')
    expect(firstFetchUrl).toContain('city=msk')
  })
})
