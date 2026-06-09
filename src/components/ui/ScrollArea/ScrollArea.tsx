import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
  /** Which axis scrolls. Defaults to "vertical". */
  orientation?: 'vertical' | 'horizontal' | 'both'
}

const overflowClass = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
} as const

// Thin, rounded scrollbars. WebKit pseudo-elements cover Chrome/old Android (our
// floor); the scrollbar-width/color pair covers Firefox. Both degrade to the
// native scrollbar where unsupported.
const scrollbarClass =
  '[scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] dark:[scrollbar-color:#3f3f46_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500'

/**
 * A scroll container with slim, styled scrollbars. Give it a bound via
 * `className` (e.g. `max-h-72`) or `style`, then drop any content inside.
 * Choose the scrolling axis with `orientation`.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', className, ...props },
  ref,
) {
  return <div ref={ref} className={twMerge('relative', overflowClass[orientation], scrollbarClass, className)} {...props} />
})
