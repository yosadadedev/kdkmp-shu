import { useMemo } from 'react'
import { MapPin } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import type { ErrorCode } from '@infra/errors/ErrorCode'
import { Skeleton } from '@presentation/components/ui/Skeleton'

export interface MemberInformationCardProps {
  member: Member | null
  cooperativeUnit: CooperativeUnit | null
  isLoading: boolean
  errorCode?: ErrorCode | null
}

export function MemberInformationCard({
  member,
  cooperativeUnit,
  isLoading,
  errorCode,
}: MemberInformationCardProps) {
  const rows = useMemo(() => {
    if (!member || !cooperativeUnit) return null
    const addressLine = [member.address, member.village, member.district, member.cityOrRegency, member.province]
      .filter(Boolean)
      .join(', ')
    return [
      {
        label: USER_STRINGS.dashboard.infoName,
        value: member.fullName,
        divider: true,
      },
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
      // {
      //   label: USER_STRINGS.dashboard.infoKdkmp,
      //   value: cooperativeUnit.branchName,
      //   divider: false,
      //   icon: <Building2 className="h-4 w-4" />,
      // },
    ] as const
  }, [member, cooperativeUnit])

  return (
    <Card padding="md" className="animate-fade-in">
      {!isLoading && !member && errorCode ? (
        <p className="text-xs leading-5 text-text-muted text-center py-2">
          {USER_STRINGS.common.loadingErrorTitle}
        </p>
      ) : isLoading || !member ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <Skeleton widthClass="w-1/3 h-3 rounded-md" />
              <Skeleton widthClass="w-1/2 h-4 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div>
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
      )}
    </Card>
  )
}
