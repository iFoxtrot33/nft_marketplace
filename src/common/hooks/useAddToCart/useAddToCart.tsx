'use client'

import { Endpoints } from '../../api/endpoints'
import { post } from '../../api/rest'
import { retryConfig } from '../../api/utils'
import type { AddToCartRequest } from '../../types/cart'
import { IAddToCartResponse } from './types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTonWallet } from '@tonconnect/ui-react'

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const wallet = useTonWallet()
  const userId = wallet?.account.address

  const mutation = useMutation({
    mutationKey: ['cart', userId, 'add'],
    mutationFn: async (payload: AddToCartRequest) => {
      const url = Endpoints.addToCart(userId!)
      const { data } = await post<IAddToCartResponse, AddToCartRequest>(url, payload)
      return data
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['cart', userId], { data: res.data })
    },
    ...retryConfig,
  })

  return {
    addToCart: async (payload: AddToCartRequest) => {
      if (!userId) {
        throw new Error('Wallet is not connected')
      }
      return mutation.mutateAsync(payload)
    },
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  }
}
