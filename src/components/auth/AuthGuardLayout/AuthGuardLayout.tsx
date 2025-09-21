'use client'

import { AuthLoader } from '../AuthLoader'

import { useTonWallet } from '@tonconnect/ui-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { IWithChildrenProps } from '@/common'

export const AuthGuardLayout: React.FC<IWithChildrenProps> = ({ children }) => {
  const wallet = useTonWallet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authPrefetch = router.prefetch('/auth')
    const homePrefetch = router.prefetch('/')

    const minTimer = setTimeout(() => {
      Promise.all([authPrefetch, homePrefetch])
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
    }, 2000)

    return () => clearTimeout(minTimer)
  }, [router])

  useEffect(() => {
    if (!isLoading && !wallet) {
      router.push('/auth')
    }
  }, [wallet, isLoading, router])

  if (isLoading) {
    return <AuthLoader />
  }

  if (!wallet) {
    return null
  }

  return <>{children}</>
}
