import { Endpoints, FindNFTByAddressResult, NFTData, logger } from '@/common'

export async function findNFTPageIdByAddress(
  nft_address: string,
  notionHeaders: Record<string, string>,
): Promise<FindNFTByAddressResult> {
  try {
    logger.info({ nft_address }, 'Searching for NFT by address')

    const response = await fetch(Endpoints.getAllNFT, {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify({
        filter: {
          property: 'nft_address',
          rich_text: {
            equals: nft_address,
          },
        },
        page_size: 1,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to search NFT by address')
      return { page_id: null, found: false }
    }

    if (data.results && data.results.length > 0) {
      const page = data.results[0]
      const page_id = page.id

      const nft: NFTData = {
        page_id: page.id,
        id: page.properties.id.number,
        title: page.properties['']?.title?.[0]?.plain_text || '',
        nft_address: page.properties.nft_address?.rich_text?.[0]?.plain_text || '',
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
      }

      logger.info({ nft_address, page_id }, 'NFT found by address')
      return { page_id, found: true, nft }
    }

    logger.info({ nft_address }, 'NFT not found by address')
    return { page_id: null, found: false }
  } catch (error) {
    logger.error({ nft_address, error }, 'Error searching NFT by address')
    return { page_id: null, found: false }
  }
}
