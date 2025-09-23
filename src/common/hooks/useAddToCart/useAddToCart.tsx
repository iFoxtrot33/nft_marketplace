'use client'

import { Endpoints } from '../../api/endpoints'
import { post } from '../../api/rest'
import { retryConfig } from '../../api/utils'
import type { AddToCartRequest, CartData } from '../../types/cart'
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
            nfts: currentNfts.includes(payload.nft_address) ? currentNfts : [...currentNfts, payload.nft_address],
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
