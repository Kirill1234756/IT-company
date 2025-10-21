import { bench, describe } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceCard from '@/components/ServiceCard.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useServicesStore } from '@/stores/services'

describe('performance benchmarks', () => {
    // Setup Pinia once for store benchmarks
    setActivePinia(createPinia())
    const servicesStore = useServicesStore()

    const cardProps = {
        id: 1,
        title: 'Test service',
        description: 'Desc',
        priceFrom: '€100',
        icon: '🔧',
        iconBg: 'from-blue-50 to-indigo-100',
        isClickable: true,
    }

    bench('render ServiceCard 100x (mount)', async () => {
        for (let i = 0; i < 100; i++) {
            const wrapper = mount(ServiceCard as any, { props: { ...cardProps, id: (i % 6) + 1 } })
            await wrapper.vm.$nextTick()
            wrapper.unmount()
        }
    })

    bench('services getCategoryById (map lookup) 10000x', () => {
        for (let i = 0; i < 10000; i++) {
            // ids in seed: 1..2
            const id = (i % 2) + 1
            void servicesStore.getCategoryById(id)
        }
    })

    bench('services getCategoryBySlug (map lookup) 10000x', () => {
        const slugs = ['site-development', 'site-integration']
        for (let i = 0; i < 10000; i++) {
            void servicesStore.getCategoryBySlug(slugs[i % slugs.length])
        }
    })
})









