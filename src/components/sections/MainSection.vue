<script setup lang="ts">
import { onMounted } from 'vue'

// Counter animation logic using GSAP
const animateCounters = async () => {
  const { gsap } = await import('gsap')
  const counters = document.querySelectorAll('.counter')

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target') || '0')

    gsap.fromTo(
      counter,
      { innerHTML: 0 },
      {
        innerHTML: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        onUpdate: function () {
          const current = Math.floor(this.targets()[0].innerHTML)
          counter.textContent = current.toString().padStart(3, '0')
        },
      }
    )
  })
}

// Company logos scroll animation using GSAP
const initCompanyScroll = async () => {
  const { gsap } = await import('gsap')
  const scrollContainer = document.querySelector('.company-logos-scroll')
  if (!scrollContainer) return

  const scrollContent = scrollContainer.querySelector('.animate-scroll')
  if (!scrollContent) return

  // Clone the content for seamless loop
  const clone = scrollContent.cloneNode(true)
  scrollContainer.appendChild(clone)

  // Create infinite scroll animation
  gsap.to(scrollContent, {
    x: '-100%',
    duration: 20,
    ease: 'none',
    repeat: -1,
  })
}

// Initialize animations when component mounts
onMounted(async () => {
  // Wait for GSAP to be available
  await new Promise((r) => requestAnimationFrame(() => r(null)))
  if ('requestIdleCallback' in window) {
    await new Promise<void>((resolve) =>
      (
        window as Window & { requestIdleCallback: (callback: () => void) => void }
      ).requestIdleCallback(() => resolve())
    )
  }

  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // Animate main section elements
  const tl = gsap.timeline()

  // Animate title
  tl.from('.main-title span', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
  })

  // Animate statistics
  tl.from(
    '.stat-block',
    {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    },
    '-=0.4'
  )

  // Animate achievement block
  tl.from(
    '.achievement-block',
    {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.6'
  )

  // Animate CTA button
  tl.from(
    '.cta-button',
    {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    },
    '-=0.2'
  )

  // Initialize counter animation when section is visible
  ScrollTrigger.create({
    trigger: '.main-section',
    start: 'top center',
    onEnter: () => {
      animateCounters()
      initCompanyScroll()
    },
  })
})
</script>

<template>
  <!-- Main Hero Section -->
  <section
    class="stack-section main-section no-scrollbar h-screen flex items-center justify-center rounded-t-3xl py-[5rem] bg-black text-white relative overflow-hidden"
  >
    <div class="container mx-auto px-4 h-full flex flex-col justify-center">
      <!-- Main Title -->
      <div class="text-center mb-12 main-title">
        <h1 class="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          <span class="block">Мы разрабатываем</span>
          <span class="block">цифровые продукты</span>
          <span class="block">для государства</span>
        </h1>
      </div>

      <!-- Statistics - Now prominently displayed -->
      <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
        <div class="bg-gray-800 p-6 rounded-xl text-center stat-block">
          <div class="text-3xl md:text-4xl font-black mb-2 counter" data-target="6">0</div>
          <div class="text-sm text-gray-300">городов</div>
        </div>
        <div class="bg-gray-800 p-6 rounded-xl text-center stat-block">
          <div class="text-3xl md:text-4xl font-black mb-2 counter" data-target="111">0</div>
          <div class="text-sm text-gray-300">наград</div>
        </div>
        <div class="bg-gray-800 p-6 rounded-xl text-center stat-block">
          <div class="text-3xl md:text-4xl font-black mb-2 counter" data-target="350">0</div>
          <div class="text-sm text-gray-300">человек</div>
        </div>
      </div>

      <!-- Achievement Block -->
      <div class="bg-gray-800 p-8 rounded-2xl relative achievement-block max-w-4xl mx-auto mb-8">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <polygon
              points="50,10 61,35 90,35 70,55 80,80 50,65 20,80 30,55 10,35 39,35"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="relative z-10 text-center">
          <h2 class="text-4xl md:text-6xl font-black mb-4">№ 1 в России</h2>
          <p class="text-gray-300 text-sm md:text-base leading-relaxed">
            в мобильной разработке по версии всех рейтингов России: Tagline, Рейтинга Рунета, CNews
            и TAdviser
          </p>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="text-center space-y-4">
        <button
          class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 cta-button mx-auto"
        >
          <span>Поддержи KODE</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        <a href="#" class="text-gray-400 text-sm hover:text-white transition-colors block"
          >Юридические документы</a
        >
      </div>
    </div>

    <!-- Company Logos Section -->
    <div class="absolute bottom-8 left-0 right-0">
      <div class="container mx-auto px-4">
        <div class="company-logos-scroll">
          <div class="flex space-x-8 animate-scroll">
            <!-- Company logos will be duplicated for infinite scroll -->
            <div class="flex space-x-8">
              <div class="text-white text-lg font-semibold opacity-80">ROSNEFT</div>
              <div class="text-white text-lg font-semibold opacity-80">Северсталь</div>
              <div class="text-white text-lg font-semibold opacity-80">победа</div>
              <div class="text-white text-lg font-semibold opacity-80">SBER DEVICES</div>
              <div class="text-white text-lg font-semibold opacity-80">MOZEN</div>
              <div class="text-white text-lg font-semibold opacity-80">Ренессанс. СТРАХОВАНИЕ</div>
              <div class="text-white text-lg font-semibold opacity-80">SPAR</div>
              <div class="text-white text-lg font-semibold opacity-80">
                МОСКОВСКАЯ ЭЛЕКТРОННАЯ ШКОЛА
              </div>
            </div>
            <div class="flex space-x-8">
              <div class="text-white text-lg font-semibold opacity-80">ROSNEFT</div>
              <div class="text-white text-lg font-semibold opacity-80">Северсталь</div>
              <div class="text-white text-lg font-semibold opacity-80">победа</div>
              <div class="text-white text-lg font-semibold opacity-80">SBER DEVICES</div>
              <div class="text-white text-lg font-semibold opacity-80">MOZEN</div>
              <div class="text-white text-lg font-semibold opacity-80">Ренессанс. СТРАХОВАНИЕ</div>
              <div class="text-white text-lg font-semibold opacity-80">SPAR</div>
              <div class="text-white text-lg font-semibold opacity-80">
                МОСКОВСКАЯ ЭЛЕКТРОННАЯ ШКОЛА
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
