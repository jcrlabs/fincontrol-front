export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
}

export interface ApiError {
  error: string
  message?: string
}

export interface DateRange {
  from: string // ISO date
  to: string   // ISO date
}
