'use client'

import { Button } from '@/ui/Button'
import { useTonConnectUI } from '@tonconnect/ui-react'

export const Login = () => {
  const [tonConnectUI] = useTonConnectUI()

  const handleConnect = () => {
    tonConnectUI.openModal()
  }

  return (
    <div className="mt-4 w-full">
      <Button onClick={handleConnect}>Sign In with TON Connect</Button>
    </div>
  )
}
