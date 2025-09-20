import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import '@/common/styles/globals.css'

import { WrapperLayout } from '@/components/core'

export const metadata: Metadata = {
  title: 'Auth: NFT Marketplace',
  description: 'Auth: NFT Marketplace with internationalization',
}

export default async function AuthLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="bg-background-black min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <WrapperLayout>{children}</WrapperLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
