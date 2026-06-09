import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ButtonGroupProps extends ComponentPropsWithoutRef<'div'> {
  /** Lay the buttons out in a row (default) or a column. */
  orientation?: 'horizontal' | 'vertical'
}

const horizontal =
  'flex-row [&>*:not(:first-child)]:-ms-px [&>*:first-child]:rounded-e-none [&>*:last-child]:rounded-s-none [&>*:not(:first-child):not(:last-child)]:rounded-none'

const vertical =
  'flex-col [&>*:not(:first-child)]:-mt-px [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none'

/**
 * Visually joins a row (or column) of buttons into a single segmented control:
 * collapses the gap between them and squares off the inner corners, keeping only
 * the outer ends rounded. Exposes `role="group"`; works with the kit's Button or
 * any button-like children. Hovered/focused children lift above their neighbours.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = 'horizontal', className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      className={twMerge(
        'inline-flex [&>*:hover]:z-10 [&>*:focus-visible]:z-10',
        orientation === 'horizontal' ? horizontal : vertical,
        className,
      )}
      {...props}
    />
  )
})
