import { FORCE_STATIC } from '@/common'

import { AuthPage } from '@/components'

export const dynamic = FORCE_STATIC

export default function Auth() {
  return (
    <div overflow-y-hidden>
      <AuthPage />
    </div>
  )
}
