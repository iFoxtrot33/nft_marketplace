'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react'
import React from 'react'

import { IWithChildrenProps } from '@/common'

export const Providers: React.FC<IWithChildrenProps> = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider
        manifestUrl="https://nft-marketplace-iurii.vercel.app/tonconnect-manifest.json"
        uiPreferences={{ theme: THEME.DARK }}
      >
        {children}
      </TonConnectUIProvider>
    </QueryClientProvider>
  )
}
