import { findNFTPageIdByAddress } from './findNFTPageIdByAddress'

import { Endpoints, NFTData, logger } from '@/common'

export async function updateNFT(
  current_address: string,
  updated_address: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; nft?: NFTData; error?: string }> {
  try {
    logger.info({ current_address, updated_address }, 'Updating NFT address')

    const [currentNFT, existingNFT] = await Promise.all([
      findNFTPageIdByAddress(current_address, notionHeaders),
      findNFTPageIdByAddress(updated_address, notionHeaders),
    ])

    if (!currentNFT.found || !currentNFT.page_id) {
      return { success: false, error: 'NFT with current address not found' }
    }

    if (existingNFT.found) {
      return { success: false, error: 'NFT with new address already exists' }
    }

    const response = await fetch(Endpoints.updateNFT(currentNFT.page_id), {
      method: 'PATCH',
      headers: notionHeaders,
      body: JSON.stringify({
        properties: {
          nft_address: {
            rich_text: [
              {
                text: {
                  content: updated_address,
                },
              },
            ],
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to update NFT')
      return { success: false, error: 'Failed to update NFT' }
    }

    const updatedNFT: NFTData = {
      page_id: data.id,
      id: data.properties.id.number,
      title: data.properties['']?.title?.[0]?.plain_text || '',
      nft_address: data.properties.nft_address?.rich_text?.[0]?.plain_text || '',
      created_time: data.created_time,
      last_edited_time: data.last_edited_time,
    }

    logger.info(
      { page_id: data.id, old_address: current_address, new_address: updated_address },
      'NFT updated successfully',
    )
    return { success: true, nft: updatedNFT }
  } catch (error) {
    logger.error({ error }, 'Error updating NFT')
    return { success: false, error: 'Server error' }
  }
}
