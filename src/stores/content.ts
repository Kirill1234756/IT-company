import { defineStore } from 'pinia'

export interface SectionContent {
  sectionId: string
  content: string
  html?: string
}

export interface FAQAnswer {
  question: string
  answer: string
}

export const useContentStore = defineStore('content', {
  state: () => ({
    sections: {} as Record<string, SectionContent>,
    faqAnswers: {} as Record<string, FAQAnswer[]>,
  }),

  getters: {
    getSectionContent: (state) => {
      return (url: string, sectionId: string): SectionContent | null => {
        const key = `${url}#${sectionId}`
        return state.sections[key] || null
      }
    },

    getFAQAnswers: (state) => {
      return (url: string): FAQAnswer[] => {
        return state.faqAnswers[url] || []
      }
    },

    getFAQAnswer: (state) => {
      return (url: string, question: string): string | null => {
        const answers = state.faqAnswers[url] || []
        const answer = answers.find((a) => a.question === question)
        return answer?.answer || null
      }
    },
  },

  actions: {
    setSectionContent(url: string, sectionId: string, content: SectionContent) {
      const key = `${url}#${sectionId}`
      this.sections[key] = content
    },

    setFAQAnswers(url: string, answers: FAQAnswer[]) {
      this.faqAnswers[url] = answers
    },

    addFAQAnswer(url: string, question: string, answer: string) {
      if (!this.faqAnswers[url]) {
        this.faqAnswers[url] = []
      }
      const answers = this.faqAnswers[url]
      if (!answers) return

      const existingIndex = answers.findIndex((a) => a.question === question)
      if (existingIndex >= 0 && answers[existingIndex]) {
        answers[existingIndex].answer = answer
      } else {
        answers.push({ question, answer })
      }
    },

    // Метод для загрузки контента из API или файлов (можно расширить)
    async loadContentForPage(url: string) {
      // TODO: Реализовать загрузку контента из API или статических файлов
      // Пока возвращаем пустой объект
      return {}
    },
  },
})
