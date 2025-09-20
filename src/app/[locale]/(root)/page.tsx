import { StoriesBlock, WrapperLayout } from '@/components'

export const revalidate = 600
export const dynamic = 'force-static'

export default function Home() {
  const buildTime = new Date().toLocaleString()

  console.log('Page rendered at:', buildTime)

  return (
    <WrapperLayout>
      <StoriesBlock />

      <p className="text-gray-400 mt-4">lastUpdated: {buildTime}</p>
    </WrapperLayout>
  )
}
