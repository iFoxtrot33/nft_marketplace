import { NextResponse } from 'next/server'

const CACHE_S_MAXAGE = 60 * 60 * 24
const CACHE_STALE_WHILE_REVALIDATE = 60 * 60 * 12
const USER_AGENT = 'Mozilla/5.0 (compatible; NFTMarketBot/1.0; +https://example.com)'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('url')

  if (!target) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  let url: URL
  try {
    url = new URL(target)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return NextResponse.json({ error: 'Unsupported protocol' }, { status: 400 })
  }

  try {
    const upstream = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: upstream.status })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(upstream.body, {
      headers: {
        'content-type': contentType,
        'cache-control': `public, s-maxage=${CACHE_S_MAXAGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
      },
    })
  } catch (_e) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 })
  }
}
