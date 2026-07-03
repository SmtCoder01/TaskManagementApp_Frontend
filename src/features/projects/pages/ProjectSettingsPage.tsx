import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Trash2, ArrowLeft, Settings, ShieldAlert } from 'lucide-react'
import { useProject, useUpdateProject, useDeleteProject } from '../hooks'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectDeleteDialog } from '../components/ProjectDeleteDialog'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { ApiError } from '../../../api/parseResponse'
import type { Project } from '../types'

export function ProjectSettingsPage() {
  const { id, projectId } = useParams<{ id: string; projectId: string }>()
  const navigate = useNavigate()
  const workspaceId = id ? Number(id) : 0
  const numericProjectId = projectId ? Number(projectId) : 0

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: project, isLoading, isError, error } = useProject(numericProjectId, workspaceId)
  const updateMutation = useUpdateProject(numericProjectId, workspaceId)
  const deleteMutation = useDeleteProject(workspaceId)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 5000)
  }

  const handleUpdate = async (formData: { name: string; description?: string }) => {
    try {
      await updateMutation.mutateAsync(formData)
      showToast('Project updated successfully!')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        if (err.code === 'PROJECT_UPDATE_FORBIDDEN' || err.statusCode === 403) {
          showToast('You do not have permission to update this project.', 'error')
        } else {
          showToast(err.message || 'Failed to update project.', 'error')
        }
      } else {
        showToast(err instanceof Error ? err.message : 'An unexpected error occurred.', 'error')
      }
    }
  }

  const handleDelete = async () => {
    if (!project) return
    try {
      await deleteMutation.mutateAsync(project.id)
      setProjectToDelete(null)
      navigate(`/workspaces/${workspaceId}`)
    } catch (err) {
      console.error(err)
      setProjectToDelete(null)
      if (err instanceof ApiError) {
        if (err.code === 'PROJECT_DELETE_FORBIDDEN' || err.statusCode === 403) {
          showToast('You do not have permission to delete this project.', 'error')
        } else {
          showToast(err.message || 'Failed to delete project.', 'error')
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
          <p className="text-sm text-slate-500 font-medium">Loading project settings...</p>
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="space-y-4">
        <Link
          to={`/workspaces/${workspaceId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workspace</span>
        </Link>
        <Alert variant="error" className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error instanceof Error ? error.message : 'Project not found.'}</span>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            toast.type === 'success' ? 'bg-slate-900' : 'bg-red-600'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-white'}`}
          />
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition">
          Workspaces
        </Link>
        <span>/</span>
        <Link to={`/workspaces/${workspaceId}`} className="hover:text-slate-900 transition">
          Workspace
        </Link>
        <span>/</span>
        <Link
          to={`/workspaces/${workspaceId}/projects/${project.id}`}
          className="hover:text-slate-900 transition"
        >
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Settings</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Settings</h1>
          <p className="text-sm text-slate-500">Modify project properties or manage administrative tasks.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Details</h2>
        <ProjectForm
          defaultValues={{
            name: project.name,
            description: project.description || '',
          }}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50/30 p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700">
              Irreversible actions related to this project. Once deleted, all associated tasks will be
              permanently removed.
            </p>
          </div>
        </div>

        <div className="border-t border-red-100 pt-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-slate-900">Delete this project</p>
            <p className="text-xs text-slate-500">Ensure you have backed up any necessary data before proceeding.</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setProjectToDelete(project)}
            className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 font-semibold"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </div>
      </div>

      <ProjectDeleteDialog
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
