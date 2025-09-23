'use client'

import { Endpoints } from '../../api/endpoints'
import { del } from '../../api/rest'
import { retryConfig } from '../../api/utils'
import type { CartData } from '../../types/cart'
import type { IDeleteAllItemsInCartResponse } from './types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTonWallet } from '@tonconnect/ui-react'

export const useDeleteAllItemsInCart = () => {
  const queryClient = useQueryClient()
  const wallet = useTonWallet()
  const userId = wallet?.account.address

  const mutation = useMutation({
    mutationKey: ['cart', userId, 'deleteAll'],
    mutationFn: async () => {
      const url = Endpoints.deleteAllItemsInCart(userId!)
      const { data } = await del<IDeleteAllItemsInCartResponse>(url)
      return data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart', userId] })
      const previous = queryClient.getQueryData(['cart', userId]) as { data: CartData } | undefined

      queryClient.setQueryData(['cart', userId], (oldData: { data: CartData } | undefined) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            nfts: [],
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
    deleteAllItemsInCart: async () => {
      if (!userId) throw new Error('Wallet is not connected')
      return mutation.mutateAsync()
    },
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  }
}
