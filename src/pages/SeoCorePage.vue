<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import {
  fetchSeoCoreList,
  fetchSeoPagesList,
  fetchSeoClustersList,
  type SeoCoreRow,
  type SeoPageListItem,
  type SeoClusterListItem,
} from '@/services/seoService'

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

useHead({
  title: 'SEO ядро',
  meta: [
    {
      name: 'description',
      content:
        'SEO ядро: запросы, кластеры и привязка к страницам. Таблица семантического ядра проекта.',
    },
  ],
})

const rows = ref<SeoCoreRow[]>([])
const total = ref(0)
const page = ref(1)
// Показываем все строки одним списком (без пагинации)
const limit = ref(5000)
const loading = ref(false)
const error = ref<string | null>(null)

const pages = ref<SeoPageListItem[]>([])
const clusters = ref<SeoClusterListItem[]>([])

const filters = ref({
  path: '',
  clusterId: '',
  city: '',
  intent: '',
  freqBucket: '',
  search: '',
})

const totalPages = computed(() => 1)
const from = computed(() => (rows.value.length ? 1 : 0))
const to = computed(() => rows.value.length)

// Значения bucket должны совпадать с тем, что реально лежит в БД (см. seo_keywords.freq_bucket)
// В ядре сейчас используются VH / H / M / L / ESTIMATE.
const freqBucketOptions = [
  { value: '', label: 'Любой' },
  { value: 'VH', label: 'VH' },
  { value: 'H', label: 'H' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'ESTIMATE', label: 'ESTIMATE' },
]

async function loadCore() {
  loading.value = true
  error.value = null
  const result = await fetchSeoCoreList({
    page: page.value,
    limit: limit.value,
    path: filters.value.path || undefined,
    clusterId: filters.value.clusterId || undefined,
    city: filters.value.city || undefined,
    intent: filters.value.intent || undefined,
    freqBucket: filters.value.freqBucket || undefined,
    search: filters.value.search?.trim() || undefined,
  })
  loading.value = false
  if (result) {
    rows.value = result.data
    total.value = result.total
  } else {
    error.value = 'Не удалось загрузить данные. Проверьте, что бэкенд запущен.'
    rows.value = []
    total.value = 0
  }
}

async function loadPages() {
  const res = await fetchSeoPagesList({ page: 1, limit: 500 })
  if (res) pages.value = res.data
}

async function loadClusters() {
  const res = await fetchSeoClustersList({ page: 1, limit: 500 })
  if (res) clusters.value = res.data
}

function applyFilters() {
  page.value = 1
  loadCore()
}

// Автообновление при изменении основных фильтров (страница, кластер, город, интент, bucket)
watch(
  () => ({
    path: filters.value.path,
    clusterId: filters.value.clusterId,
    city: filters.value.city,
    intent: filters.value.intent,
    freqBucket: filters.value.freqBucket,
  }),
  () => {
    applyFilters()
  }
)

watch(
  () => filters.value.search,
  () => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
    searchDebounceTimer = setTimeout(() => {
      applyFilters()
      searchDebounceTimer = null
    }, 400)
  }
)

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  loadCore()
}

onMounted(() => {
  loadPages()
  loadClusters()
  loadCore()
})

