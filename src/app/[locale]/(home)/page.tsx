import { FORCE_STATIC, TEN_MINUTES } from '@/common'

import { HomePage } from '@/components'

export const revalidate = TEN_MINUTES
export const dynamic = FORCE_STATIC

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  )
}
