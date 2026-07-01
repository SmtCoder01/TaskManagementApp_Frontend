import { useState } from 'react'
import { Plus, AlertCircle, Briefcase } from 'lucide-react'
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
import { Alert } from '../../../components/ui/Alert'
import { ApiError } from '../../../api/parseResponse'

export function WorkspaceListPage() {
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const { data, isLoading, isError, error } = useWorkspaces(page)
  const createMutation = useCreateWorkspace()
  const deleteMutation = useDeleteWorkspace()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleCreateWorkspace = async (formData: { name: string; description?: string }) => {
    try {
      await createMutation.mutateAsync(formData)
      setIsCreateOpen(false)
      showToast('Workspace created successfully!')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        if (err.code === 'WORKSPACE_ADMIN_REQUIRED' || err.statusCode === 403) {
          showToast('Only system administrators can create workspaces.', 'error')
        } else {
          showToast(err.message || 'Failed to create workspace.', 'error')
        }
      } else {
        showToast('An unexpected error occurred.', 'error')
      }
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return
    try {
      await deleteMutation.mutateAsync(workspaceToDelete.id)
      setWorkspaceToDelete(null)
      showToast('Workspace deleted successfully!')
      // If we deleted the only item on the last page, go to previous page
      if (data?.items.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    } catch (err) {
      console.error(err)
      setWorkspaceToDelete(null)
      if (err instanceof ApiError) {
        if (err.code === 'WORKSPACE_DELETE_FORBIDDEN' || err.statusCode === 403) {
          showToast('You do not have permission to delete this workspace. Admin role required.', 'error')
        } else {
          showToast(err.message || 'Failed to delete workspace.', 'error')
        }
      } else {
        showToast('An unexpected error occurred.', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          toastType === 'success' ? 'bg-slate-900' : 'bg-red-600'
        }`}>
          <span className={`h-2 w-2 rounded-full ${toastType === 'success' ? 'bg-green-500' : 'bg-white'}`} />
          {toastMessage}
        </div>
      )}

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
        <Alert variant="error" className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error instanceof Error ? error.message : 'Failed to fetch workspaces.'}</span>
        </Alert>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="h-4 w-24 rounded bg-slate-100" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded bg-slate-100" />
                  <div className="h-8 w-8 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
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
