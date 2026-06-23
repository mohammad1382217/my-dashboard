import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SeparatorProps extends ComponentPropsWithoutRef<'div'> {
  /** Line direction. Defaults to "horizontal". */
  orientation?: 'horizontal' | 'vertical'
  /** When true the line is purely visual and removed from the accessibility tree. */
  decorative?: boolean
}

/**
 * A thin dividing line. Horizontal by default; pass `orientation="vertical"`
 * inside a flex row (the parent must give it a height). Decorative by default
 * for screen readers — set `decorative={false}` for a semantic separator.
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = true, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={twMerge(
        'shrink-0 bg-surface-2',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
})
