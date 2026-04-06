import type { SEOConfig } from '@/config/seo'

type SeoApiPage = {
  id: string
  path: string
  page_type: string
  title: string
  h1: string | null
  description: string | null
  h2_outline: string[] | null
  faq: string[] | null
  canonical_path: string | null
  og_image: string | null
  is_indexable: boolean
  noindex: boolean
  city: string | null
  region_type: string | null
}

type SeoApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}

// В dev с localhost:5173 запросы идут на тот же origin — Vite проксирует /api на бэкенд :3000 (нет CORS, нет прямого сброса)
const API_BASE =
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? window.location.origin
    : (import.meta.env.VITE_BACKEND_URL as string | undefined) ||
      (typeof window !== 'undefined' ? window.location.origin.replace(':5173', ':3000') : ''))

function mapApiPageToSeoConfig(apiPage: SeoApiPage): SEOConfig {
  return {
    title: apiPage.title,
    h1: apiPage.h1 || apiPage.title,
    description:
      apiPage.description ||
      `${apiPage.title}. Kodify — продажа сайтов и цифровых решений для развития бизнеса.`,
    h2Outline: apiPage.h2_outline || [],
    faq: apiPage.faq || [],
    canonicalPath: apiPage.canonical_path || apiPage.path,
    ogImage: apiPage.og_image || '/og-image.webp',
  }
}

export async function fetchSeoFromApi(
  path: string,
  city?: string
): Promise<SEOConfig | null> {
  if (!API_BASE) return null

  try {
    const url = new URL('/api/seo/page', API_BASE)
    url.searchParams.set('path', path)
    if (city) {
      url.searchParams.set('city', city)
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      return null
    }

    const json = (await res.json()) as SeoApiResponse<SeoApiPage>
    if (!json.success || !json.data) return null

    return mapApiPageToSeoConfig(json.data)
  } catch {
    // Fail silently and let caller use fallback from seo.ts
    return null
  }
}

// --- SEO Core page (admin / internal) ---

export type SeoCoreRow = {
  id: string
  text: string
  freq: number | null
  freq_source: string | null
  freq_bucket: string | null
  city: string | null
  priority_score: number
  notes: string | null
  cluster_id: string | null
  cluster_name: string | null
  cluster_intent: string | null
  user_stage: string | null
  category_level: string | null
  cluster_city: string | null
  page_path: string | null
  page_title: string | null
}

export type SeoCoreListResult = {
  data: SeoCoreRow[]
  total: number
  page: number
  limit: number
}

export async function fetchSeoCoreList(params: {
  page?: number
  limit?: number
  path?: string
  clusterId?: string
  city?: string
  intent?: string
  freqBucket?: string
  search?: string
}): Promise<SeoCoreListResult | null> {
  if (!API_BASE) return null
  try {
    const url = new URL('/api/seo/core', API_BASE)
    if (params.page != null) url.searchParams.set('page', String(params.page))
    if (params.limit != null) url.searchParams.set('limit', String(params.limit))
    if (params.path) url.searchParams.set('path', params.path)
    if (params.clusterId) url.searchParams.set('clusterId', params.clusterId)
    if (params.city) url.searchParams.set('city', params.city)
    if (params.intent) url.searchParams.set('intent', params.intent)
    if (params.freqBucket) url.searchParams.set('freqBucket', params.freqBucket)
    if (params.search) url.searchParams.set('search', params.search)
    const res = await fetch(url.toString(), { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = (await res.json()) as { success: boolean; data?: SeoCoreListResult }
    return json.success && json.data ? json.data : null
  } catch {
    return null
  }
}

export type SeoPageListItem = {
  id: string
  path: string
  page_type: string
  title: string
  city: string | null
}

export async function fetchSeoPagesList(params?: { page?: number; limit?: number }): Promise<{ data: SeoPageListItem[]; total: number; page: number; limit: number } | null> {
  if (!API_BASE) return null
  try {
    const url = new URL('/api/seo/pages', API_BASE)
    if (params?.page != null) url.searchParams.set('page', String(params.page))
    if (params?.limit != null) url.searchParams.set('limit', String(params.limit))
    const res = await fetch(url.toString(), { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = (await res.json()) as { success: boolean; data?: { data: SeoPageListItem[]; total: number; page: number; limit: number } }
    return json.success && json.data ? json.data : null
  } catch {
    return null
  }
}

export type SeoClusterListItem = {
  id: string
  name: string
  intent: string | null
  city: string | null
  seo_page_id: string | null
}

export async function fetchSeoClustersList(params?: { page?: number; limit?: number; city?: string }): Promise<{ data: SeoClusterListItem[]; total: number; page: number; limit: number } | null> {
  if (!API_BASE) return null
  try {
    const url = new URL('/api/seo/clusters', API_BASE)
    if (params?.page != null) url.searchParams.set('page', String(params.page))
    if (params?.limit != null) url.searchParams.set('limit', String(params.limit))
    if (params?.city) url.searchParams.set('city', params.city)
    const res = await fetch(url.toString(), { method: 'GET', credentials: 'include', headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = (await res.json()) as { success: boolean; data?: { data: SeoClusterListItem[]; total: number; page: number; limit: number } }
    return json.success && json.data ? json.data : null
  } catch {
    return null
  }
}

