<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { defineAsyncComponent as defineAsync } from 'vue'
import { useStackScroll } from '../composables/useStackScroll'
const WhatWeDoCard = defineAsyncComponent(() => import('../components/WhatWeDoCard.vue'))
const WhatWeDoCta = defineAsyncComponent(() => import('../components/WhatWeDoCta.vue'))
const AdvantageCard = defineAsyncComponent(() => import('../components/AdvantageCard.vue'))
const BlogSection = defineAsyncComponent(() => import('../components/sections/BlogSection.vue'))
const CasesPage = defineAsync(() => import('./CasesPage.vue'))

const stackRoot = ref<HTMLElement | null>(null)

// Memoized DOM queries
const whatWeDoSectionEl = computed(
  () => stackRoot.value?.querySelector('#what-we-do') as HTMLElement | null
)
const advantagesSectionEl = computed(
  () => stackRoot.value?.querySelector('#advantages') as HTMLElement | null
)
const blogSectionEl = computed(() => document.querySelector('#blog-section') as HTMLElement | null)
const contactCardEl = computed(() => document.querySelector('.contact-card') as HTMLElement | null)
const contactFormEl = computed(() => document.querySelector('.contact-form') as HTMLElement | null)

// Router
const router = useRouter()

// Navigation handlers
const handleCardClick = (cardTitle: string) => {
  switch (cardTitle) {
    case 'Стратегия':
      router.push('/services/strategy')
      break
    case 'Рост':
      router.push('/services/growth')
      break
    case 'Разработка':
      router.push('/services/development')
      break
    default:
      router.push('/services')
  }
}

// Handle blog post click
const handleBlogPostClick = (post: { category: string; slug: string }) => {
  router.push(`/blog/${post.category}/${post.slug}`)
}

// Handle service card click (kept for potential future use)
// const handleServiceClick = (service: any) => {
//   router.push(`/services/${service.id}`)
// }

// Stats data for about us section (memoized)
type StatItem = { value: number; label: string; sublabel?: string }
const stats = computed<StatItem[]>(() => [
  { value: 13, label: 'лет', sublabel: 'на рынке' },
  { value: 400, label: 'проектов', sublabel: 'реализованных' },
  { value: 25, label: 'человек', sublabel: 'в команде' },
  { value: 10, label: 'ТОП', sublabel: 'по Tagline' },
])

// Our Advantages data (memoized)
type Advantage = { title: string; description: string }
const advantages = computed<Advantage[]>(() => [
  {
    title: 'Комплексный подход',
    description:
      'Мы можем взяться как за отдельные задачи, так и за весь проект целиком: от анализа рынка до разработки решений и продвижения «под ключ».',
  },
  {
    title: 'Бизнес‑задачи',
    description:
      'Все решения предлагаем исходя из целей вашего бизнеса — рост продаж, автоматизация, выстраивание коммуникаций с клиентами.',
  },
  {
    title: 'Каждый клиент важен',
    description:
      'Строим долгосрочные отношения: после разработки продолжаем работу над продвижением и аналитикой.',
  },
  {
    title: 'Высокая рабочая скорость',
    description:
      'Процессы внутри команды отлажены и гибко организованы — быстро включаемся в работу над проектом.',
  },
  {
    title: 'Выгодное предложение',
    description:
      'Вы не переплачиваете за бренд — получаете проект высокого уровня с оптимальным бюджетом.',
  },
  {
    title: 'Гибкая команда',
    description:
      'Небольшая команда адаптируется под процессы заказчика и оперативно принимает решения.',
  },
])
// Services data for "What We Do" section (kept for potential future use)
// const servicesData = {
//   strategy: [
//     {
//       id: 1,
//       title: 'Business Strategy Development',
//       description: 'Comprehensive business strategy development including market analysis, competitive positioning, and growth planning.',
//       priceFrom: '€800',
//       icon: '🎯',
//       iconBg: 'from-red-50 to-rose-100'
//     },
//     {
//       id: 2,
//       title: 'Digital Transformation',
//       description: 'Complete digital transformation strategy including technology assessment and process optimization.',
//       priceFrom: '€1200',
//       icon: '🚀',
//       iconBg: 'from-cyan-50 to-sky-100'
//     }
//   ],
//   growth: [
//     {
//       id: 3,
//       title: 'Promoting',
//       description: "Essential element of any company's development in digital, allowing to attract customers for any product or service.",
//       priceFrom: '€400',
//       icon: '✅',
//       iconBg: 'from-green-50 to-emerald-100'
//     },
//     {
//       id: 4,
//       title: 'Marketing Strategy',
//       description: 'Developing a business development path in the market and increasing its competitiveness.',
//       priceFrom: '€500',
//       icon: '📣',
//       iconBg: 'from-blue-50 to-indigo-100'
//     }
//   ],
//   development: [
//     {
//       id: 5,
//       title: 'Web Development',
//       description: 'Custom web application development using modern technologies for scalable and performant solutions.',
//       priceFrom: '€600',
//       icon: '💻',
//       iconBg: 'from-indigo-50 to-blue-100'
//     },
//     {
//       id: 6,
//       title: 'Mobile App Development',
//       description: 'Native and cross-platform mobile application development for iOS and Android.',
//       priceFrom: '€800',
//       icon: '📱',
//       iconBg: 'from-pink-50 to-rose-100'
//     }
//   ]
// }

