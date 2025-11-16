import { computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface ServiceSchemaOptions {
    serviceName: string
    description: string
    url: string
    priceFrom?: string
    areaServed?: string
    providerName?: string
}

export function useServiceSchema(options: ServiceSchemaOptions) {
    const schema = computed(() => {
        const baseSchema: any = {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: options.serviceName,
            description: options.description,
            url: options.url,
            areaServed: {
                '@type': 'Country',
                name: options.areaServed || 'RU',
            },
            provider: {
                '@type': 'Organization',
                name: options.providerName || 'Kodify',
            },
        }

        if (options.priceFrom) {
            baseSchema.offers = {
                '@type': 'Offer',
                price: options.priceFrom,
                priceCurrency: 'RUB',
            }
        }

        return baseSchema
    })

    return { schema }
}

























