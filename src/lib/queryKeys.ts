export type WorkspaceListFilters = {
  search?: string
}

export type ProjectListFilters = {
  workspaceId: number;
  search?: string;
}

export type TaskListFilters = {
  workspaceId?: number
  projectId?: number
  status?: string
  assigneeId?: number
  search?: string
}

export type UserListFilters = {
  workspaceId?: number
  search?: string
}

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  workspaces: {
    all: ['workspaces'] as const,
    lists: () => [...queryKeys.workspaces.all, 'list'] as const,
    list: (filters?: WorkspaceListFilters) =>
      [...queryKeys.workspaces.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.workspaces.all, 'detail'] as const,
    detail: (workspaceId: number) => [...queryKeys.workspaces.details(), workspaceId] as const,
    members: (workspaceId: number) =>
      [...queryKeys.workspaces.detail(workspaceId), 'members'] as const,
  },
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (workspaceId: number, filters?: Omit<ProjectListFilters, 'workspaceId'>) =>
      [...queryKeys.projects.lists(), { workspaceId, ...filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (projectId: number) => [...queryKeys.projects.details(), projectId] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (projectId?: number, filters?: Omit<TaskListFilters, 'projectId'>) =>
      [...queryKeys.tasks.lists(), { ...(projectId ? { projectId } : {}), ...filters }] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (taskId: number) => [...queryKeys.tasks.details(), taskId] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: UserListFilters) =>
      [...queryKeys.users.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (userId: number) => [...queryKeys.users.details(), userId] as const,
  },
} as const

export const authKeys = queryKeys.auth
export const workspaceKeys = queryKeys.workspaces
export const projectKeys = queryKeys.projects
export const taskKeys = queryKeys.tasks
export const userKeys = queryKeys.users
