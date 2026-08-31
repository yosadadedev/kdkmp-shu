import type { SupportRepository, FaqAndContactBundle } from '@domain/repositories/SupportRepository'

export class GetFaqAndContactUseCase {
  constructor(private readonly supportRepository: SupportRepository) {}

  execute(): Promise<FaqAndContactBundle> {
    return this.supportRepository.getFaqAndContact()
  }
}
