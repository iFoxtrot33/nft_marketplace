'use client'

import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  threshold?: number
  rootMargin?: string
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore) {
        onLoadMore()
      }
    },
    [onLoadMore, hasMore],
  )

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observerRef.current.observe(trigger)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin])

  return triggerRef
}
