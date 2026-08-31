import { Gavel, FileSpreadsheet, UserRound } from 'lucide-react'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'

export type BottomNavTab = 'reports' | 'voting' | 'profile'

export interface BottomNavBarProps {
  activeTab: BottomNavTab
  onTabChange: (tab: BottomNavTab) => void
  hasVoted?: boolean
}

const TabIconButton = ({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    aria-label={label}
    className={cn(
      'flex-1 relative flex flex-col items-center justify-center gap-1 py-2.5 transition tap-highlight-transparent',
    )}
  >
    <span
      className={cn(
        'h-9 w-9 rounded-xl inline-flex items-center justify-center transition',
        active
          ? 'bg-brand-50 text-brand-600'
          : 'text-text-muted hover:text-text-body',
      )}
    >
      {icon}
    </span>
    <span
      className={cn(
        'text-[11px] leading-4 font-semibold transition',
        active ? 'text-brand-700' : 'text-text-muted',
      )}
    >
      {label}
    </span>
    {active ? (
      <span className="absolute top-1.5 h-1 w-1 rounded-full bg-brand-600" aria-hidden />
    ) : null}
  </button>
)

export function BottomNavBar({ activeTab, onTabChange, hasVoted = false }: BottomNavBarProps) {
  const fabActive = activeTab === 'voting'

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[390px] pointer-events-none"
    >
      <div className="relative h-[94px] px-3 pb-[calc(env(safe-area-inset-bottom,12px)+10px)] pt-0">
        <div className="absolute inset-x-3 top-0 bottom-[calc(env(safe-area-inset-bottom,12px)+10px)] rounded-3xl bg-surface-raised shadow-pop pointer-events-auto overflow-hidden border-t border-l border-r border-border-light">
          <div className="relative w-full h-full flex items-stretch">
            <TabIconButton
              active={activeTab === 'reports'}
              onClick={() => onTabChange('reports')}
              label={USER_STRINGS.dashboard.tabReports}
              icon={<FileSpreadsheet className="h-[18px] w-[18px]" strokeWidth={2.1} />}
            />

            <div className="w-20 shrink-0" aria-hidden />

            <TabIconButton
              active={activeTab === 'profile'}
              onClick={() => onTabChange('profile')}
              label={USER_STRINGS.dashboard.tabProfile}
              icon={<UserRound className="h-[18px] w-[18px]" strokeWidth={2.1} />}
            />
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-5 pointer-events-auto">
          <button
            type="button"
            onClick={() => onTabChange('voting')}
            aria-pressed={fabActive}
            aria-label={USER_STRINGS.dashboard.fabVotingLabel}
            className={cn(
              'group relative h-[68px] w-[68px] rounded-full inline-flex items-center justify-center text-white transition-all duration-200 tap-highlight-transparent',
              fabActive
                ? 'scale-105 shadow-[0_16px_36px_rgba(200,16,46,0.45)]'
                : 'shadow-[0_12px_28px_rgba(200,16,46,0.35)] hover:shadow-[0_16px_34px_rgba(200,16,46,0.42)] active:scale-[0.97]',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'absolute inset-0 rounded-full',
                fabActive
                  ? 'bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700'
                  : 'bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 animate-pulse-slow',
              )}
            />
            <span
              aria-hidden
              className="absolute rounded-full border border-white/30"
              style={{ inset: '4px' }}
            />
            {hasVoted ? (
              <span className="relative inline-flex items-center justify-center">
                <span className="absolute -top-1 -right-3 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
                <Gavel className="relative h-8 w-8" strokeWidth={2.1} />
              </span>
            ) : (
              <Gavel className="relative h-8 w-8" strokeWidth={2.1} />
            )}
            <span
              aria-hidden
              className={cn(
                'absolute -bottom-1.5 h-1.5 rounded-full bg-white/30 transition-all duration-300',
                fabActive ? 'w-8' : 'w-5 group-hover:w-7',
              )}
            />
          </button>
          <span
            className={cn(
              'mt-2 flex items-center justify-center text-[11px] leading-4 font-extrabold transition',
              fabActive ? 'text-brand-700' : 'text-text-muted',
            )}
          >
            {USER_STRINGS.dashboard.tabVoting}
          </span>
        </div>
      </div>
    </nav>
  )
}
