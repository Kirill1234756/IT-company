import { test, expect } from '@playwright/test'

test.describe('critical flows', () => {
  test('legacy services URL redirects to canonical category', async ({ page }) => {
    await page.goto('/services/growth/market-analysis')
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveURL(/\/services\/analytics-research\/market-analysis/, {
      timeout: 15_000,
    })
  })

  test('invalid service category falls back to services hub', async ({ page }) => {
    await page.goto('/services/invalid-category-slug-999')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/services\/?$/)
  })

  test('service detail deep link shows service title', async ({ page }) => {
    await page.goto('/services/analytics-research/market-analysis')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'Анализ рынка' }).first()).toBeVisible()
  })

  test('client form shows validation error for bad email', async ({ page }) => {
    await page.goto('/contacts#project-discussion')
    await page.waitForLoadState('domcontentloaded')

    const next = page.getByRole('button', { name: 'Далее' })
    const briefText = 'Короткий тестовый ответ для перехода к следующему шагу брифа.'
    for (let step = 0; step < 4; step += 1) {
      await page.getByPlaceholder(/напиши что-нибудь/i).fill(briefText)
      await next.click()
    }
    await page.getByRole('button', { name: /до 150/i }).first().click()
    await next.click()

    await page
      .locator('#project-discussion')
      .getByPlaceholder(/электронная почта/i)
      .fill('not-an-email')
    await page.getByRole('button', { name: /отправить ответы/i }).click()
    await expect(page.getByText(/некорректный email/i)).toBeVisible()
  })

  test('client form submit succeeds when API returns success', async ({ page }) => {
    await page.route('**/api/client-form', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Заявка принята (тест).',
          clientId: 'test-id',
        }),
      })
    })

    await page.goto('/contacts#project-discussion')
    await page.waitForLoadState('domcontentloaded')

    const next = page.getByRole('button', { name: 'Далее' })
    const briefText = 'Короткий тестовый ответ для перехода к следующему шагу брифа.'
    for (let step = 0; step < 4; step += 1) {
      await page.getByPlaceholder(/напиши что-нибудь/i).fill(briefText)
      await next.click()
    }
    await page.getByRole('button', { name: /до 150/i }).first().click()
    await next.click()

    await page.locator('#project-discussion').getByPlaceholder(/имя/i).fill('Тест')
    await page.locator('#project-discussion').getByPlaceholder(/телефон/i).fill('+7 999 111-22-33')
    await page.getByRole('button', { name: /отправить ответы/i }).click()
    await expect(page.getByText(/заявка принята/i)).toBeVisible()
  })

  test('calculator landing flow and submit with mocked API', async ({ page }) => {
    await page.route('**/api/calculator-form', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Ок (тест).',
          clientId: 'calc-test',
        }),
      })
    })

    await page.goto('/calculator')
    await page.waitForLoadState('domcontentloaded')
    await page.getByRole('button', { name: /Выбрать тип сайта: Лендинг/i }).click()

    const next = page.getByRole('button', { name: /далее/i })
    for (let i = 0; i < 5; i += 1) {
      await next.click()
    }

    await page.getByPlaceholder(/ваше имя/i).fill('Кальк Тест')
    await page.getByPlaceholder(/телефон/i).fill('+7 999 222-33-44')
    await page.getByRole('button', { name: /^отправить$/i }).click()
    await expect(page.getByText(/ок \(тест\)/i)).toBeVisible()
  })
})
