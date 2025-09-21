'use client'

import { useTonWallet } from '@tonconnect/ui-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { IWithChildrenProps } from '@/common'

export const AuthGuardLayout: React.FC<IWithChildrenProps> = ({ children }) => {
  const wallet = useTonWallet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && !wallet) {
      router.push('/login')
    }
  }, [wallet, isLoading, router])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>
  }

  if (!wallet) {
    return null
  }

  return <>{children}</>
}
