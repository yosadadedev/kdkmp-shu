import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'

export interface AuthLayoutProps {
  children: ReactNode
  backPath?: string | null
  bottomSlot?: ReactNode
  title?: string
  subtitle?: string
  paddingTopNarrow?: boolean
  className?: string
}

export function AuthLayout({
  children,
  backPath,
  bottomSlot,
  title,
  subtitle,
  paddingTopNarrow = false,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn('app-shell min-h-dvh flex flex-col bg-surface-raised', className)}>
      <div className="relative w-full h-2 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" aria-hidden />
      <header
        className={cn(
          'w-full px-4 flex items-center justify-between',
          paddingTopNarrow ? 'pt-3 pb-2' : 'pt-5 pb-3',
        )}
      >
        <div className="h-stack gap-2 min-w-0 flex-1">
          <div className="h-8 w-8 rounded-lg bg-brand-500 text-white inline-flex items-center justify-center font-extrabold text-sm shrink-0 shadow-[0_2px_8px_rgba(200,16,46,0.3)]">
            K
          </div>
          <div className="min-w-0 flex-1 v-stack">
            <span className="text-[15px] font-bold leading-5 text-text truncate">
              {USER_STRINGS.common.appNameShort}
            </span>
            <span className="text-[11px] leading-4 text-text-muted truncate">
              {USER_STRINGS.common.appNameFull}
            </span>
          </div>
        </div>
        {backPath ? (
          <Link
            to={backPath}
            aria-label={USER_STRINGS.common.back}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-text hover:bg-surface-muted tap-highlight-transparent transition shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}
      </header>
      <main className="flex-1 flex flex-col animate-fade-in">
        {title ? (
          <div className="px-4 pt-3 pb-4">
            <h1 className="text-[26px] leading-9 font-extrabold tracking-tight text-text">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-6 text-text-body">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        <div className="flex-1 w-full">{children}</div>
      </main>
      {bottomSlot ? (
        <footer className="mt-auto w-full px-4 pt-3 pb-5">{bottomSlot}</footer>
      ) : null}
    </div>
  )
}
