import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        description?: string
        canonicalPath?: string
        h1?: string
        h2Outline?: string[]
        faq?: string[]
        ogImage?: string
        noindex?: boolean
    }
}

































