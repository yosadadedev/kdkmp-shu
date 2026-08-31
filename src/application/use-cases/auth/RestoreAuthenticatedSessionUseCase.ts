import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type { AuthenticatedSession } from '@domain/entities/AuthenticatedSession'

export class RestoreAuthenticatedSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<AuthenticatedSession | null> {
    return this.authRepository.loadAuthenticatedSession()
  }
}
