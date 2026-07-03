import { Link } from 'react-router-dom'
import { FolderKanban, Settings, Calendar, ArrowRight } from 'lucide-react'
import type { Project } from '../types'
import { Button } from '../../../components/ui/Button'

interface ProjectCardProps {
  project: Project
  workspaceId: number
}

export function ProjectCard({ project, workspaceId }: ProjectCardProps) {
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-200">
      <div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Calendar className="h-3 w-3" />
                <span>Created {formattedDate}</span>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 line-clamp-2 min-h-[40px]">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
        <Link
          to={`/workspaces/${workspaceId}/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>Open Project</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link to={`/workspaces/${workspaceId}/projects/${project.id}/settings`}>
          <Button
            variant="secondary"
            className="p-2 h-9 w-9 rounded-lg"
            title="Project Settings"
          >
            <Settings className="h-4 w-4 text-slate-500" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
