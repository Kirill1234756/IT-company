<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, Observer)

const gear1 = ref<SVGGElement | null>(null)
const gear2 = ref<SVGGElement | null>(null)
const gear3 = ref<SVGGElement | null>(null)
const sectionEl = ref<HTMLElement | null>(null)

const tags = [
  'API',
  'SPA',
  'JavaScript',
  'JQuery',
  'Pinia',
  'PHP',
  'MySQL',
  'TypeScript',
  'Vue',
  'HTML',
  'Soft Skill',
  'Hard Skills',
  'Smart',
  'Teamwork',
  'United',
  'Friendly',
  'Communication',
]

type StatItem = { value: number; label: string; sublabel?: string }
const stats: StatItem[] = [
  { value: 13, label: 'лет', sublabel: 'на рынке' },
  { value: 400, label: 'проектов', sublabel: 'реализованных' },
  { value: 25, label: 'человек', sublabel: 'в команде' },
  { value: 10, label: 'ТОП', sublabel: 'по Tagline' },
]

type Tech = { key: string; name: string; description: string }
const techs: Tech[] = [
  {
    key: 'git',
    name: 'Git',
    description: 'Система контроля версий с распределённой архитектурой.',
  },
  { key: 'vue', name: 'Vue', description: 'Прогрессивный фреймворк для создания интерфейсов.' },
  { key: 'node', name: 'Node.js', description: 'Серверная среда выполнения JavaScript.' },
  {
    key: 'python',
    name: 'Python',
    description: 'Язык общего назначения — быстрый старт, богатая экосистема.',
  },
  { key: 'django', name: 'Django', description: 'Высокоуровневый веб‑фреймворк на Python.' },
  { key: 'js', name: 'JavaScript', description: 'Ядро фронтенда и скриптов в браузере.' },
  {
    key: 'jquery',
    name: 'jQuery',
    description: 'Утилиты для DOM и анимаций в наследованных проектах.',
  },
  {
    key: 'ts',
    name: 'TypeScript',
    description: 'Типизированный JavaScript для крупных приложений.',
  },
  { key: 'api', name: 'REST API', description: 'Проектирование и интеграция HTTP API.' },
  { key: 'auth', name: 'Auth', description: 'Авторизация/аутентификация, OAuth2, JWT.' },
  {
    key: 'db',
    name: 'Database',
    description: 'Проектирование схем, индексы и оптимизация запросов.',
  },
]
const activeTechKey = ref<string>(techs[0].key)
const activeTech = computed(() => techs.find((t) => t.key === activeTechKey.value)!)

