import type { HttpClient } from '@infra/http/HttpClient'
import { ApiEndpoints } from '@infra/http/apiEndpoints'
import type { GetKdkmpByIdResponseDto } from '@infra/http/dto/kdkmp/KdkmpDto'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export const getKdkmpById = async (
  httpClient: HttpClient,
  id: number | string,
): Promise<GetKdkmpByIdResponseDto> => {
  try {
    const response = await httpClient.get<GetKdkmpByIdResponseDto>(ApiEndpoints.kdkmp.getById(id))
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}
