import { useMemo, useState } from 'react'
import { DashboardLayout } from '@presentation/layouts/DashboardLayout'
import { ProfitSharingAmountCard } from '@presentation/components/dashboard/ProfitSharingAmountCard'
import { AlreadyVotedStatusCard } from '@presentation/components/dashboard/AlreadyVotedStatusCard'
import { VotingChoiceSection } from '@presentation/components/dashboard/VotingChoiceSection'
import { MemberInformationCard } from '@presentation/components/dashboard/MemberInformationCard'
import { CooperativeInformationCard } from '@presentation/components/dashboard/CooperativeInformationCard'
import { FinancialStatementsSection } from '@presentation/components/dashboard/FinancialStatementsSection'
import { MemberVoteReceiptCard } from '@presentation/components/dashboard/MemberVoteReceiptCard'
import { FaqAccordionSection } from '@presentation/components/dashboard/FaqAccordionSection'
import { Divider } from '@presentation/components/ui/Divider'
import { Skeleton, SkeletonCard } from '@presentation/components/ui/Skeleton'
import { BottomNavBar, type BottomNavTab } from '@presentation/components/navigation/BottomNavBar'
import { useMyProfile } from '@application/hooks/profile/useMyProfile'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'
import { useMemberVoteStatus } from '@application/hooks/vote/useMemberVoteStatus'
import { useCurrentVoteReceipt } from '@application/hooks/vote/useCurrentVoteReceipt'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'

export function DashboardHomePage() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('voting')
  const { member, cooperativeUnit, isLoading: isProfileLoading } = useMyProfile()
  const { record, isLoading: isRecordLoading } = useCurrentProfitSharing()
  const { voteStatus, isLoading: isVoteStatusLoading } = useMemberVoteStatus()
  const { receipt, isLoading: isReceiptLoading } = useCurrentVoteReceipt()

  const isAnyLoading = isProfileLoading || isRecordLoading

  const hasVoted = useMemo(() => voteStatus?.hasMemberVoted ?? false, [voteStatus])

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-[130px]">
        {/* <div className="flex items-center justify-between gap-2">
          <h2 className="text-[15px] font-bold leading-6 text-text flex-1 min-w-0 truncate">
            {activeTab === 'reports' && USER_STRINGS.dashboard.sectionReports}
            {activeTab === 'voting' && USER_STRINGS.dashboard.sectionShuAmount}
            {activeTab === 'profile' && USER_STRINGS.dashboard.sectionMemberData}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetchAll()}
            isLoading={isAnyLoading && isReceiptLoading}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div> */}

        {activeTab === 'reports' ? (
          <div className={cn(isAnyLoading && !record ? 'opacity-70 pointer-events-none' : '')}>
            <FinancialStatementsSection />
          </div>
        ) : null}

        {activeTab === 'voting' ? (
          <div className="space-y-4">
            <ProfitSharingAmountCard record={record} isLoading={isRecordLoading} />
            <AlreadyVotedStatusCard voteStatus={voteStatus} isLoading={isVoteStatusLoading} />

            {hasVoted ? (
              <>
                <MemberVoteReceiptCard
                  receipt={receipt}
                  isLoading={isReceiptLoading}
                />
                <p className="text-[12px] leading-5 text-text-muted text-center px-2">
                  {USER_STRINGS.dashboard.votingVotedTabHint}
                </p>
              </>
            ) : (
              <VotingChoiceSection
                profitSharingRecord={record}
                voteStatus={voteStatus}
                isLoadingRecord={isRecordLoading}
                isLoadingVote={isVoteStatusLoading}
              />
            )}
          </div>
        ) : null}

        {activeTab === 'profile' ? (
          <div className="space-y-4">
            <Divider spacing="md" label={USER_STRINGS.dashboard.sectionMemberData} />
            <MemberInformationCard
              member={member}
              cooperativeUnit={cooperativeUnit}
              isLoading={isProfileLoading}
            />

            <Divider spacing="md" label={USER_STRINGS.dashboard.sectionCooperativeData} />
            <CooperativeInformationCard
              cooperativeUnit={cooperativeUnit}
              isLoading={isProfileLoading}
            />

            <Divider spacing="md" label={USER_STRINGS.dashboard.sectionFaqTitle} />
            <FaqAccordionSection />
          </div>
        ) : null}

        {isAnyLoading && !member && !record ? (
          <div className="space-y-3" aria-hidden>
            <Skeleton widthClass="w-full h-8 rounded-lg" />
            <SkeletonCard />
          </div>
        ) : null}
      </div>

      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} hasVoted={hasVoted} />
    </DashboardLayout>
  )
}
