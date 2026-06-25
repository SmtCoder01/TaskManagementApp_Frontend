import type { BaseResponse } from '@/types/api'

export class ApiError extends Error {
  code: string
  statusCode: number
  fieldErrors: Record<string, string[]> | null

  constructor(
    message: string,
    code: string,
    statusCode: number,
    fieldErrors: Record<string, string[]> | null = null,
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.fieldErrors = fieldErrors
  }
}

export function parseResponse<T>(body: BaseResponse<T>): T {
  if (!body.success) {
    throw new ApiError(
      body.error?.message ?? 'Beklenmeyen bir hata oluştu.',
      body.error?.code ?? 'UNEXPECTED_ERROR',
      body.statusCode,
      body.fieldErrors,
    )
  }

  return body.data as T
}
