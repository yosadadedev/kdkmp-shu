import type { GateCompany } from '@domain/entities/GateCompany'

export interface GateRepository {
  /** Returns null when the code is invalid (404) — not thrown, since that's an expected business outcome, not a failure. */
  verifyAccessCode(code: string): Promise<GateCompany | null>
}
