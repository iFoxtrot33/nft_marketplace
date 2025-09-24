import { NextResponse } from 'next/server'

import { FORCE_DYNAMIC, NotionRequest, deleteCart, logger, withNotionHeaders } from '@/common'
import { HTTP_STATUS } from '@/common/constants/statusCode'

export const dynamic = FORCE_DYNAMIC

/**
 * @swagger
 * /api/cart/{userid}/delete:
 *   delete:
 *     summary: Delete entire cart
 *     description: Completely removes user's cart from database (archives the cart record)
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose cart to delete
 *     responses:
 *       200:
 *         description: Cart deleted successfully
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

    logger.info({ user_id: userid }, 'Delete cart completely request')

    const result = await deleteCart(userid, req.notionHeaders)

    if (!result.success) {
      const statusCode = result.error === 'Cart not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_SERVER_ERROR
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    logger.error({ error }, 'Error in delete cart completely')
    return NextResponse.json({ error: 'Server error' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR })
  }
}

export const DELETE = withNotionHeaders(deleteHandler)
