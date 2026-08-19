import { useMemo } from 'react'
import { FileCheck2, Building2, MapPin, Landmark } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { AvatarCircle } from '@presentation/components/ui/AvatarCircle'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'

export interface CooperativeInformationCardProps {
  cooperativeUnit: CooperativeUnit | null
  isLoading: boolean
}

export function CooperativeInformationCard({ cooperativeUnit, isLoading }: CooperativeInformationCardProps) {
  const headerSkeleton = (
    <div className="h-stack gap-3">
      <Skeleton widthClass="w-14 h-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton widthClass="w-2/3 h-5 rounded-md" />
        <Skeleton widthClass="w-1/2 h-4 rounded-md" />
      </div>
    </div>
  )

  const rows = useMemo(() => {
    if (!cooperativeUnit) return null
    return [
      {
        label: USER_STRINGS.dashboard.infoKdkmpRegNumber,
        value: cooperativeUnit.registrationNumber,
        divider: true,
        icon: <FileCheck2 className="h-4 w-4" />,
      },
      {
        label: USER_STRINGS.dashboard.infoKdkmpAddress,
        value: `${cooperativeUnit.address}, ${cooperativeUnit.village}, ${cooperativeUnit.district}`,
        divider: true,
        valueClassName: '!text-right sm:!text-right',
        icon: <MapPin className="h-4 w-4" />,
      },
      {
        label: USER_STRINGS.dashboard.infoKdkmpCity,
        value: cooperativeUnit.cityOrRegency,
        divider: true,
      },
      {
        label: USER_STRINGS.dashboard.infoKdkmpProvince,
        value: cooperativeUnit.province,
        divider: false,
        icon: <Landmark className="h-4 w-4" />,
      },
    ] as const
  }, [cooperativeUnit])

  return (
    <Card padding="md" className="animate-fade-in">
      {isLoading || !cooperativeUnit ? (
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
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <AvatarCircle fullName={cooperativeUnit.branchName} size="xl" tone="brand" />
              <div className="min-w-0 flex-1 pt-1">
                <h3 className="text-[17px] font-bold leading-6 text-text truncate mb-1">
                  {cooperativeUnit.branchName}
                </h3>
                <div className="h-stack gap-1.5 text-xs text-text-muted">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="truncate">{USER_STRINGS.dashboard.infoKdkmp}</span>
                </div>
                <div className="h-stack gap-1.5 text-xs text-text-muted mt-0.5">
                  <FileCheck2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{cooperativeUnit.registrationNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {rows?.map((row, idx) => (
              <InfoRow
                key={`coop-row-${idx}`}
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
