import { NextResponse } from 'next/server'

import {
  Endpoints,
  NFTData,
  NotionRequest,
  findNFTPageIdByAddress,
  getNextAvailableId,
  logger,
  withNotionHeaders,
} from '@/common'

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
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
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

    const [existingNFT, nextId] = await Promise.all([
      findNFTPageIdByAddress(address, req.notionHeaders),
      getNextAvailableId(req.notionHeaders),
    ])

    if (existingNFT.found) {
      return NextResponse.json({ error: 'NFT with this address already exists' }, { status: 409 })
    }

    const response = await fetch(Endpoints.createNFT, {
      method: 'POST',
      headers: req.notionHeaders,
      body: JSON.stringify({
        parent: {
          database_id: process.env.NEXT_PUBLIC_NOTION_NFTS_TABLE_ID,
        },
        properties: {
          '': {
            title: [
              {
                text: {
                  content: nextId.toString(),
                },
              },
            ],
          },
          id: {
            number: nextId,
          },
          nft_address: {
            rich_text: [
              {
                text: {
                  content: address,
                },
              },
            ],
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to create NFT')
      return NextResponse.json({ error: 'Failed to create NFT' }, { status: response.status })
    }

    const createdNFT: NFTData = {
      page_id: data.id,
      id: data.properties.id.number,
      title: data.properties['']?.title?.[0]?.plain_text || '',
      nft_address: data.properties.nft_address?.rich_text?.[0]?.plain_text || '',
      created_time: data.created_time,
      last_edited_time: data.last_edited_time,
    }

    logger.info({ page_id: data.id, nft_address: address, id: nextId }, 'NFT created successfully')

    return NextResponse.json(
      {
        success: true,
        data: createdNFT,
      },
      { status: 201 },
    )
  } catch (error) {
    logger.error({ error }, 'Error creating NFT')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
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
      return NextResponse.json({ error: 'updated_nft_address is required' }, { status: 400 })
    }

    logger.info({ current_address: address, new_address: body.updated_nft_address }, 'Update NFT address request')

    const [currentNFT, existingNFT] = await Promise.all([
      findNFTPageIdByAddress(address, req.notionHeaders),
      findNFTPageIdByAddress(body.updated_nft_address, req.notionHeaders),
    ])

    if (!currentNFT.found || !currentNFT.page_id) {
      return NextResponse.json({ error: 'NFT with current address not found' }, { status: 404 })
    }

    if (existingNFT.found) {
      return NextResponse.json({ error: 'NFT with new address already exists' }, { status: 409 })
    }

    const response = await fetch(Endpoints.updateNFT(currentNFT.page_id), {
      method: 'PATCH',
      headers: req.notionHeaders,
      body: JSON.stringify({
        properties: {
          nft_address: {
            rich_text: [
              {
                text: {
                  content: body.updated_nft_address,
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
      return NextResponse.json({ error: 'Failed to update NFT' }, { status: response.status })
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
      { page_id: data.id, old_address: address, new_address: body.updated_nft_address },
      'NFT updated successfully',
    )

    return NextResponse.json({
      success: true,
      data: updatedNFT,
    })
  } catch (error) {
    logger.error({ error }, 'Error updating NFT')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
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

    const currentNFT = await findNFTPageIdByAddress(address, req.notionHeaders)
    if (!currentNFT.found || !currentNFT.page_id) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
    }

    const response = await fetch(Endpoints.deleteNFT(currentNFT.page_id), {
      method: 'PATCH',
      headers: req.notionHeaders,
      body: JSON.stringify({
        archived: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to delete NFT')
      return NextResponse.json({ error: 'Failed to delete NFT' }, { status: response.status })
    }

    logger.info({ page_id: currentNFT.page_id, nft_address: address }, 'NFT deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'NFT deleted successfully',
      page_id: currentNFT.page_id,
    })
  } catch (error) {
    logger.error({ error }, 'Error deleting NFT')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const GET = withNotionHeaders(getHandler)
export const POST = withNotionHeaders(postHandler)
export const PATCH = withNotionHeaders(patchHandler)
export const DELETE = withNotionHeaders(deleteHandler)
