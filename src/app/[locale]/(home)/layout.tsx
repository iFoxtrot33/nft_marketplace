import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NFT Marketplace',
  description: 'NFT Marketplace with internationalization',
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  return <div>{children}</div>
}
