'use client'

import { MANIFEST_URL } from './constants'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react'

import { IWithChildrenProps } from '@/common'

export const Providers: React.FC<IWithChildrenProps> = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider manifestUrl={MANIFEST_URL} uiPreferences={{ theme: THEME.DARK }}>
        {children}
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}
