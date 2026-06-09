import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type SkeletonProps = ComponentPropsWithoutRef<'div'>

/**
 * Pulsing placeholder for loading content. Size it with `className`
 * (e.g. `h-4 w-1/2`, `size-12 rounded-full`). Decorative (`aria-hidden`) and
 * respects reduced-motion.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={twMerge('animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none dark:bg-zinc-800', className)}
      {...props}
    />
  )
})
