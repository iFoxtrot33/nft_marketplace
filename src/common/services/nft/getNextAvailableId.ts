import { Endpoints, logger } from '@/common'

export async function getNextAvailableId(notionHeaders: Record<string, string>): Promise<number> {
  try {
    logger.info({}, 'Getting next available ID')

    const response = await fetch(Endpoints.getAllNFT, {
      method: 'POST',
      headers: notionHeaders,
      body: JSON.stringify({
        sorts: [
          {
            property: 'id',
            direction: 'descending',
          },
        ],
        page_size: 1,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error({ status: response.status, data }, 'Failed to get max ID')
      return 1
    }

    if (data.results && data.results.length > 0) {
      const maxId = data.results[0].properties.id.number
      const nextId = maxId + 1
      logger.info({ maxId, nextId }, 'Next available ID calculated')
      return nextId
    }

    logger.info({}, 'No existing NFTs, starting with ID 1')
    return 1
  } catch (error) {
    logger.error({ error }, 'Error getting next available ID')
    return 1
  }
}
