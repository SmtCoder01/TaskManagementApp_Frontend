import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { WorkspaceMember } from '../members/types'
import type { User, UserSearchParams } from './types'
import { userToOption } from './types'
import type { UserOption } from './types'

function memberToOption(member: WorkspaceMember): UserOption {
  return {
    id: member.userId,
    name: member.name,
    lastName: member.lastName,
    email: member.email,
  }
}

function filterFallbackMembers(members: WorkspaceMember[], search?: string): UserOption[] {
  const options = members.map(memberToOption)

  if (!search?.trim()) {
    return options
  }

  const query = search.trim().toLowerCase()
  return options.filter((user) => {
    const fullName = `${user.name} ${user.lastName}`.toLowerCase()
    return (
      fullName.includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
    )
  })
}

export async function searchUsers(
  params: UserSearchParams,
  fallbackMembers: WorkspaceMember[] = [],
): Promise<UserOption[]> {
  try {
    const { data } = await apiClient.get('/users', {
      params: {
        search: params.search || undefined,
        workspaceId: params.workspaceId,
        limit: params.limit ?? 10,
      },
    })

    const result = parseResponse<PaginationResponse<User>>(data)
    return result.items.map(userToOption)
  } catch {
    return filterFallbackMembers(fallbackMembers, params.search)
  }
}
