import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '../../api/constants'
import { retryConfig } from '../../api/utils'
import { IUseGetNFTProps, IUseGetNFTReturn } from './types'

import { Endpoints, TONNFTData, useFetch } from '@/common'

export const useGetNFT = ({ address }: IUseGetNFTProps): IUseGetNFTReturn => {
  const { data, isLoading, error } = useFetch<TONNFTData>(`nft-${address}`, Endpoints.getSingleNFT(address), {
    enabled: Boolean(address),
    ...retryConfig,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

  return {
    data,
    isLoading,
    error: error as Error | null,
  }
}
