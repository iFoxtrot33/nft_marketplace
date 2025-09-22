import { NextResponse } from 'next/server'

import { FORCE_DYNAMIC, NotionRequest, clearCart, logger, withNotionHeaders } from '@/common'

export const dynamic = FORCE_DYNAMIC

/**
 * @swagger
 * /api/cart/{userid}/all:
 *   delete:
 *     summary: Clear entire cart
 *     description: Removes all NFTs from user's cart (empties the cart)
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Operation success status
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   $ref: '#/components/schemas/CartData'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function deleteHandler(req: NotionRequest, { params }: { params: { userid: string } }): Promise<NextResponse> {
  try {
    const { userid } = params

    logger.info({ user_id: userid }, 'Clear cart request')

    const result = await clearCart(userid, req.notionHeaders)

    if (!result.success) {
      const statusCode = result.error === 'Cart not found' ? 404 : 500
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      data: result.cart,
    })
  } catch (error) {
    logger.error({ error }, 'Error in clear cart')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const DELETE = withNotionHeaders(deleteHandler)
