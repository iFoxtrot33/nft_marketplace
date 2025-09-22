import { NextResponse } from 'next/server'

import {
  AddToCartRequest,
  FORCE_DYNAMIC,
  NotionRequest,
  RemoveFromCartRequest,
  addToCart,
  findCartByUserId,
  logger,
  removeFromCart,
  withNotionHeaders,
} from '@/common'

export const dynamic = FORCE_DYNAMIC

/**
 * @swagger
 * /api/cart/{userid}:
 *   get:
 *     summary: Get cart by user ID
 *     description: Returns a specific cart by user ID
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
 *         description: Cart found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CartData'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function getHandler(req: NotionRequest, { params }: { params: { userid: string } }): Promise<NextResponse> {
  const { userid } = params

  logger.info({ user_id: userid }, 'Get cart by user_id request')

  const searchResult = await findCartByUserId(userid, req.notionHeaders)

  if (!searchResult.found || !searchResult.cart) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
  }

  return NextResponse.json({
    data: searchResult.cart,
  })
}

/**
 * @swagger
 * /api/cart/{userid}:
 *   post:
 *     summary: Add NFT to cart
 *     description: Adds NFT to user's cart. Creates cart if it doesn't exist.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: NFT added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Operation success status
 *                 data:
 *                   $ref: '#/components/schemas/CartData'
 *       201:
 *         description: Cart created and NFT added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Operation success status
 *                 data:
 *                   $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request or NFT already in cart
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
async function postHandler(req: NotionRequest, { params }: { params: { userid: string } }): Promise<NextResponse> {
  try {
    const { userid } = params
    const body: AddToCartRequest = await req.json()

    if (!body.nft_address) {
      return NextResponse.json({ error: 'nft_address is required' }, { status: 400 })
    }

    logger.info({ user_id: userid, nft_address: body.nft_address }, 'Add to cart request')

    const result = await addToCart(userid, body.nft_address, req.notionHeaders)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const statusCode = result.cart?.created_time === result.cart?.last_edited_time ? 201 : 200

    return NextResponse.json(
      {
        success: true,
        data: result.cart,
      },
      { status: statusCode },
    )
  } catch (error) {
    logger.error({ error }, 'Error in add to cart')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

/**
 * @swagger
 * /api/cart/{userid}:
 *   delete:
 *     summary: Remove NFT from cart
 *     description: Removes specific NFT from user's cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveFromCartRequest'
 *     responses:
 *       200:
 *         description: NFT removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Operation success status
 *                 data:
 *                   $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request, cart not found or NFT not in cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
    const body: RemoveFromCartRequest = await req.json()

    if (!body.nft_address) {
      return NextResponse.json({ error: 'nft_address is required' }, { status: 400 })
    }

    logger.info({ user_id: userid, nft_address: body.nft_address }, 'Remove from cart request')

    const result = await removeFromCart(userid, body.nft_address, req.notionHeaders)

    if (!result.success) {
      const statusCode = result.error === 'Cart not found' ? 404 : 400
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({
      success: true,
      data: result.cart,
    })
  } catch (error) {
    logger.error({ error }, 'Error in remove from cart')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export const GET = withNotionHeaders(getHandler)
export const POST = withNotionHeaders(postHandler)
export const DELETE = withNotionHeaders(deleteHandler)
