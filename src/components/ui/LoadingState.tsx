import { Spinner } from './Spinner'

interface LoadingStateProps {
  message?: string
  layout?: 'spinner' | 'skeleton' | 'skeleton-cards'
  count?: number
}

export function LoadingState({ message = 'Yükleniyor...', layout = 'spinner', count = 3 }: LoadingStateProps) {
  if (layout === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <Spinner className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    )
  }

  if (layout === 'skeleton-cards') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(count)].map((_, i) => (
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
          </div>
        ))}
      </div>
    )
  }

  // Default skeleton
  return (
    <div className="animate-pulse space-y-4 py-6">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded"></div>
        <div className="h-8 bg-slate-200 rounded"></div>
        <div className="h-8 bg-slate-200 rounded"></div>
      </div>
    </div>
  )
}
