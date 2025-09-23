import { routing } from './routing'

import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  const homePage = await import(`../../messages/${locale}/home.json`)
  const authPage = await import(`../../messages/${locale}/auth.json`)
  const common = await import(`../../messages/${locale}/common.json`)

  const messages = {
    homePage: homePage.default,
    authPage: authPage.default,
    common: common.default,
  }

  return {
    locale,
    timeZone: 'UTC',
    messages,
  }
})
