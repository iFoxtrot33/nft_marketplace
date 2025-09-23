type LoaderParams = {
  src: string
  width: number
  quality?: number
}

export default function imageProxyLoader({ src }: LoaderParams): string {
  if (src.startsWith('/api/image-proxy')) {
    return src
  }

  if (src.startsWith('/') && !src.startsWith('//')) {
    return src
  }

  return `/api/image-proxy?url=${encodeURIComponent(src)}`
}