// What We Do cards data (RU)
const whatWeDoCards = [
  {
    title: 'Стратегия',
    description:
      'Мы поможем создать бизнес‑план, разработать стратегию развития продукта и воплотить цели в реальность.',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23L11 13V7z',
    wrapperClass: 'md:col-span-6 ',
  },
  {
    title: 'Рост',
    description:
      'Мы проведём исследование и анализ вашего цифрового продукта, обновим веб‑ресурсы и скорректируем маркетинговую стратегию для повышения эффективности вашего бизнеса.',
    icon: 'M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z',
    wrapperClass: 'md:col-span-6 ',
  },
  {
    title: 'Разработка',
    description:
      'Мы создадим привлекательные веб‑сайты или эффективные веб‑приложения, поможем автоматизировать бизнес‑процессы и интегрируемся с другими информационными системами для улучшения общей функциональности.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    wrapperClass: 'md:col-span-8 md:py-[2rem]',
  },
]

// (portfolio moved to CasesPage)

// Intersection-based lazy mounting for heavy sections
const whatWeDoEl = ref<HTMLElement | null>(null)
const whatWeDoVisible = ref(false)
useIntersectionObserver(
  whatWeDoEl,
  ([entry]) => {
    if (entry.isIntersecting) whatWeDoVisible.value = true
  },
  { rootMargin: '200px' }
)

const portfolioEl = ref<HTMLElement | null>(null)
const portfolioVisible = ref(false)
useIntersectionObserver(
  portfolioEl,
  ([entry]) => {
    if (entry.isIntersecting) portfolioVisible.value = true
  },
  { rootMargin: '200px' }
)

