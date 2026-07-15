import { useState } from 'react'
import { Plus, Briefcase } from 'lucide-react'
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
} from '../hooks'
import { WorkspaceCard } from '../components/WorkspaceCard'
import { WorkspaceForm } from '../components/WorkspaceForm'
import { WorkspaceDeleteDialog } from '../components/WorkspaceDeleteDialog'
import type { Workspace } from '../types'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Pagination } from '../../../components/ui/Pagination'
import { EmptyState } from '../../../components/ui/EmptyState'
import { LoadingState } from '../../../components/ui/LoadingState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { showApiErrorToast } from '../../../utils/errorHandler'
import { toast } from 'sonner'

export function WorkspaceListPage() {
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null)

  const { data, isLoading, isError, refetch } = useWorkspaces(page)
  const createMutation = useCreateWorkspace()
  const deleteMutation = useDeleteWorkspace()

  const handleCreateWorkspace = async (formData: { name: string; description?: string }) => {
    await createMutation.mutateAsync(formData)
    setIsCreateOpen(false)
    toast.success('Workspace created successfully!')
  }

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return
    try {
      await deleteMutation.mutateAsync(workspaceToDelete.id)
      setWorkspaceToDelete(null)
      toast.success('Workspace deleted successfully!')
      // If we deleted the only item on the last page, go to previous page
      if (data?.items.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    } catch (err) {
      console.error(err)
      setWorkspaceToDelete(null)
      showApiErrorToast(err, 'Failed to delete workspace.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Workspaces</h1>
          <p className="text-sm text-slate-500">
            Create, manage, and collaborate across multiple teams and workspaces.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </Button>
      </div>

      {/* Error state */}
      {isError && (
        <ErrorState
          title="Çalışma alanları yüklenemedi"
          message="Çalışma alanlarını listelerken bir sorun oluştu. Lütfen tekrar deneyin."
          onRetry={() => refetch()}
        />
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <LoadingState layout="skeleton-cards" count={6} />
      )}

      {/* Data display */}
      {!isLoading && !isError && (
        <>
          {data && data.items.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.items.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.id}
                    workspace={workspace}
                    onDelete={setWorkspaceToDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center border-t border-slate-100 pt-6">
                  <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No workspaces found"
              description="Create a new workspace to start collaborating and managing projects."
              icon={<Briefcase className="h-10 w-10 text-slate-300" />}
              action={
                <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Workspace</span>
                </Button>
              }
              className="py-12"
            />
          )}
        </>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Workspace"
      >
        <WorkspaceForm
          onSubmit={handleCreateWorkspace}
          isLoading={createMutation.isPending}
          submitLabel="Create Workspace"
        />
      </Modal>

      {/* Delete Workspace Dialog */}
      <WorkspaceDeleteDialog
        workspace={workspaceToDelete}
        onClose={() => setWorkspaceToDelete(null)}
        onConfirm={handleDeleteWorkspace}
      />
    </div>
  )
}
