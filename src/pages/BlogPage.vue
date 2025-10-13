<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue'

const BlogSection = defineAsyncComponent(() => import('../components/sections/BlogSection.vue'))

onMounted(() => {
  // Add any initialization logic here
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Blog Section -->
    <BlogSection />
  </div>
</template>

<style scoped>
/* Page specific styles */
</style>
