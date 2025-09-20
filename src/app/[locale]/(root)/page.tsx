import { useTranslations } from 'next-intl'

export const revalidate = 600
export const dynamic = 'force-static'

export default function Home() {
  const t = useTranslations('homePage')
  const buildTime = new Date().toLocaleString()

  console.log('Page rendered at:', buildTime)

  return (
    <div>
      <h1 className="text-white">{t('title')}</h1>

      <p className="text-gray-400 mt-4">lastUpdated: {buildTime}</p>
    </div>
  )
}
