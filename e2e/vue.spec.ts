import { test, expect } from '@playwright/test'

test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  // Expect router to set document title
  await expect.poll(async () => await page.title()).toContain('Kodify')
  // Header navigation should be visible
  await expect(page.getByRole('navigation', { name: /main/i })).toBeVisible()
})

test('contacts page shows project brief wizard', async ({ page }) => {
  await page.goto('/contacts#project-discussion')
  await page.waitForLoadState('domcontentloaded')
  await expect(page.getByText(/шаг 1 из/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /^далее$/i })).toBeVisible()
})

test('/client-form redirects to contacts brief anchor', async ({ page }) => {
  await page.goto('/client-form')
  await page.waitForLoadState('domcontentloaded')
  await expect(page).toHaveURL(/\/contacts#project-discussion/)
})

test('calculator page shows step progress', async ({ page }) => {
  await page.goto('/calculator')
  await page.waitForLoadState('domcontentloaded')
  await expect(page.getByText(/шаг 1 из/i)).toBeVisible()
})
