import type { GateRepository } from '@domain/repositories/GateRepository'
import type { GateCompany } from '@domain/entities/GateCompany'

export class VerifyGateAccessCodeUseCase {
  constructor(private readonly gateRepository: GateRepository) {}

  execute(code: string): Promise<GateCompany | null> {
    return this.gateRepository.verifyAccessCode(code)
  }
}
