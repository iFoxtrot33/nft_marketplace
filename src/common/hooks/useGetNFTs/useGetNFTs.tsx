import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '../../api/constants'
import { Endpoints } from '../../api/endpoints'
import { fetcher } from '../../api/fetcher'
import type { NFTListResponse } from '../../types/nft'

import { useInfiniteQuery } from '@tanstack/react-query'

interface UseGetNFTsProps {
  limit?: number
}

interface UseGetNFTsReturn {
  data: NFTListResponse['data']
  isLoading: boolean
  error: Error | null
  canLoadMore: boolean
  loadMore: () => void
}

export const useGetNFTs = ({ limit = 12 }: UseGetNFTsProps = {}): UseGetNFTsReturn => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['nfts', limit],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        limit,
        offset: pageParam,
      }
      return fetcher<NFTListResponse>(Endpoints.getAllNFTPictures, params)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Если есть больше данных, возвращаем следующий offset
      if (lastPage.has_more) {
        return allPages.length * limit
      }
      return undefined
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

  // Объединяем все данные из всех страниц в один массив
  const allNFTs = data?.pages.flatMap((page) => page.data) ?? []

  const canLoadMore = hasNextPage && !isFetchingNextPage

  const loadMore = () => {
    if (canLoadMore) {
      fetchNextPage()
    }
  }

  return {
    data: allNFTs,
    isLoading: isLoading || isFetchingNextPage,
    error: error as Error | null,
    canLoadMore,
    loadMore,
  }
}
