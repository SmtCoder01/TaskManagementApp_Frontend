import type { InputHTMLAttributes } from 'react'

type InputVariant = 'primary' | 'secondary' | 'danger'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
  label?: string
  error?: string
}

const variantClasses: Record<InputVariant, string> = {
  primary: 'border border-slate-300 focus:border-indigo-500 focus:ring-indigo-500',
  secondary: 'border border-slate-300 focus:border-slate-500 focus:ring-slate-500',
  danger: 'border border-red-600 focus:border-red-700 focus:ring-red-700',
}

export function Input({ variant = 'primary', className = '', label, error, ...props }: InputProps) {
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
      <input
        id={props.id}
        className={`w-full rounded-lg px-4 py-2 text-sm transition ${variantClasses[variant]} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}