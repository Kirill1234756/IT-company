export interface BlogPostContentSection {
    heading: string
    text: string
}

export interface BlogPost {
    id: number
    image: string
    title: string
    date: string
    readTime: string
    category: string
    fullTitle?: string
    summary?: string
    content?: BlogPostContentSection[]
    views?: number
    author?: string
}

export type RelatedPost = Pick<BlogPost, 'id' | 'image' | 'title' | 'date' | 'readTime' | 'category'>


