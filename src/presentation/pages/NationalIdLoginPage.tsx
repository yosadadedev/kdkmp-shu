import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { AuthLayout } from '@presentation/layouts/AuthLayout'
import { Input } from '@presentation/components/ui/Input'
import { Button } from '@presentation/components/ui/Button'
import { Divider } from '@presentation/components/ui/Divider'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { useSendOtp } from '@application/hooks/auth/useSendOtp'
import { loginFormSchema, type LoginFormValues } from '@presentation/utils/validators'
import { ErrorCode } from '@infra/errors/ErrorCode'

export function NationalIdLoginPage() {
  const { isLoading, sendOtp } = useSendOtp()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginFormSchema),
    defaultValues: { nationalId: '' },
  })

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    const result = await sendOtp(values.nationalId)
    if (result.success) return
    switch (result.errorCode) {
      case ErrorCode.NATIONAL_ID_NOT_REGISTERED:
        setError('nationalId', { message: 'NIK ini belum terdaftar di anggota koperasi.' })
        break
      case ErrorCode.NATIONAL_ID_INVALID_FORMAT:
        setError('nationalId', { message: 'Pastikan NIK berisi 16 digit angka.' })
        break
      case ErrorCode.NETWORK_ERROR:
        setError('nationalId', {
          message: 'Masalah koneksi. Periksa internet lalu coba lagi ya.',
        })
        break
      default:
        setError('nationalId', {
          message: 'Gagal mengirimkan kode OTP. Silakan coba beberapa saat lagi.',
        })
    }
  }

  return (
    <AuthLayout
      title={USER_STRINGS.nationalIdLogin.pageTitle}
      subtitle={USER_STRINGS.nationalIdLogin.pageSubtitle}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col px-4 pt-2 gap-4"
        noValidate
      >
        <div className="space-y-1.5">
          <Input
            label={USER_STRINGS.nationalIdLogin.inputLabel}
            placeholder={USER_STRINGS.nationalIdLogin.inputPlaceholder}
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={16}
            isError={Boolean(errors.nationalId)}
            errorMessage={errors.nationalId?.message}
            helperText={USER_STRINGS.nationalIdLogin.inputHelper}
            {...register('nationalId')}
          />
        </div>
        <Divider spacing="sm" />
        <div className="flex-1" />
        <Button
          type="submit"
          size="lg"
          isBlock
          isLoading={isLoading}
          loadingText={USER_STRINGS.nationalIdLogin.ctaSubmitLoading}
          disabled={!isDirty || !isValid}
          rightIcon={!isLoading ? <ArrowRight className="h-5 w-5" strokeWidth={2.25} /> : undefined}
        >
          {USER_STRINGS.nationalIdLogin.ctaSubmit}
        </Button>
        <p className="text-[11px] leading-4 text-text-muted text-center mt-3">
          {USER_STRINGS.nationalIdLogin.policy}
        </p>
      </form>
    </AuthLayout>
  )
}
