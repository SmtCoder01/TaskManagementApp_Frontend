import { toast } from 'sonner'
import { ApiError } from '../api/parseResponse'
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'

/**
 * Backend'den gelen doğrulama hatalarını (fieldErrors) React Hook Form alanlarına aktarır.
 */
export function applyFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
): boolean {
  if (error instanceof ApiError && error.fieldErrors) {
    Object.entries(error.fieldErrors).forEach(([field, messages]) => {
      // Backend camelCase veya PascalCase dönebilir, form alanlarıyla eşleştiğinden emin olmak için 
      // ilk harfi küçülterek kontrol etmeyi veya doğrudan setlemeyi deneyebiliriz.
      const formField = (field.charAt(0).toLowerCase() + field.slice(1)) as Path<TFieldValues>
      setError(formField, {
        type: 'server',
        message: messages[0] || 'Geçersiz değer',
      })
    })
    return true
  }
  return false
}

/**
 * API hatalarını toast bildirimi olarak gösterir.
 * 401 ve 403 gibi durumlar merkezi interceptor'da da işlenebilir, ancak burası genel 500 veya iş kuralı hatalarını yakalar.
 */
export function showApiErrorToast(error: unknown, defaultMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.') {
  if (error instanceof ApiError) {
    if (error.statusCode === 403) {
      toast.error('Bu işlemi gerçekleştirmek için yetkiniz bulunmamaktadır.')
    } else if (error.statusCode === 401) {
      // 401 interceptor tarafından ele alınıyor, kullanıcıyı yönlendiriyor.
      return
    } else {
      toast.error(error.message || defaultMessage)
    }
  } else if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error(defaultMessage)
  }
}
