<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useBreadcrumbSchema } from '../composables/useBreadcrumbSchema'

const route = useRoute()

// Breadcrumb schema
const { schema: breadcrumbSchema } = useBreadcrumbSchema(route)

// Inject breadcrumb schema
watchEffect(() => {
  if (breadcrumbSchema.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema.value),
          key: 'breadcrumb-schema',
        },
      ],
    })
  }
})

// Copy phone number functionality
const phoneNumber = '+7 904 296 40 72'
const copied = ref(false)

const copyPhoneNumber = async () => {
  try {
    await navigator.clipboard.writeText(phoneNumber)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <section
    class="py-8 sm:py-12 !min-height-[100px] px-4 sm:px-6 md:px-8 lg:px-16 bg-text flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8"
  >
    <!-- Contact Information Card - 2/5 width -->
    <div
      class="flex flex-col p-6 sm:p-9 w-full md:!w-2/5 border border-accent rounded-[3rem] bg-bg"
    >
      <h3 class="text-2xl sm:text-3xl md:text-3xl text-accent font-bold mb-6 sm:mb-8">
        Наши контакты
      </h3>
      <div class="space-y-3">
        <button
          @click="copyPhoneNumber"
          class="flex items-center space-x-3 w-full text-left hover:opacity-80 transition-opacity cursor-pointer relative"
        >
          <span class="text-accent text-xl sm:text-2xl">📱</span>
          <p class="text-text text-sm sm:text-base md:text-lg">{{ phoneNumber }}</p>
          <span v-if="copied" class="ml-auto text-xs text-accent font-medium animate-pulse">
            Скопировано!
          </span>
        </button>
        <a
          href="mailto:kodify@gmail.com"
          class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <span class="text-accent text-xl sm:text-2xl">📧</span>
          <p class="text-text text-sm sm:text-base md:text-lg">kodify@gmail.com</p>
        </a>
        <a
          href="https://t.me/kodify_tg"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <span class="text-accent text-xl sm:text-2xl">💬</span>
          <p class="text-text text-sm sm:text-base md:text-lg">kodify_tg</p>
        </a>
      </div>
    </div>
  </section>
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

/* Hover effects */

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
