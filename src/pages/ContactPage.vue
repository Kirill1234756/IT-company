<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'

// Lazy load ContactSection for better performance
const ContactSection = defineAsyncComponent(
  () => import('../components/sections/ContactSection.vue')
)

// Memoized contact information
const contactInfo = {
  email: 'info@nextcode.com',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Street, Digital City, DC 12345',
  social: {
    telegram: 'https://t.me/nextcode',
    linkedin: 'https://linkedin.com/company/nextcode',
    github: 'https://github.com/nextcode',
  },
}

// Memoized animation elements
const titleEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

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
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-border)]">
    <!-- Hero Section -->
    <section class="relative py-20 px-4 md:px-8 lg:px-16">
      <div class="container mx-auto max-w-6xl">
        <h1
          ref="titleEl"
          class="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-8 text-white opacity-0 transform translate-y-8 transition-all duration-1000"
        >
          <span class="text-[var(--color-accent)]">Contact</span> Us
        </h1>

        <p
          class="text-xl md:text-2xl text-white/80 text-center max-w-3xl mx-auto mb-16 opacity-0 transform translate-y-8 transition-all duration-1000 delay-200"
        >
          Ready to start your next project? Let's discuss how we can help bring your ideas to life.
        </p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section
      ref="containerEl"
      class="relative py-16 px-4 md:px-8 lg:px-16 opacity-0 transform translate-y-8 transition-all duration-1000 delay-400"
    >
      <div class="container mx-auto max-w-4xl">
        <div
          class="bg-gradient-to-br from-[var(--color-bg)]/90 to-[var(--color-border)]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[var(--color-accent)]/30 shadow-2xl"
        >
          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 class="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-[var(--color-accent)]">📧</span>
                  </div>
                  <span class="text-white/80">{{ contactInfo.email }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-[var(--color-accent)]">📱</span>
                  </div>
                  <span class="text-white/80">{{ contactInfo.phone }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-[var(--color-accent)]">📍</span>
                  </div>
                  <span class="text-white/80">{{ contactInfo.address }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-2xl font-bold text-white mb-6">Follow Us</h3>
              <div class="space-y-4">
                <a
                  :href="contactInfo.social.telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-3 text-white/80 hover:text-[var(--color-accent)] transition-colors"
                >
                  <div
                    class="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-[var(--color-accent)]">📱</span>
                  </div>
                  <span>Telegram</span>
                </a>
                <a
                  :href="contactInfo.social.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-3 text-white/80 hover:text-[var(--color-accent)] transition-colors"
                >
                  <div
                    class="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-[var(--color-accent)]">💼</span>
                  </div>
                  <span>LinkedIn</span>
                </a>
                <a
                  :href="contactInfo.social.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-3 text-white/80 hover:text-[var(--color-accent)] transition-colors"
                >
                  <div
                    class="w-8 h-8 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center"
                  >
                    <span class="text-[var(--color-accent)]">💻</span>
                  </div>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form - handled by ContactSection -->
          <div class="opacity-0 transform translate-y-8 transition-all duration-1000 delay-600">
            <h3 class="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            <p class="text-white/60 mb-8">
              Use the contact form below to get in touch with us directly.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section (lazy loaded) -->
    <Suspense>
      <ContactSection />
      <template #fallback>
        <div class="py-20 text-center">
          <div
            class="animate-spin w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto"
          ></div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
/* Performance optimizations */
.container {
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

/* Hover effects */
a:hover {
  transform: translateY(-1px);
}

/* Form validation styles */
input:invalid:not(:focus) {
  border-color: rgb(239 68 68);
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
