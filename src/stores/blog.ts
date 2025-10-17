import { defineStore } from 'pinia'
import { blogPosts, blogTabs } from './blog.data'
import type { BlogPost } from '../types/blog'

export const useBlogStore = defineStore('blog', {
    state: () => ({
        posts: blogPosts,
        tabs: blogTabs
    }),

    getters: {
        // O(1) maps for fast lookups
        postsBySlug: (state) => {
            return state.posts.reduce<Record<string, BlogPost>>((acc, post) => {
                acc[post.slug] = post
                return acc
            }, {})
        },
        postsById: (state) => {
            return state.posts.reduce<Record<number, BlogPost>>((acc, post) => {
                acc[post.id] = post
                return acc
            }, {})
        },
        postsByCategory: (state) => {
            const map = new Map<string, BlogPost[]>()
            for (const post of state.posts) {
                const arr = map.get(post.category) || []
                arr.push(post)
                map.set(post.category, arr)
            }
            return map
        },

        // Public API using maps (no array searching)
        getPostBySlug(this: { postsBySlug: Record<string, BlogPost> }) {
            return (slug: string): BlogPost | undefined => this.postsBySlug[slug]
        },

        getPostsByCategory(this: { postsByCategory: Map<string, BlogPost[]>; posts: BlogPost[] }) {
            return (category: string): BlogPost[] => {
                if (category === 'all') return this.posts
                return this.postsByCategory.get(category) || []
            }
        },

        getRelatedPosts(this: { postsById: Record<number, BlogPost>; postsByCategory: Map<string, BlogPost[]> }) {
            return (currentPostId: number): BlogPost[] => {
                const currentPost = this.postsById[currentPostId]
                if (!currentPost) return []
                const sameCategory = this.postsByCategory.get(currentPost.category) || []
                return sameCategory.filter(post => post.id !== currentPostId).slice(0, 2)
            }
        }
    },

    actions: {
        // Дополнительные действия если понадобятся
    }
})
