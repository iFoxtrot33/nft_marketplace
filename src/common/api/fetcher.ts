import { get } from './rest'

import type { AxiosRequestConfig } from 'axios'

export const fetcher = <T>(url: string, params?: object, config?: AxiosRequestConfig) => {
  return get<T>(url, params, config).then((response) => response.data)
}
