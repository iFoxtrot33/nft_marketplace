import { NOTION_VERSION } from './constants'
import { NotionRequest } from './types'

import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

import { HTTP_STATUS } from '@/common'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export function withNotionHeaders<T extends unknown[]>(
  handler: (req: NotionRequest, ...args: T) => Promise<NextResponse>,
) {
  return async function (req: NextRequest, ...args: T): Promise<NextResponse> {
    ;(req as NotionRequest).notionHeaders = {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    }
    ;(req as NotionRequest).notion = notion

    try {
      return await handler(req as NotionRequest, ...args)
    } catch (error: unknown) {
      console.error('Notion API Error:', error)

      const notionError = error as { code?: string }

      if (notionError.code === 'object_not_found') {
        return NextResponse.json({ error: 'NFT not found' }, { status: HTTP_STATUS.NOT_FOUND })
      }

      if (notionError.code === 'validation_error') {
        return NextResponse.json({ error: 'Invalid data format' }, { status: HTTP_STATUS.BAD_REQUEST })
      }

      if (notionError.code === 'rate_limited') {
        return NextResponse.json({ error: 'Rate limited. Try again later' }, { status: HTTP_STATUS.TOO_MANY_REQUESTS })
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR })
    }
  }
}
