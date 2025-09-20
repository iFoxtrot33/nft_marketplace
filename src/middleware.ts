import { routing } from './i18n/routing'

import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {


  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|static|.*\\..*).*)'],
}
