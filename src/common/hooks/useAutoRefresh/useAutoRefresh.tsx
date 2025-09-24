'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes

export const useAutoRefresh = (scrollToTop = true) => {
  const [refreshId, setRefreshId] = useState(Math.random())
  const queryClient = useQueryClient()

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollToTop) {
        window.scrollTo(0, 0)
      }

      queryClient.removeQueries({ queryKey: ['nfts'] })
      setRefreshId(Math.random())
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [queryClient, scrollToTop])

  return refreshId
}
