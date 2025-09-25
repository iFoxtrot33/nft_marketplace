type LoaderParams = {
  src: string
  width: number
  quality?: number
}

export default function imageProxyLoader({ src, width, quality }: LoaderParams): string {
  if (src.startsWith('/api/image-proxy')) {
    const sep = src.includes('?') ? '&' : '?'
    const q = quality ? `&q=${quality}` : ''
    return `${src}${sep}w=${width}${q}`
  }

  if (src.startsWith('/') && !src.startsWith('//')) {
    const sep = src.includes('?') ? '&' : '?'
    const q = quality ? `&q=${quality}` : ''
    return `${src}${sep}w=${width}${q}`
  }

  const q = quality ? `&q=${quality}` : ''
  return `/api/image-proxy?url=${encodeURIComponent(src)}&w=${width}${q}`
}
