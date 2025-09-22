import { findCartByUserId } from './findCartByUserId'

import { CartData, Endpoints, logger } from '@/common'

export async function addToCart(
  user_id: string,
  nft_address: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; cart?: CartData; error?: string }> {
  try {
    logger.info({ user_id, nft_address }, 'Adding NFT to cart')

    const existingCart = await findCartByUserId(user_id, notionHeaders)

    if (existingCart.found && existingCart.cart) {
      const currentNfts = existingCart.cart.nfts || []

      if (currentNfts.includes(nft_address)) {
        return { success: false, error: 'NFT already in cart' }
      }

      const updatedNfts = [...currentNfts, nft_address].join(',')

      const response = await fetch(Endpoints.updateCart(existingCart.page_id!), {
        method: 'PATCH',
        headers: notionHeaders,
        body: JSON.stringify({
          properties: {
            nfts: {
              rich_text: [
                {
                  text: {
                    content: updatedNfts,
                  },
                },
              ],
            },
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        logger.error({ status: response.status, data }, 'Failed to update cart')
        return { success: false, error: 'Failed to update cart' }
      }

      const updatedNftsString = data.properties.nfts?.rich_text?.[0]?.plain_text || ''
      const updatedCart: CartData = {
        page_id: data.id,
        title: data.properties.title?.title?.[0]?.plain_text || '',
        user_id: data.properties.user_id?.rich_text?.[0]?.plain_text || '',
        nfts: updatedNftsString ? updatedNftsString.split(',').map((nft: string) => nft.trim()) : [],
        created_time: data.created_time,
        last_edited_time: data.last_edited_time,
      }

      logger.info({ user_id, page_id: data.id }, 'Cart updated successfully')
      return { success: true, cart: updatedCart }
    } else {
      const response = await fetch(Endpoints.createCart, {
        method: 'POST',
        headers: notionHeaders,
        body: JSON.stringify({
          parent: {
            database_id: process.env.NOTION_NFTS_CART_ID,
          },
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: user_id,
                  },
                },
              ],
            },
            user_id: {
              rich_text: [
                {
                  text: {
                    content: user_id,
                  },
                },
              ],
            },
            nfts: {
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
        logger.error({ status: response.status, data }, 'Failed to create cart')
        return { success: false, error: 'Failed to create cart' }
      }

      const newNftsString = data.properties.nfts?.rich_text?.[0]?.plain_text || ''
      const newCart: CartData = {
        page_id: data.id,
        title: data.properties.title?.title?.[0]?.plain_text || '',
        user_id: data.properties.user_id?.rich_text?.[0]?.plain_text || '',
        nfts: newNftsString ? newNftsString.split(',').map((nft: string) => nft.trim()) : [],
        created_time: data.created_time,
        last_edited_time: data.last_edited_time,
      }

      logger.info({ user_id, page_id: data.id }, 'Cart created successfully')
      return { success: true, cart: newCart }
    }
  } catch (error) {
    logger.error({ user_id, nft_address, error }, 'Error adding to cart')
    return { success: false, error: 'Server error' }
  }
}
