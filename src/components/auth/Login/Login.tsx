'use client'

import { Button } from '@/ui/Button'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const Login = () => {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const router = useRouter()

  useEffect(() => {
    if (wallet) {
      router.push('/')
    }
  }, [wallet, router])

  const handleConnect = () => {
    tonConnectUI.openModal()
  }

  return (
    <div className="mt-4 w-full">
      <Button onClick={handleConnect}>Sign In with TON Connect</Button>
    </div>
  )
}
