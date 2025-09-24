import { NextResponse } from 'next/server'

import { CACHE_STALE_WHILE_REVALIDATE, CACHE_S_MAXAGE, HTTP_STATUS, USER_AGENT } from '@/common'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('url')

  if (!target) {
    return NextResponse.json({ error: 'Missing url param' }, { status: HTTP_STATUS.BAD_REQUEST })
  }

  let url: URL
  try {
    url = new URL(target)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: HTTP_STATUS.BAD_REQUEST })
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return NextResponse.json({ error: 'Unsupported protocol' }, { status: HTTP_STATUS.BAD_REQUEST })
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
    return NextResponse.json({ error: 'Fetch failed' }, { status: HTTP_STATUS.BAD_GATEWAY })
  }
}
