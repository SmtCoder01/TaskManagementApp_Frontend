export enum WorkspaceRole {
  Member = 0,
  Admin = 1,
}

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
