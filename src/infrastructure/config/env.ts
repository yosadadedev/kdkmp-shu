import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.union([z.string().url(), z.literal('')]).optional(),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success && import.meta.env.DEV) {
  console.warn('[env] Invalid environment variables:', parsedEnv.error.flatten().fieldErrors)
}

const safeEnv = parsedEnv.success ? parsedEnv.data : {}

export const env = {
  apiBaseUrl: safeEnv.VITE_API_BASE_URL ?? '',
  apiTimeoutMs: safeEnv.VITE_API_TIMEOUT_MS ?? 15_000,
} as const