useStackScroll(stackRoot, {
  snap: true,
  onAfterGsapReady: ({ gsap, ScrollTrigger, sections }) => {
    // Animate cards in What We Do section
    const whatWeDoSection = sections[1] // Second section
    if (whatWeDoSection) {
      const cards = whatWeDoSection.querySelectorAll('.bg-white, .bg-blue-500')
      const button = whatWeDoSection.querySelector('button')

      // Initial state for cards
      gsap.set(cards, { y: 50, opacity: 0, scale: 0.9 })
      gsap.set(button, { y: 30, opacity: 0 })

      // Animate cards when section becomes active
      ScrollTrigger.create({
        trigger: whatWeDoSection,
        start: 'top center',
        onEnter: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
          })
          gsap.to(button, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.8,
          })
        },
        onLeaveBack: () => {
          gsap.set(cards, { y: 50, opacity: 0, scale: 0.9 })
          gsap.set(button, { y: 30, opacity: 0 })
        },
      })

      // Add hover animations for cards
      const allCards = whatWeDoSection.querySelectorAll('.bg-white, .bg-blue-500')
      allCards.forEach((card) => {
        const icon = card.querySelector('.w-16, .icon-container')

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: 'power2.out',
          })
          if (icon) {
            gsap.to(icon, {
              rotation: 360,
              scale: 1.1,
              duration: 0.6,
              ease: 'back.out(1.7)',
            })
          }
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
          if (icon) {
            gsap.to(icon, {
              rotation: 0,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
            })
          }
        })
      })
    }

    // Advantages animations (use memoized section element)
    const advantagesSection = advantagesSectionEl.value
    if (advantagesSection) {
      const cards = advantagesSection.querySelectorAll('.adv-card')
      const button = advantagesSection.querySelector('button')
      gsap.set(cards, { y: 30, opacity: 0 })
      gsap.set(button, { y: 20, opacity: 0 })
      ScrollTrigger.create({
        trigger: advantagesSection,
        start: 'top center',
        onEnter: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.12,
          })
          gsap.to(button, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.4,
          })
        },
        onLeaveBack: () => {
          gsap.set(cards, { y: 30, opacity: 0 })
          gsap.set(button, { y: 20, opacity: 0 })
        },
      })
    }

    // Creative title animation: wave-in + shimmer (robust to pinning)
    const titles = gsap.utils.toArray('.title:not(.no-title-effects)') as unknown[] as HTMLElement[]
    titles.forEach((title) => {
      // Skip if already processed
      if (title.dataset.animated === 'true') return
      const originalText = title.textContent || ''
      title.innerHTML = ''
      const wrapper = document.createElement('span')
      wrapper.className = 'inline-block relative'
      // Build gradient shimmer underline
      const shimmer = document.createElement('span')
      shimmer.className = 'absolute left-0 -bottom-1 h-[2px] w-full'
      shimmer.setAttribute(
        'style',
        'background: linear-gradient(90deg, color-mix(in oklab, var(--color-purple, #7D53FF) 20%, transparent) 0%, var(--color-purple, #7D53FF) 50%, color-mix(in oklab, var(--color-purple, #7D53FF) 20%, transparent) 100%); background-size: 200% 100%;'
      )

      // Wrap each character
      const letterNodes: HTMLElement[] = []
      for (const ch of originalText) {
        const span = document.createElement('span')
        span.textContent = ch
        span.className = 'inline-block will-change-transform'
        wrapper.appendChild(span)
        letterNodes.push(span)
      }
      title.appendChild(wrapper)
      title.appendChild(shimmer)
      title.dataset.animated = 'true'

      // Initial state
      gsap.set(letterNodes, { yPercent: 30, opacity: 0, rotateX: -60, transformPerspective: 600 })
      gsap.set(shimmer, { backgroundPositionX: '0%' })

      // Trigger when title approaches viewport (works with pinned sections)
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(letterNodes, {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: { each: 0.035, from: 'start' },
          })
          gsap.to(shimmer, {
            backgroundPositionX: '200%',
            duration: 2.4,
            ease: 'none',
            repeat: 1,
            yoyo: true,
          })
        },
      })

      // If already in view on load, animate immediately
      const rect = (title as HTMLElement).getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.8) {
        gsap.to(letterNodes, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.035, from: 'start' },
        })
        gsap.to(shimmer, {
          backgroundPositionX: '200%',
          duration: 2.4,
          ease: 'none',
          repeat: 1,
          yoyo: true,
        })
      }
    })

    // Forcefully ensure titles opted-out from effects are fully opaque and clean
    const fixedTitles = gsap.utils.toArray('.title.no-title-effects') as unknown[] as HTMLElement[]
    fixedTitles.forEach((t: HTMLElement) => {
      gsap.set(t, { opacity: 1, clearProps: 'opacity,transform' })
    })

    // Counters animation for stats section
    const counters = gsap.utils.toArray('[data-counter]') as unknown[] as HTMLElement[]
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

    // Blog section animations
    const blogSection =
      blogSectionEl.value ||
      (document.querySelector('.stack-section:nth-last-child(2)') as HTMLElement | null)
    if (blogSection) {
      const blogCards = blogSection.querySelectorAll('.bg-white')
      const blogTabs = blogSection.querySelectorAll('button')

      gsap.set(blogCards, { y: 50, opacity: 0, scale: 0.9 })
      gsap.set(blogTabs, { y: 30, opacity: 0 })

      ScrollTrigger.create({
        trigger: blogSection,
        start: 'top center',
        onEnter: () => {
          gsap.to(blogTabs, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
          })
          gsap.to(blogCards, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            delay: 0.3,
          })
        },
        onLeaveBack: () => {
          gsap.set(blogCards, { y: 50, opacity: 0, scale: 0.9 })
          gsap.set(blogTabs, { y: 30, opacity: 0 })
        },
      })

      // Add hover animations for blog cards
      blogCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      })
    }

    // Contact section animations
    const contactSection = document.getElementById('contact-section')
    if (contactSection) {
      // Animate contact title
      gsap.fromTo(
        '.contact-title',
        {
          opacity: 0,
          y: -30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Animate contact container
      gsap.fromTo(
        '.contact-container',
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Animate contact card with stagger
      gsap.fromTo(
        '.contact-card',
        {
          opacity: 0,
          y: 60,
          rotationY: 5,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Animate form elements with stagger
      const formElements = [
        '.contact-form-title',
        '.contact-form-subtitle',
        '.contact-input-wrapper',
        '.contact-button-wrapper',
        '.contact-privacy',
      ]

      formElements.forEach((selector, index) => {
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            y: 30,
            x: index % 2 === 0 ? -20 : 20,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#contact-section',
              start: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Animate decorative elements
      gsap.fromTo(
        '.contact-decoration',
        {
          opacity: 0,
          scale: 0,
          rotation: 180,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: 'elastic.out(1, 0.3)',
          scrollTrigger: {
            trigger: '#contact-section',
            start: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Add floating animation to decorative elements
      gsap.to('.contact-decoration', {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      })

      // Title glow animation
      gsap.to('.contact-title', {
        filter: 'drop-shadow(0 0 20px rgba(125, 83, 255, 0.5))',
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Card shimmer effect on hover
      const contactCard = contactCardEl.value || document.querySelector('.contact-card')
      if (contactCard) {
        contactCard.addEventListener('mouseenter', () => {
          gsap.to(contactCard, {
            '--shimmer-position': '100%',
            duration: 0.5,
            ease: 'power2.out',
          })
        })

        contactCard.addEventListener('mouseleave', () => {
          gsap.to(contactCard, {
            '--shimmer-position': '-100%',
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      }

      // Input focus animations
      const contactInputs = (contactCardEl.value || document).querySelectorAll('.contact-input')
      contactInputs.forEach((input) => {
        input.addEventListener('focus', () => {
          gsap.to(input, {
            y: -2,
            boxShadow: '0 10px 25px -5px rgba(0, 223, 130, 0.3)',
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        input.addEventListener('blur', () => {
          gsap.to(input, {
            y: 0,
            boxShadow: '0 0 0 rgba(0, 223, 130, 0)',
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      })

      // Button hover animations
      const contactButton = (contactCardEl.value || document).querySelector('.contact-button')
      const buttonIcon = (contactCardEl.value || document).querySelector('.button-icon')

      if (contactButton) {
        contactButton.addEventListener('mouseenter', () => {
          gsap.to(contactButton, {
            y: -2,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          })

          gsap.to(buttonIcon, {
            x: 5,
            duration: 0.3,
            ease: 'power2.out',
          })

          // Button shimmer effect
          gsap.to(contactButton, {
            '--button-shimmer': '100%',
            duration: 0.5,
            ease: 'power2.out',
          })
        })

        contactButton.addEventListener('mouseleave', () => {
          gsap.to(contactButton, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })

          gsap.to(buttonIcon, {
            x: 0,
            duration: 0.3,
            ease: 'power2.out',
          })

          gsap.to(contactButton, {
            '--button-shimmer': '-100%',
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      }

      // Checkbox animations
      const contactCheckbox = (contactFormEl.value || document).querySelector(
        '.contact-checkbox'
      ) as HTMLInputElement
      if (contactCheckbox) {
        contactCheckbox.addEventListener('change', () => {
          if (contactCheckbox.checked) {
            gsap.to(contactCheckbox, {
              backgroundColor: 'var(--color-accent)',
              borderColor: 'var(--color-accent)',
              scale: 1.1,
              duration: 0.3,
              ease: 'back.out(1.7)',
              onComplete: () => {
                gsap.to(contactCheckbox, {
                  scale: 1,
                  duration: 0.2,
                  ease: 'power2.out',
                })
              },
            })
          } else {
            gsap.to(contactCheckbox, {
              backgroundColor: 'transparent',
              borderColor: 'rgba(0, 223, 130, 0.3)',
              scale: 0.9,
              duration: 0.2,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(contactCheckbox, {
                  scale: 1,
                  duration: 0.2,
                  ease: 'power2.out',
                })
              },
            })
          }
        })
      }

      // Form submission animation
      const contactForm = contactFormEl.value || document.querySelector('.contact-form')
      if (contactForm) {
        contactForm.addEventListener('submit', () => {
          // Animate form elements on submit
          gsap.to('.contact-input', {
            scale: 0.98,
            duration: 0.1,
            ease: 'power2.out',
            stagger: 0.05,
            yoyo: true,
            repeat: 1,
          })

          gsap.to('.contact-button', {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          })
        })
      }
    }
  },
})

// cleanup handled in useStackScroll

// Form data for contact section
const formData = ref({
  name: '',
  phone: '',
  email: '',
  privacyAccepted: false,
})

const submitForm = () => {
  if (!formData.value.privacyAccepted) {
    alert('Please accept the Privacy Policy')
    return
  }

  // Here you can add your form submission logic
  console.log('Form submitted:', formData.value)

  // Reset form
  formData.value = {
    name: '',
    phone: '',
    email: '',
    privacyAccepted: false,
  }

  alert('Thank you! Your request has been sent.')
}
</script>

<template>
  <div id="stack" class="relative" ref="stackRoot">
    <section
      class="stack-section no-scrollbar h-screen flex items-center justify-center rounded-t-3xl py-[5rem]"
    >
      <h1 class="title text-5xl md:text-7xl font-black tracking-tight">Main</h1>
    </section>

    <!-- what we do -->
    <section
      ref="whatWeDoEl"
      class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[12rem] md:px-[6rem] px-[1rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100"
      >
        Что мы делаем
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl w-full mb-8">
        <template v-if="whatWeDoVisible">
          <WhatWeDoCard
            v-for="card in whatWeDoCards"
            :key="card.title"
            :title="card.title"
            :description="card.description"
            :iconPath="card.icon"
            :wrapperClass="card.wrapperClass"
            @click="handleCardClick(card.title)"
          />
          <WhatWeDoCta
            text="Мы предлагаем полный спектр готовых цифровых решений для вашего бизнеса"
            @click="router.push('/services')"
          />
        </template>
      </div>

      <!-- Learn More Button -->
      <button
        class="mt-6 text-[0.8rem] md:text-sm bg-gray-800 text-white py-3 px-[5rem] rounded-[3rem] font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 hover:ring-[var(--color-accent)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        @click="router.push('/services')"
      >
        Узнать больше
      </button>
    </section>

    <!-- portfolio -->
    <section
      ref="portfolioEl"
      class="stack-section no-scrollbar bg-gradient-to-br bg-[var(--color-purple))] h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
    >
      <CasesPage />
    </section>

    <!-- Our Advantages -->
    <section
      id="advantages"
      class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100 text-center"
      >
        Наши преимущества
      </h2>

      <div class="w-full grid grid-cols-1 md:grid-cols-2 items-stretch">
        <AdvantageCard
          v-for="(a, i) in advantages"
          :key="a.title + i"
          :title="a.title"
          :description="a.description"
          :index="i"
          :isCentral="i === 2 || i === 3"
          class="adv-card"
        />
      </div>

      <div class="mt-8 flex justify-center">
        <button
          class="mt-6 text-[0.8rem] md:text-sm bg-gray-800 text-white py-3 px-[5rem] rounded-[3rem] font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:ring-2 hover:ring-[var(--color-accent)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          Связаться с нам
        </button>
      </div>
    </section>

    <!-- about us -->
    <section
      id="stats-section"
      class="stack-section no-scrollbar bg-bg h-screen flex flex-col items-center justify-start rounded-t-3xl lg:py-[5rem] py-[2rem] lg:px-[12rem] md:px-[6rem] px-[1rem] overflow-y-auto"
    >
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-100"
      >
        О нас
      </h2>

      <div class="max-w-6xl w-full">
        <div class="text-center mb-12">
          <h3 class="text-sm tracking-widest font-semibold text-[var(--color-accent)] mb-8">
            КЛЮЧЕВЫЕ ЦИФРЫ
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          <div
            v-for="(s, i) in stats"
            :key="i"
            class="stats-card group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-[var(--color-accent)]/10"
          >
            <div class="text-center">
              <div
                class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-white mb-3"
              >
                <span data-counter data-plus :data-target="s.value">0</span>
              </div>
              <div class="text-lg md:text-xl font-semibold text-white mb-1">{{ s.label }}</div>
              <div v-if="s.sublabel" class="text-white/70 text-sm">{{ s.sublabel }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- blog -->
    <section
      class="stack-section no-scrollbar bg-gradient-to-br from-gray-50 to-gray-100 h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
    >
      <BlogSection @postClick="handleBlogPostClick" />
    </section>

    <!-- contact -->
    <section
      id="contact-section"
      class="stack-section no-scrollbar bg-gradient-to-br bg-[var(--color-purple))] h-screen flex flex-col items-center justify-start rounded-t-3xl py-[5rem] px-[12rem] overflow-y-auto"
    >
      <!-- Заголовок с анимацией -->
      <h2
        class="title no-title-effects text-3xl md:text-4xl font-black tracking-tight mb-8 text-[var(--color-accent)] opacity-0"
      >
        Контакты
      </h2>

      <!-- Основной контейнер формы -->
      <div class="contact-container w-full max-w-5xl opacity-0">
        <!-- Декоративные элементы -->
        <div
          class="contact-decoration absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-purple)]/20 rounded-full blur-xl"
        ></div>
        <div
          class="contact-decoration absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[var(--color-purple)]/20 to-[var(--color-accent)]/20 rounded-full blur-xl"
        ></div>

        <!-- Карточка формы -->
        <div
          class="contact-card relative bg-gradient-to-br from-[var(--color-bg)]/90 to-[var(--color-border)]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-[var(--color-accent)]/30 shadow-2xl shadow-[var(--color-accent)]/10"
        >
          <!-- Заголовок формы -->
          <div class="contact-header mb-8">
            <h3
              class="contact-form-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0"
            >
              Become our new partner
            </h3>
            <p
              class="contact-form-subtitle text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl opacity-0"
            >
              Leave a request for cooperation right now and get project price today
            </p>
          </div>

          <!-- Форма -->
          <form @submit.prevent="submitForm" class="contact-form space-y-6">
            <!-- Поля ввода -->
            <div class="contact-inputs grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div class="contact-input-wrapper opacity-0">
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="Your name"
                  required
                  class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-gray-800 placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                />
              </div>
              <div class="contact-input-wrapper opacity-0">
                <input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="Phone"
                  required
                  class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-white/5 backdrop-blur-sm text-gray-800 placeholder-white/60 focus:border-[var(--color-accent)] focus:bg-white/10 focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-white/8"
                />
              </div>
              <div class="contact-input-wrapper opacity-0">
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="E-mail"
                  required
                  class="contact-input w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-accent)]/20 bg-transparent text-white placeholder-white/60 focus:border-[var(--color-accent)] focus:outline-none transition-all duration-300 hover:border-[var(--color-accent)]/40"
                />
              </div>
              <div class="contact-button-wrapper opacity-0">
                <button
                  type="submit"
                  class="contact-button w-full px-6 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-bg)] rounded-2xl font-bold text-lg transition-all duration-300 hover:from-[var(--color-accent)]/90 hover:to-[var(--color-accent)]/70 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_color-mix(in_oklab,var(--color-accent)_50%,transparent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/30 active:translate-y-0"
                >
                  <span class="button-text">Send</span>
                  <span class="button-icon ml-2">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>

  <!-- Project Modal -->
  <PortfolioModal :showModal="showModal" :selectedProject="selectedProject" @close="closeModal" />
</template>

<style scoped>
/* Portfolio specific styles - matching what we do style */
.portfolio-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.portfolio-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px -12px rgba(0, 223, 130, 0.3);
}

/* Filter button animations - matching what we do style */
.filter-button {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.filter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 223, 130, 0.2), transparent);
  transition: left 0.5s;
}

.filter-button:hover::before {
  left: 100%;
}

/* Tech tag animations - matching what we do style */
.tech-tag {
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 223, 130, 0.2);
  background-color: rgba(255, 255, 255, 0.2);
}

/* Status badge animations */
.status-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Loading state for cards */
.portfolio-card.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .portfolio-card {
    margin-bottom: 1rem;
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}

/* Dark mode support - matching what we do style */
@media (prefers-color-scheme: dark) {
  .portfolio-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(3, 98, 76, 0.6);
  }

  .portfolio-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: var(--color-accent);
  }

  .portfolio-card h3 {
    color: #ffffff;
  }

  .portfolio-card p {
    color: rgba(255, 255, 255, 0.7);
  }

  .filter-button {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(3, 98, 76, 0.6);
  }

  .tech-tag {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }
}

/* Stats cards styling - matching what we do style */
.stats-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.stats-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px -12px rgba(0, 223, 130, 0.3);
}

/* Contact section animations and styles */
.contact-title {
  background: linear-gradient(90deg, var(--color-accent), var(--color-purple));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* GSAP will handle title glow animation */
}

.contact-card {
  position: relative;
  overflow: hidden;
}

.contact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--shimmer-position, -100%);
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 223, 130, 0.1), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.contact-input {
  position: relative;
  /* GSAP will handle input animations */
}

.contact-button {
  position: relative;
  overflow: hidden;
}

.contact-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--button-shimmer, -100%);
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.button-icon {
  display: inline-block;
}

/* GSAP handles all contact animations */

/* Responsive contact animations */
@media (max-width: 768px) {
  .contact-card {
    margin: 1rem;
    padding: 1.5rem;
  }

  .contact-inputs {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-button {
    margin-top: 1rem;
  }
}
</style>
