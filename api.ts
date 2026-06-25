export interface ErrorDetail {
  code: string
  message: string
}

export interface BaseResponse<T> {
  success: boolean
  statusCode: number
  data: T | null
  error: ErrorDetail | null
  fieldErrors: Record<string, string[]> | null
  traceId: string | null
  timestamp: string
}

export interface PaginationResponse<T> {
  items: T[]
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrevious: boolean
}
