import { Endpoints, NFTData, logger } from '@/common'

export async function getAllNFTs(
  notionHeaders: Record<string, string>,
  limit: number = 10,
  offset: number = 0,
  start_cursor?: string,
): Promise<{
  success: boolean
  nfts?: NFTData[]
  pagination?: {
    limit: number
    offset: number
    returned: number
    has_more: boolean
    next_cursor: string | null
  }
  error?: string
}> {
  try {
    logger.info({ limit, offset, start_cursor }, 'Getting all NFTs')

    const response = await fetch(Endpoints.getAllNFT, {
      method: 'POST',
      headers: notionHeaders,
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
      logger.error({ status: response.status, data }, 'Failed to fetch NFTs from Notion')
      return { success: false, error: 'Failed to fetch NFTs from Notion' }
    }

    if (!data.results) {
      logger.error({ data }, 'No results in Notion response')
      return { success: false, error: 'Invalid response from Notion API' }
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

    logger.info({ totalFromNotion: data.results.length, returned: nfts.length }, 'NFTs fetched successfully')

    return {
      success: true,
      nfts,
      pagination: {
        limit,
        offset,
        returned: nfts.length,
        has_more: data.has_more,
        next_cursor: data.next_cursor,
      },
    }
  } catch (error) {
    logger.error({ error }, 'Error getting all NFTs')
    return { success: false, error: 'Server error' }
  }
}
