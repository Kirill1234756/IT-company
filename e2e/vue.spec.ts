import { test, expect } from '@playwright/test'

test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  // Expect router to set document title
  await expect.poll(async () => await page.title()).toContain('IT Company')
  // Header navigation should be visible
  await expect(page.getByRole('navigation')).toBeVisible()
})
