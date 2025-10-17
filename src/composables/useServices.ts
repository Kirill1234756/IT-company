import { computed } from 'vue'
import { useServicesStore } from '../stores/services'
import type { ServiceCategory, ServiceDetail, ServiceItem } from '../types/services'

/**
 * Composable for services-related functionality
 * Provides convenient access to services store with additional computed properties
 */
export function useServices() {
    const servicesStore = useServicesStore()

    type FlattenedService = (ServiceItem & { category?: string }) | (ServiceDetail & { category?: string; price?: string; priceFrom?: string })

    // Memoized projections from store data
    const allServiceItems = computed<FlattenedService[]>(() => {
        // Flatten all category items where type === 'detail' or list items
        const out: FlattenedService[] = []
        for (const cat of servicesStore.categories as ServiceCategory[]) {
            if (cat.type === 'list' && Array.isArray(cat.items)) {
                for (const it of cat.items as ServiceItem[]) out.push({ ...it, category: cat.title })
            } else if (cat.type === 'detail' && cat.detail) {
                out.push({ ...(cat.detail as ServiceDetail), category: cat.title })
            }
        }
        return out
    })

    const featuredServices = computed<FlattenedService[]>(() => {
        return allServiceItems.value
            .filter((service: FlattenedService) => {
                const s = service as { priceFrom?: string; price?: string }
                const raw = s.priceFrom ?? s.price
                const price = parseInt(String(raw ?? '').replace(/[^0-9]/g, ''))
                return Number.isFinite(price) && price <= 1000
            })
            .slice(0, 6)
    })

    const servicesByCategory = computed<Record<string, FlattenedService[]>>(() => {
        const map: Record<string, FlattenedService[]> = {}
        for (const s of allServiceItems.value) {
            const key = (s as { category?: string }).category || 'Other'
                ; (map[key] ||= []).push(s)
        }
        return map
    })

    const popularServices = computed<FlattenedService[]>(() => {
        const popularIds = new Set([1, 7, 10])
        return allServiceItems.value.filter((s) => popularIds.has((s as ServiceItem).id))
    })

    // Helper functions (memo-friendly)
    const getServicePrice = (service: FlattenedService) => {
        const s = service as { priceFrom?: string; price?: string }
        const raw = s.priceFrom ?? s.price ?? (service as ServiceDetail).metrics?.cost
        return parseInt(String(raw ?? '').replace(/[^0-9]/g, ''))
    }

    const formatPrice = (price: number) => `€${(price || 0).toLocaleString()}`
    const getServiceIcon = (service: Partial<ServiceItem>) => (('icon' in service && service.icon) ? (service.icon as string) : '🔧')
    const getServiceCategoryColor = (category: string) => ({
        Growth: 'text-green-600 bg-green-100',
        Strategy: 'text-blue-600 bg-blue-100',
        Development: 'text-purple-600 bg-purple-100'
    } as const)[category as 'Growth' | 'Strategy' | 'Development'] || 'text-gray-600 bg-gray-100'

    const getServiceUrl = (serviceId: number) => `/services/${serviceId}`
    const getCategoryUrl = (category: string) => `/services?category=${category.toLowerCase()}`

    return {
        ...servicesStore,
        allServiceItems,
        featuredServices,
        servicesByCategory,
        popularServices,
        getServicePrice,
        formatPrice,
        getServiceIcon,
        getServiceCategoryColor,
        getServiceUrl,
        getCategoryUrl
    }
}

