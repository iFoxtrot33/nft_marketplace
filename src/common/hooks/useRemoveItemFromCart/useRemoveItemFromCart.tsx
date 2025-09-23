'use client'

import { Endpoints } from '../../api/endpoints'
import { del } from '../../api/rest'
import { retryConfig } from '../../api/utils'
import type { RemoveFromCartRequest } from '../../types/cart'
import type { IRemoveFromCartResponse } from './types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTonWallet } from '@tonconnect/ui-react'

export const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient()
  const wallet = useTonWallet()
  const userId = wallet?.account.address

  const mutation = useMutation({
    mutationKey: ['cart', userId, 'remove'],
    mutationFn: async (payload: RemoveFromCartRequest) => {
      const url = Endpoints.getCart(userId!)
      const { data } = await del<IRemoveFromCartResponse, RemoveFromCartRequest>(url, payload)
      return data
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['cart', userId], { data: res.data })
    },
    ...retryConfig,
  })

  return {
    removeFromCart: async (payload: RemoveFromCartRequest) => {
      if (!userId) throw new Error('Wallet is not connected')
      return mutation.mutateAsync(payload)
    },
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  }
}
