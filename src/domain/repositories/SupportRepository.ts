import type { FaqItem } from '@domain/entities/FaqItem'
import type { AdminContact } from '@domain/entities/AdminContact'

export interface FaqAndContactBundle {
  faq: FaqItem[]
  contact: AdminContact
}

export interface SupportRepository {
  getFaqAndContact(): Promise<FaqAndContactBundle>
}
