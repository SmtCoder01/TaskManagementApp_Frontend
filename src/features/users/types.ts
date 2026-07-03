import type { User } from '../../types/api'

export type { User }

export interface UserSearchParams {
  search?: string
  workspaceId?: number
  limit?: number
}

export interface UserOption {
  id: number
  name: string
  lastName: string
  email: string
}

export function userToOption(user: User): UserOption {
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  }
}
