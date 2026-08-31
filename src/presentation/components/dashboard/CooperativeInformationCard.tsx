import { useMemo } from 'react'
import { FileCheck2, MapPin, Landmark } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'

export interface CooperativeInformationCardProps {
  cooperativeUnit: CooperativeUnit | null
  isLoading: boolean
}

export function CooperativeInformationCard({ cooperativeUnit, isLoading }: CooperativeInformationCardProps) {
  const rows = useMemo(() => {
    if (!cooperativeUnit) return null
    return [
      {
        label: USER_STRINGS.dashboard.infoKdkmpName,
        value: cooperativeUnit.branchName,
        divider: true,
      },
      {
        label: USER_STRINGS.dashboard.infoKdkmpRegNumber,
        value: cooperativeUnit.registrationNumber,
        divider: true,
        icon: <FileCheck2 className="h-4 w-4" />,
      },
      {
        label: USER_STRINGS.dashboard.infoKdkmpAddress,
        value: [cooperativeUnit.address, cooperativeUnit.village, cooperativeUnit.district]
          .filter(Boolean)
          .join(', '),
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
              key={`coop-row-${idx}`}
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
