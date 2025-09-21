import { FORCE_STATIC, TEN_MINUTES } from '@/common'

export const revalidate = TEN_MINUTES
export const dynamic = FORCE_STATIC

export default function Home() {
  const buildTime = new Date().toLocaleString()

  return (
    <>
      <p className="text-gray-400 mt-4">lastUpdated: {buildTime}</p>
    </>
  )
}
