import { computed } from 'vue'
import { useServicesStore } from '../stores/services'

/**
 * Composable for services-related functionality
 * Provides convenient access to services store with additional computed properties
 */
export function useServices() {
    const servicesStore = useServicesStore()

    // Computed properties for common use cases
    const featuredServices = computed(() => {
        // Return services with lower prices as "featured"
        return servicesStore.allServices
            .filter(service => {
                const price = parseInt(service.priceFrom.replace('€', ''))
                return price <= 1000 // Services under €1000
            })
            .slice(0, 6) // Limit to 6 featured services
    })

    const servicesByCategory = computed(() => ({
        growth: servicesStore.getServicesByCategory('Growth'),
        strategy: servicesStore.getServicesByCategory('Strategy'),
        development: servicesStore.getServicesByCategory('Development')
    }))

    const popularServices = computed(() => {
        // Return services with specific popular IDs
        const popularIds = [1, 7, 10] // Promoting, Business Plan, Site Development
        return servicesStore.allServices.filter(service =>
            popularIds.includes(service.id)
        )
    })

    // Helper functions
    const getServicePrice = (service: any) => {
        return parseInt(service.priceFrom.replace('€', ''))
    }

    const formatPrice = (price: number) => {
        return `€${price.toLocaleString()}`
    }

    const getServiceIcon = (service: any) => {
        return service.icon || '🔧'
    }

    const getServiceCategoryColor = (category: string) => {
        const colors = {
            'Growth': 'text-green-600 bg-green-100',
            'Strategy': 'text-blue-600 bg-blue-100',
            'Development': 'text-purple-600 bg-purple-100'
        }
        return colors[category as keyof typeof colors] || 'text-gray-600 bg-gray-100'
    }

    // Navigation helpers
    const getServiceUrl = (serviceId: number) => {
        return `/services/${serviceId}`
    }

    const getCategoryUrl = (category: string) => {
        return `/services?category=${category.toLowerCase()}`
    }

    return {
        // Store access
        ...servicesStore,

        // Additional computed properties
        featuredServices,
        servicesByCategory,
        popularServices,

        // Helper functions
        getServicePrice,
        formatPrice,
        getServiceIcon,
        getServiceCategoryColor,
        getServiceUrl,
        getCategoryUrl
    }
}
