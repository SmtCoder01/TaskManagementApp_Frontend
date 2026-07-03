import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { projectKeys } from '../../lib/queryKeys'
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from './api'
import type { Project, ProjectCreateInput, ProjectUpdateInput } from './types'

function findProjectInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: number,
): Project | undefined {
  const lists = queryClient.getQueriesData<{ items?: Project[] }>({
    queryKey: projectKeys.lists(),
  })

  for (const [, data] of lists) {
    const found = data?.items?.find((project) => Number(project.id) === projectId)
    if (found) return found
  }

  return queryClient.getQueryData<Project>(projectKeys.detail(projectId))
}

export function useProjects(workspaceId: number, page: number, limit = 6) {
  return useQuery({
    queryKey: [...projectKeys.list(workspaceId), { page, limit }],
    queryFn: () => getProjects(workspaceId, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!workspaceId,
  })
}

export function useProject(projectId: number | undefined, workspaceId?: number) {
  const queryClient = useQueryClient()
  const numericProjectId = projectId ? Number(projectId) : undefined

  return useQuery({
    queryKey: numericProjectId ? projectKeys.detail(numericProjectId) : [],
    queryFn: () =>
      getProject(numericProjectId!, () => findProjectInCache(queryClient, numericProjectId!)),
    enabled: !!numericProjectId,
    initialData: () => {
      if (!numericProjectId) return undefined
      const cached = findProjectInCache(queryClient, numericProjectId)
      if (cached) return cached
      if (workspaceId) {
        const listData = queryClient.getQueryData<{ items?: Project[] }>(
          [...projectKeys.list(workspaceId), { page: 1, limit: 6 }],
        )
        return listData?.items?.find((project) => Number(project.id) === numericProjectId)
      }
      return undefined
    },
  })
}

export function useCreateProject(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProjectCreateInput) => createProject(workspaceId, data),
    onSuccess: (createdProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
      queryClient.setQueryData(projectKeys.detail(createdProject.id), createdProject)
    },
  })
}

export function useUpdateProject(projectId: number, workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProjectUpdateInput) =>
      updateProject(projectId, data, (payload) => {
        const current = findProjectInCache(queryClient, projectId)
        if (!current) {
          throw new Error('Project not found in cache')
        }

        const updatedProject: Project = {
          ...current,
          ...payload,
          description: payload.description || undefined,
        }

        queryClient.setQueryData(projectKeys.detail(projectId), updatedProject)
        queryClient.setQueriesData<{ items?: Project[]; totalItems?: number }>(
          { queryKey: projectKeys.list(workspaceId) },
          (old) => {
            if (!old?.items) return old
            return {
              ...old,
              items: old.items.map((project) =>
                Number(project.id) === projectId ? updatedProject : project,
              ),
            }
          },
        )

        return updatedProject
      }),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(projectId), updatedProject)
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}

export function useDeleteProject(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: number) =>
      deleteProject(projectId, () => {
        queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) })
        queryClient.setQueriesData<{ items?: Project[]; totalItems?: number; totalPages?: number }>(
          { queryKey: projectKeys.list(workspaceId) },
          (old) => {
            if (!old?.items) return old
            const items = old.items.filter((project) => Number(project.id) !== projectId)
            return {
              ...old,
              items,
              totalItems: Math.max(0, (old.totalItems ?? items.length) - 1),
            }
          },
        )
      }),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}
