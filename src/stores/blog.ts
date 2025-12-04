import { defineStore } from 'pinia'
import { blogPosts, blogTabs } from './blog.data'
import type { BlogPost } from '../types/blog'

// Performance-optimized blog store with memoization
export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: blogPosts,
    tabs: blogTabs,
    // Cache for frequently accessed data
    _cache: new Map<string, any>()
  }),

  getters: {
    // O(1) maps for fast lookups with caching
    postsBySlug: (state) => {
      const cacheKey = 'postsBySlug'
      if (state._cache.has(cacheKey)) {
        return state._cache.get(cacheKey)
      }

      const result = state.posts.reduce<Record<string, BlogPost>>((acc, post) => {
        acc[post.slug] = post
        return acc
      }, {})

      state._cache.set(cacheKey, result)
      return result
    },

    postsById: (state) => {
      const cacheKey = 'postsById'
      if (state._cache.has(cacheKey)) {
        return state._cache.get(cacheKey)
      }

      const result = state.posts.reduce<Record<number, BlogPost>>((acc, post) => {
        acc[post.id] = post
        return acc
      }, {})

      state._cache.set(cacheKey, result)
      return result
    },

    postsByCategory: (state) => {
      const cacheKey = 'postsByCategory'
      if (state._cache.has(cacheKey)) {
        return state._cache.get(cacheKey)
      }

      const map = new Map<string, BlogPost[]>()
      for (const post of state.posts) {
        const arr = map.get(post.category) || []
        arr.push(post)
        map.set(post.category, arr)
      }

      state._cache.set(cacheKey, map)
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
    // Cache management
    clearCache() {
      this._cache.clear()
    },

    // Performance monitoring
    getCacheStats() {
      return {
        size: this._cache.size,
        keys: Array.from(this._cache.keys())
      }
    }
  }
})
