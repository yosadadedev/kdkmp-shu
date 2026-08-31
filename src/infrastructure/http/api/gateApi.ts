import type { HttpClient } from '@infra/http/HttpClient'
import { ApiEndpoints } from '@infra/http/apiEndpoints'
import type { GateAccessResponseDto } from '@infra/http/dto/gate/GateDto'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export const verifyGateAccessCode = async (
  httpClient: HttpClient,
  code: string,
): Promise<GateAccessResponseDto> => {
  try {
    const response = await httpClient.get<GateAccessResponseDto>(ApiEndpoints.gate.verifyAccessCode(code), {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}
