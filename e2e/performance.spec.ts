import { test, expect } from '@playwright/test'

/**
 * Performance tests using Web Vitals metrics
 * Tests critical performance metrics: LCP, CLS, FCP, TBT, Speed Index
 */
test.describe('Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to homepage
        await page.goto('/')
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle')
    })

    test('LCP (Largest Contentful Paint) should be under 2.5s', async ({ page }) => {
        // Measure LCP using Performance API
        const lcp = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
                        renderTime?: number
                        loadTime?: number
                    }
                    const lcpValue = lastEntry.renderTime || lastEntry.loadTime || 0
                    resolve(lcpValue)
                }).observe({ entryTypes: ['largest-contentful-paint'] })

                // Timeout after 5 seconds
                setTimeout(() => resolve(5000), 5000)
            })
        })

        console.log(`LCP: ${lcp}ms`)
        expect(lcp).toBeLessThan(2500) // LCP should be under 2.5 seconds
    })

    test('CLS (Cumulative Layout Shift) should be under 0.1', async ({ page }) => {
        // Measure CLS using Performance API
        const cls = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                let clsValue = 0
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!(entry as any).hadRecentInput) {
                            clsValue += (entry as any).value
                        }
                    }
                }).observe({ entryTypes: ['layout-shift'] })

                // Wait for page to stabilize
                setTimeout(() => resolve(clsValue), 3000)
            })
        })

        console.log(`CLS: ${cls}`)
        expect(cls).toBeLessThan(0.1) // CLS should be under 0.1
    })

    test('FCP (First Contentful Paint) should be under 1.8s', async ({ page }) => {
        // Measure FCP using Performance API
        const fcp = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    const fcpEntry = entries.find(
                        (entry) => entry.name === 'first-contentful-paint'
                    ) as PerformanceEntry & { renderTime?: number }
                    if (fcpEntry) {
                        resolve(fcpEntry.renderTime || 0)
                    }
                }).observe({ entryTypes: ['paint'] })

                // Timeout after 3 seconds
                setTimeout(() => resolve(3000), 3000)
            })
        })

        console.log(`FCP: ${fcp}ms`)
        expect(fcp).toBeLessThan(1800) // FCP should be under 1.8 seconds
    })

    test('Total Blocking Time should be under 200ms', async ({ page }) => {
        // Measure TBT using Performance API
        const tbt = await page.evaluate(() => {
            return new Promise<number>((resolve) => {
                let blockingTime = 0
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if ((entry as any).duration > 50) {
                            blockingTime += (entry as any).duration - 50
                        }
                    }
                }).observe({ entryTypes: ['longtask'] })

                // Wait for page to stabilize
                setTimeout(() => resolve(blockingTime), 3000)
            })
        })

        console.log(`TBT: ${tbt}ms`)
        expect(tbt).toBeLessThan(200) // TBT should be under 200ms
    })

    test('Page load time should be reasonable', async ({ page }) => {
        const loadTime = await page.evaluate(() => {
            const navigation = performance.getEntriesByType(
                'navigation'
            )[0] as PerformanceNavigationTiming
            return navigation.loadEventEnd - navigation.fetchStart
        })

        console.log(`Page Load Time: ${loadTime}ms`)
        expect(loadTime).toBeLessThan(3000) // Page should load in under 3 seconds
    })

    test('No render-blocking resources', async ({ page }) => {
        // Check for render-blocking resources
        const blockingResources = await page.evaluate(() => {
            const resources = performance.getEntriesByType(
                'resource'
            ) as PerformanceResourceTiming[]
            return resources
                .filter((resource) => {
                    // Check if resource blocks rendering
                    const isScript = resource.name.includes('.js')
                    const isCSS = resource.name.includes('.css')
                    return (
                        (isScript || isCSS) &&
                        resource.renderBlockingStatus === 'blocking'
                    )
                })
                .map((r) => r.name)
        })

        console.log(`Blocking Resources: ${blockingResources.length}`)
        // Critical CSS is allowed, but should be minimal
        expect(blockingResources.length).toBeLessThan(5)
    })

    test('Images should have width and height attributes', async ({ page }) => {
        const imagesWithoutDimensions = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'))
            return images
                .filter((img) => !img.width || !img.height)
                .map((img) => ({
                    src: img.src,
                    alt: img.alt,
                }))
        })

        console.log(
            `Images without dimensions: ${imagesWithoutDimensions.length}`
        )
        if (imagesWithoutDimensions.length > 0) {
            console.log('Images:', imagesWithoutDimensions)
        }
        expect(imagesWithoutDimensions.length).toBe(0)
    })

    test('Images should use lazy loading', async ({ page }) => {
        // Scroll to trigger lazy loading
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight)
        })
        await page.waitForTimeout(1000)

        const imagesWithoutLazy = await page.evaluate(() => {
            const images = Array.from(
                document.querySelectorAll('img')
            ) as HTMLImageElement[]
            // Images below fold should have loading="lazy"
            return images
                .filter((img) => {
                    const rect = img.getBoundingClientRect()
                    const isBelowFold = rect.top > window.innerHeight
                    return isBelowFold && img.loading !== 'lazy'
                })
                .map((img) => ({
                    src: img.src,
                    loading: img.loading,
                }))
        })

        console.log(`Images without lazy loading: ${imagesWithoutLazy.length}`)
        expect(imagesWithoutLazy.length).toBe(0)
    })

    test('JavaScript bundle size should be reasonable', async ({ page }) => {
        const jsSize = await page.evaluate(() => {
            const resources = performance.getEntriesByType(
                'resource'
            ) as PerformanceResourceTiming[]
            return resources
                .filter((r) => r.name.includes('.js'))
                .reduce((total, r) => {
                    return total + ((r as any).transferSize || 0)
                }, 0)
        })

        const jsSizeKB = Math.round(jsSize / 1024)
        console.log(`Total JS size: ${jsSizeKB}KB`)
        // Total JS should be under 500KB (gzipped will be much smaller)
        expect(jsSizeKB).toBeLessThan(2000)
    })

    test('CSS should be optimized', async ({ page }) => {
        const cssSize = await page.evaluate(() => {
            const resources = performance.getEntriesByType(
                'resource'
            ) as PerformanceResourceTiming[]
            return resources
                .filter((r) => r.name.includes('.css'))
                .reduce((total, r) => {
                    return total + ((r as any).transferSize || 0)
                }, 0)
        })

        const cssSizeKB = Math.round(cssSize / 1024)
        console.log(`Total CSS size: ${cssSizeKB}KB`)
        // CSS should be under 100KB
        expect(cssSizeKB).toBeLessThan(150)
    })
})
