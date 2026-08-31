import { Scale } from 'lucide-react'
import { AuthLayout } from '@presentation/layouts/AuthLayout'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'

export function VotingLegalBasisPage() {
  return (
    <AuthLayout backPath={RoutePaths.DASHBOARD_HOME} title={USER_STRINGS.dashboard.votingLegalBasisLabel}>
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 text-center">
        <div className="h-14 w-14 rounded-2xl bg-surface-muted text-text-muted inline-flex items-center justify-center mb-3">
          <Scale className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-text">{USER_STRINGS.common.comingSoon}</p>
      </div>
    </AuthLayout>
  )
}
