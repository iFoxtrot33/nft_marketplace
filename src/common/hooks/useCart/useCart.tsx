'use client'

import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '../../api/constants'
import { Endpoints } from '../../api/endpoints'
import { fetcher } from '../../api/fetcher'
import { retryConfig } from '../../api/utils'
import type { CartData } from '../../types/cart'

import { useQuery } from '@tanstack/react-query'
import { useTonWallet } from '@tonconnect/ui-react'

type GetCartResponse = {
  data: CartData
}

export const useCart = () => {
  const wallet = useTonWallet()
  const userId = wallet?.account.address
  const enabled = Boolean(userId)
  const { data, isLoading, error } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => fetcher<GetCartResponse>(Endpoints.getCart(userId!)),
    enabled,
    ...retryConfig,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

  return {
    cart: data?.data,
    isLoading,
    error: error as Error | null,
  }
}
