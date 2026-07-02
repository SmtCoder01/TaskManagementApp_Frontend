import { z } from 'zod'
import { WorkspaceRole } from './types'

export const addMemberSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi giriniz'),
  role: z
    .nativeEnum(WorkspaceRole, {
      errorMap: () => ({ message: 'Geçerli bir rol seçiniz' }),
    }),
})

export type AddMemberSchemaInput = z.infer<typeof addMemberSchema>
