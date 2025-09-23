import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { AuthGuardLayout } from '@/components'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'homePage' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    icons: {
      icon: '/logo.svg',
    },
  }
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  return (
    <div className="min-h-screen overflow-x-hidden scrollbar-hide">
      <AuthGuardLayout>{children}</AuthGuardLayout>
    </div>
  )
}
