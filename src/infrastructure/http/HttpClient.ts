import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

export type HttpRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown
  queryParams?: Record<string, string | number | boolean | undefined>
  timeoutMs?: number
}

export interface HttpResponseEnvelope<T> {
  ok: boolean
  status: number
  statusText: string
  data: T
  headers: Headers
}

const buildUrlWithQuery = (baseUrl: string, query?: HttpRequestInit['queryParams']): string => {
  if (!query) return baseUrl
  const searchParams = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    searchParams.append(key, String(value))
  })
  const qs = searchParams.toString()
  return qs ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${qs}` : baseUrl
}

const serializeBody = (body: unknown, headers: Headers): BodyInit | null => {
  if (body === undefined || body === null) return null
  if (body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
    return body as BodyInit
  }
  headers.set('Content-Type', 'application/json')
  return JSON.stringify(body)
}

const DEFAULT_TIMEOUT_MS = 15_000

export interface HttpClientConfig {
  baseUrl?: string
  defaultTimeoutMs?: number
  authTokenProvider?: () => string | null
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly defaultTimeoutMs: number
  private readonly authTokenProvider?: () => string | null

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? ''
    this.defaultTimeoutMs = config.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS
    this.authTokenProvider = config.authTokenProvider
  }

  async request<T>(path: string, init: HttpRequestInit = {}): Promise<HttpResponseEnvelope<T>> {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), init.timeoutMs ?? this.defaultTimeoutMs)

    try {
      const headers = new Headers(init.headers ?? {})
      const authToken = this.authTokenProvider?.()
      if (authToken) headers.set('Authorization', `Bearer ${authToken}`)

      const finalUrl = buildUrlWithQuery(
        path.startsWith('http') ? path : `${this.baseUrl}${path}`,
        init.queryParams,
      )

      const body = serializeBody(init.body, headers)

      const response = await fetch(finalUrl, {
        method: init.method ?? 'GET',
        headers,
        body,
        credentials: init.credentials ?? 'same-origin',
        mode: init.mode,
        signal: controller.signal,
        cache: init.cache,
      })

      let data: unknown
      const contentType = response.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}))
      } else {
        data = await response.text().catch(() => '')
      }

      if (!response.ok) {
        throw createAppError(ErrorCode.NETWORK_ERROR, {
          meta: { status: response.status, statusText: response.statusText, url: finalUrl },
        })
      }

      return {
        ok: true,
        status: response.status,
        statusText: response.statusText,
        data: data as T,
        headers: response.headers,
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw createAppError(ErrorCode.NETWORK_ERROR, { cause: err, meta: { reason: 'timeout' } })
      }
      throw err
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  get<T>(path: string, init?: Omit<HttpRequestInit, 'method' | 'body'>): Promise<HttpResponseEnvelope<T>> {
    return this.request<T>(path, { ...init, method: 'GET' })
  }

  post<T>(path: string, init?: HttpRequestInit): Promise<HttpResponseEnvelope<T>> {
    return this.request<T>(path, { ...init, method: 'POST' })
  }

  put<T>(path: string, init?: HttpRequestInit): Promise<HttpResponseEnvelope<T>> {
    return this.request<T>(path, { ...init, method: 'PUT' })
  }

  delete<T>(path: string, init?: Omit<HttpRequestInit, 'body'>): Promise<HttpResponseEnvelope<T>> {
    return this.request<T>(path, { ...init, method: 'DELETE' })
  }
}
