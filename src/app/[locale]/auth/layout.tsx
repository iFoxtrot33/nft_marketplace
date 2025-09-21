import type { Metadata } from 'next'

import '@/common/styles/globals.css'

export const metadata: Metadata = {
  title: 'Auth: NFT Marketplace',
  description: 'Auth: NFT Marketplace with internationalization',
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  return <div className="h-screen overflow-hidden ">{children}</div>
}
