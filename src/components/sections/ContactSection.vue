<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  phone: '',
  email: '',
  privacyAccepted: false,
})

const submitForm = () => {
  if (!formData.value.privacyAccepted) {
    alert('Please accept the Privacy Policy')
    return
  }
  console.log('Form submitted:', formData.value)
  formData.value = { name: '', phone: '', email: '', privacyAccepted: false }
  alert('Thank you! Your request has been sent.')
}
</script>

<template>
  <section
    id="contact-section"
    class="stack-section no-scrollbar bg-gradient-to-br bg-[var(--color-purple))] h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
  >
    <h2
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-0"
    >
      Контакты
    </h2>

    <div class="contact-container w-full max-w-5xl opacity-0">
      <div
        class="contact-decoration absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-purple)]/20 rounded-full blur-xl"
      ></div>
      <div
        class="contact-decoration absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[var(--color-purple)]/20 to-[var(--color-accent)]/20 rounded-full blur-xl"
      ></div>

      <div
        class="contact-card relative bg-gradient-to-br from-[var(--color-bg)]/90 to-[var(--color-border)]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-[var(--color-accent)]/30 shadow-2xl shadow-[var(--color-accent)]/10"
      >
        <div class="contact-header mb-8">
          <h3
            class="contact-form-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0"
          >
            Become our new partner
          </h3>
          <p
            class="contact-form-subtitle text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl opacity-0"
          >
            Leave a request for cooperation right now and get project price today
          </p>
        </div>

        <form @submit.prevent="submitForm" class="contact-form space-y-6">
          <div class="contact-inputs grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            <div class="contact-input-wrapper opacity-0">
              <input
                v-model="formData.name"
                type="text"
                placeholder="Your name"
                required
                class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-gray-800 placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
              />
            </div>
            <div class="contact-input-wrapper opacity-0">
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="Phone"
                required
                class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-gray-800 placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
              />
            </div>
            <div class="contact-input-wrapper opacity-0">
              <input
                v-model="formData.email"
                type="email"
                placeholder="E-mail"
                required
                class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-transparent text-white placeholder-white/60 focus:border-[var(--color-accent)] focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40"
              />
            </div>
            <div class="contact-button-wrapper opacity-0">
              <button
                type="submit"
                class="contact-button w-full px-6 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-bg)] rounded-2xl font-bold text-lg transition-all duration-300 hover:from-[var(--color-accent)]/90 hover:to-[var(--color-accent)]/70 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_color-mix(in_oklab,var(--color-accent)_50%,transparent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/30 active:translate-y-0"
              >
                <span class="button-text">Send</span>
                <span class="button-icon ml-2">→</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>


