import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import routePrefetch from 'vite-plugin-route-prefetch'
import sitemap from 'vite-plugin-sitemap'
import { visualizer } from 'rollup-plugin-visualizer'
// import Prerender from 'vite-plugin-prerender'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ...(process.env.NODE_ENV === 'development' ? [vueDevTools()] : []),
    tailwindcss(),
    routePrefetch(),
    sitemap({
      hostname: 'https://kodifyweb.ru',
      readable: true,
    }),
    // Bundle analyzer - только в production
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // treemap, sunburst, network
    }),
    // NOTE: Disabled prerender plugin for ESM compatibility (require is not defined)
    // Prerender({
    //   staticDir: 'dist',
    //   routes: ['/', '/services', '/cases', '/contacts', '/blog'],
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Агрессивная минификация с удалением console и debugger
  esbuild: {
    drop: ['console', 'debugger'], // Всегда удаляем в production build
    legalComments: 'none', // Удаляем все комментарии
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  build: {
    // Включаем агрессивную оптимизацию для продакшена
    // Используем esbuild (быстрее чем terser, идет по умолчанию)
    minify: 'esbuild',
    // Агрессивная минификация CSS
    cssMinify: true, // Включаем минификацию CSS
    // Уменьшаем лимит для предупреждений о размере чанков (оптимизация для мобильных)
    chunkSizeWarningLimit: 200,
    // Альтернатива: terser (нужно установить: npm install -D terser)
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
    // Разделение кода на чанки для лучшего кэширования
    rollupOptions: {
      output: {
        // Стратегия именования файлов для долгого кэширования
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`
          }
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
            return `img/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        // Разделение на чанки для лучшего кэширования и меньшего размера
        manualChunks: (id) => {
          // Разделяем vendor библиотеки на более мелкие чанки
          if (id.includes('node_modules')) {
            // Vue core отдельно (критично для первой загрузки)
            if (id.includes('vue') && !id.includes('vue-router') && !id.includes('pinia') && !id.includes('@vue')) {
              return 'vendor-vue-core'
            }
            // Vue Router отдельно
            if (id.includes('vue-router')) {
              return 'vendor-vue-router'
            }
            // Pinia отдельно
            if (id.includes('pinia')) {
              return 'vendor-pinia'
            }
            // GSAP разделяем на отдельные чанки для лучшего tree-shaking
            if (id.includes('gsap/ScrollTrigger')) {
              return 'vendor-gsap-scrolltrigger'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap-core'
            }
            // Unhead отдельно
            if (id.includes('@unhead')) {
              return 'vendor-unhead'
            }
            // VueUse - разбиваем на более мелкие части
            if (id.includes('@vueuse/core')) {
              return 'vendor-vueuse-core'
            }
            if (id.includes('@vueuse')) {
              return 'vendor-vueuse-other'
            }
            // Tailwind отдельно
            if (id.includes('tailwind')) {
              return 'vendor-tailwind'
            }
            // Остальные мелкие библиотеки
            return 'vendor-other'
          }
          // Разделить по страницам для лучшего code splitting
          if (id.includes('/pages/')) {
            const match = id.match(/\/pages\/([^/]+)\.vue/)
            if (match) {
              const pageName = match[1]
              // Все страницы в отдельные чанки для лучшего lazy loading
              return `page-${pageName.toLowerCase()}`
            }
          }
          // Разделить по компонентам секций
          if (id.includes('/components/sections/')) {
            const match = id.match(/\/sections\/([^/]+)\.vue/)
            if (match) {
              return `section-${match[1].toLowerCase()}`
            }
          }
          // Разделить по компонентам UI
          if (id.includes('/components/ui/')) {
            const match = id.match(/\/ui\/([^/]+)\.vue/)
            if (match) {
              return `ui-${match[1].toLowerCase()}`
            }
          }
        },
      },
      treeshake: {
        moduleSideEffects: (id) => {
          // Исключаем файлы с side effects
          if (id.includes('node_modules')) {
            // Некоторые библиотеки требуют side effects
            if (
              id.includes('gsap') ||
              id.includes('vue-router') ||
              id.includes('pinia') ||
              id.includes('@unhead') ||
              id.includes('vue3-lazyload')
            ) {
              return true
            }
            return false
          }
          // Для наших файлов проверяем side effects более тщательно
          if (id.includes('/src/')) {
            // CSS файлы могут иметь side effects
            if (id.endsWith('.css')) {
              return true
            }
            return false
          }
          return false
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        // Агрессивное tree-shaking для удаления неиспользуемого кода
        preset: 'smallest',
      },
    },
    // Включаем source maps только для отладки (отключено для продакшена)
    sourcemap: false,
    // CSS код сплит
    cssCodeSplit: true,
    // Отчет о сжатом размере
    reportCompressedSize: true,
    // Target для современных браузеров (уменьшает размер бандла)
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
  // Оптимизация для разработки
  server: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
})
