import { NextResponse } from 'next/server'

import { Endpoints, NFTData, NotionRequest, logger, withNotionHeaders } from '@/common'

/**
 * @swagger
 * /api/nft:
 *   get:
 *     summary: Get all NFTs
 *     description: Returns a list of NFTs with pagination support
 *     tags:
 *       - NFT
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *         description: Alternative name for limit (for backward compatibility)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for cursor-based pagination
 *     responses:
 *       200:
 *         description: Successful response with NFT list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NFTListResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function getHandler(req: NotionRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)

  const limit = parseInt(searchParams.get('limit') || searchParams.get('page_size') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')
  const start_cursor = searchParams.get('cursor') || undefined

  logger.info({ limit, offset, start_cursor }, 'NFT API request parameters')
  const response = await fetch(Endpoints.getAllNFT, {
    method: 'POST',
    headers: req.notionHeaders,
    body: JSON.stringify({
      page_size: Math.min(limit + offset, 100),
      start_cursor,
      sorts: [
        {
          property: 'id',
          direction: 'ascending',
        },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    logger.error({ status: response.status, data }, 'Notion API Error')
    return NextResponse.json({ error: 'Failed to fetch NFTs from Notion' }, { status: response.status })
  }

  if (!data.results) {
    logger.error({ data }, 'No results in Notion response')
    return NextResponse.json({ error: 'Invalid response from Notion API' }, { status: 500 })
  }
  let nfts: NFTData[] = data.results.map((page: Record<string, unknown>) => {
    const notionPage = page as {
      id: string
      properties: Record<string, unknown>
      created_time: string
      last_edited_time: string
    }
    return {
      page_id: notionPage.id,
      id: (notionPage.properties.id as { number: number })?.number,
      title: (notionPage.properties[''] as { title: Array<{ plain_text: string }> })?.title?.[0]?.plain_text || '',
      nft_address:
        (notionPage.properties.nft_address as { rich_text: Array<{ plain_text: string }> })?.rich_text?.[0]
          ?.plain_text || '',
      created_time: notionPage.created_time,
      last_edited_time: notionPage.last_edited_time,
    }
  })

  if (offset > 0) {
    nfts = nfts.slice(offset, offset + limit)
  } else {
    nfts = nfts.slice(0, limit)
  }

  logger.info({ totalFromNotion: data.results.length, returned: nfts.length }, 'NFT API response')

  return NextResponse.json({
    data: nfts,
    pagination: {
      limit,
      offset,
      returned: nfts.length,
      has_more: data.has_more,
      next_cursor: data.next_cursor,
    },
  })
}

export const GET = withNotionHeaders(getHandler)
