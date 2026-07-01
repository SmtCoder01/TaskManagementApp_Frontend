import { Link } from 'react-router-dom'
import { Briefcase, Settings, Trash2, Users, Calendar, ArrowRight } from 'lucide-react'
import type { Workspace } from '../types'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'

interface WorkspaceCardProps {
  workspace: Workspace
  onDelete: (workspace: Workspace) => void
}

export function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {
  const formattedDate = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-200">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                {workspace.name}
              </h3>
              {formattedDate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formattedDate}</span>
                </div>
              )}
            </div>
          </div>
          {workspace.memberCount !== undefined && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{workspace.memberCount} members</span>
            </Badge>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600 line-clamp-2 min-h-[40px]">
          {workspace.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
        <Link
          to={`/workspaces/${workspace.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>Open Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/workspaces/${workspace.id}/settings`}>
            <Button
              variant="secondary"
              className="p-2 h-9 w-9 rounded-lg"
              title="Workspace Settings"
            >
              <Settings className="h-4 w-4 text-slate-500" />
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => onDelete(workspace)}
            className="p-2 h-9 w-9 rounded-lg border-red-200 hover:bg-red-50"
            title="Delete Workspace"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}
