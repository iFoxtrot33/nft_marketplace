'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { IWithChildrenProps } from '@/common'

export const Providers: React.FC<IWithChildrenProps> = ({ children }) => {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
