
import type { ReactNode } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs: BreadcrumbItem[]
  actions?: ReactNode
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-white pb-5 mb-6">
      <div className="space-y-1">
        {/* Breadcrumbs Path */}
        <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-400">
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <div key={idx} className="flex items-center">
                {idx > 0 && <span className="mx-1.5 text-slate-300">/</span>}
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="hover:text-slate-600 transition"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={isLast ? 'text-slate-600 font-semibold' : ''}>
                    {item.label}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          {title}
        </h1>
      </div>

      {/* Action Buttons Area */}
      {actions && (
        <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  )
}
