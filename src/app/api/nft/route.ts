import { NextResponse } from 'next/server'

import { FORCE_DYNAMIC, HTTP_STATUS, NotionRequest, getAllNFTs, logger, withNotionHeaders } from '@/common'

export const dynamic = FORCE_DYNAMIC
export const revalidate = 0

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

  const result = await getAllNFTs(req.notionHeaders, limit, offset, start_cursor)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR })
  }

  return NextResponse.json({
    data: result.nfts,
    pagination: result.pagination,
  })
}

export const GET = withNotionHeaders(getHandler)
