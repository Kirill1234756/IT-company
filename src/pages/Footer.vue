<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { throttle } from '../utils/performance'

defineOptions({ name: 'AppFooter' })

type FooterLink = {
  to: string
  label: string
}

const siteLinks: FooterLink[] = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги' },
  { to: '/packages', label: 'Пакеты' },
  { to: '/cases', label: 'Кейсы' },
  { to: '/blog', label: 'Блог' },
  { to: '/calculator', label: 'Калькулятор' },
]

const serviceLinks: FooterLink[] = [
  { to: '/services/development-launch/site-development', label: 'Корпоративные сайты' },
  { to: '/services/development-launch/site-development', label: 'Интернет-магазины' },
  { to: '/services/development-launch/site-development', label: 'Лендинги' },
  { to: '/services/development-launch/site-development', label: 'Техподдержка' },
]

const currentYear = computed(() => new Date().getFullYear())

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const showScrollButton = ref(false)

const handleScroll = throttle(() => {
  showScrollButton.value = window.scrollY > 300
}, 100)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <footer
    class="stack-section border-t border-[var(--color-accent)]/25 bg-gradient-to-br from-[var(--color-bg)] via-[#0f2448] to-[var(--color-border)]"
    style="min-height: auto; height: auto;"
  >
    <div class="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div class="mb-8 grid gap-4 md:grid-cols-[1.25fr_1fr_1fr]">
        <section
          class="rounded-3xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur-sm md:p-6"
          aria-label="О компании"
        >
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-[2rem] bg-bg">
              <img
                class="w-[60%]"
                src="/logo3.webp"
                alt="KODIFY Logo"
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span class="text-xl font-black tracking-wide text-accent">KODIFY</span>
          </div>
          <p class="max-w-md text-sm leading-6 text-white/80">
            Разрабатываем сайты и digital-решения, которые превращают трафик в заявки и продажи.
            Берем проект от стратегии до запуска и поддержки.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <router-link
              to="/contacts#project-discussion"
              class="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent/90"
            >
              Обсудить проект
            </router-link>
            <router-link
              to="/cases"
              class="rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              Смотреть кейсы
            </router-link>
          </div>
        </section>

        <section
          class="rounded-3xl border border-white/10 bg-black/10 p-5 md:p-6"
          aria-label="Разделы сайта"
        >
          <h3 class="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-white/70">Разделы</h3>
          <nav class="grid gap-2">
            <router-link
              v-for="link in siteLinks"
              :key="link.to"
              :to="link.to"
              class="w-fit rounded-lg px-1 py-1 text-sm text-white/85 transition-colors hover:text-accent"
            >
              {{ link.label }}
            </router-link>
          </nav>
        </section>

        <section
          class="rounded-3xl border border-white/10 bg-black/10 p-5 md:p-6"
          aria-label="Популярные услуги"
        >
          <h3 class="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-white/70">Услуги</h3>
          <nav class="grid gap-2">
            <router-link
              v-for="link in serviceLinks"
              :key="link.label"
              :to="link.to"
              class="w-fit rounded-lg px-1 py-1 text-sm text-white/85 transition-colors hover:text-accent"
            >
              {{ link.label }}
            </router-link>
          </nav>
          <router-link
            to="/services"
            class="mt-4 inline-flex w-fit items-center rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-accent/50 hover:text-accent"
          >
            Все услуги
          </router-link>
        </section>
      </div>

      <div
        class="rounded-3xl border border-white/10 bg-black/15 px-4 py-4 md:px-6"
        aria-label="Контакты"
      >
        <div class="grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
          <a
            href="tel:+79042964072"
            class="flex items-center gap-3 text-white/85 transition-opacity hover:opacity-90"
            aria-label="Позвонить по телефону"
          >
            <span class="text-[var(--color-accent)]">📱</span>
            <span>+7 904 296 40 72</span>
          </a>
          <a
            href="mailto:kodify@gmail.com"
            class="flex items-center gap-3 text-white/85 transition-opacity hover:opacity-90"
            aria-label="Написать на email"
          >
            <span class="text-[var(--color-accent)]">📧</span>
            <span>kodify@gmail.com</span>
          </a>
          <a
            href="https://t.me/kodify_tg"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 text-white/85 transition-opacity hover:opacity-90"
            aria-label="Написать в Telegram"
          >
            <span class="text-[var(--color-accent)]">💬</span>
            <span>@kodify_tg</span>
          </a>
          <router-link
            to="/privacy"
            class="justify-self-start text-xs text-white/60 transition-colors hover:text-accent md:justify-self-end"
          >
            Privacy & Cookies
          </router-link>
        </div>
      </div>
      <p class="mt-6 px-1 text-xs text-white/50">
        © {{ currentYear }} KODIFY. Все права защищены.
      </p>
    </div>

    <Transition name="scroll-top-fade">
      <button
        v-if="showScrollButton"
        @click="scrollToTop"
        class="fixed bottom-20 right-6 md:bottom-24 md:right-8 w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg z-[1000] transition-all duration-300 hover:scale-110 bg-[var(--color-accent)] hover:bg-[var(--color-purple)]"
        aria-label="Прокрутить наверх"
      >
        <span class="text-xs font-bold">UP</span>
      </button>
    </Transition>
  </footer>
</template>

<style scoped>
button:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
