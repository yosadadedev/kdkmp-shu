import type { GateRepository } from '@domain/repositories/GateRepository'
import type { GateCompany } from '@domain/entities/GateCompany'
import type { HttpClient } from '@infra/http/HttpClient'
import { verifyGateAccessCode } from '@infra/http/api/gateApi'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export class HttpGateRepository implements GateRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async verifyAccessCode(code: string): Promise<GateCompany | null> {
    try {
      const { data } = await verifyGateAccessCode(this.httpClient, code)
      return { name: data.company.name, nik: data.company.nik }
    } catch (err) {
      if (isApplicationError(err) && err.meta?.status === 404) return null
      throw wrapUnknownAsAppError(err)
    }
  }
}
