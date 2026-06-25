import type { TextareaHTMLAttributes } from 'react'

type TextareaVariant = 'primary' | 'secondary' | 'danger'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant
  label?: string
  error?: string
}

const variantClasses: Record<TextareaVariant, string> = {
  primary: 'border border-slate-300 focus:border-indigo-500 focus:ring-indigo-500',
  secondary: 'border border-slate-300 focus:border-slate-500 focus:ring-slate-500',
  danger: 'border border-red-600 focus:border-red-700 focus:ring-red-700',
}

export function Textarea({ variant = 'primary', className = '', label, error, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-slate-700"
        >        
          {label}
        </label>
      )}
      <textarea
        id={props.id}
        className={`w-full rounded-lg px-4 py-2 text-sm transition resize-y ${variantClasses[variant]} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
