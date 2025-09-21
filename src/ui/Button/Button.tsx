import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/common'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all outline-none rounded-lg w-full relative overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'text-black shadow-[0_4px_8.3px_0_var(--color-yellow-light),inset_0_1px_0_rgba(255,255,255,0.2)] hover:opacity-90 active:scale-95 bg-[linear-gradient(89deg,var(--color-mountain-dew-1)_-19.28%,var(--color-mountain-dew-2)_19.01%,var(--color-mountain-dew-3)_66.59%,var(--color-mountain-dew-4)_100.08%)] backdrop-blur-sm border border-white/20 before:content-[""] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full',
        disabled:
          'border-2 border-[var(--color-disabled-5)] bg-[radial-gradient(46.43%_176.04%_at_50%_-76.04%,var(--color-disabled-1)_0%,var(--color-disabled-2)_50%,var(--color-disabled-3)_100%)] backdrop-blur-md bg-opacity-60 text-white/60 cursor-not-allowed pointer-events-none before:opacity-30',
      },
      size: {
        default: 'h-10 py-2 px-6',
        sm: 'h-8 py-1.5 px-4 text-xs',
        lg: 'h-12 py-3 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  const finalVariant = disabled ? 'disabled' : variant

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant: finalVariant, size, className }))}
      disabled={disabled}
      {...props}
    />
  )
}

export { Button, buttonVariants }
