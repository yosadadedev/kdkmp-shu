import { z } from 'zod'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'

export const NATIONAL_ID_DIGITS = 16
export const OTP_CODE_DIGITS = 6

const cleanupWhitespace = (val: unknown): string =>
  typeof val === 'string' ? val.trim().replace(/\s+/g, '') : ''

export const nationalIdSchema = z.preprocess(
  cleanupWhitespace,
  z
    .string()
    .refine((val) => val.length === NATIONAL_ID_DIGITS, {
      message: `NIK harus ${NATIONAL_ID_DIGITS} digit angka.`,
    })
    .refine((val) => /^\d{16}$/.test(val), {
      message: 'NIK hanya boleh berisi angka 0-9.',
    }),
)

export const otpCodeSchema = z.preprocess(
  cleanupWhitespace,
  z
    .string()
    .refine((val) => val.length === OTP_CODE_DIGITS, {
      message: `Kode OTP harus ${OTP_CODE_DIGITS} digit.`,
    })
    .refine((val) => /^\d{6}$/.test(val), {
      message: 'Kode OTP hanya boleh berisi angka.',
    }),
)

export const loginFormSchema = z.object({
  nationalId: nationalIdSchema,
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const requiredFieldMessage = USER_STRINGS.common.required
