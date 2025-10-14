<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface CrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items?: CrumbItem[]
  separator?: string
}>()

const route = useRoute()

const autoItems = computed<CrumbItem[]>(() => {
  const matched = route.matched.filter((m) => m.path !== '')
  if (!matched.length) return []
  return matched.map((m, idx) => {
    const isLast = idx === matched.length - 1
    const label = (m.meta?.title as string) || (m.name as string) || m.path || '—'
    return { label, to: isLast ? undefined : m.path }
  })
})

const crumbs = computed<CrumbItem[]>(() => (props.items?.length ? props.items : autoItems.value))
const sep = computed(() => props.separator ?? '/')
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm text-gray-500">
    <ol class="flex items-center flex-wrap gap-1">
      <li v-for="(c, i) in crumbs" :key="i" class="flex items-center">
        <router-link v-if="c.to" :to="c.to" class="hover:text-gray-700">{{ c.label }}</router-link>
        <span v-else class="cursor-default">{{ c.label }}</span>
        <span v-if="i < crumbs.length - 1" class="mx-2 select-none">{{ sep }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
</style>



