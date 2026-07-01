import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Trash2, ArrowLeft, Settings, ShieldAlert } from 'lucide-react'
import { useWorkspace, useUpdateWorkspace, useDeleteWorkspace } from '../hooks'
import { WorkspaceForm } from '../components/WorkspaceForm'
import { WorkspaceDeleteDialog } from '../components/WorkspaceDeleteDialog'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { ApiError } from '../../../api/parseResponse'
import type { Workspace } from '../types'

export function WorkspaceSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: workspace, isLoading, isError, error } = useWorkspace(id)
  
  const updateMutation = useUpdateWorkspace(id!)
  const deleteMutation = useDeleteWorkspace()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 5000)
  }

  const handleUpdate = async (formData: { name: string; description?: string }) => {
    try {
      await updateMutation.mutateAsync(formData)
      showToast('Workspace updated successfully!')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        if (err.code === 'WORKSPACE_UPDATE_FORBIDDEN' || err.statusCode === 403) {
          showToast('You do not have permission to update this workspace. Admin role required.', 'error')
        } else {
          showToast(err.message || 'Failed to update workspace.', 'error')
        }
      } else {
        showToast('An unexpected error occurred.', 'error')
      }
    }
  }

  const handleDelete = async () => {
    if (!workspace) return
    try {
      await deleteMutation.mutateAsync(workspace.id)
      setWorkspaceToDelete(null)
      // Redirect to workspaces list
      navigate('/')
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="text-sm text-slate-500 font-medium">Loading workspace settings...</p>
        </div>
      </div>
    )
  }

  if (isError || !workspace) {
    return (
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workspaces</span>
        </Link>
        <Alert variant="error" className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error instanceof Error ? error.message : 'Workspace not found.'}</span>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'success' ? 'bg-slate-900' : 'bg-red-600'
        }`}>
          <span className={`h-2 w-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-white'}`} />
          {toast.message}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition">Workspaces</Link>
        <span>/</span>
        <Link to={`/workspaces/${workspace.id}`} className="hover:text-slate-900 transition">{workspace.name}</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Settings</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspace Settings</h1>
          <p className="text-sm text-slate-500">
            Modify workspace properties or manage administrative tasks.
          </p>
        </div>
      </div>

      {/* Settings Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Workspace Details</h2>
        <WorkspaceForm
          defaultValues={{
            name: workspace.name,
            description: workspace.description || '',
          }}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50/30 p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700">
              Irreversible actions related to this workspace. Once you delete a workspace, all its projects and tasks will be permanently removed.
            </p>
          </div>
        </div>

        <div className="border-t border-red-100 pt-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-slate-900">Delete this workspace</p>
            <p className="text-xs text-slate-500">Ensure you have backed up any necessary data before proceeding.</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setWorkspaceToDelete(workspace)}
            className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 font-semibold"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Workspace
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <WorkspaceDeleteDialog
        workspace={workspaceToDelete}
        onClose={() => setWorkspaceToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
