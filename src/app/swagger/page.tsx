import { readFileSync } from 'fs'
import { join } from 'path'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

import { FORCE_STATIC } from '@/common'

export const dynamic = FORCE_STATIC

export default function SwaggerPage() {
  let spec = null

  try {
    const swaggerPath = join(process.cwd(), 'public', 'swagger.json')
    const swaggerContent = readFileSync(swaggerPath, 'utf8')
    spec = JSON.parse(swaggerContent)
  } catch (error) {
    console.error('Failed to load swagger spec:', error)
    return <div>Error loading Swagger documentation</div>
  }

  return <SwaggerUI spec={spec} />
}
