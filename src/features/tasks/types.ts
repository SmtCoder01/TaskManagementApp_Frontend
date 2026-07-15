export const TaskStatus = {
  ToDo: 0,
  InProgress: 1,
  Done: 2,
  Cancelled: 3,
  Blocked: 4,
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

export const TaskPriority = {
  Low: 0,
  Medium: 1,
  High: 2,
} as const

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

export interface TaskListItem {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  projectId: number
  assigneeId?: number
  assigneeName?: string
  createdById: number
  createdByName: string
  createdDate: string
  updatedDate: string
}

export interface CreateTaskInput {
  projectId: number
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string | null
  assigneeId?: number | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  assigneeId?: number | null
  unassign?: boolean
}

export interface TaskListParams {
  pageNumber?: number
  pageSize?: number
  status?: TaskStatus
  assigneeId?: number
  projectId?: number
  q?: string
}
