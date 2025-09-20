import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from './constants'
import { fetcher } from './fetcher'

import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

export const useFetch = <T>(
  queryName: string,
  url: string,
  fetchConfig?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
  enabled = true,
  config?: AxiosRequestConfig,
  params?: object,
) => {
  return useQuery({
    queryKey: [queryName],
    queryFn: () => fetcher<T>(url, params, config),
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    ...fetchConfig,
  })
}
