import { findNFTPageIdByAddress } from './findNFTPageIdByAddress'

import { Endpoints, logger } from '@/common'

export async function deleteNFT(
  nft_address: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; message?: string; page_id?: string; error?: string }> {
  try {
    logger.info({ nft_address }, 'Deleting NFT')

    const currentNFT = await findNFTPageIdByAddress(nft_address, notionHeaders)
    if (!currentNFT.found || !currentNFT.page_id) {
      return { success: false, error: 'NFT not found' }
    }

    const response = await fetch(Endpoints.deleteNFT(currentNFT.page_id), {
      method: 'PATCH',
      headers: notionHeaders,
      body: JSON.stringify({
        archived: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to delete NFT')
      return { success: false, error: 'Failed to delete NFT' }
    }

    logger.info({ page_id: currentNFT.page_id, nft_address }, 'NFT deleted successfully')
    return {
      success: true,
      message: 'NFT deleted successfully',
      page_id: currentNFT.page_id,
    }
  } catch (error) {
    logger.error({ error }, 'Error deleting NFT')
    return { success: false, error: 'Server error' }
  }
}
