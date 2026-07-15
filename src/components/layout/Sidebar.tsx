import { NavLink, useParams } from 'react-router-dom'
import { Briefcase, Users, FolderKanban, CheckSquare } from 'lucide-react'

interface SidebarProps {
  onItemClick?: () => void
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const { id, projectId } = useParams<{ id: string; projectId: string }>()
  const hasActiveWorkspace = !!id

  const workspacePath = hasActiveWorkspace ? `/workspaces/${id}` : '/'
  const membersPath = hasActiveWorkspace ? `/workspaces/${id}/members` : '/'
  const projectsPath =
    hasActiveWorkspace && projectId
      ? `/workspaces/${id}/projects/${projectId}`
      : workspacePath

  const navItems = [
    {
      name: 'Workspace Dashboard',
      path: workspacePath,
      icon: Briefcase,
      end: true,
      disabled: !hasActiveWorkspace,
    },
    {
      name: 'Members',
      path: membersPath,
      icon: Users,
      disabled: !hasActiveWorkspace,
    },
    {
      name: 'Projects',
      path: projectsPath,
      icon: FolderKanban,
      disabled: !hasActiveWorkspace,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 w-64 border-r border-slate-800">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <CheckSquare className="h-6 w-6 text-indigo-400" />
        <span className="text-xl font-bold tracking-tight text-white">TaskY</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon

          if (item.disabled) {
            return (
              <span
                key={item.name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed"
                title="Bir workspace seçin"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </span>
            )
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={onItemClick}
              className={({ isActive }) => {
                const isTabActive = item.name === 'Projects' ? isActive && !!projectId : isActive
                return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v0.1.0 • Task Management
      </div>
    </div>
  )
}
