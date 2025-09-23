'use client'

import { Endpoints } from '../../api/endpoints'
import { del } from '../../api/rest'
import { retryConfig } from '../../api/utils'
import type { CartData, RemoveFromCartRequest } from '../../types/cart'
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
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['cart', userId] })
      const previous = queryClient.getQueryData(['cart', userId]) as { data: CartData } | undefined

      queryClient.setQueryData(['cart', userId], (oldData: { data: CartData } | undefined) => {
        if (!oldData?.data) return oldData
        const currentNfts: string[] = oldData.data.nfts || []
        return {
          ...oldData,
          data: {
            ...oldData.data,
            nfts: currentNfts.filter((addr) => addr !== payload.nft_address),
          },
        }
      })

      return { previous }
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cart', userId], context.previous)
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['cart', userId], { data: res.data })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] })
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
