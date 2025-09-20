export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000, // 5 min
  MEDIUM: 15 * 60 * 1000, // 15 min
  LONG: 30 * 60 * 1000, // 30 min
  VERY_LONG: 60 * 60 * 1000, // 1 min
} as const

export const DEFAULT_STALE_TIME = CACHE_TIME.SHORT
export const DEFAULT_GC_TIME = CACHE_TIME.MEDIUM
