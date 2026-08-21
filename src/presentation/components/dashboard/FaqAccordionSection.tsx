import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'

export interface FaqItem {
  readonly q: string
  readonly a: string
}

export function FaqAccordionSection() {
  const items: readonly FaqItem[] = USER_STRINGS.dashboard.faq

  return (
    <div className="space-y-2.5">
      <div className="h-stack gap-2 mb-1 px-0.5">
        <span className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 inline-flex items-center justify-center shrink-0">
          <HelpCircle className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold leading-5 text-text truncate">
            {USER_STRINGS.dashboard.sectionFaqTitle}
          </h3>
          <p className="text-[11px] leading-4 text-text-muted truncate">
            Jawaban cepat tentang SHU &amp; voting KDKMP
          </p>
        </div>
      </div>

      <Card variant="default" padding="sm" className="overflow-hidden !p-1.5 shadow-sm">
        <div className="flex flex-col divide-y divide-border-light">
          {items.map((item, index) => (
            <FaqItemRow key={`${index}-${item.q}`} item={item} index={index} />
          ))}
        </div>
      </Card>
    </div>
  )
}

interface FaqItemRowProps {
  item: FaqItem
  index: number
}

function FaqItemRow({ item, index }: FaqItemRowProps) {
  const [isOpen, setIsOpen] = useState(false)
  void index

  return (
    <div className={cn('bg-surface first:rounded-xl last:rounded-xl overflow-hidden')}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full h-stack justify-between gap-3 px-3 py-3 text-left hover:bg-surface-muted active:bg-surface-muted/80 transition-colors"
      >
        <span className="h-stack gap-2.5 min-w-0 flex-1">
          <span className="h-5.5 w-5.5 rounded-md bg-brand-50 text-brand-700 text-[11px] font-bold inline-flex items-center justify-center shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[13px] font-semibold leading-5 text-text min-w-0 line-clamp-2">
            {item.q}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-4.5 w-4.5 shrink-0 text-text-muted transition-transform duration-200 ease-out',
            isOpen && 'rotate-180 text-brand-600',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none',
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-3 pb-3.5 pt-0 pl-[48px] pr-3">
            <p className="text-[12.5px] leading-6 text-text-body">
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
