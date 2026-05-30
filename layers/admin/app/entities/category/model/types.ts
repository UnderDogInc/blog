export interface Category {
  id: number
  name: string
  key: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface CategoryPayload {
  name: string
  key: string
}

export type CategoryUpdatePayload = Partial<CategoryPayload>
