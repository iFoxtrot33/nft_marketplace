import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import '@/common/styles/globals.css'

import { Providers, StoriesBlock, WrapperLayout } from '@/components'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`bg-background-black ${inter.className}`} suppressHydrationWarning>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <WrapperLayout>
          <Providers>
            <NextIntlClientProvider messages={messages}>
              <StoriesBlock />
              {children}
            </NextIntlClientProvider>
          </Providers>
        </WrapperLayout>
      </body>
    </html>
  )
}
