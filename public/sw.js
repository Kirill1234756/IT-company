/**
 * Service Worker для кэширования статических ресурсов
 * Версия: 2.0.0 - Исправлена проблема с кэшированием 404 страниц
 */

const CACHE_VERSION = '2.0.0'
const CACHE_NAME = 'kodifyweb-v2'
const STATIC_CACHE_NAME = 'kodifyweb-static-v2'
const DYNAMIC_CACHE_NAME = 'kodifyweb-dynamic-v2'

// Ресурсы для предварительного кэширования
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/logo3.png',
    '/stratige.svg',
    '/robots.txt',
    '/sitemap.xml',
]

// Ресурсы, которые кэшируются навсегда (с хэшами)
const IMMUTABLE_PATTERNS = [
    /\/assets\/.*-[a-f0-9]+\.(js|css)$/,
    /\/img\/.*-[a-f0-9]+\.(jpg|jpeg|png|webp|avif|svg)$/,
    /\/fonts\/.*-[a-f0-9]+\.(woff|woff2|ttf|otf|eot)$/,
]

// Ресурсы, которые не кэшируются
const NO_CACHE_PATTERNS = [
    /\/api\//,
    /\/functions\/v1\//,
    /\/stats/,
    /\/stats\.html/,
]

// Пути, которые должны возвращать 404 (не кэшировать)
const NOT_FOUND_PATTERNS = [
    /\/stats/,
    /\/stats\.html/,
]

// Максимальное количество записей в динамическом кэше
const MAX_DYNAMIC_CACHE_SIZE = 50

/**
 * Установка Service Worker
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('Failed to cache some static assets:', err)
            })
        })
    )
    self.skipWaiting()
})

/**
 * Активация Service Worker
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        // Удаляем все старые версии кэша
                        return (
                            cacheName !== STATIC_CACHE_NAME &&
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('kodifyweb-')
                        )
                    })
                    .map((cacheName) => caches.delete(cacheName))
            ).then(() => {
                // Очищаем кэш от 404 страниц
                return Promise.all([
                    caches.open(STATIC_CACHE_NAME),
                    caches.open(DYNAMIC_CACHE_NAME)
                ]).then(([staticCache, dynamicCache]) => {
                    return Promise.all([
                        staticCache.keys(),
                        dynamicCache.keys()
                    ]).then(([staticKeys, dynamicKeys]) => {
                        const allKeys = [...staticKeys, ...dynamicKeys]
                        const keysToDelete = allKeys.filter((request) => {
                            const url = new URL(request.url)
                            return NOT_FOUND_PATTERNS.some(pattern => pattern.test(url.pathname))
                        })
                        return Promise.all(keysToDelete.map(key => {
                            return staticCache.delete(key).catch(() =>
                                dynamicCache.delete(key).catch(() => { })
                            )
                        }))
                    })
                })
            })
        })
    )
    self.clients.claim()
})

/**
 * Обработка запросов
 */
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Пропускаем не-GET запросы
    if (request.method !== 'GET') {
        return
    }

    // Пропускаем запросы к API
    if (NO_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
        return
    }

    // Не обрабатываем 404 страницы через Service Worker
    if (NOT_FOUND_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
        return
    }

    // Стратегия кэширования для разных типов ресурсов
    if (IMMUTABLE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
        // Кэш-первый для immutable ресурсов (JS, CSS с хэшами)
        event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
    } else if (url.pathname.endsWith('.html')) {
        // Сеть-первый для HTML
        event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME))
    } else if (
        url.pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|gif|ico)$/i)
    ) {
        // Кэш-первый для изображений
        event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME))
    } else if (url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
        // Кэш-первый для шрифтов
        event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
    } else {
        // Сеть-первый для остальных ресурсов
        event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME))
    }
})

/**
 * Стратегия "Cache First"
 */
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
        // Проверяем, что кэшированный ответ не 404 страница
        const url = new URL(request.url)
        if (!NOT_FOUND_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
            return cached
        }
    }

    try {
        const response = await fetch(request)
        // Не кэшируем ошибки (404, 500 и т.д.)
        if (response.ok && response.status === 200) {
            // Проверяем, что это не 404 страница
            const url = new URL(request.url)
            if (!NOT_FOUND_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
                cache.put(request, response.clone())
                // Ограничиваем размер динамического кэша
                if (cacheName === DYNAMIC_CACHE_NAME) {
                    await limitCacheSize(cacheName, MAX_DYNAMIC_CACHE_SIZE)
                }
            }
        }
        return response
    } catch (error) {
        // Возвращаем fallback для offline (только для существующих страниц)
        if (request.destination === 'document') {
            const url = new URL(request.url)
            if (!NOT_FOUND_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
                const fallback = await cache.match('/index.html')
                if (fallback) {
                    return fallback
                }
            }
        }
        throw error
    }
}

/**
 * Стратегия "Network First"
 */
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName)

    try {
        const response = await fetch(request)
        // Не кэшируем ошибки (404, 500 и т.д.)
        if (response.ok && response.status === 200) {
            // Проверяем, что это не 404 страница
            const url = new URL(request.url)
            if (!NOT_FOUND_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
                cache.put(request, response.clone())
                // Ограничиваем размер динамического кэша
                if (cacheName === DYNAMIC_CACHE_NAME) {
                    await limitCacheSize(cacheName, MAX_DYNAMIC_CACHE_SIZE)
                }
            }
        }
        return response
    } catch (error) {
        const cached = await cache.match(request)
        if (cached) {
            // Проверяем, что кэшированный ответ не 404
            const url = new URL(request.url)
            if (!NOT_FOUND_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
                return cached
            }
        }
        // Fallback для HTML (только для существующих страниц)
        if (request.destination === 'document') {
            const fallback = await cache.match('/index.html')
            if (fallback) {
                return fallback
            }
        }
        throw error
    }
}

/**
 * Ограничение размера кэша
 */
async function limitCacheSize(cacheName, maxSize) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()

    if (keys.length > maxSize) {
        // Удаляем самые старые записи
        const keysToDelete = keys.slice(0, keys.length - maxSize)
        await Promise.all(keysToDelete.map((key) => cache.delete(key)))
    }
}







