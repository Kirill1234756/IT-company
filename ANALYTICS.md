## Yandex.Metrica integration

This project has a fully configured Yandex.Metrica integration for the Vue 3 SPA.

- **Counter ID configuration**
  - Set your real counter ID in the `.env` file:
    - `VITE_YANDEX_METRIKA_ID=YOUR_COUNTER_ID`
  - The helper `getYandexMetrikaId` (in `src/types/yandex-metrika.ts`) is the single source of truth; it reads `VITE_YANDEX_METRIKA_ID` and, in non‑production modes, can fall back to a safe default ID for local testing.

- **Initialization & script loading**
  - Metrica is initialized via the plugin `installYandexMetrika(app, router)` in `src/main.ts`.
  - The plugin and composable are defined in:
    - `src/plugins/yandex-metrika.ts`
    - `src/composables/useYandexMetrika.ts`
  - The script is loaded lazily on the client only, after initial render / LCP, so it does not block first paint.

- **Page‑view tracking**
  - The plugin registers a `router.afterEach` hook and calls:
    - `trackPageView(to.fullPath, to.meta.title, to.name)`
  - All page‑view hits use a unified payload:
    - `page_name` – route name (or document title),
    - `page_title` – meta title or `document.title`,
    - `page_url` – `to.fullPath` / current URL.

- **Key events & goals**
  - All event types and goals are centralized in:
    - `METRIKA_EVENTS`, `METRIKA_GOALS` in `src/types/yandex-metrika.ts`.
  - The composable exposes convenient helpers:
    - `trackPageView`, `trackFormSubmit`, `trackButtonClick`, `trackCtaClick`,
      `trackModalOpen`, `trackServiceView`, `trackBlogView`,
      `trackPortfolioView`, `trackNavigationClick`,
      plus basic `hit` / `reachGoal`.
  - Examples already wired in the app:
    - **Home hero CTA** – `MainSection.vue` calls
      - `trackCtaClick('cta_home_calculator', { location: 'hero_main_section' })`
      when the main “Калькулятор цены” button is clicked.
    - **Services** – `ServicesPage.vue` tracks:
      - service views via `trackServiceView(...)`,
      - filter button interactions via `trackButtonClick('service-filter-…', …)`.
    - **Packages** – `PackagesPage.vue` tracks package card clicks via:
      - `trackButtonClick('package-<slug>', { package_id, package_title, package_price })`.
    - **Portfolio** – `PortfolioModal.vue` tracks project views via:
      - `trackPortfolioView(projectName, { project_id, ... })`.
    - **Blog** – `BlogModal.vue` tracks blog post views via:
      - `trackBlogView(postTitle, category, { post_id, read_time, views })`.
    - **Client form** – `useClientForm.ts` calls:
      - `trackFormSubmit('client-form', { budget, company })`
      after a **successful** API submission.

## How to track a new event

1. Import the composable in your component:

```ts
import { useYandexMetrika } from '@/composables/useYandexMetrika'

const { trackCtaClick } = useYandexMetrika()
```

2. Call the appropriate helper in your handler:

```ts
const handleClick = () => {
  trackCtaClick('cta_header_contact', { location: 'header', variant: 'primary' })
}
```

3. If you need a new logical event type or goal:
   - Add it to `METRIKA_EVENTS` / `METRIKA_GOALS` in `src/types/yandex-metrika.ts`.
   - Extend the `trackEvent` switch in `src/composables/useYandexMetrika.ts` to map your new event type to the goal.

