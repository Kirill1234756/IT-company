import { test, expect } from '@playwright/test'

test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  // Expect router to set document title
  await expect.poll(async () => await page.title()).toContain('Kodify')
  // Header navigation should be visible
  await expect(page.getByRole('navigation')).toBeVisible()
})

test('client form page has accessible submit control', async ({ page }) => {
  await page.goto('/client-form')
  await page.waitForLoadState('domcontentloaded')
  await expect(page.getByRole('button', { name: /отправить ответы/i })).toBeVisible()
})

test('calculator page shows step progress', async ({ page }) => {
  await page.goto('/calculator')
  await page.waitForLoadState('domcontentloaded')
  await expect(page.getByText(/шаг 1 из/i)).toBeVisible()
})
