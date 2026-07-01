import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import type { Workspace } from '../types'

interface WorkspaceDeleteDialogProps {
  workspace: Workspace | null
  onClose: () => void
  onConfirm: () => void
}

export function WorkspaceDeleteDialog({ workspace, onClose, onConfirm }: WorkspaceDeleteDialogProps) {
  return (
    <ConfirmDialog
      isOpen={!!workspace}
      title="Delete Workspace"
      message={`Are you sure you want to delete this workspace "${workspace?.name}"? This action cannot be undone.`}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
