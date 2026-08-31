import type { SupportRepository, FaqAndContactBundle } from '@domain/repositories/SupportRepository'
import type { HttpClient } from '@infra/http/HttpClient'
import { getFaqAndContact } from '@infra/http/api/profileApi'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export class HttpSupportRepository implements SupportRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getFaqAndContact(): Promise<FaqAndContactBundle> {
    try {
      const envelope = await getFaqAndContact(this.httpClient)
      const { faq, contact } = envelope.data
      return {
        faq: faq.map((item) => ({ id: item.id, question: item.question, answer: item.answer })),
        contact: { email: contact.email, whatsapp: contact.whatsapp },
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }
}
