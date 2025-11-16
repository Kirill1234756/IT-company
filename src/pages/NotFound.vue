<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center p-8">
    <h1 class="text-5xl font-extrabold mb-4">404</h1>
    <p class="text-gray-600 mb-8">Страница не найдена</p>
    <router-link to="/" class="px-6 py-3 rounded-full bg-[var(--color-accent)] text-white"
      >На главную</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'

// Устанавливаем noindex для 404 страницы
onMounted(() => {
  useHead({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  })
})
</script>

<style scoped>
</style>









