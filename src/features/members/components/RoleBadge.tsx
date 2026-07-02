import { Badge } from '@/components/ui/Badge'
import { WorkspaceRole } from '../types'

interface RoleBadgeProps {
  role: WorkspaceRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === WorkspaceRole.Admin) {
    return <Badge variant="warning">Admin</Badge>
  }
  return <Badge variant="secondary">Member</Badge>
}
