import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Bir Hata Oluştu',
  message = 'Veriler yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-red-100 bg-red-50/20 text-center gap-4 max-w-md mx-auto my-6">
      <div className="rounded-full bg-red-100 p-3 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="px-4 py-2 border-slate-200">
          Tekrar Dene
        </Button>
      )}
    </div>
  )
}
