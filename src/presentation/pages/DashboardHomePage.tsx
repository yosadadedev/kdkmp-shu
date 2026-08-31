import { useMemo, useState } from 'react'
import { DashboardLayout } from '@presentation/layouts/DashboardLayout'
import { ProfitSharingAmountCard } from '@presentation/components/dashboard/ProfitSharingAmountCard'
// import { AlreadyVotedStatusCard } from '@presentation/components/dashboard/AlreadyVotedStatusCard'
import { VotingChoiceSection } from '@presentation/components/dashboard/VotingChoiceSection'
import { MemberInformationCard } from '@presentation/components/dashboard/MemberInformationCard'
import { CooperativeInformationCard } from '@presentation/components/dashboard/CooperativeInformationCard'
import { FinancialStatementsSection } from '@presentation/components/dashboard/FinancialStatementsSection'
import { ShuAllocationSection } from '@presentation/components/dashboard/ShuAllocationSection'
import { FaqAccordionSection } from '@presentation/components/dashboard/FaqAccordionSection'
import { AdminContactSection } from '@presentation/components/dashboard/AdminContactSection'
import { Divider } from '@presentation/components/ui/Divider'
import { Skeleton, SkeletonCard } from '@presentation/components/ui/Skeleton'
import { BottomNavBar, type BottomNavTab } from '@presentation/components/navigation/BottomNavBar'
import { useMyProfile } from '@application/hooks/profile/useMyProfile'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'
import { useMemberVoteStatus } from '@application/hooks/vote/useMemberVoteStatus'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'

export function DashboardHomePage() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('voting')
  const {
    member,
    cooperativeUnit,
    isLoading: isProfileLoading,
    errorCode: profileErrorCode,
  } = useMyProfile()
  const { record, isLoading: isRecordLoading } = useCurrentProfitSharing()
  const { voteStatus, isLoading: isVoteStatusLoading } = useMemberVoteStatus()

  const isAnyLoading = isProfileLoading || isRecordLoading

  const hasVoted = useMemo(() => voteStatus?.hasMemberVoted ?? false, [voteStatus])

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-[130px]">
        {activeTab === 'reports' ? (
          <div className={cn('space-y-4', isAnyLoading && !record ? 'opacity-70 pointer-events-none' : '')}>
            <FinancialStatementsSection />
            <ShuAllocationSection />
          </div>
        ) : null}

        {activeTab === 'voting' ? (
          <div className="space-y-4">
            <ProfitSharingAmountCard />
            {/* <AlreadyVotedStatusCard voteStatus={voteStatus} isLoading={isVoteStatusLoading} /> */}

            {hasVoted ? (
              <p className="text-[12px] leading-5 text-text-muted text-center px-2">
                {USER_STRINGS.dashboard.votingVotedTabHint}
              </p>
            ) : (
              <VotingChoiceSection
                voteStatus={voteStatus}
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
              errorCode={profileErrorCode}
            />

            <Divider spacing="md" label={USER_STRINGS.dashboard.sectionCooperativeData} />
            <CooperativeInformationCard
              cooperativeUnit={cooperativeUnit}
              isLoading={isProfileLoading}
            />

            <Divider spacing="md" label={USER_STRINGS.dashboard.sectionFaqTitle} />
            <FaqAccordionSection />

            <AdminContactSection />
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
