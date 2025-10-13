<script setup lang="ts">
import { defineProps, defineEmits, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

interface Project {
  id: number
  title: string
  category: string
  description: string
  bgColor: string
  logoColor: string
  logoText: string
  technologies: string[]
  link: string
  image: string
  year: string
  status: string
}

const props = defineProps<{
  showModal: boolean
  selectedProject: Project | null
}>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

// Handle escape key for modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.showModal) {
    handleClose()
  }
}

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)

      nextTick(() => {
        const modal = document.querySelector('.fixed.inset-0.z-50')
        const modalContent = document.querySelector('.modal-content')

        if (modal && modalContent) {
          gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })

          gsap.fromTo(
            modalContent,
            { scale: 0.8, y: 50, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
          )
        }
      })
    } else {
      document.removeEventListener('keydown', handleKeydown)

      const modal = document.querySelector('.fixed.inset-0.z-50')
      const modalContent = document.querySelector('.modal-content')

      if (modal && modalContent) {
        gsap.to(modalContent, {
          scale: 0.8,
          y: 50,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(modal, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
              delay: 0.1,
              onComplete: () => {
                document.body.style.overflow = 'auto'
              },
            })
          },
        })
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <!-- Project Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click="handleClose"
  >
    <div
      v-if="selectedProject"
      @click.stop
      class="modal-content bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
    >
      <!-- Modal Header -->
      <div class="relative p-6 border-b border-gray-200">
        <button
          @click="handleClose"
          class="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <div class="flex items-start gap-4">
          <div
            :class="`w-16 h-12 ${selectedProject.logoColor} rounded-lg flex items-center justify-center shadow-lg`"
          >
            <span class="text-white font-bold text-sm">{{ selectedProject.logoText }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-blue-600 text-sm font-semibold">{{
                selectedProject.category
              }}</span>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  selectedProject.status === 'Завершен'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800',
                ]"
              >
                {{ selectedProject.status }}
              </span>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                {{ selectedProject.year }}
              </span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedProject.title }}</h3>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <!-- Project Image -->
        <div
          :class="`bg-gradient-to-br ${selectedProject.bgColor} rounded-xl h-64 mb-6 flex items-center justify-center relative overflow-hidden`"
        >
          <div class="absolute inset-0 bg-black/10"></div>
          <div
            :class="`w-32 h-20 ${selectedProject.logoColor} rounded-xl flex items-center justify-center shadow-lg`"
          >
            <span class="text-white font-bold text-lg">{{ selectedProject.logoText }}</span>
          </div>
        </div>

        <!-- Project Description -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Описание проекта</h4>
          <p class="text-gray-600 leading-relaxed">{{ selectedProject.description }}</p>
        </div>

        <!-- Technologies -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Использованные технологии</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in selectedProject.technologies"
              :key="tech"
              class="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Project Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Категория</h4>
            <p class="text-gray-600">{{ selectedProject.category }}</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Год реализации</h4>
            <p class="text-gray-600">{{ selectedProject.year }}</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Статус</h4>
            <p class="text-gray-600">{{ selectedProject.status }}</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Количество технологий</h4>
            <p class="text-gray-600">{{ selectedProject.technologies.length }} технологий</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <a
            :href="selectedProject.link"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
          >
            Посмотреть проект
          </a>
          <button
            @click="handleClose"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for modal */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>












