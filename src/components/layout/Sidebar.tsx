import { NavLink, useParams } from 'react-router-dom'
import { Briefcase, Users, FolderKanban, CheckSquare } from 'lucide-react'

interface SidebarProps {
  onItemClick?: () => void
}

export function Sidebar({ onItemClick }: SidebarProps) {
  // Extract route params to keep links context-aware
  const { id, projectId } = useParams<{ id: string; projectId: string }>()

  // Fallback to 'personal' if no workspace is active in the URL
  const activeWorkspaceId = id || 'personal'
  
  // Resolve paths
  const workspacePath = `/workspaces/${activeWorkspaceId}`
  const membersPath = `/workspaces/${activeWorkspaceId}/members`
  const projectsPath = projectId
    ? `/workspaces/${activeWorkspaceId}/projects/${projectId}`
    : workspacePath

  const navItems = [
    {
      name: 'Workspace Dashboard',
      path: workspacePath,
      icon: Briefcase,
      end: true,
    },
    {
      name: 'Members',
      path: membersPath,
      icon: Users,
    },
    {
      name: 'Projects',
      path: projectsPath,
      icon: FolderKanban,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 w-64 border-r border-slate-800">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <CheckSquare className="h-6 w-6 text-indigo-400" />
        <span className="text-xl font-bold tracking-tight text-white">TaskY</span>
      </div>

      {/* Main Navigation links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v0.1.0 • Task Management
      </div>
    </div>
  )
}
