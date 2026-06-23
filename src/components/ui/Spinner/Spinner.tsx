import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SpinnerProps extends ComponentPropsWithoutRef<'span'> {
  /** Diameter. Defaults to "md". */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible label announced to screen readers. Defaults to "Loading". */
  label?: string
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
} as const

/**
 * An indeterminate loading spinner built from a bordered circle, so it needs no
 * inline SVG. Respects `prefers-reduced-motion`. Exposes `role="status"`.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...props },
  ref,
) {
  return (
    <span ref={ref} role="status" className={twMerge('inline-flex', className)} {...props}>
      <span
        className={twMerge(
          'inline-block animate-spin rounded-full border-slate-300 border-t-primary-600 motion-reduce:animate-none dark:border-zinc-700 dark:border-t-primary-400',
          sizeClasses[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
})
