<script setup lang="ts">
defineOptions({ name: 'AppLoader' })
import { defineProps, computed } from 'vue'

const props = defineProps<{
  progress: number
  isRouteChange?: boolean
}>()

const loadingText = computed(() => {
  return props.isRouteChange ? 'Переход...' : 'Загрузка...'
})

// title text is fixed in template; computed kept minimal
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center">
    <!-- Logo/Brand -->
    <div class="mb-8">
      <div class="w-16 h-16 bg-border rounded-2xl flex items-center justify-center overflow-hidden">
        <img
          src="/logo3.webp"
          alt="Kodify Logo"
          width="64"
          height="64"
          loading="eager"
          fetchpriority="high"
          class="w-full h-full object-contain"
        />
      </div>
    </div>

    <!-- Loading Text -->
    <h2 class="text-2xl font-bold text-accent mb-8">Kodify</h2>

    <!-- Progress Bar -->
    <div class="w-80 max-w-sm">
      <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          class="bg-gradient-to-r from-[#2455ff] to-[#1e40af] h-full rounded-full transition-all duration-300 ease-out relative"
          :style="{ width: `${props.progress}%` }"
        >
          <!-- Shimmer effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
          ></div>
        </div>
      </div>

      <!-- Progress Percentage -->
      <div class="text-center mt-3">
        <span class="text-sm font-semibold text-gray-600">{{ Math.round(props.progress) }}%</span>
      </div>
    </div>

    <!-- Loading Animation -->
    <div class="mt-8 flex space-x-2">
      <div
        v-for="i in 3"
        :key="i"
        class="w-2 h-2 bg-[#2455ff] rounded-full animate-pulse"
        :style="{ animationDelay: `${i * 0.2}s` }"
      ></div>
    </div>

    <!-- Loading Text -->
    <p class="text-gray-500 text-sm mt-6">{{ loadingText }}</p>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>
