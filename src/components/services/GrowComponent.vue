<script setup lang="ts">
import { ref } from 'vue'

type GrowthService = {
  id: number
  title: string
  description: string
  priceFrom: string
  icon: string
}

const services = ref<GrowthService[]>([
  {
    id: 1,
    title: 'Promoting',
    description:
      "An essential element of any company's development in digital, allowing to attract customers / buyers for any product / service / product in the market. High-quality promotion online is the key to successful business for any industry in current conditions.",
    priceFrom: '€400',
    icon: '✅',
  },
  {
    id: 2,
    title: 'Drawing up a marketing strategy',
    description:
      'Developing a business development path in the market and increasing its competitiveness. Defining the target audience, analyzing the market, competitors and trends, promotion channels and performance metrics.',
    priceFrom: '€500',
    icon: '📣',
  },
  {
    id: 3,
    title: 'Marketing campaign audit',
    description:
      'Improving the efficiency of marketing activities. The service includes analyzing the results of configured campaigns, assessing the effectiveness of marketing channels and metrics, identifying strengths and weaknesses, and adjusting the marketing strategy.',
    priceFrom: '€500',
    icon: '📄',
  },
  {
    id: 4,
    title: 'Research for business development',
    description:
      'We determine the needs and preferences of customers, identify market features, and analyze competitors. We conduct marketing research, analyze statistical data, and other sources.',
    priceFrom: '€700',
    icon: '🔬',
  },
])
</script>

<template>
  <section class="w-full px-[10rem] py-[3rem]">
    <!-- Breadcrumbs -->
    <div class="max-w-5xl mx-auto text-sm text-gray-500 mb-4">
      <span class="cursor-default">Home</span>
      <span class="mx-1">/</span>
      <span class="cursor-default">Services</span>
      <span class="mx-1">/</span>
    </div>

    <!-- Header -->
    <div class="max-w-5xl mx-auto mb-6">
      <h1 class="text-5xl font-extrabold text-[#1f2937] tracking-tight">Growth</h1>
    </div>

    <!-- Badge -->
    <div class="max-w-5xl mx-auto mb-10">
      <span class="inline-block bg-[#2455ff] text-white text-sm px-5 py-2 rounded-full"
        >Growth</span
      >
    </div>

    <!-- Cards -->
    <div class="max-w-5xl mx-auto space-y-10">
      <div
        v-for="service in services"
        :key="service.id"
        class="rounded-[2rem] bg-white border border-gray-200 shadow-sm p-8 md:p-10 flex items-start gap-6"
      >
        <div
          class="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-4xl"
        >
          <span>{{ service.icon }}</span>
        </div>
        <div class="flex-1">
          <h3 class="text-3xl font-bold text-gray-900 leading-snug">{{ service.title }}</h3>
          <p class="text-gray-700 mt-4 leading-relaxed max-w-3xl">
            {{ service.description }}
          </p>
          <div class="mt-6">
            <span class="text-2xl font-semibold text-[#2455ff]">from {{ service.priceFrom }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
