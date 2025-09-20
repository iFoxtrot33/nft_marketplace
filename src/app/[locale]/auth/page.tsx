import { useTranslations } from 'next-intl'

export const dynamic = 'force-static'

export default function Auth() {
  const t = useTranslations('authPage')
  return (
    <div>
      <h1 className="text-white">{t('title')}</h1>
      <p className="text-gray-400 text-sm mt-2">This page is SSG (Static Site Generation)</p>
    </div>
  )
}
