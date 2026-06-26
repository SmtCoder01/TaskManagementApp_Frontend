import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { User } from '../../types/api'
import type { LoginInput, RegisterInput } from './schema'

export async function register(payload: RegisterInput): Promise<User> {
  const { data } = await apiClient.post('/auth/register', payload)
  return parseResponse<User>(data)
}

export async function login(payload: LoginInput): Promise<{ token: string }> {
  const { data } = await apiClient.post('/auth/login', payload)
  return parseResponse<{ token: string }>(data)
}

export async function me(): Promise<User> {
  const { data } = await apiClient.get('/auth/me')
  return parseResponse<User>(data)
}
