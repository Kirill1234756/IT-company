<script setup lang="ts">
export interface PackageCardProps {
  id: number
  title: string
  description: string
  price: string
  originalPrice?: string
  features: string[]
  icon: string
  iconBg?: string
  isPopular?: boolean
  isClickable?: boolean
  slug?: string
}

const props = withDefaults(defineProps<PackageCardProps>(), {
  iconBg: 'from-blue-50 to-indigo-100',
  isClickable: true,
  isPopular: false,
})

const emit = defineEmits<{
  (e: 'click', packageData: PackageCardProps): void
}>()

const handleClick = () => {
  if (props.isClickable) {
    emit('click', props)
  }
}
</script>

<template>
  <div
    :class="[
      'package-card group rounded-[3rem] services-card shadow-sm p-6 md:p-8 flex flex-col transition-all duration-300 relative',
      isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : '',
      isPopular ? 'ring-2 ring-accent' : '',
    ]"
    @click="handleClick"
  >
    <!-- Popular Badge -->
    <div
      v-if="isPopular"
      class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-bg rounded-full text-xs font-bold"
    >
      Популярный
    </div>

    <!-- Icon -->
    <div
      :class="[
        'w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[3rem] bg-gradient-to-br flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 mb-4',
        iconBg,
        isClickable ? 'group-hover:scale-110 group-hover:rotate-3' : '',
      ]"
    >
      <span>{{ icon }}</span>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <h3
        :class="[
          'text-xl md:text-2xl font-bold services-card-title leading-snug transition-colors duration-300 mb-2',
          isClickable ? 'group-hover:text-accent' : '',
        ]"
      >
        {{ title }}
      </h3>
      <p
        :class="[
          'services-card-description text-sm md:text-base leading-relaxed mb-6 transition-colors duration-300',
          isClickable ? 'group-hover:text-text' : '',
        ]"
      >
        {{ description }}
      </p>

      <!-- Features List -->
      <ul class="space-y-3 mb-6 flex-1">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-2 text-sm text-text-muted"
        >
          <svg
            class="w-5 h-5 text-accent shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{{ feature }}</span>
        </li>
      </ul>

      <!-- Price -->
      <div class="mt-auto pt-4 border-t border-border">
        <div v-if="originalPrice" class="flex items-baseline gap-2 mb-2">
          <span class="text-sm text-text-muted line-through">{{ originalPrice }}</span>
          <span class="text-xs text-accent font-semibold">Экономия</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span
            :class="[
              'text-2xl md:text-3xl font-bold services-card-price transition-colors duration-300',
              isClickable ? 'group-hover:text-purple' : '',
            ]"
          >
            {{ price }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.package-card {
  backdrop-filter: blur(10px);
}

.package-card:hover {
  transform: translateY(-2px);
}
</style>

