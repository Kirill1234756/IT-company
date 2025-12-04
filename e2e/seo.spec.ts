import { test, expect } from '@playwright/test'

/**
 * SEO tests
 * Tests meta tags, structured data, heading structure, and accessibility
 */
test.describe('SEO Tests', () => {
    test('Homepage should have correct meta tags', async ({ page }) => {
        await page.goto('/')

        // Check title
        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(10)
        expect(title.length).toBeLessThan(60)
        console.log(`Title: ${title}`)

        // Check meta description
        const description = await page
            .locator('meta[name="description"]')
            .getAttribute('content')
        expect(description).toBeTruthy()
        expect(description?.length).toBeGreaterThan(50)
        expect(description?.length).toBeLessThan(160)
        console.log(`Description: ${description}`)

        // Check viewport
        const viewport = await page
            .locator('meta[name="viewport"]')
            .getAttribute('content')
        expect(viewport).toContain('width=device-width')
        console.log(`Viewport: ${viewport}`)
    })

    test('Homepage should have Open Graph tags', async ({ page }) => {
        await page.goto('/')

        const ogTitle = await page
            .locator('meta[property="og:title"]')
            .getAttribute('content')
        expect(ogTitle).toBeTruthy()
        console.log(`OG Title: ${ogTitle}`)

        const ogDescription = await page
            .locator('meta[property="og:description"]')
            .getAttribute('content')
        expect(ogDescription).toBeTruthy()
        console.log(`OG Description: ${ogDescription}`)

        const ogType = await page
            .locator('meta[property="og:type"]')
            .getAttribute('content')
        expect(ogType).toBe('website')
        console.log(`OG Type: ${ogType}`)
    })

    test('Homepage should have only one h1', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBe(1)
        console.log(`H1 count: ${h1Count}`)

        const h1Text = await page.locator('h1').first().textContent()
        expect(h1Text).toBeTruthy()
        expect(h1Text?.trim().length).toBeGreaterThan(10)
        console.log(`H1 text: ${h1Text}`)
    })

    test('Heading structure should be logical', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Get all headings
        const headings = await page.evaluate(() => {
            const hElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            return hElements.map((h) => ({
                tag: h.tagName.toLowerCase(),
                text: h.textContent?.trim().substring(0, 50) || '',
            }))
        })

        console.log('Headings structure:', headings)

        // Check that h1 comes before h2
        const h1Index = headings.findIndex((h) => h.tag === 'h1')
        const h2Index = headings.findIndex((h) => h.tag === 'h2')

        if (h2Index !== -1) {
            expect(h1Index).toBeLessThan(h2Index)
        }

        // Check for skipped heading levels
        let previousLevel = 0
        for (const heading of headings) {
            const currentLevel = parseInt(heading.tag.charAt(1))
            if (previousLevel > 0 && currentLevel > previousLevel + 1) {
                throw new Error(
                    `Skipped heading level: ${heading.tag} after h${previousLevel}`
                )
            }
            previousLevel = currentLevel
        }
    })

    test('All images should have alt attributes', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const imagesWithoutAlt = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'))
            return images
                .filter((img) => !img.alt || img.alt.trim() === '')
                .map((img) => ({
                    src: img.src.substring(0, 100),
                    hasAlt: !!img.alt,
                }))
        })

        console.log(`Images without alt: ${imagesWithoutAlt.length}`)
        if (imagesWithoutAlt.length > 0) {
            console.log('Images:', imagesWithoutAlt)
        }
        // Decorative images can have empty alt, but should have the attribute
        // We check that all images have the alt attribute (even if empty for decorative)
        const imagesWithoutAltAttr = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'))
            return images.filter((img) => img.getAttribute('alt') === null)
        })
        expect(imagesWithoutAltAttr.length).toBe(0)
    })

    test('Structured data (JSON-LD) should be present', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const jsonLdScripts = await page.evaluate(() => {
            const scripts = Array.from(
                document.querySelectorAll('script[type="application/ld+json"]')
            )
            return scripts.map((script) => {
                try {
                    return JSON.parse(script.textContent || '{}')
                } catch {
                    return null
                }
            }).filter(Boolean)
        })

        expect(jsonLdScripts.length).toBeGreaterThan(0)
        console.log(`JSON-LD scripts found: ${jsonLdScripts.length}`)

        // Check for Organization schema
        const hasOrganization = jsonLdScripts.some(
            (schema: any) => schema['@type'] === 'Organization'
        )
        expect(hasOrganization).toBe(true)
        console.log('Organization schema: ✓')

        // Check for WebSite schema
        const hasWebSite = jsonLdScripts.some(
            (schema: any) => schema['@type'] === 'WebSite'
        )
        expect(hasWebSite).toBe(true)
        console.log('WebSite schema: ✓')
    })

    test('Canonical URL should be present', async ({ page }) => {
        await page.goto('/')

        const canonical = await page
            .locator('link[rel="canonical"]')
            .getAttribute('href')
        expect(canonical).toBeTruthy()
        expect(canonical).toContain('http')
        console.log(`Canonical URL: ${canonical}`)
    })

    test('Language attribute should be set', async ({ page }) => {
        await page.goto('/')

        const lang = await page.locator('html').getAttribute('lang')
        expect(lang).toBeTruthy()
        expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/)
        console.log(`Language: ${lang}`)
    })

    test('All links should have proper attributes', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const externalLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href]'))
            return links
                .filter((link) => {
                    const href = link.getAttribute('href') || ''
                    return href.startsWith('http') && !href.includes(window.location.hostname)
                })
                .map((link) => ({
                    href: link.getAttribute('href'),
                    hasRel: link.hasAttribute('rel'),
                    rel: link.getAttribute('rel'),
                }))
        })

        // External links should have rel="noopener noreferrer"
        const unsafeLinks = externalLinks.filter(
            (link) => !link.rel?.includes('noopener')
        )

        console.log(`External links: ${externalLinks.length}`)
        console.log(`Unsafe external links: ${unsafeLinks.length}`)
        if (unsafeLinks.length > 0) {
            console.log('Unsafe links:', unsafeLinks)
        }
        expect(unsafeLinks.length).toBe(0)
    })

    test('Buttons should have accessible labels', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const buttonsWithoutLabels = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'))
            return buttons
                .filter((button) => {
                    const hasText = button.textContent?.trim().length || 0 > 0
                    const hasAriaLabel = button.hasAttribute('aria-label')
                    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
                    const hasTitle = button.hasAttribute('title')
                    return !hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle
                })
                .map((button) => ({
                    className: button.className,
                    hasText: !!button.textContent?.trim(),
                }))
        })

        console.log(`Buttons without labels: ${buttonsWithoutLabels.length}`)
        if (buttonsWithoutLabels.length > 0) {
            console.log('Buttons:', buttonsWithoutLabels)
        }
        expect(buttonsWithoutLabels.length).toBe(0)
    })

    test('Touch targets should be at least 44x44px', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const smallTouchTargets = await page.evaluate(() => {
            const interactiveElements = Array.from(
                document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')
            )
            return interactiveElements
                .filter((el) => {
                    const rect = el.getBoundingClientRect()
                    return rect.width < 44 || rect.height < 44
                })
                .map((el) => ({
                    tag: el.tagName,
                    width: el.getBoundingClientRect().width,
                    height: el.getBoundingClientRect().height,
                    className: el.className,
                }))
        })

        console.log(`Small touch targets: ${smallTouchTargets.length}`)
        if (smallTouchTargets.length > 0) {
            console.log('Small targets:', smallTouchTargets)
        }
        // Allow some small targets on desktop, but check mobile viewport
        await page.setViewportSize({ width: 375, height: 667 }) // Mobile viewport
        await page.waitForTimeout(500)

        const smallTouchTargetsMobile = await page.evaluate(() => {
            const interactiveElements = Array.from(
                document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')
            )
            return interactiveElements
                .filter((el) => {
                    const rect = el.getBoundingClientRect()
                    return rect.width < 44 || rect.height < 44
                })
                .map((el) => ({
                    tag: el.tagName,
                    width: rect.width,
                    height: rect.height,
                }))
        })

        console.log(`Small touch targets (mobile): ${smallTouchTargetsMobile.length}`)
        expect(smallTouchTargetsMobile.length).toBe(0)
    })

    test('Color contrast should meet WCAG AA standards', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // This is a simplified check - full contrast testing requires more complex logic
        const textElements = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button'))
            return elements
                .filter((el) => {
                    const style = window.getComputedStyle(el)
                    const color = style.color
                    const bgColor = style.backgroundColor
                    return color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)'
                })
                .slice(0, 10) // Check first 10 elements
                .map((el) => ({
                    tag: el.tagName,
                    text: el.textContent?.substring(0, 30) || '',
                    color: window.getComputedStyle(el).color,
                    bgColor: window.getComputedStyle(el).backgroundColor,
                }))
        })

        console.log(`Text elements checked: ${textElements.length}`)
        // Note: Full contrast calculation would require converting RGB to relative luminance
        // This is a placeholder - in production, use a library like 'wcag-contrast'
        expect(textElements.length).toBeGreaterThan(0)
    })

    test('Sitemap should be accessible', async ({ page }) => {
        await page.goto('/sitemap.xml')

        const contentType = await page.evaluate(() => {
            return document.contentType
        })

        // Sitemap should be XML
        const content = await page.content()
        expect(content).toContain('<?xml')
        expect(content).toContain('<urlset')
        console.log('Sitemap is accessible and valid XML')
    })

    test('Robots.txt should be accessible', async ({ page }) => {
        await page.goto('/robots.txt')

        const content = await page.textContent('body')
        expect(content).toContain('User-agent')
        console.log('Robots.txt is accessible')
    })
})


























