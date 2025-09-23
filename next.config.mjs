/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  images: {
    minimumCacheTTL: 86400,
    loader: 'custom',
    loaderFile: './src/common/utils/imageLoader.ts',
  },
}

export default withNextIntl(nextConfig)
