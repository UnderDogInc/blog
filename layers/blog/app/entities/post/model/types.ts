import type { ApiListResponse } from '#shared/types/api'

interface PostCategory {
  id: number
  name: string
  key: string
}

interface Post {
  id: number
  title: string
  preview: string
  description: string
  metaTitle?: string
  content: string
  ctaButton?: string
  categoryId: number
  category?: PostCategory
  createdAt?: string
  updatedAt?: string
  recommendedPostIds?: number[]
}

type PostResponse = ApiListResponse<Post>

export type { Post, PostCategory, PostResponse }
