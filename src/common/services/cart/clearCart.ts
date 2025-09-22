import { findCartByUserId } from './findCartByUserId'

import { CartData, Endpoints, logger } from '@/common'

export async function clearCart(
  user_id: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; cart?: CartData; error?: string }> {
  try {
    logger.info({ user_id }, 'Clearing cart')

    const existingCart = await findCartByUserId(user_id, notionHeaders)

    if (!existingCart.found || !existingCart.cart) {
      return { success: false, error: 'Cart not found' }
    }

    const response = await fetch(Endpoints.updateCart(existingCart.page_id!), {
      method: 'PATCH',
      headers: notionHeaders,
      body: JSON.stringify({
        properties: {
          nfts: {
            rich_text: [
              {
                text: {
                  content: '',
                },
              },
            ],
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to clear cart')
      return { success: false, error: 'Failed to clear cart' }
    }

    const clearedCart: CartData = {
      page_id: data.id,
      title: data.properties.title?.title?.[0]?.plain_text || '',
      user_id: data.properties.user_id?.rich_text?.[0]?.plain_text || '',
      nfts: [],
      created_time: data.created_time,
      last_edited_time: data.last_edited_time,
    }

    logger.info({ user_id, page_id: data.id }, 'Cart cleared successfully')
    return { success: true, cart: clearedCart }
  } catch (error) {
    logger.error({ user_id, error }, 'Error clearing cart')
    return { success: false, error: 'Server error' }
  }
}