onMounted(() => {
  // HERO Slides logic
  const sections = gsap.utils.toArray<HTMLElement>('#hero-slides .slide')
  const images = gsap.utils.toArray<HTMLElement>('#hero-slides .image').reverse()
  const slideImages = gsap.utils.toArray<HTMLElement>('#hero-slides .slide__img')
  const outerWrappers = gsap.utils.toArray<HTMLElement>('#hero-slides .slide__outer')
  const innerWrappers = gsap.utils.toArray<HTMLElement>('#hero-slides .slide__inner')
  const count = document.querySelector('#hero-slides .count') as HTMLElement | null
  const wrapIndex = gsap.utils.wrap(0, sections.length)
  let animating = false
  let currentIndex = 0

  if (sections.length) {
    gsap.set(outerWrappers, { xPercent: 100 })
    gsap.set(innerWrappers, { xPercent: -100 })
    gsap.set('#hero-slides .slide:nth-of-type(1) .slide__outer', { xPercent: 0 })
    gsap.set('#hero-slides .slide:nth-of-type(1) .slide__inner', { xPercent: 0 })

    const gotoSection = (index: number, direction: number) => {
      if (!count) return
      animating = true
      index = wrapIndex(index)
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'expo.inOut' },
        onComplete: () => (animating = false),
      })

      const currentSection = sections[currentIndex]
      const heading = currentSection.querySelector('.slide__heading') as HTMLElement
      const nextSection = sections[index]
      const nextHeading = nextSection.querySelector('.slide__heading') as HTMLElement

      gsap.set([sections as unknown as HTMLElement[], images as unknown as HTMLElement[]], {
        zIndex: 0,
        autoAlpha: 0,
      })
      gsap.set([sections[currentIndex], images[index] as HTMLElement], { zIndex: 1, autoAlpha: 1 })
      gsap.set([sections[index], images[currentIndex] as HTMLElement], { zIndex: 2, autoAlpha: 1 })

      tl.set(count, { textContent: String(index + 1) }, 0.32)
        .fromTo(outerWrappers[index], { xPercent: 100 * direction }, { xPercent: 0 }, 0)
        .fromTo(innerWrappers[index], { xPercent: -100 * direction }, { xPercent: 0 }, 0)
        .to(heading, { xPercent: 30 * direction }, 0)
        .fromTo(nextHeading, { xPercent: -30 * direction }, { xPercent: 0 }, 0)
        .fromTo(
          images[index] as HTMLElement,
          { xPercent: 125 * direction, scaleX: 1.5, scaleY: 1.3 },
          { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 },
          0
        )
        .fromTo(
          images[currentIndex] as HTMLElement,
          { xPercent: 0, scaleX: 1, scaleY: 1 },
          { xPercent: -125 * direction, scaleX: 1.5, scaleY: 1.3 },
          0
        )
        .fromTo(slideImages[index] as HTMLElement, { scale: 2 }, { scale: 1 }, 0)
        .timeScale(0.8)

      currentIndex = index
    }

    const heroObserver = Observer.create({
      target: document.getElementById('hero-slides'),
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onUp: (self: { event?: Event }) => {
        if (!animating && currentIndex < sections.length - 1) {
          if (self.event) self.event.preventDefault()
          gotoSection(currentIndex + 1, +1)
        } else if (!animating && currentIndex === sections.length - 1) {
          if (self.event) {
            self.event.stopPropagation()
            heroObserver.kill()
          }
        }
      },
      onDown: (self: { event?: Event }) => {
        if (!animating && currentIndex > 0) {
          if (self.event) self.event.preventDefault()
          gotoSection(currentIndex - 1, -1)
        }
      },
      tolerance: 10,
      preventDefault: true,
    })

    window.addEventListener('keydown', (e) => {
      if ((e.code === 'ArrowUp' || e.code === 'ArrowLeft') && !animating)
        gotoSection(currentIndex - 1, -1)
      if (['ArrowDown', 'ArrowRight', 'Space', 'Enter'].includes(e.code) && !animating)
        gotoSection(currentIndex + 1, +1)
    })
  }

  // Panels with ScrollTrigger
  const panels = gsap.utils.toArray<HTMLElement>('#panels .panel')
  if (panels.length) {
    const total = panels.length
    gsap.set(panels, { yPercent: (i) => (i === 0 ? 0 : 100) })
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut', duration: 1 },
      scrollTrigger: {
        id: 'panels-st',
        trigger: '#panels',
        start: 'top top',
        end: () => '+=' + (total - 1) * window.innerHeight,
        pin: true,
        scrub: 1,
        snap: { snapTo: 1 / (total - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut' },
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          const idx = Math.round(st.progress * (total - 1))
          document.querySelectorAll('#dotnav .dot').forEach((d, di) => {
            ;(d as HTMLElement).style.backgroundColor =
              di === idx ? 'white' : 'rgba(255,255,255,0.3)'
            ;(d as HTMLElement).style.transform = di === idx ? 'scale(1.2)' : 'scale(1)'
          })
        },
      },
    })
    for (let i = 1; i < total; i++) {
      const prev = panels[i - 1]
      const next = panels[i]
      tl.to(prev, { yPercent: -100 }, 'step' + i)
        .fromTo(next, { yPercent: 100 }, { yPercent: 0 }, 'step' + i)
        .fromTo(
          next.querySelectorAll('.panel-title, .panel-text'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          'step' + i + '+=0.2'
        )
    }
    document.querySelectorAll('#dotnav .dot')?.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number((dot as HTMLElement).dataset.idx || 0)
        const st = tl.scrollTrigger as ScrollTrigger
        const y = st.start + idx * window.innerHeight
        window.scrollTo({ top: y, behavior: 'smooth' })
      })
    })
  }

  // Gears
  if (gear1.value && gear2.value && gear3.value && sectionEl.value) {
    gsap.to(gear1.value, {
      rotate: 1080,
      transformOrigin: '50% 50%',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.to(gear2.value, {
      rotate: -1440,
      transformOrigin: '50% 50%',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    gsap.to(gear3.value, {
      rotate: 720,
      transformOrigin: '50% 50%',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  // Counters
  const counters = gsap.utils.toArray<HTMLElement>('[data-counter]')
  if (counters.length) {
    const playCounters = () => {
      counters.forEach((el) => {
        const endValue = Number(el.getAttribute('data-target') || '0')
        const showPlus = el.hasAttribute('data-plus')
        const state = { n: 0 }
        el.textContent = showPlus ? '0+' : '0'
        gsap.to(state, {
          n: endValue,
          duration: Math.min(2.0, Math.max(1.2, endValue / 250)),
          ease: 'power1.out',
          onUpdate: () => {
            const value = Math.floor(state.n)
            el.textContent = showPlus ? `${value}+` : `${value}`
          },
        })
      })
    }
    ScrollTrigger.create({
      trigger: '#stats-section',
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: playCounters,
      onEnterBack: playCounters,
    })
  }
})
</script>

<script lang="ts">
export default { name: 'Test' }
</script>

<template>
  <main class="min-h-[200vh] bg-white text-gray-900">
    <section id="hero-slides" class="relative h-[100vh] overflow-hidden bg-[#4361ee] text-white">
      <section class="slide absolute inset-0">
        <div class="slide__outer w-full h-full overflow-hidden">
          <div class="slide__inner w-full h-full overflow-hidden">
            <div class="slide__content absolute inset-0 flex items-center justify-center">
              <div
                class="slide__container w-screen max-w-[1400px] h-[90vh] grid grid-cols-10 grid-rows-10 px-4"
              >
                <h2
                  class="slide__heading col-start-2 col-end-10 row-start-2 row-end-3 self-end font-black"
                  style="--width: 200"
                >
                  SCROLL
                </h2>
                <div class="slide__img-cont col-start-1 col-end-8 row-start-2 row-end-7 mt-16">
                  <div
                    class="slide__img w-full h-full flex items-center justify-center bg-white/10 rounded-2xl"
                  >
                    <div class="text-4xl md:text-6xl font-extrabold">Creative. Bold. Web.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="slide absolute inset-0">
        <div class="slide__outer w-full h-full overflow-hidden">
          <div class="slide__inner w-full h-full overflow-hidden">
            <div class="slide__content absolute inset-0 flex items-center justify-center">
              <div
                class="slide__container w-screen max-w-[1400px] h-[90vh] grid grid-cols-10 grid-rows-10 px-4"
              >
                <h2
                  class="slide__heading col-start-2 col-end-10 row-start-2 row-end-3 self-end font-black"
                  style="--width: 200"
                >
                  SWIPE
                </h2>
                <div class="slide__img-cont col-start-1 col-end-8 row-start-2 row-end-7 mt-16">
                  <div
                    class="slide__img w-full h-full flex items-center justify-center bg-white/10 rounded-2xl"
                  >
                    <div class="text-4xl md:text-6xl font-extrabold">UX/UI Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="slide absolute inset-0">
        <div class="slide__outer w-full h-full overflow-hidden">
          <div class="slide__inner w-full h-full overflow-hidden">
            <div class="slide__content absolute inset-0 flex items-center justify-center">
              <div
                class="slide__container w-screen max-w-[1400px] h-[90vh] grid grid-cols-10 grid-rows-10 px-4"
              >
                <h2
                  class="slide__heading col-start-2 col-end-10 row-start-2 row-end-3 self-end font-black"
                  style="--width: 200"
                >
                  SCROLL
                </h2>
                <div class="slide__img-cont col-start-1 col-end-8 row-start-2 row-end-7 mt-16">
                  <div
                    class="slide__img w-full h-full flex items-center justify-center bg-white/10 rounded-2xl"
                  >
                    <div class="text-4xl md:text-6xl font-extrabold">Engineering Power</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="slide absolute inset-0">
        <div class="slide__outer w-full h-full overflow-hidden">
          <div class="slide__inner w-full h-full overflow-hidden">
            <div class="slide__content absolute inset-0 flex items-center justify-center">
              <div
                class="slide__container w-screen max-w-[1400px] h-[90vh] grid grid-cols-10 grid-rows-10 px-4"
              >
                <h2
                  class="slide__heading col-start-2 col-end-10 row-start-2 row-end-3 self-end font-black"
                  style="--width: 200"
                >
                  SWIPE
                </h2>
                <div class="slide__img-cont col-start-1 col-end-8 row-start-2 row-end-7 mt-16">
                  <div
                    class="slide__img w-full h-full flex items-center justify-center bg-white/10 rounded-2xl"
                  >
                    <div class="text-4xl md:text-6xl font-extrabold">Results that Scale</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="overlay absolute inset-0 z-10 pointer-events-none">
        <div
          class="overlay__content w-screen max-w-[1400px] h-[90vh] grid grid-cols-10 grid-rows-10 px-4"
        >
          <p
            class="overlay__count col-start-10 col-end-11 row-start-3 row-end-4 text-right border-b-[7px] border-white text-4xl md:text-6xl"
          >
            0<span class="count">1</span>
          </p>
          <figure class="overlay__img-cont col-start-3 col-end-11 row-start-4 row-end-9 relative">
            <div class="image absolute w-full h-full flex items-center justify-center">
              <div class="text-6xl md:text-8xl font-black">Strategy</div>
            </div>
            <div class="image absolute w-full h-full flex items-center justify-center">
              <div class="text-6xl md:text-8xl font-black">Design</div>
            </div>
            <div class="image absolute w-full h-full flex items-center justify-center">
              <div class="text-6xl md:text-8xl font-black">Development</div>
            </div>
            <div class="image absolute w-full h-full flex items-center justify-center">
              <div class="text-6xl md:text-8xl font-black">Marketing</div>
            </div>
          </figure>
        </div>
      </section>
    </section>

    <section id="panels" class="relative h-[100vh] overflow-hidden">
      <div class="panel bg-neutral-950 text-white absolute inset-0">
        <div class="container mx-auto px-6 h-full flex items-center">
          <div>
            <h2 class="panel-title text-6xl font-black">Стратегия</h2>
            <p class="panel-text mt-4 text-white/80 max-w-xl">
              Исследуем базу, аудиторию и конкурентов. Формируем KPI, дорожную карту и гипотезы
              роста.
            </p>
          </div>
        </div>
      </div>
      <div
        class="panel bg-gradient-to-b from-indigo-950 to-neutral-900 text-white absolute inset-0"
      >
        <div class="container mx-auto px-6 h-full flex items-center">
          <div>
            <h2 class="panel-title text-6xl font-black">Дизайн</h2>
            <p class="panel-text mt-4 text-white/80 max-w-xl">
              Создаём визуальную систему, UX‑паттерны и библиотеку компонентов. Прототипируем и
              тестируем.
            </p>
          </div>
        </div>
      </div>
      <div
        class="panel bg-gradient-to-b from-fuchsia-900 to-neutral-900 text-white absolute inset-0"
      >
        <div class="container mx-auto px-6 h-full flex items-center">
          <div>
            <h2 class="panel-title text-6xl font-black">Разработка</h2>
            <p class="panel-text mt-4 text-white/80 max-w-xl">
              Frontend на Vue/TS, backend на Node/Python. Интеграции, CI/CD, мониторинг,
              безопасность.
            </p>
          </div>
        </div>
      </div>
      <div
        class="panel bg-gradient-to-b from-emerald-900 to-neutral-900 text-white absolute inset-0"
      >
        <div class="container mx-auto px-6 h-full flex items-center">
          <div>
            <h2 class="panel-title text-6xl font-black">Маркетинг</h2>
            <p class="panel-text mt-4 text-white/80 max-w-xl">
              Контент, SEO/ASO, перфоманс и аналитика. Выстраиваем систему роста и A/B‑эксперименты.
            </p>
          </div>
        </div>
      </div>
      <div
        id="dotnav"
        class="hidden md:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-10"
      >
        <button
          v-for="n in 4"
          :key="n"
          :data-idx="n - 1"
          class="dot w-3 h-3 rounded-full bg-white/30"
        ></button>
      </div>
    </section>

    <section ref="sectionEl" class="relative h-[120vh]">
      <div class="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <svg viewBox="0 0 200 200" width="260" height="260" aria-hidden="true">
          <g ref="gear1" fill="none" stroke="currentColor" stroke-width="6">
            <circle cx="80" cy="100" r="36" class="text-gray-300" />
            <g class="text-gray-400">
              <rect x="78" y="54" width="4" height="12" rx="1" />
              <rect x="78" y="134" width="4" height="12" rx="1" />
              <rect x="34" y="98" width="12" height="4" rx="1" />
              <rect x="114" y="98" width="12" height="4" rx="1" />
              <rect x="50" y="70" width="12" height="4" rx="1" transform="rotate(-45 56 72)" />
              <rect x="50" y="124" width="12" height="4" rx="1" transform="rotate(45 56 126)" />
              <rect x="98" y="70" width="12" height="4" rx="1" transform="rotate(45 104 72)" />
              <rect x="98" y="124" width="12" height="4" rx="1" transform="rotate(-45 104 126)" />
            </g>
            <circle cx="80" cy="100" r="10" class="text-gray-500" />
            <line x1="80" y1="60" x2="80" y2="90" class="text-gray-400" />
            <line x1="80" y1="110" x2="80" y2="140" class="text-gray-400" />
          </g>
          <g ref="gear2" fill="none" stroke="currentColor" stroke-width="5">
            <circle cx="132" cy="82" r="24" class="text-gray-300" />
            <g class="text-gray-400">
              <rect x="130" y="52" width="4" height="10" rx="1" />
              <rect x="130" y="102" width="4" height="10" rx="1" />
              <rect x="108" y="80" width="10" height="4" rx="1" />
              <rect x="146" y="80" width="10" height="4" rx="1" />
              <rect x="116" y="62" width="10" height="4" rx="1" transform="rotate(-45 121 64)" />
              <rect x="116" y="96" width="10" height="4" rx="1" transform="rotate(45 121 98)" />
              <rect x="136" y="62" width="10" height="4" rx="1" transform="rotate(45 141 64)" />
              <rect x="136" y="96" width="10" height="4" rx="1" transform="rotate(-45 141 98)" />
            </g>
            <circle cx="132" cy="82" r="7" class="text-gray-500" />
          </g>
          <g ref="gear3" fill="none" stroke="currentColor" stroke-width="4">
            <circle cx="150" cy="132" r="16" class="text-gray-300" />
            <g class="text-gray-400">
              <rect x="149" y="114" width="2" height="8" rx="1" />
              <rect x="149" y="142" width="2" height="8" rx="1" />
              <rect x="132" y="131" width="8" height="2" rx="1" />
              <rect x="160" y="131" width="8" height="2" rx="1" />
              <rect x="139" y="121" width="8" height="2" rx="1" transform="rotate(-45 143 122)" />
              <rect x="139" y="139" width="8" height="2" rx="1" transform="rotate(45 143 140)" />
              <rect x="155" y="121" width="8" height="2" rx="1" transform="rotate(45 159 122)" />
              <rect x="155" y="139" width="8" height="2" rx="1" transform="rotate(-45 159 140)" />
            </g>
            <circle cx="150" cy="132" r="5" class="text-gray-500" />
          </g>
        </svg>
      </div>
      <div class="h-full flex items-center justify-center">
        <h1 class="text-4xl font-bold">Scroll to spin the gears</h1>
      </div>
    </section>

    <section class="h-[120vh] flex items-center justify-center bg-gray-50">
      <p class="text-lg text-gray-600">Keep scrolling…</p>
    </section>
  </main>

  <section class="bg-neutral-900 text-white py-16 overflow-hidden">
    <div class="relative rotate-[-8deg]">
      <div class="marquee whitespace-nowrap flex gap-6">
        <div class="marquee-track flex gap-6">
          <template v-for="(t, i) in tags" :key="'r1a-' + i">
            <span
              class="inline-flex items-center px-5 py-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm shadow-sm text-xl"
              >{{ t }}</span
            >
          </template>
        </div>
        <div class="marquee-track flex gap-6" aria-hidden="true">
          <template v-for="(t, i) in tags" :key="'r1b-' + i">
            <span
              class="inline-flex items-center px-5 py-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm shadow-sm text-xl"
              >{{ t }}</span
            >
          </template>
        </div>
      </div>
    </div>
    <div class="relative mt-10 rotate-[-8deg]">
      <div class="marquee rtl whitespace-nowrap flex gap-6">
        <div class="marquee-track flex gap-6">
          <template v-for="(t, i) in tags" :key="'r2a-' + i">
            <span
              class="inline-flex items-center px-5 py-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm shadow-sm text-xl"
              >{{ t }}</span
            >
          </template>
        </div>
        <div class="marquee-track flex gap-6" aria-hidden="true">
          <template v-for="(t, i) in tags" :key="'r2b-' + i">
            <span
              class="inline-flex items-center px-5 py-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm shadow-sm text-xl"
              >{{ t }}</span
            >
          </template>
        </div>
      </div>
    </div>
  </section>

  <!-- What We Do -->
  <section id="what-we-do" class="bg-[#eef2f7] py-12 sm:py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <h2 class="text-center text-3xl sm:text-4xl md:text-6xl font-black text-neutral-900 mb-8 sm:mb-12 md:mb-14">
        What We Do
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8">
        <!-- Strategy -->
        <article class="md:col-span-6 bg-white rounded-2xl md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
          <div class="flex items-start gap-4 md:gap-6">
            <div class="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl select-none">
              🎯
            </div>
            <div>
              <h3 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900">Strategy</h3>
              <p class="mt-2 sm:mt-3 text-[15px] sm:text-base text-neutral-600 leading-relaxed">
                We will help create a business plan, develop a product development strategy,
                and turn goals into reality.
              </p>
            </div>
          </div>
        </article>

        <!-- Growth -->
        <article class="md:col-span-6 bg-white rounded-2xl md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
          <div class="flex items-start gap-4 md:gap-6">
            <div class="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl select-none">
              🚀
            </div>
            <div>
              <h3 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900">Growth</h3>
              <p class="mt-2 sm:mt-3 text-[15px] sm:text-base text-neutral-600 leading-relaxed">
                We will conduct research and analysis of your digital product, update your web
                resources, and adjust the marketing strategy to enhance the efficiency of your
                business.
              </p>
            </div>
          </div>
        </article>

        <!-- Development (wide) -->
        <article class="md:col-span-8 bg-white rounded-2xl md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
          <div class="flex items-start gap-4 md:gap-6">
            <div class="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl select-none">
              ⚙️
            </div>
            <div>
              <h3 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900">Development</h3>
              <p class="mt-2 sm:mt-3 text-[15px] sm:text-base text-neutral-600 leading-relaxed">
                We will create compelling websites or efficient web applications, assist in
                automating business processes, and integrate with other information systems to
                enhance overall functionality.
              </p>
            </div>
          </div>
        </article>

        <!-- CTA card -->
        <aside class="md:col-span-4 bg-[#1f5bd8] text-white rounded-2xl md:rounded-[32px] p-6 sm:p-8 shadow-sm flex items-center">
          <p class="text-base sm:text-lg md:text-xl font-medium">
            We offer a complete range of turnkey digital solutions for your business
          </p>
        </aside>
      </div>

      <div class="mt-8 sm:mt-10 flex justify-center">
        <a href="#" class="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-neutral-900 text-white text-base md:text-lg font-semibold shadow-sm hover:bg-neutral-800 transition-colors">
          Learn More
        </a>
      </div>
    </div>
  </section>

  <section id="stats-section" class="bg-white text-neutral-900 py-16">
    <div class="max-w-5xl mx-auto px-6">
      <h2 class="text-sm tracking-widest font-semibold text-neutral-500 mb-8">КЛЮЧЕВЫЕ ЦИФРЫ</h2>
      <div class="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-4">
        <div v-for="(s, i) in stats" :key="i">
          <div class="text-5xl sm:text-6xl font-extrabold leading-none">
            <span data-counter data-plus :data-target="s.value">0</span>
          </div>
          <div class="mt-2 text-2xl font-semibold">{{ s.label }}</div>
          <div v-if="s.sublabel" class="text-neutral-500 mt-1 text-base">{{ s.sublabel }}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-neutral-900 text-white py-16">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center gap-6 mb-6">
        <div class="w-16 h-16 rounded-2xl border border-white/30 flex items-center justify-center">
          <span class="text-3xl">🧩</span>
        </div>
        <p class="text-xl text-white/80">{{ activeTech.name }} — {{ activeTech.description }}</p>
      </div>
      <h3 class="text-4xl sm:text-5xl font-extrabold mb-8">Стек технологий</h3>
      <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-6">
        <button
          v-for="t in techs"
          :key="t.key"
          class="group relative h-24 rounded-2xl border border-white/30 flex items-center justify-center text-2xl transition-colors"
          :class="
            activeTechKey === t.key
              ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.35)]'
              : 'hover:bg-white/5'
          "
          @click="activeTechKey = t.key"
        >
          <span class="font-semibold">{{ t.name.slice(0, 2) }}</span>
          <span
            class="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/20"
          ></span>
        </button>
      </div>
    </div>
  </section>

  <section class="bg-[#eef2f7] py-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div
            class="absolute -top-16 -left-10 w-64 h-64 bg-gradient-to-tr from-indigo-200 to-sky-100 rounded-3xl rotate-[-20deg]"
          ></div>
          <h3 class="relative text-5xl font-extrabold mb-4 text-neutral-900">digital lab</h3>
          <p class="relative text-neutral-700 leading-relaxed max-w-2xl">
            Разные компании — единые принципы: качество продукта, высокий уровень сервиса,
            партнёрство на годы.
          </p>
        </div>
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div class="space-y-5 text-neutral-800">
            <div>
              <div class="text-sm uppercase tracking-widest text-neutral-400">телефон</div>
              <div class="mt-1 font-semibold">+7 (495) 136-93-07</div>
            </div>
            <div>
              <div class="text-sm uppercase tracking-widest text-neutral-400">познакомиться</div>
              <div class="mt-1 font-semibold break-all">info@digital-lab.ru</div>
            </div>
            <div>
              <div class="text-sm uppercase tracking-widest text-neutral-400">адрес</div>
              <div class="mt-1">129272, Москва, ул. Советской Армии, 6 офис 134</div>
            </div>
            <div class="flex gap-3 pt-2">
              <a href="#" class="px-4 py-2 rounded-xl bg-sky-100 text-sky-700 font-medium"
                >whats app</a
              >
              <a href="#" class="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-medium"
                >telegram</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article class="group relative rounded-3xl overflow-hidden shadow-sm bg-white">
          <div class="aspect-[4/3] bg-gradient-to-br from-lime-200 to-emerald-200"></div>
          <footer class="absolute inset-x-0 bottom-0 p-4 bg-black/30 backdrop-blur-sm text-white">
            <h4 class="text-xl font-semibold">студия разработки игр</h4>
            <div class="mt-2 flex flex-wrap gap-2 text-sm text-white/90">
              <span class="px-2 py-1 rounded-lg bg-white/20">promo</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">gamifications</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">mobile games</span>
            </div>
          </footer>
        </article>
        <article class="group relative rounded-3xl overflow-hidden shadow-sm bg-white">
          <div class="aspect-[4/3] bg-neutral-900"></div>
          <footer class="absolute inset-x-0 bottom-0 p-4 bg-black/30 backdrop-blur-sm text-white">
            <h4 class="text-xl font-semibold">видеопродакшен</h4>
            <div class="mt-2 flex flex-wrap gap-2 text-sm text-white/90">
              <span class="px-2 py-1 rounded-lg bg-white/20">creative</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">3d</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">branded</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">commercial</span>
            </div>
          </footer>
        </article>
        <article class="group relative rounded-3xl overflow-hidden shadow-sm bg-white">
          <div class="aspect-[4/3] bg-gradient-to-tr from-sky-100 to-indigo-100"></div>
          <footer class="absolute inset-x-0 bottom-0 p-4 bg-black/30 backdrop-blur-sm text-white">
            <h4 class="text-xl font-semibold">студия заказной разработки</h4>
            <div class="mt-2 flex flex-wrap gap-2 text-sm text-white/90">
              <span class="px-2 py-1 rounded-lg bg-white/20">web</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">mobile</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">ux/ui</span>
              <span class="px-2 py-1 rounded-lg bg-white/20">enterprise</span>
            </div>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  display: flex;
  width: max-content;
  animation: marquee-left 36s linear infinite;
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  contain: layout paint;
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.marquee.rtl {
  animation-name: marquee-right;
  animation-duration: 40s;
}
.marquee-track {
  display: flex;
  flex-shrink: 0;
}
@keyframes marquee-left {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}
@keyframes marquee-right {
  from {
    transform: translate3d(-50%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .marquee,
  .marquee.rtl {
    animation-duration: 120s;
  }
}
</style>


