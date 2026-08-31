import type { HttpClient } from '@infra/http/HttpClient'
import { ApiEndpoints } from '@infra/http/apiEndpoints'
import type { ValidateNikRequestDto, ValidateNikResponseDto } from '@infra/http/dto/auth/ValidateNikDto'
import type { ValidateOtpRequestDto, ValidateOtpResponseDto } from '@infra/http/dto/auth/ValidateOtpDto'
import type { RefreshTokenRequestDto, RefreshTokenResponseDto } from '@infra/http/dto/auth/RefreshTokenDto'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export const validateNik = async (
  httpClient: HttpClient,
  payload: ValidateNikRequestDto,
): Promise<ValidateNikResponseDto> => {
  try {
    const response = await httpClient.post<ValidateNikResponseDto>(ApiEndpoints.auth.validateNik, {
      body: payload,
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}

export const validateOtp = async (
  httpClient: HttpClient,
  payload: ValidateOtpRequestDto,
): Promise<ValidateOtpResponseDto> => {
  try {
    const response = await httpClient.post<ValidateOtpResponseDto>(ApiEndpoints.auth.validateOtp, {
      body: payload,
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}

export const refreshToken = async (
  httpClient: HttpClient,
  payload: RefreshTokenRequestDto,
): Promise<RefreshTokenResponseDto> => {
  try {
    const response = await httpClient.post<RefreshTokenResponseDto>(ApiEndpoints.auth.refresh, {
      body: payload,
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}
