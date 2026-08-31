import type { HttpClient } from '@infra/http/HttpClient'
import { ApiEndpoints } from '@infra/http/apiEndpoints'
import type { GetMyProfileResponseDto } from '@infra/http/dto/profile/ProfileDto'
import type { FaqAndContactResponseDto } from '@infra/http/dto/profile/FaqAndContactDto'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export const getMyProfile = async (httpClient: HttpClient): Promise<GetMyProfileResponseDto> => {
  try {
    const response = await httpClient.get<GetMyProfileResponseDto>(ApiEndpoints.profile.getMyProfile, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}

export const getFaqAndContact = async (httpClient: HttpClient): Promise<FaqAndContactResponseDto> => {
  try {
    const response = await httpClient.get<FaqAndContactResponseDto>(ApiEndpoints.profile.getFaqAndContact, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}
