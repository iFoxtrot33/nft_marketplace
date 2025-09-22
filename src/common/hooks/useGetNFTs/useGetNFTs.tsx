import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from '../../api/constants'
import { Endpoints } from '../../api/endpoints'
import { fetcher } from '../../api/fetcher'
import { APIResponse, UseGetNFTsProps, UseGetNFTsReturn } from './types'

import { useInfiniteQuery } from '@tanstack/react-query'

export const useGetNFTs = ({ limit = 12 }: UseGetNFTsProps = {}): UseGetNFTsReturn => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['nfts', limit],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        limit,
        offset: pageParam,
      }
      return fetcher<APIResponse>(Endpoints.getAllNFTPictures, params)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.has_more) {
        return allPages.length * limit
      }
      return undefined
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  })

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