watch([page, limit], () => loadCore())
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-stone-900 text-[12px]">
    <header class="border-b border-stone-200 bg-white px-4 py-4 shadow-sm md:px-6">
      <div class="mx-auto max-w-7xl">
        <h1 class="font-display text-2xl font-semibold text-stone-900 md:text-3xl">
          SEO ядро
        </h1>
        <p class="mt-1 text-sm text-stone-500">
          Запросы, кластеры и привязка к страницам. Все параметры семантического ядра.
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <!-- Filters -->
      <section class="mb-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Фильтры
        </h2>
        <form
          id="seo-core-filters"
          class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
          @submit.prevent="applyFilters"
        >
          <div>
            <label class="mb-1 block text-xs font-medium text-stone-600">Страница (path)</label>
            <select
              v-model="filters.path"
              class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Все</option>
              <option
                v-for="p in pages"
                :key="p.id"
                :value="p.path"
              >
                {{ p.path }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-stone-600">Кластер</label>
            <select
              v-model="filters.clusterId"
              class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Все</option>
              <option
                v-for="c in clusters"
                :key="c.id"
                :value="c.id"
              >
                {{ c.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-stone-600">Город</label>
            <input
              v-model="filters.city"
              type="text"
              placeholder="Москва, СПб..."
              class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-stone-600">Интент</label>
            <input
              v-model="filters.intent"
              type="text"
              placeholder="informational, commercial..."
              class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-stone-600">Частота (bucket)</label>
            <select
              v-model="filters.freqBucket"
              class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option
                v-for="opt in freqBucketOptions"
                :key="opt.value || 'any'"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-stone-600">Поиск по запросу</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Текст запроса..."
              class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              @keyup.enter="applyFilters"
            />
          </div>
        </form>
        <div class="mt-3 flex justify-end">
          <button
            type="submit"
            form="seo-core-filters"
            class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Применить
          </button>
        </div>
      </section>

      <!-- Error -->
      <div
        v-if="error"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      >
        {{ error }}
      </div>

      <!-- Table -->
      <section class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="sheet-table min-w-full text-left">
            <thead>
              <tr>
                <th style="width: 50px;">№</th>
                <th style="width: 220px;">Запрос</th>
                <th style="width: 70px;">Частота</th>
                <th style="width: 60px;">Bucket</th>
                <th style="width: 100px;">Город</th>
                <th style="width: 80px;">Приоритет</th>
                <th style="width: 220px;">Кластер</th>
                <th style="width: 120px;">Интент</th>
                <th style="width: 90px;">Стадия</th>
                <th style="width: 90px;">Уровень</th>
                <th style="width: 170px;">Страница (path)</th>
                <th style="width: 260px;">Title страницы</th>
                <th style="width: 170px;">Заметки</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="13" class="sheet-meta text-center">
                  Загрузка…
                </td>
              </tr>
              <tr v-else-if="!rows.length">
                <td colspan="13" class="sheet-meta text-center">
                  Нет записей по заданным фильтрам.
                </td>
              </tr>
              <tr
                v-for="(r, idx) in rows"
                :key="r.id"
                class="sheet-row"
              >
                <td class="text-right text-stone-600">
                  {{ idx + 1 }}
                </td>
                <td :title="r.text">
                  {{ r.text }}
                </td>
                <td class="text-right text-stone-600" :title="String(r.freq ?? '—')">
                  {{ r.freq ?? '—' }}
                </td>
                <td class="text-center">
                  <span v-if="r.freq_bucket">
                    {{ r.freq_bucket }}
                  </span>
                  <span v-else>—</span>
                </td>
                <td class="text-stone-600" :title="r.city || r.cluster_city || '—'">
                  {{ r.city || r.cluster_city || '—' }}
                </td>
                <td class="text-right text-stone-600">
                  {{ r.priority_score }}
                </td>
                <td class="text-stone-600" :title="r.cluster_name || '—'">
                  {{ r.cluster_name || '—' }}
                </td>
                <td class="text-stone-600" :title="r.cluster_intent || '—'">
                  {{ r.cluster_intent || '—' }}
                </td>
                <td class="text-stone-600" :title="r.user_stage || '—'">
                  {{ r.user_stage || '—' }}
                </td>
                <td class="text-stone-600" :title="r.category_level || '—'">
                  {{ r.category_level || '—' }}
                </td>
                <td :title="r.page_path || '—'">
                  {{ r.page_path || '—' }}
                </td>
                <td class="text-stone-600" :title="r.page_title || '—'">
                  {{ r.page_title || '—' }}
                </td>
                <td class="text-stone-500" :title="r.notes || '—'">
                  {{ r.notes || '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>
    </main>
  </div>
</template>

<style scoped>
.sheet-table {
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11px;
}

.sheet-table th,
.sheet-table td {
  border: 1px solid #e5e5e5;
  padding: 4px 6px;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sheet-table thead th {
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: #f3f4f6;
  font-weight: 600;
}

.sheet-row:nth-child(even) {
  background-color: #fafafa;
}

.sheet-row:hover {
  background-color: #f3f4ff;
}

.sheet-meta {
  padding: 8px 6px;
  font-size: 11px;
  color: #6b7280;
}
</style>
