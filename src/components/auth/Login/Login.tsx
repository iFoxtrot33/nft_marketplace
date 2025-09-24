'use client'

import { Button } from '@/ui/Button'
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { PageRoute } from '@/common'

export const Login = () => {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const router = useRouter()
  const t = useTranslations('authPage')

  useEffect(() => {
    if (wallet) {
      router.push(PageRoute.home)
    }
  }, [wallet, router])

  const handleConnect = () => {
    tonConnectUI.openModal()
  }

  return (
    <div className="mt-4 w-full">
      <Button onClick={handleConnect}>{t('signInWithTONConnect')}</Button>
    </div>
  )
}
