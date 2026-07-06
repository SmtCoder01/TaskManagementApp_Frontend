import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { registerSchema, type RegisterInput } from './schema'
import { useRegister } from './hooks'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { ApiError } from '../../api/parseResponse'
import { applyFieldErrors, showApiErrorToast } from '../../utils/errorHandler'

export function RegisterPage() {
  const navigate = useNavigate()
  const { mutateAsync: registerMutate, isPending } = useRegister()
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: RegisterInput) => {
    setGeneralError(null)
    setIsSuccess(false)
    try {
      await registerMutate(values)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.statusCode === 422) {
          applyFieldErrors(error, setError)
        } else {
          setGeneralError(error.message || 'Kayıt işlemi başarısız oldu.')
          showApiErrorToast(error)
        }
      } else {
        setGeneralError('Beklenmeyen bir hata oluştu.')
        showApiErrorToast(error)
      }
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Create your Account
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Get started with <span className="text-indigo-600">TaskY</span> today
          </p>
        </div>

        {generalError && (
          <Alert variant="error" className="mb-6">
            {generalError}
          </Alert>
        )}

        {isSuccess && (
          <Alert variant="success" className="mb-6">
            Registration successful! Redirecting to login...
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="name"
            type="text"
            label="First Name"
            placeholder="John"
            error={errors.name?.message}
            {...register('name')}
            disabled={isPending || isSuccess}
          />

          <Input
            id="lastName"
            type="text"
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
            disabled={isPending || isSuccess}
          />

          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
            disabled={isPending || isSuccess}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            disabled={isPending || isSuccess}
          />

          <Button
            type="submit"
            className="w-full py-2.5 mt-2"
            disabled={isPending || isSuccess}
          >
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
