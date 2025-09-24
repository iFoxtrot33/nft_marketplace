import { BACKOFF_MULTIPLIER, BASE_DELAY_MS, HTTP_STATUS, MAX_DELAY_MS, MAX_RETRY_ATTEMPTS } from '@/common'

interface IErrorWithStatus {
  status?: number
  response?: { status?: number }
  code?: number
}

export const retryOn429 = (failureCount: number, error: unknown): boolean => {
  const err = error as IErrorWithStatus
  const errorStatus = err?.status || err?.response?.status || err?.code
  if (errorStatus === HTTP_STATUS.TOO_MANY_REQUESTS && failureCount < MAX_RETRY_ATTEMPTS) {
    return true
  }

  return false
}

export const exponentialBackoffDelay = (attemptIndex: number): number => {
  const delay = Math.min(BASE_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attemptIndex), MAX_DELAY_MS)
  return delay
}

export const retryConfig = {
  retry: retryOn429,
  retryDelay: exponentialBackoffDelay,
}
