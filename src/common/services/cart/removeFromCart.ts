import { findCartByUserId } from './findCartByUserId'

import { CartData, Endpoints, logger } from '@/common'

export async function removeFromCart(
  user_id: string,
  nft_address: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; cart?: CartData; error?: string }> {
  try {
    logger.info({ user_id, nft_address }, 'Removing NFT from cart')

    const existingCart = await findCartByUserId(user_id, notionHeaders)

    if (!existingCart.found || !existingCart.cart) {
      return { success: false, error: 'Cart not found' }
    }

    const currentNfts = existingCart.cart.nfts || []

    if (!currentNfts.includes(nft_address)) {
      return { success: false, error: 'NFT not found in cart' }
    }

    const updatedNfts = currentNfts.filter((nft) => nft !== nft_address)
    const updatedNftsString = updatedNfts.join(',')

    const response = await fetch(Endpoints.updateCart(existingCart.page_id!), {
      method: 'PATCH',
      headers: notionHeaders,
      body: JSON.stringify({
        properties: {
          nfts: {
            rich_text: [
              {
                text: {
                  content: updatedNftsString,
                },
              },
            ],
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to remove NFT from cart')
      return { success: false, error: 'Failed to remove NFT from cart' }
    }

    const updatedNftsResponseString = data.properties.nfts?.rich_text?.[0]?.plain_text || ''
    const updatedCart: CartData = {
      page_id: data.id,
      title: data.properties.title?.title?.[0]?.plain_text || '',
      user_id: data.properties.user_id?.rich_text?.[0]?.plain_text || '',
      nfts: updatedNftsResponseString ? updatedNftsResponseString.split(',').map((nft: string) => nft.trim()) : [],
      created_time: data.created_time,
      last_edited_time: data.last_edited_time,
    }

    logger.info({ user_id, page_id: data.id, removed_nft: nft_address }, 'NFT removed from cart successfully')
    return { success: true, cart: updatedCart }
  } catch (error) {
    logger.error({ user_id, nft_address, error }, 'Error removing NFT from cart')
    return { success: false, error: 'Server error' }
  }
}
