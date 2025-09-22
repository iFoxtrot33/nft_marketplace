import { findCartByUserId } from './findCartByUserId'

import { Endpoints, logger } from '@/common'

export async function deleteCart(
  user_id: string,
  notionHeaders: Record<string, string>,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    logger.info({ user_id }, 'Deleting cart completely')

    const existingCart = await findCartByUserId(user_id, notionHeaders)

    if (!existingCart.found || !existingCart.cart) {
      return { success: false, error: 'Cart not found' }
    }

    const response = await fetch(Endpoints.deleteCart(existingCart.page_id!), {
      method: 'PATCH',
      headers: notionHeaders,
      body: JSON.stringify({
        archived: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to delete cart')
      return { success: false, error: 'Failed to delete cart' }
    }

    logger.info({ user_id, page_id: existingCart.page_id }, 'Cart deleted successfully')
    return { success: true, message: 'Cart deleted successfully' }
  } catch (error) {
    logger.error({ user_id, error }, 'Error deleting cart')
    return { success: false, error: 'Server error' }
  }
}
