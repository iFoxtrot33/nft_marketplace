import { findNFTPageIdByAddress } from './findNFTPageIdByAddress'
import { getNextAvailableId } from './getNextAvailableId'

import { Endpoints, NFTData, logger } from '@/common'

export async function createNFT(
  nft_address: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; nft?: NFTData; error?: string }> {
  try {
    logger.info({ nft_address }, 'Creating NFT')

    const [existingNFT, nextId] = await Promise.all([
      findNFTPageIdByAddress(nft_address, notionHeaders),
      getNextAvailableId(notionHeaders),
    ])

    if (existingNFT.found) {
      return { success: false, error: 'NFT with this address already exists' }
    }

    const response = await fetch(Endpoints.createNFT, {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify({
        parent: {
          database_id: process.env.NOTION_NFTS_TABLE_ID,
        },
        properties: {
          '': {
            title: [
              {
                text: {
                  content: nextId.toString(),
                },
              },
            ],
          },
          id: {
            number: nextId,
          },
          nft_address: {
            rich_text: [
              {
                text: {
                  content: nft_address,
                },
              },
            ],
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to create NFT')
      return { success: false, error: 'Failed to create NFT' }
    }

    const createdNFT: NFTData = {
      page_id: data.id,
      id: data.properties.id.number,
      title: data.properties['']?.title?.[0]?.plain_text || '',
      nft_address: data.properties.nft_address?.rich_text?.[0]?.plain_text || '',
      created_time: data.created_time,
      last_edited_time: data.last_edited_time,
    }

    logger.info({ page_id: data.id, nft_address, id: nextId }, 'NFT created successfully')
    return { success: true, nft: createdNFT }
  } catch (error) {
    logger.error({ error }, 'Error creating NFT')
    return { success: false, error: 'Server error' }
  }
}
