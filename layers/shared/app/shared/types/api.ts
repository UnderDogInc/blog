export interface ApiErrorPayload {
  statusCode?: number
  message: string
  details?: unknown
}

export interface ApiEnvelope<T> {
  data: T
  error: ApiErrorPayload | null
}

export interface ApiListData<T> {
  items: T[]
  total: number
  totalPages: number
}

export type ApiListResponse<T> = ApiEnvelope<ApiListData<T>>
