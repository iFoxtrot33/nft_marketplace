import { cn } from '@/common/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md', className)}
      style={{ backgroundColor: 'var(--color-disabled-3)' }}
      {...props}
    />
  )
}

export { Skeleton }
