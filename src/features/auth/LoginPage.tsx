import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginInput } from './schema'
import { useLogin } from './hooks'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { ApiError } from '../../api/parseResponse'

export function LoginPage() {
  const { mutateAsync: loginMutate, isPending } = useLogin()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginInput) => {
    setGeneralError(null)
    try {
      await loginMutate(values)
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setGeneralError('Invalid email or password.')
        } else if (error.statusCode === 422 && error.fieldErrors) {
          // Map validation errors to React Hook Form fields
          Object.entries(error.fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof LoginInput, {
              type: 'server',
              message: messages[0] || 'Validation error',
            })
          })
        } else {
          setGeneralError(error.message || 'Something went wrong. Please try again.')
        }
      } else {
        setGeneralError('A generic error occurred. Please try again later.')
      }
      // Never swallow errors - log to console
      console.error('Login error:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome back to <span className="text-indigo-600">TaskY</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Enter your details to access your workspace
          </p>
        </div>

        {generalError && (
          <Alert variant="error" className="mb-6">
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
            disabled={isPending}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            disabled={isPending}
          />

          <Button
            type="submit"
            className="w-full py-2.5 mt-2"
            disabled={isPending}
          >
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
