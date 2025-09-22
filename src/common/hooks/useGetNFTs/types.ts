import { NFTData } from '@/common'

export interface APIResponse {
  data: NFTData[]
  pagination: {
    limit: number
    offset: number
    returned: number
    has_more: boolean
    next_cursor: string | null
  }
}

export interface UseGetNFTsProps {
  limit?: number
}

export interface UseGetNFTsReturn {
  data: NFTData[]
  isLoading: boolean
  error: Error | null
  canLoadMore: boolean
  loadMore: () => void
}
