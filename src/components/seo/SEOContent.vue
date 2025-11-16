<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useContentStore } from '@/stores/content'

const route = useRoute()
const contentStore = useContentStore()

const h1 = computed(() => (route.meta.h1 as string) || '')
const h2Outline = computed(() => (route.meta.h2Outline as string[]) || [])
const faq = computed(() => (route.meta.faq as string[]) || [])

// Get section content from store
const sectionContent = computed(() => {
  const sectionId = h2Outline.value[0]?.toLowerCase().replace(/\s+/g, '-') || ''
  return sectionId ? contentStore.getSectionContent(route.path, sectionId) : null
})

// Get FAQ answers from store or props
const faqAnswers = computed(() => {
  return contentStore.getFAQAnswers(route.path)
})

// Generate FAQPage JSON-LD schema with real answers
const faqSchema = computed(() => {
  if (!faq.value.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.value.map((question) => {
      const answer = contentStore.getFAQAnswer(route.path, question) || ''
      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      }
    }),
  }
})

// Inject FAQ schema into head
watchEffect(() => {
  if (faqSchema.value) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(faqSchema.value),
          key: 'faq-schema',
        },
      ],
    })
  }
})
</script>

<template>
  <div v-if="h1 || h2Outline.length || faq.length" class="seo-content">
    <!-- <h1 v-if="h1" class="seo-h1">{{ h1 }}</h1> -->

    <div v-if="h2Outline.length" class="seo-sections">
      <section
        v-for="section in h2Outline"
        :key="section"
        :id="section.toLowerCase().replace(/\s+/g, '-')"
        class="seo-section"
      >
        <h2 class="seo-h2">{{ section }}</h2>
        <!-- Content will be added here -->
        <slot :name="`section-${section.toLowerCase().replace(/\s+/g, '-')}`" :section="section">
          <div v-if="sectionContent" v-html="sectionContent.html"></div>
          <p v-else class="text-muted">Контент для секции "{{ section }}" будет добавлен позже.</p>
        </slot>
      </section>
    </div>
<!--
    <div v-if="faq.length" class="seo-faq">
      <h2 class="seo-faq-title">Часто задаваемые вопросы</h2>
      <div v-for="(question, idx) in faq" :key="idx" class="seo-faq-item">
        <h3 class="seo-faq-question">{{ question }}</h3>
        <slot :name="`faq-${idx}`" :question="question">
          <p class="text-muted">Ответ на вопрос будет добавлен позже.</p>
        </slot>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.seo-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.seo-h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-bg);
}

.seo-sections {
  margin-top: 3rem;
}

.seo-section {
  margin-bottom: 3rem;
}

.seo-h2 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-bg);
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.seo-faq {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-border);
}

.seo-faq-title {
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.seo-faq-item {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.seo-faq-question {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .seo-h1 {
    font-size: 2rem;
  }

  .seo-h2 {
    font-size: 1.5rem;
  }

  .seo-faq-title {
    font-size: 1.5rem;
  }

  .seo-faq-question {
    font-size: 1.125rem;
  }
}
</style>

