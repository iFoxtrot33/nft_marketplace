import { CartData, Endpoints, FindCartByUserIdResult, logger } from '@/common'

export async function findCartByUserId(
  user_id: string,
  notionHeaders: Record<string, string>,
): Promise<FindCartByUserIdResult> {
  try {
    logger.info({ user_id }, 'Searching for cart by user_id')

    const response = await fetch(Endpoints.getAllCart, {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify({
        filter: {
          property: 'user_id',
          rich_text: {
            equals: user_id,
          },
        },
        page_size: 1,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to search cart by user_id')
      return { page_id: null, found: false }
    }

    if (data.results && data.results.length > 0) {
      const page = data.results[0]
      const page_id = page.id

      const nftsString = page.properties.nfts?.rich_text?.[0]?.plain_text || ''
      const cart: CartData = {
        page_id: page.id,
        title: page.properties.title?.title?.[0]?.plain_text || '',
        user_id: page.properties.user_id?.rich_text?.[0]?.plain_text || '',
        nfts: nftsString ? nftsString.split(',').map((nft: string) => nft.trim()) : [],
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
      }

      logger.info({ user_id, page_id }, 'Cart found by user_id')
      return { page_id, found: true, cart }
    }

    logger.info({ user_id }, 'Cart not found by user_id')
    return { page_id: null, found: false }
  } catch (error) {
    logger.error({ user_id, error }, 'Error searching cart by user_id')
    return { page_id: null, found: false }
  }
}
