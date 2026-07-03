import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import type { Project } from '../types'

interface ProjectDeleteDialogProps {
  project: Project | null
  onClose: () => void
  onConfirm: () => void
}

export function ProjectDeleteDialog({ project, onClose, onConfirm }: ProjectDeleteDialogProps) {
  return (
    <ConfirmDialog
      isOpen={!!project}
      title="Delete Project"
      message={`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
