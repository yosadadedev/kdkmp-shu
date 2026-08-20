import { LogOut, RefreshCcw } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { AvatarCircle } from '@presentation/components/ui/AvatarCircle'
import { ConfirmationDialog } from '@presentation/components/ui/Dialog'
import { useLogout } from '@application/hooks/auth/useLogout'
import { useMyProfile } from '@application/hooks/profile/useMyProfile'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'
import { useAuthStore } from '@application/stores/AuthStore'

export interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

const greetByHour = (hour: number): string => {
  if (hour < 10) return USER_STRINGS.dashboard.greetingMorning
  if (hour < 15) return USER_STRINGS.dashboard.greetingDay
  if (hour < 18) return USER_STRINGS.dashboard.greetingEvening
  return USER_STRINGS.dashboard.greetingNight
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { member, isLoading: isProfileLoading, refetch } = useMyProfile()
  const { isLoading: isLogoutLoading, logout } = useLogout()
  const [isConfirmLogout, setIsConfirmLogout] = useState<boolean>(false)
  const authToken = useAuthStore((s) => s.session?.authToken)

  const hour = new Date().getHours()
  const prefix = greetByHour(hour)
  const displayName = member?.fullName

  return (
    <div className={cn('app-shell min-h-dvh flex flex-col bg-surface', className)}>
      <header className="sticky top-0 z-20 bg-surface-raised/90 backdrop-blur-md border-b border-border-light">
        <div className="w-full px-4 pt-4 pb-3 flex items-center gap-3">
          <AvatarCircle
            fullName={member?.fullName ?? 'Anggota'}
            size="lg"
            tone="brand"
          />
          <div className="flex-1 min-w-0 v-stack gap-0.5">
            <span className="text-xs text-text-muted leading-4 truncate">
              {prefix}
              <span aria-hidden> 👋</span>
            </span>
            <span className="text-[15px] font-bold text-text leading-5 truncate">
              {isProfileLoading || !displayName ? 'Anggota Koperasi' : displayName}
            </span>
            <span className="text-[11px] leading-4 text-text-muted truncate">
                {USER_STRINGS.common.appNameFull}
            </span>
          </div>
          <div className="h-stack gap-1.5">
            <button
              type="button"
              onClick={() => void refetch()}
              aria-label="Perbarui data"
              disabled={!authToken}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-surface-muted transition tap-highlight-transparent text-text-muted disabled:opacity-50"
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmLogout(true)}
              aria-label={USER_STRINGS.dashboard.logoutCta}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-danger-soft text-brand-600 transition tap-highlight-transparent"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full screen-container pb-3 animate-slide-up">
        {children}
      </main>
      <ConfirmationDialog
        isOpen={isConfirmLogout}
        onClose={() => setIsConfirmLogout(false)}
        title="Keluar dari akun?"
        description="Kamu akan keluar dari akun anggota. Untuk masuk kembali, kamu perlu memasukkan NIK & kode OTP lagi."
        icon={<LogOut className="h-6 w-6" />}
        actions={[
          { label: USER_STRINGS.common.cancel, variant: 'ghost', onClick: () => setIsConfirmLogout(false) },
          {
            label: USER_STRINGS.dashboard.logoutCta,
            variant: 'danger',
            isLoading: isLogoutLoading,
            onClick: async () => {
              await logout()
              setIsConfirmLogout(false)
            },
          },
        ]}
      />
    </div>
  )
}
