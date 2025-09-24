import { NextResponse } from 'next/server'

import {
  FORCE_DYNAMIC,
  HTTP_STATUS,
  NotionRequest,
  createNFT,
  deleteNFT,
  findNFTPageIdByAddress,
  logger,
  updateNFT,
  withNotionHeaders,
} from '@/common'

export const dynamic = FORCE_DYNAMIC

/**
 * @swagger
 * /api/nft/{address}:
 *   get:
 *     summary: Get NFT by address
 *     description: Returns a specific NFT by its address
 *     tags:
 *       - NFT
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: NFT address
 *     responses:
 *       200:
 *         description: NFT found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/NFTData'
 *       404:
 *         description: NFT not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function getHandler(req: NotionRequest, { params }: { params: { address: string } }): Promise<NextResponse> {
  const { address } = params

  logger.info({ address }, 'Get NFT by address request')

  const searchResult = await findNFTPageIdByAddress(address, req.notionHeaders)

  if (!searchResult.found || !searchResult.nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: HTTP_STATUS.NOT_FOUND })
  }

  return NextResponse.json({
    data: searchResult.nft,
  })
}

/**
 * @swagger
 * /api/nft/{address}:
 *   post:
 *     summary: Create new NFT
 *     description: Creates a new NFT with the specified address. ID is generated automatically.
 *     tags:
 *       - NFT
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: NFT address to create
 *     responses:
 *       201:
 *         description: NFT successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       409:
 *         description: NFT with this address already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function postHandler(req: NotionRequest, { params }: { params: { address: string } }): Promise<NextResponse> {
  try {
    const { address } = params

    logger.info({ nft_address: address }, 'Create NFT request')

    const result = await createNFT(address, req.notionHeaders)

    if (!result.success) {
      const statusCode =
        result.error === 'NFT with this address already exists' ? HTTP_STATUS.CONFLICT : HTTP_STATUS.BAD_REQUEST
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json(
      {
        success: true,
        data: result.nft,
      },
      { status: HTTP_STATUS.CREATED },
    )
  } catch (error) {
    logger.error({ error }, 'Error creating NFT')
    return NextResponse.json({ error: 'Invalid request body' }, { status: HTTP_STATUS.BAD_REQUEST })
  }
}

/**
 * @swagger
 * /api/nft/{address}:
 *   patch:
 *     summary: Update NFT address
 *     description: Updates the address of an existing NFT
 *     tags:
 *       - NFT
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Current NFT address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNFTRequest'
 *     responses:
 *       200:
 *         description: NFT successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: NFT with current address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: NFT with new address already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
async function patchHandler(req: NotionRequest, { params }: { params: { address: string } }): Promise<NextResponse> {
  try {
    const { address } = params
    const body: { updated_nft_address: string } = await req.json()

    if (!body.updated_nft_address) {
      return NextResponse.json({ error: 'updated_nft_address is required' }, { status: HTTP_STATUS.BAD_REQUEST })
    }

    logger.info({ current_address: address, new_address: body.updated_nft_address }, 'Update NFT address request')

    const result = await updateNFT(address, body.updated_nft_address, req.notionHeaders)

    if (!result.success) {
      let statusCode = 400
      if (result.error === 'NFT with current address not found') statusCode = 404
      if (result.error === 'NFT with new address already exists') statusCode = 409

      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({
      success: true,
      data: result.nft,
    })
  } catch (error) {
    logger.error({ error }, 'Error updating NFT')
    return NextResponse.json({ error: 'Invalid request body' }, { status: HTTP_STATUS.BAD_REQUEST })
  }
}

/**
 * @swagger
 * /api/nft/{address}:
 *   delete:
 *     summary: Delete NFT
 *     description: Archives (deletes) NFT by specified address
 *     tags:
 *       - NFT
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: NFT address to delete
 *     responses:
 *       200:
 *         description: NFT successfully deleted
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
 *                   description: Success deletion message
 *                 page_id:
 *                   type: string
 *                   description: ID of deleted page
 *       404:
 *         description: NFT not found
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
async function deleteHandler(req: NotionRequest, { params }: { params: { address: string } }): Promise<NextResponse> {
  try {
    const { address } = params

    logger.info({ nft_address: address }, 'Delete NFT request')

    const result = await deleteNFT(address, req.notionHeaders)

    if (!result.success) {
      const statusCode = result.error === 'NFT not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_SERVER_ERROR
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      page_id: result.page_id,
    })
  } catch (error) {
    logger.error({ error }, 'Error deleting NFT')
    return NextResponse.json({ error: 'Server error' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR })
  }
}

export const GET = withNotionHeaders(getHandler)
export const POST = withNotionHeaders(postHandler)
export const PATCH = withNotionHeaders(patchHandler)
export const DELETE = withNotionHeaders(deleteHandler)
