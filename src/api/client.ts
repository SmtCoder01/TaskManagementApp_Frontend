import axios from 'axios'
import { ApiError } from './parseResponse'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const apiClient = axios.create({
  baseURL: API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors, specifically 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config.url?.includes('/auth/login')
      if (!isLoginRequest) {
        localStorage.removeItem('access_token')
        // Clear query cache and redirect
        window.location.href = '/login'
      }
    }

    if (error.response && error.response.data) {
      const data = error.response.data
      if (data.success === false) {
        return Promise.reject(
          new ApiError(
            data.error?.message ?? 'Beklenmeyen bir hata oluştu.',
            data.error?.code ?? 'UNEXPECTED_ERROR',
            data.statusCode ?? error.response.status,
            data.fieldErrors
          )
        )
      }
    }

    return Promise.reject(error)
  }
)
