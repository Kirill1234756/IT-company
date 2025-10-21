<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Memoized form data with reactive validation
const formData = ref({
  name: '',
  phone: '',
  email: '',
  privacyAccepted: false,
})

// Memoized validation state
const validationErrors = computed(() => {
  const errors: Record<string, string> = {}

  if (!formData.value.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!formData.value.phone.trim()) {
    errors.phone = 'Phone is required'
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.value.phone.replace(/\s/g, ''))) {
    errors.phone = 'Invalid phone format'
  }

  if (!formData.value.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.email = 'Invalid email format'
  }

  if (!formData.value.privacyAccepted) {
    errors.privacy = 'Privacy policy must be accepted'
  }

  return errors
})

// Memoized form validity
const isFormValid = computed(() => Object.keys(validationErrors.value).length === 0)

// Memoized animation elements
const titleEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)
const formEl = ref<HTMLElement | null>(null)

// Memoized form submission handler
const submitForm = async () => {
  if (!isFormValid.value) {
    console.warn('Form validation failed:', validationErrors.value)
    return
  }

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Form submitted:', formData.value)

    // Reset form
    formData.value = {
      name: '',
      phone: '',
      email: '',
      privacyAccepted: false,
    }

    alert('Thank you! Your request has been sent.')
  } catch (error) {
    console.error('Form submission error:', error)
    alert('Error sending request. Please try again.')
  }
}

// Memoized animation setup
onMounted(() => {
  // Simple fade-in animation for performance
  if (titleEl.value) {
    titleEl.value.style.opacity = '1'
    titleEl.value.style.transform = 'translateY(0)'
  }

  if (containerEl.value) {
    containerEl.value.style.opacity = '1'
    containerEl.value.style.transform = 'translateY(0)'
  }

  if (formEl.value) {
    formEl.value.style.opacity = '1'
    formEl.value.style.transform = 'translateY(0)'
  }
})
</script>

<template>
  <section
    id="contact-section"
    class="stack-section no-scrollbar bg-gradient-modern h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
  >
    <h2
      ref="titleEl"
      class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-0 transform translate-y-8 transition-all duration-1000"
    >
      Контакты
    </h2>

    <div
      ref="containerEl"
      class="contact-container w-full max-w-5xl opacity-0 transform translate-y-8 transition-all duration-1000 delay-200"
    >
      <div
        class="contact-decoration absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-purple)]/20 rounded-full blur-xl"
      ></div>
      <div
        class="contact-decoration absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[var(--color-purple)]/20 to-[var(--color-accent)]/20 rounded-full blur-xl"
      ></div>

      <div
        class="contact-card relative bg-gradient-to-br from-[var(--color-bg)]/90 to-[var(--color-border)]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-accent/30 shadow-accent"
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

        <form
          ref="formEl"
          @submit.prevent="submitForm"
          class="contact-form space-y-6 opacity-0 transform translate-y-8 transition-all duration-1000 delay-400"
        >
          <div class="contact-inputs grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            <div class="contact-input-wrapper">
              <input
                v-model="formData.name"
                type="text"
                placeholder="Your name"
                required
                class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-white placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                :class="{ 'border-red-500': validationErrors.name }"
              />
              <p v-if="validationErrors.name" class="text-red-400 text-sm mt-2">
                {{ validationErrors.name }}
              </p>
            </div>
            <div class="contact-input-wrapper">
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="Phone"
                required
                class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-white placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                :class="{ 'border-red-500': validationErrors.phone }"
              />
              <p v-if="validationErrors.phone" class="text-red-400 text-sm mt-2">
                {{ validationErrors.phone }}
              </p>
            </div>
            <div class="contact-input-wrapper">
              <input
                v-model="formData.email"
                type="email"
                placeholder="E-mail"
                required
                class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-white placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                :class="{ 'border-red-500': validationErrors.email }"
              />
              <p v-if="validationErrors.email" class="text-red-400 text-sm mt-2">
                {{ validationErrors.email }}
              </p>
            </div>
            <div class="contact-button-wrapper">
              <button
                type="submit"
                :disabled="!isFormValid"
                class="contact-button w-full px-6 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-bg)] rounded-2xl font-bold text-lg transition-all duration-300 hover:from-[var(--color-accent)]/90 hover:to-[var(--color-accent)]/70 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_color-mix(in_oklab,var(--color-accent)_50%,transparent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span class="button-text">Send</span>
                <span class="button-icon ml-2">→</span>
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <input
              v-model="formData.privacyAccepted"
              type="checkbox"
              id="privacy"
              class="w-5 h-5 text-[var(--color-accent)] bg-white/5 border-[var(--color-accent)]/20 rounded focus:ring-[var(--color-accent)]/30 focus:ring-2"
              :class="{ 'border-red-500': validationErrors.privacy }"
            />
            <label for="privacy" class="text-white/80 text-sm">
              I agree to the
              <a href="/privacy" class="text-[var(--color-accent)] hover:underline"
                >Privacy Policy</a
              >
            </label>
          </div>
          <p v-if="validationErrors.privacy" class="text-red-400 text-sm">
            {{ validationErrors.privacy }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Performance optimizations */
.contact-container {
  contain: layout style;
}

/* Smooth transitions */
* {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
input:focus,
button:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Form validation styles */
input:invalid:not(:focus) {
  border-color: rgb(239 68 68);
}

/* Hover effects */
a:hover {
  transform: translateY(-1px);
}

/* Loading state */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>



