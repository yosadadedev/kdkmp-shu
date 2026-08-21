import { useMemo } from 'react'
import { MapPin, Building2 } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { AvatarCircle } from '@presentation/components/ui/AvatarCircle'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import { Skeleton } from '@presentation/components/ui/Skeleton'

export interface MemberInformationCardProps {
  member: Member | null
  cooperativeUnit: CooperativeUnit | null
  isLoading: boolean
}

export function MemberInformationCard({ member, cooperativeUnit, isLoading }: MemberInformationCardProps) {
  const headerSkeleton = (
    <div className="h-stack gap-3">
      <Skeleton widthClass="w-14 h-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton widthClass="w-2/3 h-5 rounded-md" />
        <Skeleton widthClass="w-1/2 h-4 rounded-md" />
      </div>
      <Skeleton widthClass="w-20 h-6 rounded-full" />
    </div>
  )

  const rows = useMemo(() => {
    if (!member || !cooperativeUnit) return null
    const addressLine = `${member.address}, ${member.village}, ${member.district}, ${member.cityOrRegency}, ${member.province}`
    return [
      {
        label: USER_STRINGS.dashboard.infoNik,
        value: member.nationalIdNikMasked,
        divider: true,
      },
      {
        label: USER_STRINGS.dashboard.infoAddress,
        value: addressLine,
        divider: true,
        valueClassName: '!text-right sm:!text-right',
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: USER_STRINGS.dashboard.infoKdkmp,
        value: cooperativeUnit.branchName,
        divider: false,
        icon: <Building2 className="h-4 w-4" />,
      },
    ] as const
  }, [member, cooperativeUnit])

  return (
    <Card padding="md" className="animate-fade-in">
      {isLoading || !member ? (
        <div className="space-y-4">
          {headerSkeleton}
          <div className="space-y-2 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <Skeleton widthClass="w-1/3 h-3 rounded-md" />
                <Skeleton widthClass="w-1/2 h-4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <AvatarCircle fullName={member.fullName} size="xl" />
              <div className="min-w-0 flex-1 pt-1">
                <h3 className="text-[17px] font-bold leading-6 text-text truncate">
                  {member.fullName}
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {rows?.map((row, idx) => (
              <InfoRow
                key={`row-${idx}`}
                label={row.label}
                value={row.value}
                divider={row.divider}
                stackOnNarrow
              />
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
