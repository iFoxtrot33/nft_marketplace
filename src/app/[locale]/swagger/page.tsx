import spec from '../../../../public/swagger.json'

import SwaggerUI from 'swagger-ui-react'

import { FORCE_STATIC } from '@/common'

export const dynamic = FORCE_STATIC

export default function Auth() {
  return <SwaggerUI spec={spec} />
}
