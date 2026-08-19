import { useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { DashboardLayout } from '@presentation/layouts/DashboardLayout'
import { ProfitSharingAmountCard } from '@presentation/components/dashboard/ProfitSharingAmountCard'
import { AlreadyVotedStatusCard } from '@presentation/components/dashboard/AlreadyVotedStatusCard'
import { VotingChoiceSection } from '@presentation/components/dashboard/VotingChoiceSection'
import { MemberInformationCard } from '@presentation/components/dashboard/MemberInformationCard'
import { CooperativeInformationCard } from '@presentation/components/dashboard/CooperativeInformationCard'
import { FinancialStatementsSection } from '@presentation/components/dashboard/FinancialStatementsSection'
import { Button } from '@presentation/components/ui/Button'
import { Skeleton, SkeletonCard } from '@presentation/components/ui/Skeleton'
import { useMyProfile } from '@application/hooks/profile/useMyProfile'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'
import { useMemberVoteStatus } from '@application/hooks/vote/useMemberVoteStatus'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { Divider } from '@presentation/components/ui/Divider'

export function DashboardHomePage() {
  const { member, cooperativeUnit, isLoading: isProfileLoading, refetch: refetchProfile } = useMyProfile()
  const { record, isLoading: isRecordLoading, refetch: refetchShu } = useCurrentProfitSharing()
  const { voteStatus, isLoading: isVoteStatusLoading, refetch: refetchVote } = useMemberVoteStatus()

  const refetchAll = useCallback(async () => {
    await Promise.allSettled([refetchProfile(), refetchShu(), refetchVote()])
  }, [refetchProfile, refetchShu, refetchVote])

  const isAnyLoading = isProfileLoading || isRecordLoading

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[15px] font-bold leading-6 text-text flex-1 min-w-0 truncate">
            Ringkasan SHU
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetchAll()}
            isLoading={isAnyLoading}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>

        <ProfitSharingAmountCard record={record} isLoading={isRecordLoading} />
        <AlreadyVotedStatusCard voteStatus={voteStatus} isLoading={isVoteStatusLoading} />
        <VotingChoiceSection
          profitSharingRecord={record}
          voteStatus={voteStatus}
          isLoadingRecord={isRecordLoading}
          isLoadingVote={isVoteStatusLoading}
        />

        <Divider spacing="md" label={USER_STRINGS.dashboard.profileCardTitle} />
        <MemberInformationCard
          member={member}
          cooperativeUnit={cooperativeUnit}
          isLoading={isProfileLoading}
        />

        {/* Data KDKMP */}
        <Divider spacing="md" label="Data KDKMP" />
        <CooperativeInformationCard
          cooperativeUnit={cooperativeUnit}
          isLoading={isProfileLoading}
        />

        <Divider spacing="md" label="Laporan Keuangan" />
        <FinancialStatementsSection />

        {isAnyLoading && !member && !record ? (
          <div className="space-y-3" aria-hidden>
            <Skeleton widthClass="w-full h-8 rounded-lg" />
            <SkeletonCard />
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
