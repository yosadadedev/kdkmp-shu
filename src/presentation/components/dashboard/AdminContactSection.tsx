import { Headset, Mail, MessageCircle } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { useFaqAndContact } from '@application/hooks/support/useFaqAndContact'

function buildWaLink(phone: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '')
  return `https://wa.me/62${digits}`
}

export function AdminContactSection() {
  const s = USER_STRINGS.dashboard
  const { contact, isLoading, errorCode } = useFaqAndContact()

  return (
    <div className="space-y-2.5">
      <div className="h-stack gap-2 mb-1 px-0.5">
        <span className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 inline-flex items-center justify-center shrink-0">
          <Headset className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold leading-5 text-text truncate">
            {s.sectionAdminContact}
          </h3>
          <p className="text-[11px] leading-4 text-text-muted truncate">
            {s.adminContactSubtitle}
          </p>
        </div>
      </div>

      <Card variant="default" padding="md" className="shadow-sm">
        {!isLoading && !contact && errorCode ? (
          <p className="text-xs leading-5 text-text-muted text-center py-2">
            {USER_STRINGS.common.loadingErrorTitle}
          </p>
        ) : isLoading || !contact ? (
          <div className="space-y-3 py-1">
            <Skeleton widthClass="w-full h-10 rounded-lg" />
            <Skeleton widthClass="w-full h-10 rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border-light">
            <a
              href={buildWaLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-stack gap-3 py-3 -my-0.5 first:pt-1 first:-mt-1 rounded-xl hover:bg-surface-muted active:bg-surface-muted/80 transition-colors"
            >
              <span className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] leading-4 text-text-muted">WhatsApp</span>
                <span className="block text-[13.5px] font-semibold leading-5 text-text">
                  {contact.whatsapp}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="h-stack gap-3 py-3 -my-0.5 last:pb-1 last:-mb-1 rounded-xl hover:bg-surface-muted active:bg-surface-muted/80 transition-colors"
            >
              <span className="h-10 w-10 rounded-full bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] leading-4 text-text-muted">Email</span>
                <span className="block text-[13.5px] font-semibold leading-5 text-text">
                  {contact.email}
                </span>
              </span>
            </a>
          </div>
        )}
      </Card>
    </div>
  )
}
