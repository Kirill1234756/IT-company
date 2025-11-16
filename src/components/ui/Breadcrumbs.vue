<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServicesStore } from '../../stores/services'
import { useBlogStore } from '../../stores/blog'

interface CrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items?: CrumbItem[]
  separator?: string
}>()

const route = useRoute()
const router = useRouter()
const servicesStore = useServicesStore()
const blogStore = useBlogStore()

function resolveRecordHref(record: any): string | undefined {
  // last crumb shouldn't be a link
  if (record === route.matched[route.matched.length - 1]) return undefined
  // Prefer named navigation to fill params
  if (record.name) {
    try {
      const resolved = router.resolve({
        name: record.name as string,
        params: route.params,
        query: route.query,
      })
      return resolved.href
    } catch {
      // ignore and fall back
    }
  }
  return record.path || undefined
}

function titleFromRecord(record: any): string {
  // meta.breadcrumb can be a function (route => string) or a string
  const bc = (record.meta as any)?.breadcrumb
  if (typeof bc === 'function') {
    try {
      return String(bc(route))
    } catch {
      /* noop */
    }
  } else if (typeof bc === 'string') {
    return bc
  }

  // Dynamic route label mapping via stores
  const name = String(record.name || '')
  if (name === 'service-category') {
    const slug = String(route.params.category || '')
    const cat = servicesStore.getCategoryBySlug(slug)
    if (cat?.title) return cat.title
  }
  if (name === 'service-detail') {
    const slug = String(route.params.service || '')
    const svc = servicesStore.getServiceDetailBySlug(slug)
    if (svc?.title) return svc.title
  }
  if (name === 'blog-category') {
    const cat = String(route.params.category || '')
    const tab = blogStore.tabs.find((t) => t.id === cat)
    if (tab?.name) return tab.name
  }
  if (name === 'blog-post') {
    const postSlug = String(route.params.post || '')
    const post = blogStore.getPostBySlug(postSlug)
    if (post?.title) return post.title
  }

  // Fall back to meta.title, then name, then path
  return (record.meta?.title as string) || (record.name as string) || record.path || '—'
}

const autoItems = computed<CrumbItem[]>(() => {
  const matched = route.matched.filter((m) => m.path !== '')
  if (!matched.length) return []
  const home: CrumbItem = { label: 'Главная', to: router.resolve({ name: 'home' }).href }
  const crumbs: CrumbItem[] = [home]
  for (const rec of matched) {
    // Skip duplicating home if record is root
    if (rec.path === '/') continue
    crumbs.push({ label: titleFromRecord(rec), to: resolveRecordHref(rec) })
  }
  // Ensure last has no link
  const lastCrumb = Array.isArray(crumbs) && crumbs.length ? crumbs[crumbs.length - 1] : undefined
  if (lastCrumb) lastCrumb.to = undefined
  return crumbs
})

const crumbs = props.items || []
const sep = computed(() => props.separator ?? '/')
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
    class="text-sm text-gray-500"
  >
    <ol class="flex items-center flex-wrap gap-1 mb-5">
      <li
        v-for="(c, i) in crumbs"
        :key="i"
        class="flex items-center"
        :itemprop="'itemListElement'"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <router-link v-if="c.to" :to="c.to" class="hover:text-gray-700" itemprop="item">
          <span itemprop="name">{{ c.label }}</span>
        </router-link>
        <span v-else class="cursor-default" itemprop="name">{{ c.label }}</span>
        <meta itemprop="position" :content="String(i + 1)" />
        <span v-if="i < crumbs.length - 1" class="mx-2 select-none" aria-hidden="true">{{
          sep
        }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
</style>

















