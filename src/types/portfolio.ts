export interface PortfolioModal {
  id: number
  img: string
  card: Array<{
    id: number
    title: string
    description: string
  }>
  text?: Array<{
    id: number
    title: string
    description: string
  }>
}

export interface PortfolioProject {
  id: number
  title: string
  category: string
  // Основные поля (опциональные для проектов без детальной информации)
  description?: string
  bgColor?: string
  logoColor?: string
  logoText?: string
  technologies?: string[]
  link?: string
  image?: string
  year?: string
  status?: string
  // Модальные данные (опциональные)
  modalImg?: string
  modalCard?: Array<{
    id: number
    title: string
    description: string
  }>
  modalText?: Array<{
    id: number
    title: string
    description: string
  }>
}

export type FilterType = 'all' | 'ecommerce' | 'corporate' | 'landing' | 'promo' | 'mobile' | 'tech-support' | 'design' | 'marketing'
