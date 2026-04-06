export interface PackageIncludedBlock {
  title: string
  intro?: string
  items?: string[]
  result?: string
}

export interface PackageHighlight {
  icon?: string
  title: string
  text: string
}

export interface PackageDetail {
  slug: string
  title: string
  breadcrumbs: string[]
  tagline?: string
  subtitle?: string
  /** Усиление оффера под заголовком (например, срок запуска) */
  offerHighlight?: string
  /** Доп. результат / обещание до конца проекта */
  leadsDuringBuild?: string
  essenceTitle?: string
  /** Подзаголовок перед списком сути (по умолчанию в UI: «Идеально, если вы:») */
  essenceIntro?: string
  essenceBullets?: string[]
  essenceFootnote?: string
  highlights: PackageHighlight[]
  includesSectionTitle?: string
  includes: PackageIncludedBlock[]
  importantTitle?: string
  /** Текст перед списком «что важно понимать» */
  importantIntro?: string
  importantBullets?: string[]
  importantNote?: string
  mainValue?: string
  whyBestValueTitle?: string
  /** Подпись перед списком позиций (по умолчанию в UI: «Если делать по отдельности:») */
  whyBestValueIntro?: string
  whyBestValueItems?: string[]
  /** Короткий список последствий (например: дольше / дороже / сложнее) */
  whyBestValueConsequences?: string[]
  whyBestValueConsequencesLabel?: string
  whyBestValueFootnote?: string
  suitForTitle?: string
  suitForItems?: string[]
  insightTitle?: string
  insightText?: string
  /** Стратегический контекст (например, роль якорного пакета) */
  strategicMomentTitle?: string
  strategicMomentText?: string
  notForTitle?: string
  notForItems?: string[]
  notForCta?: string
  beforeAfter?: {
    beforeTitle?: string
    afterTitle?: string
    before: string[]
    after: string[]
  }
  metrics: {
    priceLabel?: string
    price: string
    secondaryLabel?: string
    secondaryValue?: string
  }
  originalPrice?: string
  savingsNote?: string
}
