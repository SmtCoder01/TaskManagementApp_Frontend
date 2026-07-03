export const WorkspaceRole = {
  Member: 0,
  Admin: 1,
} as const

export type WorkspaceRole = typeof WorkspaceRole[keyof typeof WorkspaceRole]

export interface WorkspaceMember {
  userId: number
  name: string
  lastName: string
  email: string
  role: WorkspaceRole
}

export interface AddWorkspaceMemberInput {
  email: string
  role: WorkspaceRole
}
