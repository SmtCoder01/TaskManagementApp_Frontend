import { useQuery } from '@tanstack/react-query'
import { userKeys } from '../../lib/queryKeys'
import { searchUsers } from './api'
import type { UserSearchParams } from './types'
import type { WorkspaceMember } from '../members/types'

export function useUserSearch(
  params: UserSearchParams,
  fallbackMembers: WorkspaceMember[] = [],
  enabled = true,
) {
  return useQuery({
    queryKey: [...userKeys.list(params), { fallbackCount: fallbackMembers.length }],
    queryFn: () => searchUsers(params, fallbackMembers),
    enabled,
    staleTime: 30_000,
  })
}
