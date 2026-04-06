<script setup lang="ts">
import { onMounted } from 'vue'

const apiBase =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ||
  (typeof window !== 'undefined' ? window.location.origin.replace(':5173', ':3000') : 'http://localhost:3000')

onMounted(() => {
  const q = window.location.search
  const url = `${apiBase.replace(/\/$/, '')}/seo-core${q}`
  window.location.replace(url)
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-stone-50">
    <p class="text-stone-600">Перенаправление на страницу SEO ядра…</p>
  </div>
</template>
