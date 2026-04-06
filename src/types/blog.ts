export interface BlogPostContentSection {
    heading: string
    text?: string
    table?: {
        columns: string[]
        rows: string[][]
    }
}

export interface BlogPost {
    id: number
    image: string
    title: string
    category: string
    additionalCategories?: string[]
    slug: string
    fullTitle?: string
    summary?: string
    content?: BlogPostContentSection[]
}

export type RelatedPost = Pick<BlogPost, 'id' | 'image' | 'title' | 'category'>









