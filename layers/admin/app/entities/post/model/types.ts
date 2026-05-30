export interface PostSelectItem {
  id: number
  title: string
}

export interface PostDetails {
  id: number
  title: string
  preview: string
  description: string
  metaTitle: string | null
  content: string
  ctaButton: string | null
  categoryId: number
  recommendedPosts?: Array<{ id: number }>
}

export interface PostPayload {
  title: string
  preview: string
  description: string
  metaTitle: string
  content: string
  ctaButton: string
  categoryId: number
  recommendedPostIds: number[]
}

export interface PostEditorOptions {
  mode: 'create' | 'edit'
  postId?: number
}
