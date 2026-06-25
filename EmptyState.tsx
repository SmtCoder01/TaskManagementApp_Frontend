import type { ReactNode, HTMLAttributes } from 'react'

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action, className = '', ...props }: EmptyStateProps) {
  return(
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-slate-300 bg-white p-6 text-center ${className}`}
      {...props}
    > 
      {icon && <div className="text-slate-400">{icon}</div>}
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}  
      {action && <div>{action}</div>}
    </div>
  )
}