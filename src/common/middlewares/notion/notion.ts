import { Client } from '@notionhq/client'
import { NextRequest, NextResponse } from 'next/server'

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
})

export const NOTION_VERSION = '2022-06-28'
export const NFT_DATABASE_ID = process.env.NEXT_PUBLIC_NOTION_NFTS_TABLE_ID!

export interface NotionRequest extends NextRequest {
  notion: Client
  notionHeaders: Record<string, string>
}

export function withNotionHeaders<T extends unknown[]>(
  handler: (req: NotionRequest, ...args: T) => Promise<NextResponse>,
) {
  return async function (req: NextRequest, ...args: T): Promise<NextResponse> {
    ;(req as NotionRequest).notionHeaders = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTION_TOKEN}`,
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
        return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
      }

      if (notionError.code === 'validation_error') {
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
      }

      if (notionError.code === 'rate_limited') {
        return NextResponse.json({ error: 'Rate limited. Try again later' }, { status: 429 })
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
