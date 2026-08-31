import type { HttpClient } from '@infra/http/HttpClient'
import { ApiEndpoints } from '@infra/http/apiEndpoints'
import type { ReportCardResponseDto } from '@infra/http/dto/report/ReportCardDto'
import type { PnlSummaryResponseDto, PnlDetailResponseDto } from '@infra/http/dto/report/PnlDto'
import type { ShuAllocationResponseDto } from '@infra/http/dto/report/ShuAllocationDto'
import type { PnlPeriod } from '@domain/entities/PnlReport'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export const getReportCard = async (httpClient: HttpClient): Promise<ReportCardResponseDto> => {
  try {
    const response = await httpClient.get<ReportCardResponseDto>(ApiEndpoints.report.getCard, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}

export const getPnlSummary = async (
  httpClient: HttpClient,
  period: PnlPeriod,
): Promise<PnlSummaryResponseDto> => {
  try {
    const response = await httpClient.get<PnlSummaryResponseDto>(ApiEndpoints.report.getPnlSummary, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      queryParams: { period },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}

export const getPnlDetail = async (
  httpClient: HttpClient,
  period: PnlPeriod,
  section: string,
): Promise<PnlDetailResponseDto> => {
  try {
    const response = await httpClient.get<PnlDetailResponseDto>(ApiEndpoints.report.getPnlDetail, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      queryParams: { period, section },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}

export const getShuAllocation = async (
  httpClient: HttpClient,
  period: PnlPeriod,
): Promise<ShuAllocationResponseDto> => {
  try {
    const response = await httpClient.get<ShuAllocationResponseDto>(ApiEndpoints.report.getShuAllocation, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      queryParams: { period },
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}
