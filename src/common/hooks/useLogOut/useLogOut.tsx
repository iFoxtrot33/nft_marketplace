'use client'

import { Endpoints } from '../../api/endpoints'
import { del } from '../../api/rest'
import { retryConfig } from '../../api/utils'

import { useMutation } from '@tanstack/react-query'
import { useTonWallet } from '@tonconnect/ui-react'

export const useLogOut = () => {
  const wallet = useTonWallet()
  const userId = wallet?.account.address

  const mutation = useMutation({
    mutationKey: ['logout', userId],
    mutationFn: async () => {
      if (!userId) throw new Error('Wallet is not connected')

      const url = Endpoints.deleteCartCompletely(userId)
      del(url).catch(() => {})

      return { success: true }
    },
    onSuccess: () => {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('ton-connect')) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })

      window.location.reload()
    },
    ...retryConfig,
  })

  return {
    logOut: async () => {
      if (!userId) throw new Error('Wallet is not connected')
      return mutation.mutateAsync()
    },
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  }
}
